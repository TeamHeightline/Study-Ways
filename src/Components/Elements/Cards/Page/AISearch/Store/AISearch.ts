import {autorun, makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {GET_AI_SEARCH_CARDS, GET_PERSONAL_HOME_PAGE} from "./Query";

class AISearch{
    constructor() {
        makeAutoObservable(this)
        autorun(()=> this.getAISearchResult())
    }
    clientStorage = ClientStorage
    loadPersonalHomePage(){
        try{
            this.clientStorage.client.query({query: GET_PERSONAL_HOME_PAGE,
                fetchPolicy: "network-only",
                variables:{

            }})
                .then((response) =>response.data.personalCardHomePage)
                .then((recommendations) =>{
                    if(recommendations?.IDs){
                        this.cardsIDArrayFromHomePage = recommendations.IDs
                    }
                })

            }catch(e){
                console.log(e)
        }
    }
    changeAISearchString = async (e) =>{
        this.AISearchString = e.target.value
    }
    AISearchString?: string

    get AISearchStringForSearch(){
        if(this.AISearchString && String(this?.AISearchString).length > 2){
            return(this.AISearchString)
        }
        else{
            return undefined
        }
    }

    getAISearchResult(){
        if(this.AISearchStringForSearch){
            try{
                this.clientStorage.client.query({query: GET_AI_SEARCH_CARDS, variables:{
                        searchString: this.AISearchStringForSearch
                }})
                    .then((response) =>response.data.aiCardSearch)
                    .then((recommendations)  => {
                        if(recommendations?.IDs){
                            this.cardsIDArrayFromSearch = recommendations.IDs
                        }
                    })

                }catch(e){
                    console.log(e)
            }
        }
    }

    cardsIDArrayFromSearch: string[] = []
    cardsIDArrayFromHomePage: string[] = []

    get cardsIDArray(){
        if(this.AISearchStringForSearch){
            return(toJS(this.cardsIDArrayFromSearch))
        }
        else{
            return (toJS(this.cardsIDArrayFromHomePage))
        }
    }
}

export const AISObject = new AISearch()