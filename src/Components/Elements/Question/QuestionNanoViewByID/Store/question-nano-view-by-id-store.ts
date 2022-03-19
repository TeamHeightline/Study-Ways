import {autorun, makeAutoObservable} from "mobx";
import {Query} from "../../../../../SchemaTypes";
import {ClientStorage} from "../../../../../Store/ApolloStorage/ClientStorage";
import {GET_QUESTION_NANO_VIEW_BY_ID} from "../../Selector/Store/query";
import React from "react";

export class QuestionNanoViewByIdStore {
    constructor(id?: number) {
        makeAutoObservable(this)
        autorun(() => this.loadQuestionTextNanoViewByID())
        this.id = id
    }

    id?: number
    clientStorage = ClientStorage

    text?: string
    owner_username?: string
    questionImage?: string


    dataHasBeenLoaded = false

    loadQuestionTextNanoViewByID(useCache = true) {
        if (this.id) {
            this.clientStorage.client.query<Query>({
                query: GET_QUESTION_NANO_VIEW_BY_ID,
                variables: {
                    id: this.id
                },
                fetchPolicy: useCache ? "cache-only" : "network-only"
            })
                .then((response) => response.data.questionNanoViewById)
                .then((questionNanoViewData) => {
                    if (questionNanoViewData) {
                        this.text = questionNanoViewData.text
                        this.owner_username = questionNanoViewData.ownerUsername
                        this.questionImage = questionNanoViewData.questionImage
                        this.dataHasBeenLoaded = true
                    }
                    if (useCache) {
                        this.loadQuestionTextNanoViewByID(false)
                    }
                })
                .catch((e) => console.log(e))
        }
    }

    //Изображение вопроса

    AnchorEl: any

    handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        this.AnchorEl = event.currentTarget
    };


    handlePopoverClose = () => {
        this.AnchorEl = null
    };

    get isShowQuestionImagePopover() {
        return Boolean(this.AnchorEl) && !!this.questionImage
    }

}

const sampleQNVByID = new QuestionNanoViewByIdStore()

export type NanoQuestionStoreType = typeof sampleQNVByID