import {autorun, makeAutoObservable, reaction} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {sort} from "fast-sort";
import {Maybe, QuestionNode, QuestionSequenceNode} from "../../../../../SchemaTypes";
import {ALL_QUESTIONS_STATISTIC, MY_QUESTION_SEQUENCES} from "./Struct";
import {StatisticByQuestionDataStoreObject} from "./StatisticByQuestionDataStore";

class StatisticPageStore {
    constructor(){
        makeAutoObservable(this)
        this.loadQuestionsDataFromServer()
        reaction(() => this.userStorage.userAccessLevel, () => this.loadQuestionsDataFromServer())
        autorun( () => this.changeSelectedQuestionData())
        autorun(() => StatisticByQuestionDataStoreObject?.changeQuestionData(this?.selectedQuestionData))
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    //Данные по всем вопросам
    allQuestionsData: Maybe<QuestionNode[]> | any = []

    //Флаг загрузки всех данных
    questionDataHasBeenLoaded = false

    //Функция для загрузки нужных данных о вопросах с сервера
    loadQuestionsDataFromServer(){
        if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN"){
            this.clientStorage.client.query({query:ALL_QUESTIONS_STATISTIC})
                .then((response) =>{
                    this.allQuestionsData = sort(response?.data?.me?.questionSet).desc((question: any) => question?.id)
                    this.questionDataHasBeenLoaded = true
                })
                .catch(() => void(0))
            this.clientStorage.client.query({query: MY_QUESTION_SEQUENCES})
                .then((response) => {
                    this.allQuestionSequenceData = sort(response?.data?.me?.questionsequenceSet).desc((qs: any) => qs?.id)
                    this.questionSequenceDataHasBeenLoaded = true
                })
                .catch(() => void(0))

        }
    }

    //Данные по всем сериям вопросов
    allQuestionSequenceData: Maybe<QuestionSequenceNode[]> | any = []

    //Флаг загрузки всех данных
    questionSequenceDataHasBeenLoaded = false

    //Вычисляемое значение для отрисовки вопросов на главной странице статистики
    get QuestionArrayForDisplay(){
        return(
            sort(this?.allQuestionsData).desc((question: any) => Number(question.id))
        )
    }

    //ID выбранного вопроса
    selectedQuestionID: number | undefined = undefined

    //handle функция для изменения ID вопроса
    changeSelectedQuestionID(newID: number){
        this.selectedQuestionID = newID
    }
    //Все данные о выбранном вопросе
    selectedQuestionData: any = null

    //handle функция для изменения данных о выбранном вопросе
    changeSelectedQuestionData(){
        if(this.selectedQuestionID){
            this.selectedQuestionData = this.allQuestionsData.find(question => Number(question.id) === Number(this.selectedQuestionID))
        }
    }

    //Открыт ли вопрос для просмотра его статистики
    isOpenQuestion = false

    //Обработчик изменений для isOpenQuestion
    changeIsOpenQuestion(newOpenState: boolean){
        this.isOpenQuestion = newOpenState
    }

    //Активная вкладка на меню сверху (вопросы/серия вопросов)
    activePageOnTopMenu = 0

    changeActivePageOnTopMenu(newPage: number){
        this.activePageOnTopMenu = newPage
    }




}

export const StatisticPageStoreObject = new StatisticPageStore()