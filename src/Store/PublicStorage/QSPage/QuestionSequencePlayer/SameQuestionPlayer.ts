import {makeAutoObservable, reaction} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {GET_QUESTION_DATA_BY_ID} from "./Struct";
import {SameAnswerNode} from "./SameAnswerNode";

export class SameQuestionPlayer{
    constructor(questionID){
        makeAutoObservable(this)
        reaction(() => this.questionID, () => this.loadQuestionDataFromServer())
        reaction(() => this.questionID, () => this.deliverFromServerImageURL())
        this.questionID = questionID

    }
    questionID: any

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Текст вопроса
    questionText = ''

    //Ссылка на видео вопрос
    questionVideoUrl = ''

    //Массив всех ответов
    answersArray: any = []

    //Выбранные ответы
    selectedAnswers = new Set()

    //Обработчик выбора карточки
    selectAnswerHandleChange(answerID){
        if(this.selectedAnswers.has(answerID)){
            this.selectedAnswers.delete(answerID)
        }else{
            this.selectedAnswers.add(answerID)
        }

    }

    //Количество попыток
    numberOfPasses = 0

    //Ссылка на фото для вопроса
    questionImageUrl = ''

    deliverFromServerImageURL(){
        fetch("https://iot-experemental.herokuapp.com/files/question?id="+ this.questionID)
            .then(response => response.json())
            .then(jResponse =>{
                this.questionImageUrl = jResponse[0].image
            })
            .catch(() => this.questionImageUrl = '')
    }

    //Функция для загрузки данных о вопросе с сервера
    loadQuestionDataFromServer(){
        this.clientStorage.client.query({query: GET_QUESTION_DATA_BY_ID, variables:{
            id: this.questionID
            }})
            .then((data) => {
                console.log(data)
                this.questionText = data.data.questionById.text
                const __AnswersArray: any[] = []
                data.data.questionById.answers.map((answer) =>{
                    __AnswersArray.push(new SameAnswerNode( answer.id,  answer.text))
                })
                this.answersArray = __AnswersArray
            })
    }


}