import {makeAutoObservable} from "mobx";
import {ClientStorage} from "../../../../../../Store/ApolloStorage/ClientStorage";
import {GET_QUESTIONS_FROM_QS_BY_ID} from "./Query";
import {Query} from "../../../../../../SchemaTypes";

class ToQuestionsArray{
    constructor() {
        makeAutoObservable(this)
    }
    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    getQuestionsByQSID(qs_id: number){
        try{
            this.clientStorage.client.query<Query>({query: GET_QUESTIONS_FROM_QS_BY_ID, variables:{
                id: qs_id
                }})
                .then((response) =>response.data.questionSequenceById)
                .then((qs_data) => this.selectedQuestions = qs_data?.sequenceData?.sequence)
        }catch(e){
            console.log(e)
        }
    }


    selectedQuestions:  number[] = []
}

export const TQAObject = new ToQuestionsArray()