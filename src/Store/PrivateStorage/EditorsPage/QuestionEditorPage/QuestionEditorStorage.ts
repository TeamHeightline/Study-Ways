import { makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";
import {
    THEMES_AND_AUTHORS_FOR_QUESTION,
    CREATE_NEW_ANSWER,
    CREATE_NEW_ANSWER_BASED_ON_DATA,
    CREATE_NEW_QUESTION, GET_QUESTION_DATA_BY_ID, MY_QUESTIONS_BASIC_DATA,
    UPDATE_QUESTION, CREATE_DEEP_QUESTION_COPY
} from "./Struct";
import {
    AnswerNode,
    Maybe,
    Mutation,
    Query,
    QuestionAuthorNode,
    QuestionNode,
    QuestionThemesNode
} from "../../../../SchemaTypes";
import {sort} from "fast-sort";
import {Answer} from "./AnswersStorage";
import {UserStorage} from "../../../UserStore/UserStore";
import {SERVER_BASE_URL} from "../../../../settings";
export enum variantsOfStateOfSave{
    SAVED = "SAVED",
    SAVING = "SAVING",
    ERROR = "ERROR"
}
class QuestionEditor{
    constructor() {
            makeAutoObservable(this)
            reaction(() => this.selectedQuestionID, () => this.deliverFromServerImageURL())
            reaction(() => this.selectedQuestionText, () => this.autoSave())
            reaction(() => this.selectedQuestionVideoUrl, () => this.autoSave())
            reaction(() => this.selectedQuestionThemesArray, () => this.autoSave())
            reaction(() => this.selectedQuestionAuthorsArray, () => this.autoSave())
            reaction(() => this.selectedQuestionNumberOfShowingAnswers, () => this.autoSave())
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //доступ к данным о пользователе, чтобы можно было проверять уровень доступа
    userStorage = UserStorage

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

    changeQuestionHasBeenSelected(newState){
        this.questionHasBeenSelected = newState
    }

    //Флаг, указывающий на то, использовать превью или нет
    showPreview = false

    //Функция для получения данных о всех вопросов с сервера
    loadQuestionAuthorsAndThemes(){
        if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN"){
            this.clientStorage.client.query({query:THEMES_AND_AUTHORS_FOR_QUESTION, fetchPolicy: "network-only"})
                .then((response) =>{
                    this.allThemesForQuestion = sort(response?.data?.questionThemes).desc((theme: any) => theme?.id)
                    this.allAuthorsForQuestion = sort(response?.data?.me?.questionauthorSet).desc((author: any) => author?.id)
                    this.AuthorsAndThemesHasBeenLoaded = true
                })
                .catch(() => void(0))
        }
    }
    AuthorsAndThemesHasBeenLoaded = false

    loadBasicQuestionData(){
        this.loadingBasicQuestionData = true
        if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
            this.clientStorage.client.query({query: MY_QUESTIONS_BASIC_DATA, fetchPolicy: "network-only"})
                .then((response) => (response?.data?.me?.questionSet))
                .then((questionsArray: QuestionNode[] | undefined) => {
                    if(questionsArray){
                        this.basicQuestionData = sort(questionsArray).desc((question: any) => question?.id)
                    }
                    this.loadingBasicQuestionData = false
                })
        }
    }
    basicQuestionData: QuestionNode[] = []
    loadingBasicQuestionData = true
    loadingQuestionData = false
    selectQuestionClickHandler(id: number){
        this.loadingQuestionData = true
        if(this.userStorage.userAccessLevel === "TEACHER" || this.userStorage.userAccessLevel === "ADMIN") {
            this.clientStorage.client.query<Query>({query: GET_QUESTION_DATA_BY_ID, fetchPolicy: "network-only",
            variables:{id: id}})
                .then((response) => (response.data.questionById))
                .then((question_data) =>{
                    if(question_data){
                        this.selectedQuestionID = Number(question_data.id);
                        this.selectedQuestionText = question_data.text;
                        if(question_data.videoUrl){
                            this.selectedQuestionVideoUrl = question_data.videoUrl;
                        }
                        if(question_data.numberOfShowingAnswers){
                            this.selectedQuestionNumberOfShowingAnswers = String(question_data.numberOfShowingAnswers)
                        }
                        const __QuestionAuthors = question_data.author.map((author) => {return(String(author.id))})
                        this.selectedQuestionAuthorsArray = __QuestionAuthors ? __QuestionAuthors: []
                        const __QuestionThemes = question_data.theme.map((theme) => {return(String(theme.id))})
                        this.selectedQuestionThemesArray = __QuestionThemes ?__QuestionThemes:  []

                        if(question_data.answers){
                            const __Answers: Answer[] = []
                            sort(question_data.answers)
                                .asc((answer:  AnswerNode) => Number(answer?.id))
                                .filter((answer:  AnswerNode) => !answer.isDeleted)
                                .map((answer: AnswerNode) => __Answers.push(new Answer(this, answer, this.selectedQuestionID)))
                            this.answers = __Answers
                        }
                        this.questionHasBeenSelected = true;
                        this.loadingQuestionData = false
                    }
                })

        }
    }

    //Геттер, нужен чтобы можно было без преобразований использовать allQuestionsData
    get allQuestionsDataForSelector(){
        return(toJS(this.allQuestionsData))
    }


    deliverFromServerImageURL(){
        fetch(SERVER_BASE_URL + "/files/question?id="+ this.selectedQuestionID)
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
            SERVER_BASE_URL + '/files/question?update_id='+ String(this.selectedQuestionID),
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
                numberOfShowingAnswers: Number(this.selectedQuestionNumberOfShowingAnswers),
            }})
            .then((response) => {
                console.log(response)
                if(response.data.updateQuestion.errors.length > 0){
                    this.stateOfSave = variantsOfStateOfSave.ERROR
                }else{
                    this.stateOfSave = variantsOfStateOfSave.SAVED
                }
            })
            .then(() =>{
                this.loadBasicQuestionData()
                this.simpleUpdateFlag = true
            })
    }
    //сохранен/не сохранен / ошибка

    stateOfSave: variantsOfStateOfSave = variantsOfStateOfSave.SAVED

    //Функция для авто сохранений
    autoSave(){
        this.stateOfSave = variantsOfStateOfSave.SAVING
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
    selectedQuestionThemesArray: string[]   = []

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
        return(toJS(this.selectedQuestionAuthorsArray) || [])
    }

    //Геттер имени фотографии вопроса (приводит ссылку к красивому виду)
    get QuestionImageName(){
        return(this.selectedQuestionImageURL.slice(70).split('?')[0])
    }
    //Раздел ответов ----------------------------------------------------------
    answers:  any = []


    //Флаг который позволяет игнорировать пересоздание сторов для ответов в случае если это просто обновление
    //ответа
    simpleUpdateFlag = false

    changeSimpleUpdateFlag(newFlag){
        this.simpleUpdateFlag = newFlag
    }


    //Создаем новый вопрос
    createNewQuestion(){
        this.clientStorage.client.mutate<Mutation>({mutation: CREATE_NEW_QUESTION})
            .then((response) => (response?.data?.updateQuestion?.question?.id))
            .then((id) => this.selectQuestionClickHandler(Number(id)))
            .then(() => this.loadBasicQuestionData())
    }

    //Создаем копию этого вопроса со всеми ответами и переходим в нее
    createDeepCopyInProgress = false
    deepQuestionCopyWithAnswers = () => {
        this.createDeepCopyInProgress = true
        try{
            this.clientStorage.client.mutate<Mutation>({mutation: CREATE_DEEP_QUESTION_COPY,
                variables:{
                    questionId: this.selectedQuestionID
            }})
                .then((response) => response?.data?.copyQuestionWithAnswers)
                .then((create_question_data) =>{
                    if(create_question_data?.ok && create_question_data.newQuestionId){
                        this.createDeepCopyInProgress = false
                        this.selectQuestionClickHandler(Number(create_question_data.newQuestionId))
                    }
                })

            }catch(e){
                console.log(e)
        }
    }

    addCreatedAnswerToAnswersObjectArray(answer: AnswerNode){
        this.answers.push(new Answer(this, answer, this.selectedQuestionID))
    }

    //Создаем новый ответ
    createNewAnswer(){
        this.clientStorage.client.mutate({mutation: CREATE_NEW_ANSWER, variables:{
                question: this.selectedQuestionID
            }})
            .then((response) => {
                console.log(response.data)
                this.addCreatedAnswerToAnswersObjectArray(response.data.createAnswer.answer)
                // this.selectQuestionClickHandler(this.selectedQuestionID)
                })
            .catch(() => void(0))
    }

    //Создать новый ответ на основе существующего
    createNewAnswerBasedOnExist(basedAnswerID){
        const basedAnswer = this.answers.find((answer) => answer.id === basedAnswerID)
        this.clientStorage.client.mutate({mutation: CREATE_NEW_ANSWER_BASED_ON_DATA,
            variables:{
                question: this.selectedQuestionID,
                isTrue: basedAnswer.isTrue  == "true",
                text: basedAnswer.text,
                helpTextv1: basedAnswer.helpTextv1,
                helpTextv2: basedAnswer.helpTextv2,
                helpTextv3: basedAnswer.helpTextv3,
                videoUrl: basedAnswer.videoUrl,
                checkQueue: basedAnswer.checkQueue,
                hardLevelOfAnswer: basedAnswer.hardLevelOfAnswer,
                isDeleted: basedAnswer.isDeleted,
        }})
            .then((response) => {
                console.log(response.data)
                this.addCreatedAnswerToAnswersObjectArray(response.data.createAnswer.answer)
                // this.selectQuestionClickHandler(this.selectedQuestionID)
            })
            .catch(() => void(0))
    }



    activeFolder = 0

    changeActiveFolder(newFolder){
        this.activeFolder = newFolder
    }

    get QuestionArrayForDisplay(){
        if(!this?.basicQuestionData){
            return([])
        }
        if(this.activeFolder === 0 ){
            return(
                sort(this.basicQuestionData)?.desc((question: any) => Number(question.id))
            )
        }
        if(this.activeFolder === 1){
            return (
                sort(this.basicQuestionData?.filter((question) => question.text !== "Новый вопрос"))?.desc((question: any) => Number(question.id))
            )
        }
        if(this.activeFolder === 2){
            return (
                sort(this.basicQuestionData?.filter((question) => question.text === "Новый вопрос"))?.desc((question: any) => Number(question.id))
            )
        }
    }

    //Массив редактируемых сейчас вопросов, нужен чтобы хранить свернутые и развернутые ответы
    activeEditAnswerIDSet = new Set()

    changeActiveEditAnswerIDSet(id){
        if(QuestionEditorStorage.activeEditAnswerIDSet.has(id)){
            QuestionEditorStorage.activeEditAnswerIDSet.delete(id)
        }else{
            QuestionEditorStorage.activeEditAnswerIDSet.add(id)
        }
    }

}
export const  QuestionEditorStorage =  new QuestionEditor()