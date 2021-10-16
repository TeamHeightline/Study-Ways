import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {sort} from "fast-sort";
import {Maybe, QuestionNode, QuestionSequenceNode} from "../../../../../SchemaTypes";
import {ALL_QUESTION_SEQUENCE, ALL_QUESTIONS_STATISTIC, GET_QUESTION_DATA_BY_ID, MY_QUESTION_SEQUENCES} from "./Struct";
import {StatisticByQuestionDataStoreObject} from "./StatisticByQuestionsDataStore";

class StatisticPageStore {
    constructor(){
        makeAutoObservable(this)
        this.loadQuestionsDataFromServer()
        reaction(() => this.userStorage.userAccessLevel, () => this.loadQuestionsDataFromServer())
        reaction(()=>this.selectedQuestionID ,() => this.changeSelectedQuestionData())
        reaction(()=> this?.selectedQuestionsData, () => StatisticByQuestionDataStoreObject?.changeQuestionsData(this?.selectedQuestionsData))
        reaction(() => this.selectedQuestionSequenceID, () => this.loadQSDataFromServer())
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
            this.clientStorage.client.query({query: ALL_QUESTION_SEQUENCE})
                .then((response) => {
                    // this.allQuestionSequenceData = sort(response?.data?.me?.questionsequenceSet).desc((qs: any) => qs?.id)
                    this.allQuestionSequenceData = sort(response?.data?.questionSequence).desc((qs: any) => qs?.id)
                    this.questionSequenceDataHasBeenLoaded = true
                })
                .catch(() => void(0))
            this.clientStorage.client.query({query: MY_QUESTION_SEQUENCES})
                .then((response) => {
                    this.myQuestionSequenceData = sort(response?.data?.me?.questionsequenceSet).desc((qs: any) => qs?.id)
                    // this.allQuestionSequenceData = sort(response?.data?.questionSequence).desc((qs: any) => qs?.id)
                    this.questionSequenceDataHasBeenLoaded = true
                })
                .catch(() => void(0))

        }
    }
    //Данные по собственным всем сериям вопросов
    myQuestionSequenceData: Maybe<QuestionSequenceNode[]> | any = []

    //Данные по всем сериям вопросов
    allQuestionSequenceData: Maybe<QuestionSequenceNode[]> | any = []

    showOnlyMyQSStatistic = false

    changeShowOnlyMyQSStatistic(){
        this.showOnlyMyQSStatistic = !this.showOnlyMyQSStatistic
    }
    get qsDataForRenderOnPage(){
        if(this.showOnlyMyQSStatistic){
            return(this?.myQuestionSequenceData)
        }else{
            return(this?.allQuestionSequenceData)
        }
    }

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
    selectedQuestionsData: any = null

    //ID выбранной серии вопросов
    selectedQuestionSequenceID: number | undefined = undefined

    //При выборе серии вопросов мы загружаем данные о ней, потому что иначе придется загружать данные по всем вопросам,
    // это слишком много
    loadQSDataFromServer(){
        if(this?.selectedQuestionSequenceID){
            const activeQS = this.allQuestionSequenceData?.find((qs) => Number(qs.id) === Number(this.selectedQuestionSequenceID))
            if(activeQS){
                this.questionsDataForSelectedQS = []
                const awaitAllQuestionsPromisesArray: any = []
                activeQS?.sequenceData?.sequence.map((questionID) =>{
                    awaitAllQuestionsPromisesArray.push(new Promise((resolve, reject) =>{
                        this.clientStorage.client.query({query: GET_QUESTION_DATA_BY_ID, variables:{
                            id: questionID
                            }})
                            .then((response) =>{
                                try{
                                    this.questionsDataForSelectedQS.push(response?.data?.questionById)
                                    resolve(true)
                                }
                                catch(e){
                                    reject(e)
                                }
                            })
                    }))
                })
                Promise.all(awaitAllQuestionsPromisesArray).then(() => {
                    this.changeSelectedQuestionData()
                    //После того, как все данные загружены можно переключаться на страницу с
                    //таблицами и графиками
                    this.isOpenQuestion = true
                })
            }
        }
    }
    questionsDataForSelectedQS: Maybe<QuestionNode[]> | any = []

    //handle функция для изменения данных о выбранном вопросе
    changeSelectedQuestionData(){
        if(this.selectedQuestionID && this.activePageOnTopMenu === 0){
            this.selectedQuestionsData = this.allQuestionsData.find(question => Number(question.id) === Number(this.selectedQuestionID))
        }else if(this.selectedQuestionSequenceID && this.activePageOnTopMenu === 1){
            //Поскольку здесь у нас массив вопросов (все-таки речь идет о QS), нам нужно пройтись по ним всем и собрать
            //попытки прохождения и ответы

            let detailquestionstatisticSet: any = []
            toJS(this.questionsDataForSelectedQS)?.map((question) =>{
                detailquestionstatisticSet = detailquestionstatisticSet?.concat(question?.detailquestionstatisticSet)
            })

            let answers: any = []
            toJS(this.questionsDataForSelectedQS)?.map((question) =>{
                answers = answers.concat(question.answers)
            })
            this.selectedQuestionsData = {detailquestionstatisticSet: detailquestionstatisticSet, answers: answers}
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