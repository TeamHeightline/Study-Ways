import {makeAutoObservable, reaction} from "mobx";

export class SameAnswerNode{
    constructor(id, text) {
        makeAutoObservable(this)
        reaction(()=> this.id, () => this.getImageUrlFromServer())
        this.id = id
        this.answerText = text

    }
    id = 0
    answerText = ''
    answerImageUrl = ''

    getImageUrlFromServer(){
        fetch("https://iot-experemental.herokuapp.com/files/answer?id="+ this.id)
            .then(response => response.json())
            .then(data => this.answerImageUrl = data[0].image)
            .catch(() => void(0))
    }
}