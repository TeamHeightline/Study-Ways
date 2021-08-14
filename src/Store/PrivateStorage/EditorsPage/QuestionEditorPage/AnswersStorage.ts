import {makeAutoObservable, reaction} from "mobx";
import {UPDATE_ANSWER} from "./Struct";
import {ClientStorage} from "../../../ApolloStorage/ClientStorage";

export class Answer{
    store = null
    id = null
    isTrue = "false"
    text = ''
    helpTextv1 = ''
    helpTextv2 = ''
    helpTextv3 = ''
    checkQueue = 10000
    videoUrl = ''
    hardLevelOfAnswer = ''
    isEditNow = false
    imageUrl = ''
    usePreview = false
    fakeAnswerIndexForUpdatePreview = 0
    questionID = 0
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    getImageUrlFromServer(){
        fetch("https://iot-experemental.herokuapp.com/files/answer?id="+ this.id)
            .then(response => response.json())
            .then(data => this.imageUrl = data[0].image)
            .then(() => this.fakeAnswerIndexForUpdatePreview = this.fakeAnswerIndexForUpdatePreview + 1)
            .catch(() => void(0))
    }
    updateImage(e){
        const formData = new FormData();
        console.log(e.target.files[0])
        formData.append('image', e.target.files[0]);
        formData.append('owner_answer', String(this.id));
        fetch(
            'https://iot-experemental.herokuapp.com/files/answer?update_id=' + String(this.id),
            {
                method: 'POST',
                body: formData
            })
            .then((response) => response.json())
            .then(() => {
                this.getImageUrlFromServer()
            })
            .catch(() => {
                this.getImageUrlFromServer()
            })
    }

    //Таймер для сохранения
    savingTimer: any

    //Функция для сохранения даных на сервере
    saveDataOnServer(){
        this.clientStorage.client.mutate({mutation: UPDATE_ANSWER, variables:{
                question: this.questionID,
                id: this.id,
                is_true: Boolean(this.isTrue),
                text: this.text,
                helpTextv1: this.helpTextv1,
                helpTextv2: this.helpTextv2,
                helpTextv3: this.helpTextv3,
                videoUrl: this.videoUrl,
                checkQueue: this.checkQueue,
                hardLevelOfAnswer: this.hardLevelOfAnswer
            }})
            .then(() =>{
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

    get imageName(){
        if(this.imageUrl === ''){
            return ('')
        }
        return(this.imageUrl.slice(68).split('?')[0])
    }


    constructor(store, answer, questionID){
        makeAutoObservable(this, {
            store: false,
        })
        this.store = store
        this.id = answer.id
        this.isTrue = String(answer.isTrue)
        this.text = answer.text
        this.helpTextv1 = answer.helpTextv1
        this.helpTextv2 = answer.helpTextv2
        this.helpTextv3 = answer.helpTextv3
        this.checkQueue = answer.checkQueue
        this.videoUrl = answer.videoUrl
        this.hardLevelOfAnswer = answer.hardLevelOfAnswer
        this.questionID = questionID
        this.getImageUrlFromServer()
        reaction(() => this.id, () => this.autoSave())
        reaction(() => this.isTrue, () => this.autoSave())
        reaction(() => this.text, () => this.autoSave())
        reaction(() => this.helpTextv1, () => this.autoSave())
        reaction(() => this.helpTextv2, () => this.autoSave())
        reaction(() => this.helpTextv3, () => this.autoSave())
        reaction(() => this.checkQueue, () => this.autoSave())
        reaction(() => this.videoUrl, () => this.autoSave())
        reaction(() => this.hardLevelOfAnswer, () => this.autoSave())
        reaction(() => this.questionID, () => this.autoSave())
    }
}