import {autorun, makeAutoObservable, reaction, toJS} from "mobx";
import {SameAnswerNode} from "../../../PublicStorage/QSPage/QuestionSequencePlayer/SameAnswerNode";
import {sort} from "fast-sort";
import {StatisticPageStoreObject} from "./StatisticPageStore";
import React from "react";

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
    get arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints(){
        let __sumOfAnswerPoints = 0
        let __minAnswerPoint = 100000
        this.attemptData?.statistic?.ArrayForShowAnswerPoints?.map((attempt) => {
            __sumOfAnswerPoints += Number(attempt.answerPoints)
            if(attempt.answerPoints < __minAnswerPoint){
                __minAnswerPoint = attempt.answerPoints
            }
        })
        this.minAnswerPoint = __minAnswerPoint
        const arithmeticMeanNumberOfAnswersPoints = Math.ceil(__sumOfAnswerPoints / Math.ceil(Number(this.attemptData?.statistic?.numberOfPasses)))
        const dividePercent = Math.ceil(arithmeticMeanNumberOfAnswersPoints / this.maxSumOfAnswersPoint * 100)
        return (arithmeticMeanNumberOfAnswersPoints + "/" + this.maxSumOfAnswersPoint + " (" + dividePercent+ ")" )
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
        this.numberOfWrongAnswers = __sumOfWrongAnswers
        this.maxNumberOfWrongAnswers = __maxNumberOfWrongAnswers
        return (__sumOfWrongAnswers > 0?
            ( __sumOfWrongAnswers / (Number(this.attemptData?.statistic?.numberOfPasses) - 1)).toFixed(1):
            "Ошибок нет")
    }

    //Максимальное число баллов для того набора ответов, который попался ученику
    get maxSumOfAnswersPoint(){
        return(this?.attemptData?.maxSumOfAnswersPoint ?
            this?.attemptData?.maxSumOfAnswersPoint:
            this.attemptData?.questionHasBeenCompleted?
                this.attemptData?.statistic?.ArrayForShowAnswerPoints[this.attemptData?.statistic?.ArrayForShowAnswerPoints.length - 1].answerPoints:
                0)
    }


    get SumOFPointsWithNewMethod(){
        const divideValue = StatisticPageStoreObject.divideValueForCalculations
        let sumOfAnswerPoints = 0
        let sumOfAnswerPointsNewMethod = 0
        let maxSumNewMethod = 0

        this.attemptData?.statistic?.ArrayForShowAnswerPoints?.map((attempt, aIndex) => {
            sumOfAnswerPoints += Number(attempt.answerPoints)
            sumOfAnswerPointsNewMethod += Number(attempt.answerPoints) * (divideValue ** aIndex)
            maxSumNewMethod += Number(this.maxSumOfAnswersPoint) * (divideValue ** aIndex)
        })
        let result = Math.ceil(sumOfAnswerPointsNewMethod / maxSumNewMethod * 100)
        // if(result < 0){
        //     result = 0
        // }

        if(!this?.attemptData?.maxSumOfAnswersPoint &&  !this.attemptData?.questionHasBeenCompleted){
            return ("Невозможно рассчитать")
        }else{
            return (result + "%")
        }
        // return(sumOfAnswerPointsNewMethod + "/" + sumOfAnswerPoints)
    }

    numberOfWrongAnswers = 0

    maxNumberOfWrongAnswers = 0



}
const PassedQuestionObject = new PassedQuestion({})
type PassedQuestionObjectType = typeof PassedQuestionObject
class StatisticByQuestionsDataStore {
    constructor(){
        makeAutoObservable(this)
        autorun(() => this.fillPassedQuestionsObjectsArray())

        //При открытие вопроса/серии, фильтры сбрасываются
        reaction(()=> StatisticPageStoreObject.isOpenQuestion, ()=> {
            this.searchingUserName = ''
            this.selectedQuestionOnPage = '-1'
            this.showPassesOnlyIfTheyDoneInQS = false
            this.showPassesOnlyInActiveExamMode = false
        })
        reaction(() => this.activePage > this.NumberOfPages, () => this.activePage = 1)
    }


    //Статистика всех прохождений вопроса
    questionStatistic: any = undefined

    //В StatisticPageStore происходит полная загрузка данных, затем через реакцию на то, что все данные загружены,
    //данные попадают в эту функцию, здесь они заворачиваются в мини сторы и проходят по всей логики до визуализации
    changeQuestionsData(questionData){
        // this.questionText = questionData.text;
        // this.questionID = questionData.id;
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


    passedQuestionsObjectsArray: PassedQuestionObjectType[] = []

    fillPassedQuestionsObjectsArray(){
        const __passedQuestionsObjectsArray: PassedQuestionObjectType[]  = []
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

    //Отображать только те прохождения, которые сделаны в режиме серии вопросов
    showPassesOnlyIfTheyDoneInQS = false

    //Функция обработчик изменений в showPassesOnlyIfTheyDoneInQS
    changeShowPassesOnlyIfTheyDoneInQS(newState: boolean):void {
        this.showPassesOnlyIfTheyDoneInQS = newState
    }

    //Отображать только прохождения в которых был включен режим экзамена
    showPassesOnlyInActiveExamMode = false

    //Функция обработчик изменений в showPassesOnlyInActiveExamMode
    changeShowPassesOnlyInActiveExamMode(newState: boolean):void {
        this.showPassesOnlyInActiveExamMode = newState
    }

    //Выбранная страница в пагинации
    activePage = 1
    changeActivePage = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(value)
        this.activePage = value
    }

    get NumberOfPages(){
        return(Math.ceil(this.passesAfterFiltering.length / Number(this.rowLimit)))
    }


    //Данные для таблицы по каждому прохождению теста
    get passesAfterFiltering(){
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
        if(this.showPassesOnlyIfTheyDoneInQS){
            if(StatisticPageStoreObject.activePageOnTopMenu !==2){
                __passedQuestionsObjectsArray = __passedQuestionsObjectsArray.filter((passedQuestion) =>
                    Number(passedQuestion?.attemptData?.questionSequence?.id) == Number(StatisticPageStoreObject?.selectedQuestionSequenceID))
            }else{
                __passedQuestionsObjectsArray = __passedQuestionsObjectsArray.filter((passedQuestion) =>
                    passedQuestion?.attemptData?.questionSequence?.id)
            }
        }
        if(this.showPassesOnlyInActiveExamMode){
            __passedQuestionsObjectsArray = __passedQuestionsObjectsArray.filter((passedQuestion) =>
                passedQuestion?.attemptData?.isUseexammode)
        }
        return(__passedQuestionsObjectsArray)
    }

    get passesAfterPaginate(){
        return(this.passesAfterFiltering.slice((this.activePage -1 ) * Number(this.rowLimit), this.activePage * Number(this.rowLimit)))
    }

    get objectRows(){
        return(
            this.passesAfterPaginate?.map((passedQuestionObject) =>{
                const ArrayOfNumberOfWrongAnswers: any[] = []
                passedQuestionObject?.attemptData?.statistic?.ArrayForShowWrongAnswers.map((attempt) =>{
                    ArrayOfNumberOfWrongAnswers.push({numberOfPasses: attempt?.numberOfPasses,
                        numberOfWrongAnswers: attempt?.numberOfWrongAnswers?.length})
                })

                return({
                    username: passedQuestionObject?.attemptData?.userName,
                    isLogin: passedQuestionObject?.attemptData?.isLogin ? "да" : "нет",
                    numberOfPasses: passedQuestionObject?.attemptData?.statistic?.numberOfPasses,
                    arithmeticMeanNumberOfWrongAnswer: passedQuestionObject?.arithmeticMeanNumberOfWrongAnswer,
                    numberOfWrongAnswers: passedQuestionObject?.numberOfWrongAnswers,
                    arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints: passedQuestionObject?.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints,
                    minAnswerPoint: passedQuestionObject?.minAnswerPoint,
                    questionID: passedQuestionObject?.attemptData?.question?.id,
                    attemptID: passedQuestionObject?.attemptData?.id,
                    ArrayForShowAnswerPoints: passedQuestionObject?.attemptData?.statistic?.ArrayForShowAnswerPoints,
                    ArrayOfNumberOfWrongAnswers: ArrayOfNumberOfWrongAnswers,
                    ArrayForShowWrongAnswers: passedQuestionObject?.attemptData?.statistic?.ArrayForShowWrongAnswers,
                    passedQuestion: passedQuestionObject,
                    questionHasBeenCompleted: passedQuestionObject?.attemptData?.questionHasBeenCompleted,
                    SumOFPointsWithNewMethod: passedQuestionObject?.SumOFPointsWithNewMethod
                })
            }
        ))
    }

    // get rows(){
    //     return(
    //         this.passesAfterPaginate?.map((passedQuestion) =>{
    //             const ArrayOfNumberOfWrongAnswers: any[] = []
    //             passedQuestion?.attemptData?.statistic?.ArrayForShowWrongAnswers.map((attempt) =>{
    //                 ArrayOfNumberOfWrongAnswers.push({numberOfPasses: attempt?.numberOfPasses,
    //                     numberOfWrongAnswers: attempt?.numberOfWrongAnswers?.length})
    //             })
    //             return([passedQuestion?.attemptData?.userName,
    //                 passedQuestion?.attemptData?.isLogin ? "да" : "нет",
    //             passedQuestion?.attemptData?.statistic?.numberOfPasses,
    //                 passedQuestion?.arithmeticMeanNumberOfWrongAnswer,
    //             passedQuestion?.attemptData?.numberOfWrongAnswers,
    //                 passedQuestion?.arithmeticMeanNumberOfAnswersPoints,
    //             passedQuestion?.minAnswerPoint,
    //                 passedQuestion?.attemptData?.id,
    //                 passedQuestion?.attemptData?.statistic?.ArrayForShowAnswerPoints,
    //                 ArrayOfNumberOfWrongAnswers,
    //                 passedQuestion?.attemptData?.statistic?.ArrayForShowWrongAnswers,
    //                 passedQuestion,
    //                 passedQuestion?.attemptData?.questionHasBeenCompleted
    //             ])
    //         })
    //     )
    // }

    rowsOpenForDetailStatistic = new Set()

    changeRowsForDetailStatistic(rowID){
        if(this.rowsOpenForDetailStatistic.has(rowID)){
            this.rowsOpenForDetailStatistic.delete(rowID)
        }else{
            this.rowsOpenForDetailStatistic.add(rowID)
        }
    }

    get multiQuestionMode(){
        return StatisticPageStoreObject.activePageOnTopMenu === 1 || StatisticPageStoreObject.activePageOnTopMenu === 2;
    }

    rowLimit: number | number[]  = 50

    changeRowLimit(newLimit: number | number[]){
        this.rowLimit = Number(newLimit)
    }



}

export const StatisticByQuestionDataStoreObject = new StatisticByQuestionsDataStore()
// export type rowsType = StatisticByQuestionsDataStore['objectRows']