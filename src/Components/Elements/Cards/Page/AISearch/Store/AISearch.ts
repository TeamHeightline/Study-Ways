import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {getAutocompleteCardDataAsync, selectRecommendedCardReport} from "./Query";
import {UnstructuredThemesNode} from "../../../../../../SchemaTypes";
import {GET_CONNECTED_THEME} from "../../../Selector/Store/Query";

class AISearch {
    constructor() {
        makeAutoObservable(this)

        reaction(() => this.AIQueryFilterString, () => this.getAutocompleteCardsData())
        reaction(() => this.AIQueryFilterString, () => this.getAISearchResult())
        reaction(() => this.cardConnectedTheme, () => this.calculateThemeWithParent())
    }


    clientStorage = ClientStorage

    loadAutocompleteDefaultData() {
        getAutocompleteCardDataAsync("", undefined, this.convertMatchToCardData)
    }


    changeAISearchString = async (value) => {
        this.AISearchString = value
        this.getAutocompleteCardsData()
    }
    AISearchString = ''

    //Фильтры ------------------------------------------------------
    //function for build RrQL filter string
    get AIQueryFilterString() {
        let queryString = ""
        if (this.hardLevel != "-1") {
            queryString += `'hard_level' == ${this.hardLevel}`
        }
        if (this.themeWithPatentIDArray.length > 0) {
            if (queryString.length > 0) {
                queryString += " and "
            }
            const itemInRecombeeStyleString = this.themeWithPatentIDArray.map((item) => {
                return ('"' + item + '"')
            }).join(", ")

            queryString += `({${itemInRecombeeStyleString}} & 'connected_theme') != {}`
        }
        return queryString
    }

    hardLevel: "-1" | "0" | "1" | "2" | "3" = "-1"

    changeHardLevel = (e) => {
        this.hardLevel = e.target.value
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

    loadCardConnectedThemes() {
        try {
            this.clientStorage.client.query({
                query: GET_CONNECTED_THEME,
                fetchPolicy: "network-only",
                variables: {}
            })
                .then((response) => response.data.unstructuredTheme)
                .then((connected_themes) => {
                    this.allConnectedThemes = connected_themes
                    for (let theme of connected_themes) {
                        if (this.themeParentToThemeMap.has(theme.parent?.id)) {
                            const themesArray = this.themeParentToThemeMap.get(theme.parent?.id) || []
                            this.themeParentToThemeMap.set(theme?.parent?.id, [...themesArray, theme?.id])
                        } else {
                            this.themeParentToThemeMap.set(theme?.parent?.id, [theme?.id])
                        }
                    }
                    this.connectedThemesHasBeenLoaded = true
                })
        } catch (e) {
            console.log(e)
        }
    }

    calculateThemeWithParent() {
        this.themeWithPatentIDArray = []
        if (this.cardConnectedTheme) {
            this.themeWithPatentIDArray.push(String(this.cardConnectedTheme))
            this.recursiveThemeCollector(this.cardConnectedTheme)
            console.log(toJS(this.themeWithPatentIDArray))
        }
    }

    recursiveThemeCollector(themeID) {
        if (this.themeParentToThemeMap.has(themeID)) {
            const themesArray = this.themeParentToThemeMap.get(themeID) || []
            for (let theme of themesArray) {
                this.themeWithPatentIDArray.push(theme)
                this.recursiveThemeCollector(theme)
            }
        }
    }


    themeWithPatentIDArray: string[] = []

    cardConnectedTheme?: number
    themeParentToThemeMap: Map<string, string[]> = new Map()

    //


    async getAutocompleteCardsData() {
        const searchString = this?.AISearchString
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            getAutocompleteCardDataAsync(searchString || undefined, this.AIQueryFilterString, this.convertMatchToCardData)
        }, 500)
    }

    convertMatchToCardData = (recommendation) => {
        console.log(recommendation)
        if (recommendation?.recomms) {
            const cardData = recommendation?.recomms?.map((recommItem) => {
                return (
                    {
                        label: recommItem?.values?.title,
                        id: recommItem?.id
                    }
                )
            })
            this.changeCardDataForAutocomplete(cardData)
            this.changeAutocompleteRecommendationID(recommendation?.recommId)

        }
    }

    onSelectCardInAutocomplete = (event, value) => {
        console.log(toJS(value))
        this.changeAISearchString(value.label)
        this.getAISearchResult()
        selectRecommendedCardReport(this.autocompleteRecommendationID, value?.id)
    }

    changeCardDataForAutocomplete(cardData) {
        this.cardDataForAutocomplete = cardData
    }

    changeAutocompleteRecommendationID(id) {
        this.autocompleteRecommendationID = id
    }

    debounceTimer: any = null

    cardDataForAutocomplete: { label: string, id: number }[] = []
    autocompleteRecommendationID = ''

    getAISearchResult() {
        getAutocompleteCardDataAsync(this.AISearchString, this.AIQueryFilterString, this.changeCardIDArrayFromSearch, 50)
    }

    changeCardIDArrayFromSearch = (recommendation) => {
        if (recommendation?.recomms) {
            this.cardsIDArrayFromSearch = recommendation?.recomms?.map((recommItem) => recommItem?.id)
        }
    }

    cardsIDArrayFromSearch: string[] = []

    get cardsIDArray() {
        return (toJS(this.cardsIDArrayFromSearch))
    }
}

export const AISObject = new AISearch()
