import {autorun, makeAutoObservable, reaction, toJS} from "mobx";
import {CardCourseNode, CardNode, Mutation, Query, UnstructuredThemesNode} from "../../../../../SchemaTypes";
import {ClientStorage} from "../../../../../Store/ApolloStorage/ClientStorage";
import {
    ADD_TO_BOOKMARK,
    GET_ALL_COURSE,
    GET_SIMILAR_CARDS_ID_ARRAY,
    GET_THEME_ANCESTORS,
    LOAD_CARD_DATA_BY_ID,
    REMOVE_CARD_FROM_BOOKMARK,
    SET_RATING
} from "./Query";
import {SERVER_BASE_URL} from "../../../../../settings";
import {ICourseLine} from "../../../Course/Editor/EditCourseByID";
import {positionDataI} from "../../../Course/CourseMicroView/V2/Store/CourseMicroStoreByID";
import React, {RefObject} from "react";
import recombeeClient from "../../../../../Store/RecombeeClient/recombee-client";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
// @ts-ignore
import recombee from 'recombee-js-api-client';


export class CardByIDStore {
    constructor(id?: number) {
        makeAutoObservable(this)
        autorun(() => this.loadCardData())
        autorun(() => this.getCardImageURL())
        autorun(() => this.getAllCoursesData())
        autorun(() => this.collectFindInCourseNotification())
        autorun(() => this.updateRatingAndISBookmarked())
        autorun(() => this.loadThemesAncestors())
        autorun(() => this.loadSimilarCards())
        reaction(() => this.id, () => {
            recombeeClient.send(new recombee.AddDetailView(UserStorage.userIDForRecombee, this.id, {
                'cascadeCreate': true
            }));
        })
        reaction(() => UserStorage.userIDForRecombee, () => {
            recombeeClient.send(new recombee.AddDetailView(UserStorage.userIDForRecombee, this.id, {
                'cascadeCreate': true
            }));
        })

        this.id = id
    }

    clientStorage = ClientStorage
    id?: number
    card_data?: CardNode
    changeID = (new_card_id?: number | string) => {
        if (new_card_id) {
            this.id = Number(new_card_id)
        } else {
            this.id = undefined
        }
    }

    loadCardData(useCache = true) {
        if (this.id) {
            try {
                this.clientStorage.client.query<Query>({
                    query: LOAD_CARD_DATA_BY_ID,
                    variables: {
                        id: this.id
                    },
                    fetchPolicy: useCache ? "cache-first" : "network-only",
                })
                    .then((response) => response.data.cardById)
                    .then((card_data) => {
                        if (card_data && this.id == Number(card_data?.id)) {
                            this.card_data = card_data

                        }
                        if (useCache) {
                            this.loadCardData(false)
                        }
                    })
            } catch (e) {
                console.log(e)
            }

        }
    }

    loadSimilarCards() {
        if (this.card_data?.id) {
            this.clientStorage.client.query({
                query: GET_SIMILAR_CARDS_ID_ARRAY
                , variables: {
                    card_id: this.card_data?.id

                }
            })
                .then((response) => response.data.similarCards)
                .then((similar_cards_id_array) => {
                    if (similar_cards_id_array && similar_cards_id_array.IDs) {
                        this.similarCardsID = similar_cards_id_array.IDs
                    }
                })
                .catch((e) => console.log(e))
        }
    }

    similarCardsID: string[] = []


    getAncestorForTheme(theme_id: number) {
        this.clientStorage.client.query({
            query: GET_THEME_ANCESTORS,
            variables: {
                theme_id: theme_id
            }
        })
            .then((response) => response.data?.themeAncestors)
            .then((themes) => {
                if (themes && themes.length > 0) {
                    this.themesAncestorsMap.set(String(theme_id), themes)
                }
            })
            .catch((e) => console.log(e))
    }

    themesAncestorsMap: ThemeAncestorMap = new Map()

    loadThemesAncestors = () => {
        this.card_data?.connectedTheme.map((theme) => {
            this.getAncestorForTheme(Number(theme.id))
        })
    }

    onThemeHover = (theme_id) => {
        if (this.themesAncestorsMap.has(String(theme_id))) {
            return toJS(this.themesAncestorsMap.get(String(theme_id)))
        } else {
            return []
        }
    }


    get defaultCardImageURL() {
        if (this?.card_data?.id) {
            return ("https://storage.googleapis.com/sw-files/cards-images/card/" + this?.card_data?.id)
        } else {
            return ("")
        }
    }

    cardImageURLFromServer = {
        url: "",
        card_id: this.id
    }

    get cardImageURLForUI() {
        if (this.cardImageURLFromServer.url &&
            Number(this.cardImageURLFromServer.card_id) == Number(this.card_data?.id)) {
            return (this.cardImageURLFromServer.url)
        } else {
            return (this.defaultCardImageURL)
        }
    }

    getCardImageURL = (useCache = true) => {
        const card_id_for_request = Number(this?.card_data?.id)
        if (card_id_for_request) {
            fetch(SERVER_BASE_URL + "/cardfiles/card?id=" + Number(card_id_for_request),
                {cache: useCache ? "force-cache" : "default"})
                .then((response) => response.json())
                .then((data) => {
                    if (card_id_for_request == Number(this?.card_data?.id)) {
                        this.cardImageURLFromServer = {
                            url: data[0].image,
                            card_id: card_id_for_request
                        }
                    }
                    if (useCache) {
                        this.getCardImageURL(false)
                    }
                })
                .catch(() => void (0))
        }
    }

    getAllCoursesData(useCache = true) {
        this.clientStorage.client.query({
            query: GET_ALL_COURSE,
            fetchPolicy: useCache ? "cache-only" : "network-only",
            variables: {}
        })
            .then((response) => response.data.cardCourse)
            .then((courses_data) => {
                if (courses_data !== toJS(this.allCoursesData)) {
                    this.allCoursesData = courses_data
                }
                if (useCache) {
                    this.getAllCoursesData(false)
                }
            })
            .catch((e) => console.log(e))
    }

    allCoursesData?: CardCourseNode[]

    findInCourseArray: IFindInCourseNotification = []

    get findInCourseArrayForUI() {
        return (toJS(this.findInCourseArray))
    }

    collectFindInCourseNotification() {
        const active_card_id = this.card_data?.id
        if (active_card_id) {
            const __findInCourseNotification: IFindInCourseNotification = []
            this.allCoursesData?.map((course) => {
                course?.courseData?.map((course_line: ICourseLine, lIndex) => {
                    course_line.SameLine?.map((fragment, fIndex) => {
                        fragment.CourseFragment?.map((element, bIndex) => {
                            if (element?.CourseElement?.id == active_card_id) {
                                __findInCourseNotification?.push({
                                    course_name: String(course?.name || "_"),
                                    course_id: String(course?.id),
                                    position: {
                                        activePage: fIndex + 1,
                                        selectedRow: lIndex,
                                        selectedPage: fIndex + 1,
                                        selectedIndex: bIndex,
                                    }
                                })
                            }
                        })
                    })
                })
            })
            this.findInCourseArray = __findInCourseNotification

        }
    }

    clickToBookmarkIcon = () => {
        this.isBookmarked = !this.isBookmarked
        if (this.card_data?.isBookmarked) {
            this.removeCardFromBookmark()
        } else {
            this.addToBookmark()
        }
    }

    removeCardFromBookmark = () => {
        if (this.card_data?.id) {
            this.clientStorage.client.mutate<Mutation>({
                mutation: REMOVE_CARD_FROM_BOOKMARK, variables: {
                    id: Number(this.card_data?.id)
                }
            })
                .then((response) => response?.data?.removeCardFromBookmark)
                .then(() => {
                    this.loadCardData(false)
                })
                .catch((e) => console.log(e))

        }
    }

    addToBookmark = () => {
        if (this.card_data?.id) {
            this.clientStorage.client.mutate<Mutation>({
                mutation: ADD_TO_BOOKMARK, variables: {
                    id: Number(this.card_data?.id)
                }
            })
                .then((response) => response?.data?.addCardToBookmark)
                .then((response) => {
                    if (response?.ok) {
                        this.loadCardData(false)
                    }
                })
                .catch((e) => console.log(e))
        }
    }

    setRating = (rating: number | null) => {
        if (rating && this.card_data?.id) {
            this.rating = rating
            this.clientStorage.client.mutate<Mutation>({
                mutation: SET_RATING, variables: {
                    id: Number(this.card_data?.id),
                    rating: rating
                }
            })
                .then((response) => response?.data?.setCardRating)
                .then((response) => {
                    if (response?.ok) {
                        this.loadCardData(false)
                    }
                })
                .catch((e) => console.log(e))

        }
    }

    rating?: number
    isBookmarked = false

    updateRatingAndISBookmarked() {
        if (this.card_data) {
            if (this.card_data.rating) {
                this.rating = this.card_data.rating
            }
            this.isBookmarked = Boolean(this.card_data.isBookmarked)
        }
    }

    isOpenGoToTestDialogAfterVideo = false
    testElementRef = React.createRef() as RefObject<HTMLDivElement>


}


type ThemeAncestorMap = Map<string, UnstructuredThemesNode[]>;


type IFindInCourseNotification = {
    course_name: string
    course_id: string
    position: positionDataI
}[]
type similarCardsI = {
    type: "CardElement",
    id: number
}
