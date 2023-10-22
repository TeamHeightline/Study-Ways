import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";
import {GET_ENCRYPT_QUESTION_DATA_BY_ID} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/Struct";
import {SameAnswerNode} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/SameAnswerNode";
import {shuffle} from "lodash"
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import CryptoJS from 'crypto-js'
import {SERVER_BASE_URL} from "../../../../settings";
import axiosClient from "../../../../ServerLayer/QueryLayer/config";
import {createDetailStatistic} from "../../../../ServerLayer/QueryLayer/detail-statistic.query";

export class QuestionPlayerStore {
    constructor(ownStore, questionID) {
        makeAutoObservable(this)
        reaction(() => this.questionID, () => this.loadQuestionDataFromServer())
        reaction(() => UserStorage.isLogin, () => this.loadQuestionDataFromServer())
        reaction(() => this.questionID, () => this.deliverFromServerImageURL())
        reaction(() => UserStorage.isLogin, () => this.deliverFromServerImageURL())
        reaction(() => this.questionHasBeenCompleted, () => this.saveDetailStatistic())

        this.ownStore = ownStore
        this.questionID = questionID
        if (ownStore) {
            reaction(() => this.ownStore.hardLevelOfHelpText,
                () => this.changeHardLevelOfHelpText(this.ownStore.hardLevelOfHelpText))
            reaction(() => this.ownStore.HardLevelHasBeenSelected,
                () => this.startQuestion())
        }

    }

    ownStore: any = null
    questionID: any

    //Функция для обновления ID вопроса
    changeQuestionId(newId) {
        this.questionID = newId
        this.oneTimeCheckError = false
        this.numberOfPasses = 0
        this.IndexOfMostWantedError = -1
        this.questionHasBeenCompleted = false
        this.selectedAnswers = new Set()
        this.historyOfWrongSelectedAnswers = new Map()
        this.historyOfAnswerPoints = new Map()
        this.maxSumOfPoints = 0
        this.isAcceptDefeat = false
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
    selectAnswerHandleChange(answerID) {
        if (this.selectedAnswers.has(answerID)) {
            this.selectedAnswers.delete(answerID)
        } else {
            this.selectedAnswers.add(answerID)
        }

    }

    //Уровень сложности подсказок
    hardLevelOfHelpText = '0'

    //обработчик изменений сложности подсказки
    changeHardLevelOfHelpText(newHardLevelOfHelpText) {
        this.hardLevelOfHelpText = newHardLevelOfHelpText
    }

    startQuestion() {
        this.questionHasBeenStarted = true
    }

    //Начался ли вопрос или нет
    questionHasBeenStarted = false

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

    numberOfSelectAnswersOnThisPass = 0

    //Проверка ошибок
    checkErrors() {
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
        this.numberOfSelectAnswersOnThisPass = this.selectedAnswers?.size
        this.answersArray.map((answer, aIndex) => {
            if ((answer.isTrue && !this.selectedAnswers.has(answer.id)) || (!answer.isTrue && this.selectedAnswers.has(answer.id))) {
                __errorArray.push(answer.id)


                if (answer.hardLevelOfAnswer == "EASY") {
                    __sumOfLoosedAnswerPoints += 15
                } else if (answer.hardLevelOfAnswer == "MEDIUM") {
                    __sumOfLoosedAnswerPoints += 10
                } else {
                    __sumOfLoosedAnswerPoints += 5
                }


                if (Number(answer.checkQueue) < Number(minCheckQueue)) {
                    minCheckQueue = answer.checkQueue
                    indexOfMostWantedError = aIndex
                }
            } else {
                if (answer.hardLevelOfAnswer == "EASY") {
                    __sumOfGotAnswerPoints += 5
                } else if (answer.hardLevelOfAnswer == "MEDIUM") {
                    __sumOfGotAnswerPoints += 10
                } else {
                    __sumOfGotAnswerPoints += 15
                }
            }
        })

        //Добавляем в историю сколько баллов было получено за эту попытку
        this.historyOfAnswerPoints.set(this.numberOfPasses, __sumOfGotAnswerPoints - __sumOfLoosedAnswerPoints)

        //Добавляем в историю выбора эти неправильные ответы
        this.historyOfWrongSelectedAnswers.set(this.numberOfPasses, __errorArray)

        this.IndexOfMostWantedError = indexOfMostWantedError
        if (__errorArray.length == 0) {
            this.questionHasBeenCompleted = true
        }
    }

    //Массив данные из которого будут использованы чтобы отобразить график количества неправильных ответов на каждой из поыпыток
    get ArrayForShowNumberOfWrongAnswers() {
        const showArray: any = []
        toJS(this.historyOfWrongSelectedAnswers)?.forEach((attempt, aIndex: any) => {
            showArray.push({numberOfPasses: aIndex, numberOfWrongAnswers: attempt.length})
        })
        return (
            showArray
        )
    }

    get ArrayForShowWrongAnswers() {
        const showArray: any = []
        toJS(this.historyOfWrongSelectedAnswers)?.forEach((attempt, aIndex: any) => {
            showArray.push({numberOfPasses: aIndex, numberOfWrongAnswers: attempt})
        })
        return (
            showArray
        )
    }

    //Массив для отображения графика баллов на каждой из попыток
    get ArrayForShowAnswerPoints() {
        const showArray: any = []
        toJS(this.historyOfAnswerPoints)?.forEach((attempt, aIndex: any) => {
            showArray.push({numberOfPasses: aIndex, answerPoints: attempt})
        })
        return (showArray)
    }

    //Флаг экзаменационного режима
    isUseExamMode = false

    //Функция для изменения (включения) экзаменационного режима
    changeIsUseExamMode(newExamState) {
        this.isUseExamMode = newExamState
    }

    //Выводит подсказку
    get HelpTextForShow() {
        if (Number(this.numberOfSelectAnswersOnThisPass) == 0 && this.numberOfPasses == 1) {
            return ("Среди предложенных вариантов ответа есть хотя бы один правильный, проверьте еще раз")
        }
        // if(this.ownStore?.isUseExamMode || this.isUseExamMode){
        //     return ("Вы допустили одну или более ошибок")
        // }
        if (this.hardLevelOfHelpText == "0") {
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv1)
        }
        if (this.hardLevelOfHelpText == "1") {
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv2)
        }
        if (this.hardLevelOfHelpText == "2") {
            return (this.answersArray[this.IndexOfMostWantedError].helpTextv3)
        }

    }

    //Доставка изображения для вопроса с сервера
    deliverFromServerImageURL() {
        fetch(SERVER_BASE_URL + "/files/question?id=" + this.questionID)
            .then(response => response.json())
            .then(jResponse => {
                this.questionImageUrl = jResponse[0].image
            })
            .catch(() => this.questionImageUrl = '')
    }


    //Функция для загрузки данных о вопросе с сервера
    loadQuestionDataFromServer() {
        if (this.questionID) {
            this.clientStorage.client.query({
                query: GET_ENCRYPT_QUESTION_DATA_BY_ID,
                variables: {
                    id: this.questionID,
                    examMode: this.isUseExamMode || this?.ownStore?.isUseExamMode
                }, fetchPolicy: "network-only"
            })
                .then((data) => {
                    let __decrypt_question: any = {}
                    let __decrypt_answers: any = [{}]
                    if (data?.data?.eqbi) {
                        const _question_string = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data?.data?.eqbi?.qbs.slice(2)))
                        __decrypt_question = JSON.parse(_question_string)[0]?.fields
                        const _answer_string = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data?.data?.eqbi?.abs.slice(2)))
                        __decrypt_answers = JSON.parse(_answer_string)
                        __decrypt_answers.map((answer, aIndex) => {
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
                    const __requiredAnswersForDisplay = shuffle(__decrypt_answers?.filter((answer) => !answer.is_deleted)?.filter((answer) => answer.is_required))?.slice(0, __decrypt_question?.number_of_showing_answers)
                    const __notRequiredAnswersForDisplay = shuffle(__decrypt_answers?.filter((answer) => !answer.is_deleted)?.filter((answer) => !answer.is_required))?.slice(0, __decrypt_question?.number_of_showing_answers - __requiredAnswersForDisplay.length)
                    let __answersForDisplay = __requiredAnswersForDisplay.length > 0 ? __requiredAnswersForDisplay.concat(__notRequiredAnswersForDisplay) : __notRequiredAnswersForDisplay;
                    __answersForDisplay = shuffle(__answersForDisplay)
                    __answersForDisplay.map((answer) => {
                        if (answer.hard_level_of_answer == "EASY") {
                            __maxSumOfAnswerPoints += 5
                        } else if (answer.hard_level_of_answer == "MEDIUM") {
                            __maxSumOfAnswerPoints += 10
                        } else {
                            __maxSumOfAnswerPoints += 15
                        }
                        this.maxSumOfPoints = __maxSumOfAnswerPoints
                        __AnswersArray.push(new SameAnswerNode(answer.id, answer.text, answer.is_true, answer.check_queue,
                            answer.help_textV1, answer.help_textV2, answer.help_textV3, answer.hard_level_of_answer, answer.is_image_deleted))
                    })


                    this.answersArray = __AnswersArray
                    this.userMarks = Array(__AnswersArray.length).fill('none')
                })

        }
    }

    //Сдался ли пользователь при попытке пройти вопрос
    isAcceptDefeat = false

    onAcceptDefeat() {
        if (!this.isAcceptDefeat) {
            this.isAcceptDefeat = true
            this.saveDetailStatistic()
        }
    }

    //Сохраняет детальную статистику по прохождению вопроса
    saveDetailStatistic() {
        createDetailStatistic({
            question_id: Number(this.questionID),
            user_name: UserStorage?.username || "Анонимный пользователь",
            is_login: UserStorage.isLogin,
            question_has_been_completed: this?.questionHasBeenCompleted,
            statistic: {
                numberOfPasses: this.numberOfPasses,
                ArrayForShowAnswerPoints: this.ArrayForShowAnswerPoints,
                ArrayForShowWrongAnswers: this.ArrayForShowWrongAnswers,
            },
            is_useExamMode: this.isUseExamMode || this?.ownStore?.isUseExamMode || false,
            max_sum_of_answers_point: this.maxSumOfPoints,
            answers_id_array: this.answersArray?.map((answer) => answer.id),
            ...(this?.ownStore && this?.ownStore?.questionSequenceID && {
                question_sequence_id: this?.ownStore?.questionSequenceID
            })
        })
            .catch(() => void (0))
    }

    //------------------------------------------------------------------------------------------------------------------

    //Пользовательские пометки

    userMarks: IUserMark[] = []

    onQuestionButtonClick = (index: number) => {
        if (this.userMarks[index] == 'unknown' || this.userMarks[index] == 'none') {
            this.userMarks[index] = 'false'
        } else {
            this.userMarks[index] = 'none'
        }
    }

    onUnknownButtonClick = (index: number) => {
        if (this.userMarks[index] == 'false' || this.userMarks[index] == 'none') {
            this.userMarks[index] = 'unknown'
        } else {
            this.userMarks[index] = 'none'
        }
    }

    answerIndexForCreateErrorReport: number | undefined = undefined

    onReportAnswerButtonClick = (index: number) => {
        this.answerIndexForCreateErrorReport = index
    }


    onCloseAnswerReportDialog = () => {
        this.answerIndexForCreateErrorReport = undefined
        this.answerReportText = ''
    }

    answerReportText = ''
    changeAnswerReportText = (e) => {
        this.answerReportText = e.target.value
    }
    onSendAnswerReportButtonClick = () => {
        this.saveAnswerReport()
        this.onCloseAnswerReportDialog()
    }

    saveAnswerReport = () => {
        if (this.answerReportText && this.answerIndexForCreateErrorReport) {
            axiosClient.post('/page/question-page/create-answer-report', {
                report_data: {
                    answer_id: this.answersArray[this.answerIndexForCreateErrorReport].id,
                    text: this.answerReportText
                }
            })
                .then(() => {
                    this.addAnswerReportSavedMessage()
                })
                .catch(() => {
                    this.addAnswerReportErrorMessage()
                })
        }
    }

    answerReportSavedMessageArray: boolean[] = []

    addAnswerReportSavedMessage = () => {
        this.answerReportSavedMessageArray.push(true)
    }

    addAnswerReportErrorMessage = () => {
        this.answerReportSavedMessageArray.push(false)
    }

    removeAnswerReportSavedMessage = () => {
        this.answerReportSavedMessageArray.shift()
    }


}

type  IUserMark = "false" | "none" | "unknown" //false - неверно, none - не отвечено, unknown - неуверен


