import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {
    GET_ENCRYPT_QUESTION_DATA_BY_ID,
    SAVE_DETAIL_STATISTIC,
    SAVE_DETAIL_STATISTIC_WITH_QS
} from "./Struct";
import {SameAnswerNode} from "./SameAnswerNode";
import * as _ from "lodash"
import {UserStorage} from "../../../UserStore/UserStore";
import CryptoJS from 'crypto-js'

export class SameQuestionPlayer{
    constructor(ownStore, questionID){
        makeAutoObservable(this)
        reaction(() => this.questionID, () => this.loadQuestionDataFromServer())
        reaction(() => this.questionID, () => this.deliverFromServerImageURL())
        reaction(() => this.questionHasBeenCompleted, () => this.saveDetailStatistic())
        this.ownStore = ownStore
        this.questionID = questionID

    }

    userStore = UserStorage
    ownStore: any = null
    questionID: any

    //Функция для обновления ID вопроса
    changeQuestionId(newId){
        this.questionID = newId
        this.oneTimeCheckError = false
        this.numberOfPasses = 0
        this.IndexOfMostWantedError = -1
        this.questionHasBeenCompleted = false
        this.selectedAnswers = new Set()
        this.historyOfWrongSelectedAnswers = new Map()
        this.historyOfAnswerPoints = new Map()
        this.maxSumOfPoints = 0

    }

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

    //Уровень сложности подсказок
    hardLevelOfHelpText = '0'

    //обработчик изменений сложности подсказки
    changeHardLevelOfHelpText(newHardLevelOfHelpText){
        this.hardLevelOfHelpText = newHardLevelOfHelpText
    }

    //Прошли мы вопрос или нет
    questionHasBeenCompleted = false

    //Количество попыток
    numberOfPasses = 0

    //Ссылка на фото для вопроса
    questionImageUrl = ''

    //Была ли хоть раз вызвана проверка на ошибку
    oneTimeCheckError = false

    //Порядковый номер ответа в котором допущена самая грубая ошибка
    IndexOfMostWantedError = -1

    //История всех выбранных ошибочных ответов
    historyOfWrongSelectedAnswers = new Map()

    //История того, сколько пользователь получал баллов на каждой попытке
    historyOfAnswerPoints = new Map()

    //Максимальный балл, который можно получить за то, что выберешь все правильные ответы
    maxSumOfPoints = 0

    //Проверка ошибок
    checkErrors(){
        //Говорим что теперь мы точно совершили первую проверку на ошибку и теперь можно или показывать
        //подсказку или сообщать, что все верно
        this.oneTimeCheckError = true
        this.numberOfPasses = this.numberOfPasses + 1

        let indexOfMostWantedError = -1
        let minCheckQueue = 100000000000
        const __errorArray: any = []

        //Сумма потерянных баллов за неправильно выбранные ответы
        let __sumOfLoosedAnswerPoints = 0

        //Полученные баллы за правильные выбранные ответы
        let __sumOfGotAnswerPoints = 0

        this.answersArray.map((answer, aIndex) => {
            if((answer.isTrue && !this.selectedAnswers.has(answer.id)) || (!answer.isTrue && this.selectedAnswers.has(answer.id))){
                __errorArray.push(answer.id)


                if(answer.hardLevelOfAnswer == "EASY"){
                    __sumOfLoosedAnswerPoints += 15
                }else if(answer.hardLevelOfAnswer == "MEDIUM"){
                    __sumOfLoosedAnswerPoints += 10
                }else{
                    __sumOfLoosedAnswerPoints += 5
                }


                if(Number(answer.checkQueue) < Number(minCheckQueue)){
                    minCheckQueue = answer.checkQueue
                    indexOfMostWantedError = aIndex
                }
            }
            else{
                if(answer.hardLevelOfAnswer == "EASY"){
                    __sumOfGotAnswerPoints += 5
                }else if(answer.hardLevelOfAnswer == "MEDIUM"){
                    __sumOfGotAnswerPoints += 10
                }else{
                    __sumOfGotAnswerPoints += 15
                }
            }
        })

        //Добавляем в историю сколько баллов было получено за эту попытку
        this.historyOfAnswerPoints.set(this.numberOfPasses, __sumOfGotAnswerPoints - __sumOfLoosedAnswerPoints)

        //Добавляем в историю выбора эти неправильные ответы
        this.historyOfWrongSelectedAnswers.set(this.numberOfPasses, __errorArray)

        this.IndexOfMostWantedError = indexOfMostWantedError
        if(__errorArray.length == 0){
            this.questionHasBeenCompleted = true
        }
        // console.log(Array.from(toJS(this.historyOfAnswerPoints)))
        // console.log(Array.from(toJS(this.historyOfWrongSelectedAnswers)))
    }

    //Массив данные из которого будут использованы чтобы отобразить график количества неправильных ответов на каждой из поыпыток
    get ArrayForShowNumberOfWrongAnswers(){
        const showArray: any = []
       toJS(this.historyOfWrongSelectedAnswers)?.forEach((attempt, aIndex: any) =>{
            showArray.push({numberOfPasses: aIndex, numberOfWrongAnswers: attempt.length})
        })
        return(
            showArray
        )
    }

    get ArrayForShowWrongAnswers(){
        const showArray: any = []
        toJS(this.historyOfWrongSelectedAnswers)?.forEach((attempt, aIndex: any) =>{
            showArray.push({numberOfPasses: aIndex, numberOfWrongAnswers: attempt})
        })
        return(
            showArray
        )
    }

    //Массив для отображения графика баллов на каждой из попыток
    get ArrayForShowAnswerPoints(){
        const showArray: any = []
        toJS(this.historyOfAnswerPoints)?.forEach((attempt, aIndex: any) =>{
            showArray.push({numberOfPasses: aIndex, answerPoints: attempt})
        })
        return(showArray)
    }
    //Флаг экзаменационного режима
    isUseExamMode = false

    //Функция для изменения (включения) экзаменационного режима
    changeIsUseExamMode(newExamState){
        this.isUseExamMode = newExamState
    }
    //Выводит подсказку
    get HelpTextForShow(){
        if(this.selectedAnswers.size === 0){
            return ("Среди предложенных вариантов ответа есть хотя бы один правильный, проверьте еще раз")
        }
        if(this.ownStore?.isUseExamMode || this.isUseExamMode){
            return ("Вы допустили одну или более ошибок")
        }
        if(this.hardLevelOfHelpText == "0"){
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv1)
        }
        if(this.hardLevelOfHelpText == "1"){
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv2)
        }
        if(this.hardLevelOfHelpText == "2"){
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv3)
        }

    }

    //Доставка изображения для вопроса с сервера
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
        this.clientStorage.client.query({query: GET_ENCRYPT_QUESTION_DATA_BY_ID, variables:{
            id: this.questionID
            }})
            .then((data) => {
                let __decrypt_question: any = {}
                let __decrypt_answers: any = [{}]
                if(data?.data?.eqbi) {
                    const _question_string =  CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data?.data?.eqbi?.qbs.slice(2)))
                    __decrypt_question =  JSON.parse(_question_string)[0]?.fields
                    const _answer_string =  CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data?.data?.eqbi?.abs.slice(2)))
                    __decrypt_answers =   JSON.parse(_answer_string)
                    __decrypt_answers.map((answer, aIndex) =>{
                        const ___fields_to_pass = answer?.fields
                        ___fields_to_pass.id = answer.pk
                        __decrypt_answers[aIndex] = ___fields_to_pass
                    })
                }
                // this.questionText = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data.data.questionById.text))
                this.questionText = __decrypt_question?.text
                const __AnswersArray: any[] = []
                //максимальное число баллов, которые можно получить выбрав все правильные ответы
                let __maxSumOfAnswerPoints = 0
                //Перемешиваем ответы и обрезаем из количество на значение из настроек
                const __requiredAnswersForDisplay = _.shuffle(__decrypt_answers?.filter((answer) => answer.is_deleted === false)?.filter((answer) => answer.is_required === true))?.slice(0, __decrypt_question?.number_of_showing_answers)
                const __notRequiredAnswersForDisplay = _.shuffle(__decrypt_answers?.filter((answer) => answer.is_deleted === false)?.filter((answer) => answer.is_required === false))?.slice(0, __decrypt_question?.number_of_showing_answers - __requiredAnswersForDisplay.length)
                let __answersForDisplay = __requiredAnswersForDisplay.length > 0 ? __requiredAnswersForDisplay.concat(__notRequiredAnswersForDisplay) : __notRequiredAnswersForDisplay;
                __answersForDisplay = _.shuffle(__answersForDisplay)
                __answersForDisplay.map((answer) =>{
                    if(answer.hard_level_of_answer == "EASY"){
                        __maxSumOfAnswerPoints += 5
                    }else if(answer.hard_level_of_answer == "MEDIUM"){
                        __maxSumOfAnswerPoints += 10
                    }else{
                        __maxSumOfAnswerPoints += 15
                    }
                    this.maxSumOfPoints = __maxSumOfAnswerPoints
                    console.log(answer)
                    __AnswersArray.push(new SameAnswerNode(answer.id,  answer.text, answer.is_true, answer.check_queue,
                        answer.help_textV1, answer.help_textV2, answer.help_textV3, answer.hard_level_of_answer))
                })


                this.answersArray = __AnswersArray
            })
    }

    //Сохраняет детальную статистику по прохождению вопроса
    saveDetailStatistic(){
        if(this?.ownStore && this?.ownStore?.questionSequenceID){
            this.clientStorage.client.mutate({mutation: SAVE_DETAIL_STATISTIC_WITH_QS, variables:{
                    question: this.questionID,
                    isLogin: this.userStore.isLogin,
                    userName: this.userStore.isLogin? this.userStore.username : localStorage?.getItem('username')?.length !== 0 ? localStorage?.getItem('username') : "Анонимный пользователь",
                    isUseexammode: this.isUseExamMode || this?.ownStore?.isUseExamMode,
                    questionSequence: this?.ownStore?.questionSequenceID,
                    statistic:{
                        numberOfPasses: this.numberOfPasses,
                        ArrayForShowAnswerPoints : this.ArrayForShowAnswerPoints,
                        ArrayForShowWrongAnswers: this.ArrayForShowWrongAnswers,
                    }
                }})
                .catch((e) => console.log(e))
        }else{
            this.clientStorage.client.mutate({mutation: SAVE_DETAIL_STATISTIC, variables:{
                    question: this.questionID,
                    isLogin: this.userStore.isLogin,
                    userName: this.userStore.isLogin? this.userStore.username : localStorage?.getItem('username')?.length !== 0 ? localStorage?.getItem('username') : "Анонимный пользователь",
                    isUseexammode: this.isUseExamMode || this?.ownStore?.isUseExamMode,
                    statistic:{
                        numberOfPasses: this.numberOfPasses,
                        ArrayForShowAnswerPoints : this.ArrayForShowAnswerPoints,
                        ArrayForShowWrongAnswers: this.ArrayForShowWrongAnswers,
                    }
                }})
                .catch(() => void(0))
        }
    }


}
