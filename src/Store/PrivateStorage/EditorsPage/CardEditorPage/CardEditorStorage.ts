import {makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {GET_CARD_DATA_BY_ID, GET_MY_CARD_AUTHOR} from "./Struct";
import {CardAuthorNode, CardNode} from "../../../../SchemaTypes";
import { computedFn } from "mobx-utils"
import {sort} from "fast-sort";
export type card_object_fields = keyof CardNode

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
            if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
                this.clientStorage.client.query({query: GET_CARD_DATA_BY_ID, fetchPolicy: "network-only",
                variables:{id: id}})
                    .then((response) => (response.data.cardById))
                    .then((card_data) => {

                        //--------для полей, содержащих массивы, делаем дополнительную загрузку уже только айдишников
                        const author = card_data?.author?.map((author) => author.id)
                        //----------------------------------------------------------------

                        this.card_object = {...card_data, author}
                        this.cardDataLoaded = true})
            }
        }
    }
    // ---------------------раздел работы с авторами карточек---------------------------------------
    all_my_card_authors: CardAuthorNode[] | undefined = undefined
    authorsDataLoaded = false

    loadCardAuthorsFromServer(){
        if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
            this.clientStorage.client.query({query: GET_MY_CARD_AUTHOR, fetchPolicy: "network-only"})
                .then((response) => (response.data.me.cardauthorSet))
                .then((authors_data) => {
                    this.all_my_card_authors = authors_data
                    this.authorsDataLoaded = true
                })
        }
    }

    get allMyCardAuthors(){
        if(this.all_my_card_authors){
        return(sort(toJS(this.all_my_card_authors? this.all_my_card_authors : [])).desc((author) => author.id))
        }
    }

    //----------------------раздел работы с данными в самом редакторе ------------------------------

    card_object: CardNode | undefined = undefined

    //Умный Getter позволяет получать кэшированные значения сразу для все полей объекта, принимает поле и дефолтное значение
    getField = computedFn((field_name: card_object_fields, default_value: string | number| boolean | [] = "",
                           card_object = this.card_object) =>{
        return (card_object && card_object[field_name]) ? card_object[field_name]: default_value
    })
    //number в field - это грязный хак, чтобы не было ошибки из строчки с присвоением, как только TS видит что используются
    //конкретные ключи, начинает сразу говорить, что это never тип
    changeField = (field: card_object_fields | number, eventField: "value"| "checked" = "value",
                   card_object = this.card_object) => ({target}) =>{
        if(card_object && field in card_object){
            card_object[field] = target[eventField]
        }
    }

    changeFieldByValue(field: card_object_fields | number, value: string | number | boolean,
                       card_object = this.card_object){
        if(card_object && card_object[field]){
            card_object[field] = value
        }
    }

    //----------------------------------------------------------------
    urlValidation(arrow_url){
        if(!arrow_url){
            return true
        }
        try {
            const url = new URL(arrow_url);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }
    validateUrlField = computedFn((fieldName: card_object_fields, card_object:  CardNode | undefined  = this.card_object) => {
        if(card_object && fieldName in card_object){
        return(
            this.urlValidation(card_object[fieldName])
        )}
    })



}
export const CESObject = new CardEditorStorage()