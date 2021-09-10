import {autorun, makeAutoObservable,  toJS} from "mobx";

class PassedQuestion{
    constructor(attemptData){
        makeAutoObservable(this)
        this.attemptData = attemptData;
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
        return __sumOfAnswerPoints / Number(this.attemptData?.statistic?.numberOfPasses)
    }

    //Минимальны балл за попытку
    minAnswerPoint = 0

    get arithmeticMeanNumberOfWrongAnswer(){
        let __sumOfWrongAnswers = 0
        let __maxNumberOfWrongAnswers = 0
        console.log(toJS(this.attemptData))
        this.attemptData?.statistic?.ArrayForShowWrongAnswers?.map((attempt) => {
            __sumOfWrongAnswers += Number(attempt?.numberOfWrongAnswers?.length)
            if(attempt?.numberOfWrongAnswers?.length > __maxNumberOfWrongAnswers){
                __maxNumberOfWrongAnswers = attempt?.numberOfWrongAnswers?.length
            }
        })
        this.maxNumberOfWrongAnswers = __maxNumberOfWrongAnswers
        return __sumOfWrongAnswers / (Number(this.attemptData?.statistic?.numberOfPasses) - 1)
    }

    maxNumberOfWrongAnswers = 0



}

class StatisticByQuestionDataStore{
    constructor(){
        makeAutoObservable(this)
        autorun(() => this.fillPassedQuestionsObjectsArray())
    }

    //Текст вопроса
    questionText = ''

    //ID вопроса
    questionID: number | undefined = undefined

    //Статистика всех прохождений вопроса
    questionStatistic: any = undefined

    changeQuestionData(questionData){
        this.questionText = questionData.text;
        this.questionID = questionData.id;
        this.questionStatistic = questionData.detailquestionstatisticSet;
    }


    passedQuestionsObjectsArray: any = []

    fillPassedQuestionsObjectsArray(){
        const __passedQuestionsObjectsArray: any = []
        this.questionStatistic?.map((attempt) =>{
            __passedQuestionsObjectsArray?.push(new PassedQuestion(attempt))
        })
        this.passedQuestionsObjectsArray = __passedQuestionsObjectsArray
    }

    //Данные для таблицы по каждому прохождению теста
    get rows(){
        return(
            this.passedQuestionsObjectsArray?.map((passedQuestion) =>{
                console.log(toJS(passedQuestion?.attemptData?.userName))
                return([passedQuestion?.attemptData?.userName ? passedQuestion?.attemptData?.userName : "Анонимный пользователь", passedQuestion?.attemptData?.isLogin ? "да" : "нет",
                passedQuestion?.attemptData?.statistic?.numberOfPasses, passedQuestion?.arithmeticMeanNumberOfWrongAnswer,
                passedQuestion?.maxNumberOfWrongAnswers, passedQuestion?.arithmeticMeanNumberOfAnswersPoints,
                passedQuestion?.minAnswerPoint])
            })
        )
    }

}

export const StatisticByQuestionDataStoreObject = new StatisticByQuestionDataStore()
