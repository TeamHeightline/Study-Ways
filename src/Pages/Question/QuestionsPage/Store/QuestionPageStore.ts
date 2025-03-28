import {makeAutoObservable} from "mobx";
import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";


interface IQuestion {
    id: number
    text: string
}

class QuestionPage {
    constructor() {
        makeAutoObservable(this)
    }

    //Данные обо всех вопросах
    questionsData: IQuestion[] = []

    //Флаг, предназначенный отслеживать момент, когда данные придут с сервера
    dataHasBeenDelivered = false

    //ID выбранного вопроса
    selectedQuestionID = 0


    //Функция для изменения ID вопроса
    changeSelectedQuestionID = (e) => {
        this.selectedQuestionID = e.target.value
    }


    //функция для получения всех данных о вопросе
    getQuestionData() {

        //Функция для удаления вопросов, которые называются "Новый вопрос"
        function removeQuestionsTatNotFilled(questions: IQuestion[]) {
            return questions?.filter((question) => question?.text !== "Новый вопрос")
        }


        axiosClient.get('page/question-page//all-questions')
            .then(res => {
                    this.questionsData = removeQuestionsTatNotFilled(res.data)
                    console.log(res.data)
                    this.dataHasBeenDelivered = true
                }
            )
    }


    //ID выбранной темы
    selectedThemeID = 0
}

export const QuestionPageStorage = new QuestionPage()