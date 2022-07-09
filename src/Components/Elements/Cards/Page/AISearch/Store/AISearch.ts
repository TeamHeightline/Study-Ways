import {makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {
    GET_AI_SEARCH_CARDS,
    GET_PERSONAL_HOME_PAGE,
    getAutocompleteCardDataAsync,
    selectRecommendedCardReport
} from "./Query";

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
    AISearchString = ''


    async getAutocompleteCardsData() {
        if (this?.AISearchString) {
            const searchString = this?.AISearchString
            if (searchString) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    getAutocompleteCardDataAsync(searchString)
                }, 500)
            }
        }
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
        if (this.AISearchString) {
            try {
                this.clientStorage.client.query({
                    query: GET_AI_SEARCH_CARDS, variables: {
                        searchString: this.AISearchString
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
