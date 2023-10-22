import {autorun, makeAutoObservable} from "mobx";
import {Query} from "../../../../SchemaTypes";
import {LoadAnswersIDArrayByQuestionID} from "./query";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";

export class CheckQuestionByIdStore {
    constructor(question_id?: string) {
        makeAutoObservable(this)
        this.question_id = question_id;
        autorun(() => this.LoadQuestionAnswersIDArray())
    }

    question_id?: string
    clientStorage = ClientStorage
    answersIDArray: string[] = []

    LoadQuestionAnswersIDArray() {
        if (this.question_id) {
            this.clientStorage.client.query<Query>({
                query: LoadAnswersIDArrayByQuestionID,
                variables: {
                    questionId: this.question_id
                },
                fetchPolicy: "network-only"
            })
                .then((response) => response.data.answersId)
                .then((answerIDResponseObject) => {
                    if (Number(answerIDResponseObject?.ownerQuestionId) === Number(this.question_id)
                        && answerIDResponseObject?.IDs) {
                        this.answersIDArray = answerIDResponseObject.IDs
                    }
                })

                .catch((e) => console.log(e))

        }
    }
}
