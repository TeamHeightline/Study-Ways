import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {GET_QS_DATA_BY_ID} from "./Struct";
import {Query, QuestionNode} from "../../../../../SchemaTypes";
import {SameQuestionPlayer} from "./SameQuestionPlayer";


export class QSPlayerStore {
    constructor(){
        makeAutoObservable(this)

        reaction(() =>this.questionSequenceID, () => {this.loadQSDataFromServer()})
    }

    //ID той последовательности вопросов, которую мы хотим отредактировать
    questionSequenceID: any = null

    //устанавливаем или меняем id серии вопросов
    setQSID(id){
        this.questionSequenceID = id
    }

    //Флаг для загрузки
    allDataNasBeenLoaded = false

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    //Параметры серии вопросов ----------------------------

    //Название серии вопросов
    name = ''

    //Режим экзамена
    isUseExamMode = false

    //Массив сторов, отвечающих за каждый конкретный вопрос
    questionsStoreArray: any[] = []

    //Номер вопроса, который проходят прямо сейчас
    selectedQuestionIndex = 0

    //Обработчик переключения между вопросами
    changeSelectedQuestionIndex(newIndex){
        this.selectedQuestionIndex = newIndex
    }
    //------------------------------------------------------


    //Подгрузка данных с сервера о серии вопросов
    loadQSDataFromServer() {
        if(this.questionSequenceID !== null && !this.allDataNasBeenLoaded){
            const __questionsStoreArray: any = []
            this.clientStorage.client.query<Query, {id: number}>(
                {query: GET_QS_DATA_BY_ID,
                    variables: {
                    id: Number(this.questionSequenceID)
                }})
                .then((data) => {
                    console.log(data)
                    this.name = String(data?.data?.questionSequenceById?.name)
                    data?.data?.questionSequenceById?.sequenceData?.sequence.map((sameQuestion, sqIndex) =>{
                        __questionsStoreArray.push(new SameQuestionPlayer(Number(sameQuestion)))
                    })
                    this.questionsStoreArray = __questionsStoreArray

                    this.allDataNasBeenLoaded = true
                })
        }
    }

}
