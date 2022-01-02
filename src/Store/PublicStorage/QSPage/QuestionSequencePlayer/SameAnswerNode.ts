import {makeAutoObservable, reaction} from "mobx";
import {SERVER_BASE_URL} from "../../../../settings";

export class SameAnswerNode{
    constructor(id, text, isTrue, checkQueue?, helpTextv1?, helpTextv2?, helpTextv3?, hardLevelOfAnswer?, is_image_deleted?) {
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
        this.isImageDeleted = is_image_deleted
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
    isImageDeleted = false

    getImageUrlFromServer(){
        fetch(SERVER_BASE_URL + "/files/answer?id="+ this.id)
            .then(response => response.json())
            .then(data => {
                if(data && data[0]?.image){
                    this.answerImageUrl = data[0].image
                }
            })
            .catch(() => void(0))
    }
}