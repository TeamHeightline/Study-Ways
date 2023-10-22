import {autorun, makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";
import {CREATE_NEW_CARD, GET_CARD_ID_BY_SEARCHING_PARAMS, GET_CONNECTED_THEME} from "./Query";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {CardCardContentType, CardHardLevel, Mutation, UnstructuredThemesNode} from "../../../../SchemaTypes";


export class CardSelectorStore {
    constructor() {
        makeAutoObservable(this)
        autorun(() => this.loadCardsIDBBySearchingParams())
    }

    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    //---Создание новых карточек--------------------------------------------------------
    createNewCard() {
        try {
            this.clientStorage.client.mutate<Mutation>({
                mutation: CREATE_NEW_CARD, variables: {}
            })
                .then((response) => response?.data?.card?.card)
                .then((new_card) => {
                    if (new_card) {
                        this.selectedCardID = new_card.id
                    }
                    this.loadCardsIDBBySearchingParams()
                })
                .catch((e) => console.log(e))

        } catch (e) {
            console.log(e)
        }
    }

    //-------------------------------------------------------------------------------

    activePage = 1
    maxPages = 1
    searching_string = ''

    changeActivePage = (e: any, value: number) => {
        this.activePage = value
    }

    changeSearchString = (e) => {
        this.searching_string = e.target.value
    }

    cards_id_array: string[] = []

    mode?: "onlyCreatedByMe" | "standard" = undefined

    setMode(new_mode) {
        this.mode = new_mode
    }

    hardLevel: hardLevelTypes = "undefined"
    changeHardLevel = (e) => {
        this.hardLevel = e.target.value
    }

    contentType: cardContentType = "undefined"
    changeContentType = (e) => {
        this.contentType = e.target.value
    }
    allConnectedThemes: UnstructuredThemesNode[] = []
    connectedThemesHasBeenLoaded = false

    get connectedThemesForSelector() {
        return toJS(this.allConnectedThemes)
            ?.map((theme) => {
                return ({
                    id: theme.id,
                    value: theme.id,
                    title: theme.text,
                    pId: theme?.parent?.id || 0
                })
            })
    }

    loadCardConnectedThemes(useCache = true) {
        try {
            this.clientStorage.client.query({
                query: GET_CONNECTED_THEME,
                fetchPolicy: useCache ? "cache-first" : "network-only",
                variables: {}
            })
                .then((response) => response.data.unstructuredTheme)
                .then((connected_themes) => {
                    this.allConnectedThemes = connected_themes
                    this.connectedThemesHasBeenLoaded = true
                })
            if (useCache) {
                this.loadCardConnectedThemes(false)
            }

        } catch (e) {
            console.log(e)
        }
    }

    cardConnectedTheme?: number

    selectedCardID?: number | string

    selectCard(card_id: number | string) {
        this.selectedCardID = card_id
    }

    loadCardsIDBBySearchingParams() {
        if (this.mode) {
            const filters = {}
            if (this.searching_string.length > 2) {
                filters['smartSearchString'] = this.searching_string
            }
            if (this.mode == "onlyCreatedByMe") {
                filters['createdByMe'] = true
            }
            if (this.hardLevel !== "undefined") {
                filters['cardHardLevel'] = Number(this.hardLevel.slice(2, 3))
            }
            if (this.contentType !== "undefined") {
                filters['cardType'] = Number(this.contentType.slice(2, 3))
            }
            if (this.cardConnectedTheme) {
                filters['connectedTheme'] = this.cardConnectedTheme
            }


            try {
                this.clientStorage.client.query({
                    query: GET_CARD_ID_BY_SEARCHING_PARAMS,
                    fetchPolicy: "network-only",
                    variables: {
                        activePage: this.activePage,
                        ...filters
                    }
                })
                    .then((response) => response.data.cardIdResolverForSelector)
                    .then((searching_data) => {
                        if (searching_data) {
                            if (searching_data?.IDs) {
                                if (this.mode == "onlyCreatedByMe") {
                                    this.my_cards_activePage = Number(searching_data.activePage)
                                    this.my_cards_maxPages = Number(searching_data.numPages)
                                    this.my_cards_cards_id_array = searching_data?.IDs
                                }
                                this.activePage = Number(searching_data.activePage)
                                this.maxPages = Number(searching_data.numPages)
                                this.cards_id_array = searching_data?.IDs
                            }
                        }
                    })

            } catch (e) {
                console.log(e)
            }
        }
    }

    my_cards_activePage = 0
    my_cards_maxPages = 1
    my_cards_cards_id_array: string[] = []


    get cards_id_array_for_selector() {
        if (this.mode == "onlyCreatedByMe") {
            return toJS(this.my_cards_cards_id_array)
        } else {
            return toJS(this.cards_id_array)
        }
    }

    get activePage_for_selector() {
        if (this.mode == "onlyCreatedByMe") {
            return this.my_cards_activePage
        } else {
            return this.activePage
        }
    }

    get maxPages_for_selector() {
        if (this.mode == "onlyCreatedByMe") {
            return this.my_cards_maxPages
        } else {
            return this.maxPages
        }
    }
}

type hardLevelTypes = CardHardLevel | "undefined"
export type cardContentType = CardCardContentType | "undefined"

export const
    CSSObject = new CardSelectorStore()
