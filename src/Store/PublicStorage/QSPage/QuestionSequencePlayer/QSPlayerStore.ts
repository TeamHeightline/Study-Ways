import {makeAutoObservable, reaction} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {GET_QS_DATA_BY_ID} from "./Struct";
import {Query} from "../../../../SchemaTypes";
import {QuestionPlayerStore} from "../../../../Pages/Question/QuestionByID/Store/QuestionPlayerStore";
import {shuffle} from "lodash"

export class QSPlayerStore {
    constructor() {
        makeAutoObservable(this)

        reaction(() => this.questionSequenceID, () => {
            this.loadQSDataFromServer()
        })
    }

    //ID той последовательности вопросов, которую мы хотим отредактировать
    questionSequenceID: any = null

    //устанавливаем или меняем id серии вопросов
    setQSID(id) {
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

    //Уровень сложности подсказок
    hardLevelOfHelpText = '0'

    //обработчик изменений сложности подсказки
    changeHardLevelOfHelpText(newHardLevelOfHelpText) {
        this.hardLevelOfHelpText = newHardLevelOfHelpText
    }

    //Был ли выбран уровень сложности для всей серии вопросов
    HardLevelHasBeenSelected = false

    setHardLevelHasBeenSelected() {
        this.HardLevelHasBeenSelected = true
    }

    //Обработчик переключения между вопросами
    changeSelectedQuestionIndex(newIndex) {
        this.selectedQuestionIndex = newIndex
    }

    get activeQuestionStoreInstance() {
        return (this.questionsStoreArray[this.selectedQuestionIndex])
    }

    //------------------------------------------------------


    //Подгрузка данных с сервера о серии вопросов
    loadQSDataFromServer() {
        if (this.questionSequenceID !== null && !this.allDataNasBeenLoaded) {
            const __questionsStoreArray: any = []
            this.clientStorage.client.query<Query, { id: number }>(
                {
                    query: GET_QS_DATA_BY_ID,
                    variables: {
                        id: Number(this.questionSequenceID)
                    }, fetchPolicy: "network-only"
                })
                .then((data) => {
                    this.name = String(data?.data?.questionSequenceById?.name)
                    //Перемешиваем вопросы
                    shuffle(data?.data?.questionSequenceById?.sequenceData?.sequence).map((sameQuestion) => {
                        __questionsStoreArray.push(new QuestionPlayerStore(this, Number(sameQuestion)))
                    })
                    this.questionsStoreArray = __questionsStoreArray

                    this.allDataNasBeenLoaded = true
                })
        }
    }

}
