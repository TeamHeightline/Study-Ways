import {makeAutoObservable, toJS} from "mobx";
import {directionData, GET_ALL_COURSE, GET_QUESTION_TEXT_BY_ID} from "./Struct";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {CardCourseNode} from "../../../../SchemaTypes";
import {GET_QS_DATA_BY_ID} from "../../PublicStorage/QSPage/QuestionSequencePlayer/Struct";

class CardProcessedClass{
    cardID = 1
    type = "CardElement"
    constructor(id){
        this.cardID = id
    }
}

class QuestionProcessedClass{
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    ownStore: any = null

    id = 68
    type = "QuestionElement"
    questionText = ''

    loadQuestionDataFromServer(){
        this.clientStorage.client.query({query: GET_QUESTION_TEXT_BY_ID, variables: {id: this.id}})
            .then(response => {
                this.questionText = response.data.questionById.text
            })
    }

    handleClickOnQuestionCard(){
        this.ownStore.openQuestionID = this.id
        this.ownStore.openQuestion()
    }


    constructor(id, ownStore){
        this.ownStore = ownStore
        this.id = id
        this.loadQuestionDataFromServer()
    }

}

class CourseProcessedClass{
    constructor(cardPositionData, ownStore) {
        this.cardPositionData = cardPositionData
        this.ownStore = ownStore
    }
    ownStore: any = null
    cardPositionData: any = {}
    type = "CourseElement"
    updateCardPositionData(e){
        this.ownStore.openCard()
        const cardPositionData = this.cardPositionData
        cardPositionData.buttonIndex = e.buttonIndex
        cardPositionData.fragment = e.fragment
        cardPositionData.row = e.row
        this.cardPositionData = cardPositionData
        this.ownStore.openCardID = this.ownStore.get_card_id_in_course_by_position(toJS(this.cardPositionData))
        this.ownStore.isOpenCard = true
    }
}

class QuestionSequenceProcessedClass{
    constructor(id, ownStore) {
        this.id = id
        this.ownStore = ownStore
        this.loadQSDataFromServer()
    }
    ownStore: any = null
    type = "QuestionSequenceElement"
    id = 0
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    qsName = ''

    loadQSDataFromServer(){
        this.clientStorage.client.query({query: GET_QS_DATA_BY_ID, variables: {id: this.id}})
            .then(response => {
                this.qsName = response.data.questionSequenceById.name
            })
            .catch(() => void(0))
    }

    handleClickOnQuestionSequnceCard(){
        this.ownStore.openQuestionSequenceID = this.id
        this.ownStore.openQuestionSequence()
    }

}

export class ReUsefulQuestionStore{
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    directionData = directionData
    cardCourse:  CardCourseNode[]  = []

    //ID выбранной карточки, используется и для элемента курса
    openCardID = 1
    //Выбрана ли карточка, по факту означает, нажал ли пользователь на что-нибудь или нет
    isOpenCard = false

    //ID выбранного вопроса
    openQuestionID = 68
    //Выбран ли вопрос, по факту означает, нажал ли пользователь на карточку с вопросом или нет
    isOpenQuestion = false
    //Выбрана ли сейчас серия вопросов
    isOpenQuestionSequence = false

    openQuestionSequenceID = 0

    openCard(){
        this.isOpenCard = true
        this.isOpenQuestion = false
        this.isOpenQuestionSequence = false
    }

    openQuestion(){
        this.isOpenCard = false
        this.isOpenQuestion = true
        this.isOpenQuestionSequence = false
    }

    openQuestionSequence(){
        this.isOpenCard = false
        this.isOpenQuestion = false
        this.isOpenQuestionSequence = true
    }

    //Массив наблюдаемых объектов, каждый из которых управляет поведением своего обьъекта в Step,
    //сделано, чтобы курсы помнили и могли обрабатывать изменения в выбранной карточки, а вопросы помнили
    //сколько было попыток и тд.
    directionProcessedObject: any = []

    get_card_id_in_course_by_position(cardPositionData){
        return(this?.cardCourse?.find( course => Number(course.id) === Number(cardPositionData?.courseID))?.courseData[Number(cardPositionData.row)]
            .SameLine[cardPositionData.fragment].CourseFragment[Number(cardPositionData.buttonIndex)].CourseElement.id)
    }

    //Загружает всю информацию о курсах с сервера
    loadCourseDataFromServer(){
        this.clientStorage.client.query({query: GET_ALL_COURSE})
            .then((response) =>{
                this.cardCourse = response.data.cardCourse
            })
    }

    //Превращает данные о пользовательской серии данных в массив наблюдаемых объектов определенных типов
    directionDataParser(){
        const directionProcessedObject: any = []
        this.directionData.map((element) =>{
            if(element.type === "CardElement"){
                directionProcessedObject.push(new CardProcessedClass(element.id))
            }
            if(element.type === "CourseElement"){
                directionProcessedObject.push(new CourseProcessedClass(element.cardPositionData, this))
            }
            if(element.type === "QuestionElement"){
                directionProcessedObject.push(new QuestionProcessedClass(element.id, this))
            }
            if(element.type === "QuestionSequenceElement"){
                directionProcessedObject.push(new QuestionSequenceProcessedClass(element.id, this))
            }

        })
        this.directionProcessedObject = directionProcessedObject
    }

    constructor(){
        makeAutoObservable(this)
        this.loadCourseDataFromServer()
        this.directionDataParser()
    }
}