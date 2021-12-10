import {makeAutoObservable} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {GET_CARD_DATA_BY_ID} from "./Struct";
import {CardNode} from "../../../../SchemaTypes";
import { computedFn } from "mobx-utils"

class CardEditorStorage{
    constructor() {
        makeAutoObservable(this)
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    cardDataLoaded = false

    loadCardDataFromServer(id: string | number | undefined){
        if(id){
            console.log(id)
            if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
                this.clientStorage.client.query({query: GET_CARD_DATA_BY_ID, fetchPolicy: "network-only",
                variables:{id: id}})
                    .then((response) => (response.data.cardById))
                    .then((card_data) => {
                        console.log(card_data)
                        this.card_object = card_data
                        this.cardDataLoaded = true})
            }
        }
    }
    //----------------------раздел работы с данными в самом редакторе ------------------------------

    card_object: CardNode | undefined = undefined

    get cardTitle(){
        return(this.card_object?.title !== 'Название карточки по умолчанию' ? this.card_object?.title : '')
    }
    getField = computedFn((field_name, default_value = "", card_object = this.card_object) =>{
        return card_object && card_object[field_name] ? card_object[field_name]: default_value
    })
    changeCardField = field => (e) =>{
        console.log(e)
        if(this.card_object){
            this.card_object[field] = e.target.value
        }
    }
}

export const CESObject = new CardEditorStorage()