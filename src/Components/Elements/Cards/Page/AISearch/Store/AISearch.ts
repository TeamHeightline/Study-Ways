import {makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {GET_AI_SEARCH_CARDS, GET_PERSONAL_HOME_PAGE, getAutocompleteCardDataAsync} from "./Query";

class AISearch {
    constructor() {
        makeAutoObservable(this)
        getAutocompleteCardDataAsync("физика")
    }

    clientStorage = ClientStorage

    loadPersonalHomePage() {
        try {
            this.clientStorage.client.query({
                query: GET_PERSONAL_HOME_PAGE,
                fetchPolicy: "network-only",
                variables: {}
            })
                .then((response) => response.data.personalCardHomePage)
                .then((recommendations) => {
                    if (recommendations?.IDs) {
                        this.cardsIDArrayFromHomePage = recommendations.IDs
                    }
                })

        } catch (e) {
            console.log(e)
        }
    }

    changeAISearchString = async (value) => {
        this.AISearchString = value
        this.getAutocompleteCardsData()
    }
    AISearchString: string = ''

    get AISearchStringForSearch() {
        if (this.AISearchString && String(this?.AISearchString).length > 2) {
            return (this.AISearchString)
        } else {
            return undefined
        }
    }

    async getAutocompleteCardsData() {
        const searchString = this.AISearchStringForSearch
        if (searchString) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                getAutocompleteCardDataAsync(searchString)
            }, 500)
        }
    }

    convertMatchToCardData(recommendation) {
        console.log(recommendation)
        const cardData = recommendation.recomms.map((recommItem) => recommItem?.values?.title)
        this.changeCardDataForAutocomplete(cardData)
    }

    changeCardDataForAutocomplete(cardData) {
        this.cardDataForAutocomplete = cardData
    }

    debounceTimer: any = null

    cardDataForAutocomplete: any[] = []

    getAISearchResult() {
        if (this.AISearchStringForSearch) {
            try {
                this.clientStorage.client.query({
                    query: GET_AI_SEARCH_CARDS, variables: {
                        searchString: this.AISearchStringForSearch
                    }
                })
                    .then((response) => response.data.aiCardSearch)
                    .then((recommendations) => {
                        if (recommendations?.IDs) {
                            this.cardsIDArrayFromSearch = recommendations.IDs
                        }
                    })

            } catch (e) {
                console.log(e)
            }
        }
    }

    cardsIDArrayFromSearch: string[] = []
    cardsIDArrayFromHomePage: string[] = []

    get cardsIDArray() {
        if (toJS(this.cardsIDArrayFromSearch).length > 0) {
            return (toJS(this.cardsIDArrayFromSearch))
        } else {
            return (toJS(this.cardsIDArrayFromHomePage))
        }
    }
}

export const AISObject = new AISearch()
