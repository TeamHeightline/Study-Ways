import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {GET_QUESTION_DATA_BY_ID} from "./Struct";
import {SameAnswerNode} from "./SameAnswerNode";

export class SameQuestionPlayer{
    constructor(questionID){
        makeAutoObservable(this)
        reaction(() => this.questionID, () => this.loadQuestionDataFromServer())
        reaction(() => this.questionID, () => this.deliverFromServerImageURL())
        this.questionID = questionID

    }
    questionID: any

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

        this.answersArray.map((answer, aIndex) => {
            if((answer.isTrue && !this.selectedAnswers.has(answer.id)) || (!answer.isTrue && this.selectedAnswers.has(answer.id))){
                console.log("error")
                __errorArray.push(answer.id)

                if(answer.hardLevelOfAnswer === "EASY"){
                    __sumOfLoosedAnswerPoints += 15
                }else if(answer.hardLevelOfAnswer === "MEDIUM"){
                    __sumOfLoosedAnswerPoints += 10
                }else{
                    __sumOfLoosedAnswerPoints += 5
                }

                if(Number(answer.checkQueue) < Number(minCheckQueue)){
                    minCheckQueue = answer.minCheckQueue
                    indexOfMostWantedError = aIndex
                }
            }
        })

        //Добавляем в историю сколько баллов было получено за эту попытку
        this.historyOfAnswerPoints.set(this.numberOfPasses, this.maxSumOfPoints - __sumOfLoosedAnswerPoints)

        //Добавляем в историю выбора эти неправильные ответы
        this.historyOfWrongSelectedAnswers.set(this.numberOfPasses, __errorArray)

        this.IndexOfMostWantedError = indexOfMostWantedError
        if(__errorArray.length == 0){
            this.questionHasBeenCompleted = true
        }
        console.log(toJS(this.historyOfAnswerPoints))
        console.log(toJS(this.historyOfWrongSelectedAnswers))
    }

    //Выводит подсказку
    get HelpTextForShow(){
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
        this.clientStorage.client.query({query: GET_QUESTION_DATA_BY_ID, variables:{
            id: this.questionID
            }})
            .then((data) => {
                console.log(data)
                this.questionText = data.data.questionById.text
                const __AnswersArray: any[] = []
                //максимальное число баллов, которые можно получить выбрав все правильные ответы
                let __maxSumOfAnswerPoints = 0
                data.data.questionById.answers.map((answer) =>{
                    if(answer.hardLevelOfAnswer === "EASY"){
                        __maxSumOfAnswerPoints += 5
                    }else if(answer.hardLevelOfAnswer === "MEDIUM"){
                        __maxSumOfAnswerPoints += 10
                    }else{
                        __maxSumOfAnswerPoints += 15
                    }
                    this.maxSumOfPoints = __maxSumOfAnswerPoints

                    __AnswersArray.push(new SameAnswerNode( answer.id,  answer.text, answer.isTrue, answer.checkQueue,
                        answer.helpTextv1, answer.helpTextv2, answer.helpTextv3, answer.hardLevelOfAnswer))
                })


                this.answersArray = __AnswersArray
            })
    }


}