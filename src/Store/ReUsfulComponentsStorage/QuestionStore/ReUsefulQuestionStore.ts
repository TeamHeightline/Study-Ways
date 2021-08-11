import {makeAutoObservable} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_QUESTION_DATA} from "./Struct";
import {AnswerNode, Maybe} from "../../../../SchemaTypes";

// Если нужно в любом месте проекта вызвать логику и данные для прохождения вопроса, то в сторе,
// который отвечает за ту страницу, где это нужно, заводится переменная, которая является объектом
// этого класса, то есть за создание и поведение логики проигрывателя вопроса отвечает тот сторадж,
// которому этот проигрыватель нужен, ВНИМАНИЕ!!!! НЕ РЕАКТ КОМПОНЕНТ, А ИМЕННО СТОРАДЖ, а уже из
// этого стора в глупый реакт компонент пробрасывается объект ImageQuestion пробрасываются данные
// и логика работы
export class ReUsefulQuestionStore {
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    store = null

    questionText = ''
    videoUrl = ''
    answers: Maybe<AnswerNode[]> = []
    id = 0

    //Функция для передачи данных о вопросе с сервера
    getQuestionDataFromServer(){
        if(this.id !== 0){
            this.clientStorage.client.query({query: GET_QUESTION_DATA, variables: {id: this.id}})
                .then(response => {
                    this.questionText = response.data.questionById.text
                    this.answers = response.data.questionById.answers
                    this.videoUrl = response.data.questionById.videoUrl
                })
                .catch(() => void(0))
        }
    }
    constructor(store, id: number){
        makeAutoObservable(this)
        this.store = store
        this.id = id
        this.getQuestionDataFromServer()
    }
    
}