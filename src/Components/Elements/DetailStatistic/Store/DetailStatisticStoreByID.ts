import {autorun, makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";
import {GET_QUESTION_TEXT_BY_ID, LOAD_ATTEMPT_BY_ID} from "./Query";
import {UserStorage} from "../../../../Store/UserStore/UserStore";

export class DetailStatisticStoreByID {
    constructor(id?: number){
        makeAutoObservable(this)
        autorun( () => this.loadAttemptFromServer())
        autorun(()=> this.loadQuestionText())
        this.attempt_id = id
    }
    changeAttemptID(new_attempt_id: number){
        this.attempt_id = new_attempt_id
    }

    attempt_id: number | undefined = undefined
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage
    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

    loadAttemptFromServer(){
        if(this.attempt_id){
            try{
                this.clientStorage.client.query({query: LOAD_ATTEMPT_BY_ID, variables:{
                        ID: this.attempt_id
                    }})
                    .then((request) => request.data.detailStatisticById)
                    .then((attemptData) => {
                        this.attemptData = attemptData

                        if(attemptData.userName === null){
                            this.attemptData.userName = "Анонимный пользователь"
                        }

                    })
            }catch (e) {
                console.log(e)
            }
        }
    }

    questionText = ''

    get QuestionTextForStatistic(){
        if(this.userStorage.userAccessLevel === "ADMIN" || this.userStorage.userAccessLevel === "TEACHER"){
            return(this.questionText)
        } else {
            return (this.questionText.slice(0, 200))
        }
    }

    loadQuestionText(){
        if(this?.attemptData?.question?.id){
            try{
                this.clientStorage.client.query({query: GET_QUESTION_TEXT_BY_ID,
                    variables:{
                        id: toJS(this?.attemptData)?.question?.id
                }})
                    .then((response) => response.data.questionText)
                    .then((question_obj) => {
                        if(question_obj && question_obj.text){
                            this.questionText = question_obj.text
                        }
                    })

                }catch(e){
                    console.log(e)
            }
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

    isOpenDetailStatistic = false
    changeIsOpenDetailStatistic(){
        this.isOpenDetailStatistic = !this.isOpenDetailStatistic
    }

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
        return (arithmeticMeanNumberOfAnswersPoints + "/" + this.maxSumOfAnswersPoint + " (" + dividePercent+ "%)" )
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

    divideValueForCalculations = 0.7
    changeDivideValue(){

    }
    get SumOFPointsWithNewMethod(){
        const divideValue = this.divideValueForCalculations
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
            return (result)
        }
        // return(sumOfAnswerPointsNewMethod + "/" + sumOfAnswerPoints)
    }

    get FormattedCreatedAt(){
        if(!this?.attemptData?.createdAt){
            return ("Дата не сохранена")
        }
        const createdAtDate = new Date(Date.parse(this.attemptData?.createdAt))
            .toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })
        return(String(createdAtDate))

    }

    numberOfWrongAnswers = 0

    maxNumberOfWrongAnswers = 0

    get ArrayOfNumberOfWrongAnswers(){
        const ArrayOfNumberOfWrongAnswers: any[] = []
        this?.attemptData?.statistic?.ArrayForShowWrongAnswers.map((attempt) =>{
            ArrayOfNumberOfWrongAnswers.push({numberOfPasses: attempt?.numberOfPasses,
                numberOfWrongAnswers: attempt?.numberOfWrongAnswers?.length})
        })
        return(ArrayOfNumberOfWrongAnswers)
    }

    get loadingData(){
        return(!this?.attemptData?.id)
    }

    get ShowStepByStepStatistic(){
        return(this.userStorage.userAccessLevel == "ADMIN" || this.userStorage.userAccessLevel == "TEACHER")
    }

    openedSteps = new Set()
    addOrRemoveOpenedSteps(index){
        if(this.openedSteps.has(index)){
            this.openedSteps.delete(index)
        }else{
            this.openedSteps.add(index)
        }
    }

    get dataForRow(){
        return({
            username: this?.attemptData?.userName,
            lastname: this?.attemptData?.authorizedUser?.userprofile?.lastname,
            isLogin: this?.attemptData?.isLogin ? "да" : "нет",
            numberOfPasses: this?.attemptData?.statistic?.numberOfPasses,
            arithmeticMeanNumberOfWrongAnswer: this?.arithmeticMeanNumberOfWrongAnswer,
            numberOfWrongAnswers: this?.numberOfWrongAnswers,
            arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints: this?.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints,
            minAnswerPoint: this?.minAnswerPoint,
            questionID: this?.attemptData?.question?.id,
            attemptID: this?.attemptData?.id,
            ArrayForShowAnswerPoints: this?.attemptData?.statistic?.ArrayForShowAnswerPoints,
            ArrayOfNumberOfWrongAnswers: this.ArrayOfNumberOfWrongAnswers,
            ArrayForShowWrongAnswers: this?.attemptData?.statistic?.ArrayForShowWrongAnswers,
            passedQuestion: this,
            questionHasBeenCompleted: this?.attemptData?.questionHasBeenCompleted,
            SumOFPointsWithNewMethod: this?.SumOFPointsWithNewMethod,
            FormattedCreatedAt: this?.FormattedCreatedAt,
            QuestionTextForStatistic: this.QuestionTextForStatistic
        })
    }

}

export const DetailStatisticStoreByIDObject = new DetailStatisticStoreByID()
export type DSSObjectType = typeof DetailStatisticStoreByIDObject
export type rowType = typeof DetailStatisticStoreByIDObject['dataForRow']