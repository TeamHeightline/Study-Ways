import {makeAutoObservable, reaction} from "mobx";

export class SameAnswerNode{
    constructor(id, text, isTrue, checkQueue, helpTextv1, helpTextv2, helpTextv3, hardLevelOfAnswer) {
        makeAutoObservable(this)
        reaction(()=> this.id, () => this.getImageUrlFromServer())
        this.id = id
        this.answerText = text
        this.isTrue = isTrue
        this.checkQueue = checkQueue
        this.helpTextv1 = helpTextv1
        this.helpTextv2 = helpTextv2
        this.helpTextv3 = helpTextv3
        this.hardLevelOfAnswer = hardLevelOfAnswer
    }
    id = 0
    answerText = ''
    answerImageUrl = ''
    isTrue = false
    checkQueue = 1000000

    hardLevelOfAnswer = "EASY"

    helpTextv1 = ''
    helpTextv2 = ''
    helpTextv3 = ''

    getImageUrlFromServer(){
        fetch("https://iot-experemental.herokuapp.com/files/answer?id="+ this.id)
            .then(response => response.json())
            .then(data => this.answerImageUrl = data[0].image)
            .catch(() => void(0))
    }
}