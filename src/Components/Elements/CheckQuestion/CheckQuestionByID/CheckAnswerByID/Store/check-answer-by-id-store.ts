import {autorun, makeAutoObservable} from "mobx";
import {AnswerNode, Query} from "../../../../../../SchemaTypes";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {AnswerDataByID} from "./query";

export class CheckAnswerByIdStore {
    constructor(answerID) {
        makeAutoObservable(this)
        this.answerID = answerID
        autorun(() => this.loadAnswerData())
    }

    clientStorage = ClientStorage
    answerID?: string
    answerData?: AnswerNode
    isAnswerDataLoaded = false

    private loadAnswerData() {
        if (this.answerID) {
            this.clientStorage.client.query<Query>({
                query: AnswerDataByID,
                variables: {
                    answerID: this.answerID
                },
                fetchPolicy: "network-only"
            })
                .then((response) => response.data.answerById)
                .then((answerByIDResponseObject) => {
                    if (Number(answerByIDResponseObject?.id) === Number(this.answerID)) {
                        this.answerData = answerByIDResponseObject
                        this.isAnswerDataLoaded = true
                    }
                })
                .catch((e) => console.log(e))
        }
    }


}