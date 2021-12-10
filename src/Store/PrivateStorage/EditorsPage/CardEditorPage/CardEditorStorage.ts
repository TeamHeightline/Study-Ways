import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {GET_CARD_DATA_BY_ID} from "./Struct";
import {CardNode} from "../../../../SchemaTypes";

class CardEditorStorage{
    constructor() {
        makeAutoObservable(this)
        reaction(() => this.id, () => this.loadCardDataFromServer(toJS(this.id)))
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    id: number | undefined = undefined

    setID(id: number){
        this.id = id
    }

    loadCardDataFromServer(id: string | number | undefined){
        if(id){
            console.log(id)
            if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
                this.clientStorage.client.query({query: GET_CARD_DATA_BY_ID, fetchPolicy: "network-only",
                variables:{id: id}})
                    .then((response) => (response.data.cardById))
                    .then((card_data) => this.card_object = card_data)
            }
        }
    }
    //----------------------раздел работы с данными в самом редакторе ------------------------------

    card_object: CardNode | undefined = undefined

    get cardTitle(){
        return(this.card_object?.title !== 'Название карточки по умолчанию' ? this.card_object?.title : '')
    }
    changeCardTitle(e){
        if(this.card_object){
            this.card_object.title = e.target.value
        }
    }
    changeCardField = field => (e) =>{
        console.log(e)
        if(this.card_object){
            this.card_object[field] = e.target.value
        }
    }
}

export const CESObject = new CardEditorStorage()