import {makeAutoObservable} from "mobx";

export class Answer {

    id = null
    isDeleted = false

    constructor(store, answer?) {
        makeAutoObservable(this, {})
        if (answer) {
            this.id = answer?.id
            this.isDeleted = answer?.isDeleted
        }
    }
}


const answerStoreObject = new Answer(undefined)

export type answerStoreType = typeof answerStoreObject
