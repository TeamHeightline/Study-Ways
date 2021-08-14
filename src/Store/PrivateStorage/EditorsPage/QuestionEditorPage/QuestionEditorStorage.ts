import {autorun, makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {ALL_QUESTIONS_DATA, CREATE_NEW_ANSWER, CREATE_NEW_QUESTION, UPDATE_QUESTION} from "./Struct";
import {Maybe, QuestionAuthorNode, QuestionNode, QuestionThemesNode} from "../../../../../SchemaTypes";
import {sort} from "fast-sort";
import {Answer} from "./AnswersStorage";

class QuestionEditor{
    constructor() {
        makeAutoObservable(this)
        autorun(() => this.deliverFromServerAppQuestionsData())
        reaction(() => this.selectedQuestionID, () => this.deliverFromServerImageURL())
        reaction(() => this.selectedQuestionText, () => this.autoSave())
        reaction(() => this.selectedQuestionVideoUrl, () => this.autoSave())
        reaction(() => this.selectedQuestionThemesArray, () => this.autoSave())
        reaction(() => this.selectedQuestionAuthorsArray, () => this.autoSave())
        reaction(() => this.allQuestionsData, () => this.loadAnswers())
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Данные с сервера о всех вопросах
    allQuestionsData: Maybe<QuestionNode[]> | any = []

    //Все темы для вопросов
    allThemesForQuestion: Maybe<QuestionThemesNode[]> | any = []

    //Все авторы для вопросов
    allAuthorsForQuestion: Maybe<QuestionAuthorNode[]> | any = []

    //Флаг, указывающий на то, были ли доставлены данные о всех вопросах с сервера или нет
    allQuestionsDataHasBeenDeliver = false

    //Флаг, указывающий на то, был ли выбран вопрос в селекторе
    questionHasBeenSelected = false

    //Флаг, указывающий на то, использовать превью или нет
    showPreview = false

    //Функция для получения данных о всех вопросов с сервера
    deliverFromServerAppQuestionsData(){
        this.clientStorage.client.query({query:ALL_QUESTIONS_DATA, fetchPolicy: "network-only"})
            .then((response) =>{
                this.allQuestionsData = sort(response.data.me.questionSet).desc((question: any) => question?.id)
                this.allThemesForQuestion = sort(response.data.questionThemes).desc((theme: any) => theme?.id)
                this.allAuthorsForQuestion = sort(response.data.me.questionauthorSet).desc((author: any) => author?.id)
                this.allQuestionsDataHasBeenDeliver = true
            })
    }

    //Геттер, нужен чтобы можно было без преобразований использовать allQuestionsData
    get allQuestionsDataForSelector(){
        return(toJS(this.allQuestionsData))
    }

    //Обработчик изменений в селекторе вопросов
    selectorHandleChange(e, questionData: Maybe<QuestionNode>){
        this.questionHasBeenSelected = true
        this.selectedQuestionID = Number(questionData?.id)
        this.selectedQuestionText = questionData?.text
        this.selectedQuestionVideoUrl = questionData?.videoUrl ? questionData?.videoUrl: ''

        //Т.к. с сервера темы и автора приходят как обьекты, а нам нужны только их ID, то
        //здесь мы собираем массивы ID и устанавливает их в наблюдаемые переменные
        const selectedThemeIDArray: string[] = []
        questionData?.theme.map((theme) =>{
            selectedThemeIDArray.push(theme?.id)
        })
        this.selectedQuestionThemesArray = selectedThemeIDArray

        const selectedAuthorIDArray: string[]  = []
        questionData?.author.map((author) =>{
            selectedAuthorIDArray.push(author?.id)
        })
        this.selectedQuestionAuthorsArray = selectedAuthorIDArray

        //После выбора вопроса собирается массив ответов
        this.loadAnswers()
    }

    deliverFromServerImageURL(){
        fetch("https://iot-experemental.herokuapp.com/files/question?id="+ this.selectedQuestionID)
            .then(response => response.json())
            .then(jResponse =>{
                this.selectedQuestionImageURL = jResponse[0].image
            })
            .catch(() => this.selectedQuestionImageURL = '')
    }

    //Функция для загрузки нового изображения на сервер (обработчик нажатия на кнопку для загрузки изображения)
    uploadNewQuestionImage(event){
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        formData.append('owner_question', String(this.selectedQuestionID));
        fetch(
            'https://iot-experemental.herokuapp.com/files/question?update_id='+ String(this.selectedQuestionID),
            {
                method: 'POST',
                body: formData,
            })
            .then((response) => response.json())
            .then(() => {
                this.deliverFromServerImageURL()
            })
            .catch(() => {
                this.deliverFromServerImageURL()
            })
    }

    //Авто сохранение ---------------------------------------------

    //Таймер для сохранения
    savingTimer: any

    //Функция для сохранения даных на сервере
    saveDataOnServer(){
        this.clientStorage.client.mutate({mutation: UPDATE_QUESTION, variables:{
                id: this.selectedQuestionID,
                createdBy: 0,
                theme: this.selectedQuestionThemesArray,
                author: this.selectedQuestionAuthorsArray,
                text: this.selectedQuestionText,
                videoUrl: this.selectedQuestionVideoUrl,
            }})
            .then(() =>{
                this.deliverFromServerAppQuestionsData()
                this.stateOfSave = true
            })
    }
    //сохранен/не сохранен
    stateOfSave = true

    //Функция для авто сохранений
    autoSave(){
        this.stateOfSave = false
        clearTimeout(this.savingTimer)
        this.savingTimer = setTimeout(() =>{this.saveDataOnServer()}, 5000)
    }


    //Поля вопроса ------------------------------------

    //ID выбранного вопроса
    selectedQuestionID = 0

    //Текст выбранного вопроса
    selectedQuestionText: string | undefined = ''

    //Ссылка на видео для выбранного вопроса
    selectedQuestionVideoUrl: string | undefined = ''

    //Темы выбранного вопроса
    selectedQuestionThemesArray: string[]  = []

    //Авторы выбранного вопроса
    selectedQuestionAuthorsArray: string[]  = []

    //Ссылка на изображение для вопроса
    selectedQuestionImageURL = ''

    //Количество отображаемых ответов
    selectedQuestionNumberOfShowingAnswers = "8"

    //Геттеры для полей вопроса ------------------------

    //Геттер для тем вопроса которые выбрал автор
    get SelectedQuestionThemesForSelector(){
        return(toJS(this.selectedQuestionThemesArray))
    }

    //Геттер для аторов вопроса которые выбрал автор
    get SelectedQuestionAuthorForSelector(){
        return(toJS(this.selectedQuestionAuthorsArray))
    }

    //Геттер имени фотографии вопроса (приводит ссылку к красивому виду)
    get QuestionImageName(){
        return(this.selectedQuestionImageURL.slice(70).split('?')[0])
    }
    //Раздел ответов ----------------------------------------------------------
    answers: any = []

    //Подгрузка данных о вопросах в массив
    loadAnswers(){
        if(this.questionHasBeenSelected){
        this.answers = sort(this.allQuestionsData?.find((question) => Number(question.id) === Number(this.selectedQuestionID))
            .answers)
            .asc((answer: any) => answer?.id)
            .map((answer) => new Answer(this, answer, this.selectedQuestionID))
        }
    }

    //Создаем новый вопрос
    createNewQuestion(){
        this.clientStorage.client.mutate({mutation: CREATE_NEW_QUESTION})
            .then(() => this.deliverFromServerAppQuestionsData())
    }

    //Создаем новый ответ
    createNewAnswer(){
        this.clientStorage.client.mutate({mutation: CREATE_NEW_ANSWER, variables:{
                question: this.selectedQuestionID
            }})
            .then(() => this.deliverFromServerAppQuestionsData())
            .catch(() => void(0))
    }


}
export const  QuestionEditorStorage =  new QuestionEditor()