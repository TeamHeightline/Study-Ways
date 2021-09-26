import {autorun, makeAutoObservable,  toJS} from "mobx";
import {SameAnswerNode} from "../../../PublicStorage/QSPage/QuestionSequencePlayer/SameAnswerNode";
import {sort} from "fast-sort";
import {StatisticPageStoreObject} from "./StatisticPageStore";

class PassedQuestion{
    constructor(attemptData){
        makeAutoObservable(this)
        this.attemptData = attemptData;
        if(attemptData.userName === null){
            this.attemptData.userName = "Анонимный пользователь"
        }
    }
    //Массив индексов попыток, которые открыты для детальной статистики
    openAttemptForDetailStatistic = new Set()

    //Функция обработчик для того, чтобы открывать на редактирование конкретную попытку
    changeOpenAttemptForDetailStatistic(attemptIndex){
        if(this.openAttemptForDetailStatistic.has(attemptIndex)){
            this.openAttemptForDetailStatistic.delete(attemptIndex)
        }else{
            this.openAttemptForDetailStatistic.add(attemptIndex)
        }
    }
    attemptData: any = undefined;

    //Вычисляемое значение среднего балла за попытку
    get arithmeticMeanNumberOfAnswersPoints(){
        let __sumOfAnswerPoints = 0
        let __minAnswerPoint = 100000
        this.attemptData?.statistic?.ArrayForShowAnswerPoints?.map((attempt) => {
            __sumOfAnswerPoints += Number(attempt.answerPoints)
            if(attempt.answerPoints < __minAnswerPoint){
                __minAnswerPoint = attempt.answerPoints
            }
        })
        this.minAnswerPoint = __minAnswerPoint
        return (__sumOfAnswerPoints / Number(this.attemptData?.statistic?.numberOfPasses)).toFixed(2)
    }

    //Минимальны балл за попытку
    minAnswerPoint = 0

    get arithmeticMeanNumberOfWrongAnswer(){
        let __sumOfWrongAnswers = 0
        let __maxNumberOfWrongAnswers = 0
        this.attemptData?.statistic?.ArrayForShowWrongAnswers?.map((attempt) => {
            __sumOfWrongAnswers += Number(attempt?.numberOfWrongAnswers?.length)
            if(attempt?.numberOfWrongAnswers?.length > __maxNumberOfWrongAnswers){
                __maxNumberOfWrongAnswers = attempt?.numberOfWrongAnswers?.length
            }
        })
        this.maxNumberOfWrongAnswers = __maxNumberOfWrongAnswers
        return (__sumOfWrongAnswers / (Number(this.attemptData?.statistic?.numberOfPasses) - 1)).toFixed(1)
    }

    maxNumberOfWrongAnswers = 0



}

class StatisticByQuestionsDataStore {
    constructor(){
        makeAutoObservable(this)
        autorun(() => this.fillPassedQuestionsObjectsArray())
    }

    //Текст вопроса
    // questionText = ''
    //
    // //ID вопроса
    // questionID: number | undefined = undefined

    //Статистика всех прохождений вопроса
    questionStatistic: any = undefined

    //функция заполнения стора данными из стора, отвечающего за страницу, в том сторе используется реакция
    //на изменение тех данных, которые нужно сюда доставить, далее реакция вызывает эту функцию и пробрасывает
    //данные
    changeQuestionsData(questionData){
        // this.questionText = questionData.text;
        // this.questionID = questionData.id;
        console.log(questionData)
        this.questionStatistic = sort(questionData.detailquestionstatisticSet).desc((detailQuestionStatistic: any) => Number(detailQuestionStatistic?.id));
        const __answersObjectsArray: any = []
        toJS(questionData?.answers)?.map((answer) =>{
            __answersObjectsArray.push(new SameAnswerNode(Number(answer?.id), answer?.text, answer?.isTrue))
        })
        __answersObjectsArray.map((QuestionsObject) =>{
            QuestionsObject?.getImageUrlFromServer()
        })
        this.answersArrayDataStore = __answersObjectsArray
    }

    //Массив наблюдаемых хранилищ ответов, для каждой попытки мы будем брать массив неверных ответов,
    // для него делать поиск в этом массиве, получать стор для конкретного ответа и отображать текст и картинку для
    //этого ответа

    answersArrayDataStore: any[] = []


    passedQuestionsObjectsArray: any = []

    fillPassedQuestionsObjectsArray(){
        const __passedQuestionsObjectsArray: any = []
        this.questionStatistic?.map((attempt) =>{
            __passedQuestionsObjectsArray?.push(new PassedQuestion(attempt))
        })
        this.passedQuestionsObjectsArray = __passedQuestionsObjectsArray
    }

    //Имя пользователя, статистику по которому мы хотим увидеть
    searchingUserName = ''

    //Обработчик изменений в имени пользователя, статистику по которому мы хотим увидеть
    changeSearchingUserName(newName: string){
        this.searchingUserName = newName
    }

    //Выбранный ответ на странице со статистикой для режима серии вопросов
    selectedQuestionOnPage = '-1'

    //Функция обработчик изменений в selectedQuestionOnPage
    changeSelectedQuestionOnPage(newQuestion){
        this.selectedQuestionOnPage = newQuestion
    }

    //Данные для таблицы по каждому прохождению теста
    get rows(){
        let __passedQuestionsObjectsArray = this.passedQuestionsObjectsArray
        if(this.searchingUserName.length > 0){
            __passedQuestionsObjectsArray = __passedQuestionsObjectsArray.filter((passedQuestion) =>
                passedQuestion?.attemptData?.userName?.toLowerCase()?.includes(this.searchingUserName.toLowerCase()))
        }
        if(this.selectedQuestionOnPage !== '-1'){
            __passedQuestionsObjectsArray = __passedQuestionsObjectsArray.filter((passedQuestion) =>
                Number(passedQuestion?.attemptData?.question?.id) === Number(this.selectedQuestionOnPage)
            )
        }
        return(
            __passedQuestionsObjectsArray?.map((passedQuestion) =>{
                const ArrayOfNumberOfWrongAnswers: any[] = []
                passedQuestion?.attemptData?.statistic?.ArrayForShowWrongAnswers.map((attempt) =>{
                    ArrayOfNumberOfWrongAnswers.push({numberOfPasses: attempt?.numberOfPasses,
                        numberOfWrongAnswers: attempt?.numberOfWrongAnswers?.length})
                })
                return([passedQuestion?.attemptData?.userName, passedQuestion?.attemptData?.isLogin ? "да" : "нет",
                passedQuestion?.attemptData?.statistic?.numberOfPasses, passedQuestion?.arithmeticMeanNumberOfWrongAnswer,
                passedQuestion?.maxNumberOfWrongAnswers, passedQuestion?.arithmeticMeanNumberOfAnswersPoints,
                passedQuestion?.minAnswerPoint, passedQuestion?.attemptData?.id,
                    passedQuestion?.attemptData?.statistic?.ArrayForShowAnswerPoints, ArrayOfNumberOfWrongAnswers,
                    passedQuestion?.attemptData?.statistic?.ArrayForShowWrongAnswers, passedQuestion])
            })
        )
    }

    rowsOpenForDetailStatistic = new Set()

    changeRowsForDetailStatistic(rowID){
        if(this.rowsOpenForDetailStatistic.has(rowID)){
            this.rowsOpenForDetailStatistic.delete(rowID)
        }else{
            this.rowsOpenForDetailStatistic.add(rowID)
        }
    }

    get multiQuestionMode(){
        return StatisticPageStoreObject.activePageOnTopMenu === 1;
    }



}

export const StatisticByQuestionDataStoreObject = new StatisticByQuestionsDataStore()
