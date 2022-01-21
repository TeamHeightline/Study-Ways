import {autorun, makeAutoObservable, toJS} from "mobx";
import { ClientStorage } from "../../../../../Store/ApolloStorage/ClientStorage";
import {GET_CARD_ID_BY_SEARCHING_PARAMS, GET_CONNECTED_THEME} from "./Query";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {CardCardContentType, CardHardLevel, UnstructuredThemesNode} from "../../../../../SchemaTypes";

export class CardSelectorStore{
    constructor() {
        makeAutoObservable(this)
        autorun(()=> this.loadCardsIDBBySearchingParams())
        autorun(() => this.loadCardConnectedThemes())
    }
    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    activePage = 1
    maxPages = 1
    searching_string = ''

    changeActivePage = (e: any, value: number) =>{
        this.activePage = value
    }

    changeSearchString = (e) =>{
        this.searching_string = e.target.value
    }

    cards_id_array: string[] = []

    mode: "onlyCreatedByMe" | "standard" = "standard"
    setMode(new_mode){
        this.mode = new_mode
    }

    hardLevel: hardLevelTypes  = "undefined"
    changeHardLevel = (e) =>{
        this.hardLevel = e.target.value
    }

    contentType: cardContentType = "undefined"
    changeContentType = (e) =>{
        this.contentType = e.target.value
    }
    allConnectedThemes: UnstructuredThemesNode[] = []
    connectedThemesHasBeenLoaded = false
    get connectedThemesForSelector(){
        return toJS(this.allConnectedThemes)
            ?.map((theme)=> {
                return({
                    id: theme.id,
                    value: theme.id,
                    title: theme.text,
                    pId: theme?.parent?.id || 0
                })
            })
    }
    loadCardConnectedThemes( useCache=true){
        try{
            this.clientStorage.client.query({query: GET_CONNECTED_THEME,
                fetchPolicy: useCache? "cache-first": "network-only",
                variables:{

            }})
                .then((response) =>response.data.unstructuredTheme)
                .then((connected_themes) => {
                    this.allConnectedThemes = connected_themes
                    this.connectedThemesHasBeenLoaded = true
                })
            if(useCache){
                this.loadCardConnectedThemes(false)
            }

            }catch(e){
                console.log(e)
        }
    }

    cardConnectedTheme?: number

    selectedCardID?: number | string

    selectCard(card_id: number | string){
        this.selectedCardID = card_id
    }

    loadCardsIDBBySearchingParams(){
        const filters = {}
        if(this.searching_string.length > 2){
            filters['smartSearchString'] = this.searching_string
        }
        if(this.mode == "onlyCreatedByMe"){
            filters['createdByMe'] = true
        }
        if(this.hardLevel !== "undefined"){
            filters['cardHardLevel'] = Number(this.hardLevel.slice(2,3))
        }
        if(this.contentType !== "undefined"){
            filters['cardType'] = Number(this.contentType.slice(2,3))
        }
        if(this.cardConnectedTheme){
            filters['connectedTheme'] = this.cardConnectedTheme
        }

        try{
            this.clientStorage.client.query({query: GET_CARD_ID_BY_SEARCHING_PARAMS,
                fetchPolicy: "network-only",
                variables:{
                    activePage: this.activePage,
                    ...filters
            }})
                .then((response) =>response.data.cardIdResolverForSelector)
                .then((searching_data) =>{
                    if(searching_data){
                        if(searching_data?.IDs){
                            this.activePage = Number(searching_data.activePage)
                            this.maxPages = Number(searching_data.numPages)
                            this.cards_id_array = searching_data?.IDs
                        }
                    }
                })

            }catch(e){
                console.log(e)
        }
    }

}

type hardLevelTypes = CardHardLevel | "undefined"
type cardContentType = CardCardContentType | "undefined"

export const CSSObject = new CardSelectorStore()