import { makeAutoObservable } from "mobx";
import { ClientStorage } from "../../../../../Shared/Store/ApolloStorage/ClientStorage";
import { GET_ALL_QUESTIONS_ID, GET_QUESTIONS_FROM_QS_BY_ID } from "./Query";
import { Query } from "../../../../../SchemaTypes";

class ToQuestionsArray {
  constructor() {
    makeAutoObservable(this);
  }

  // Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
  clientStorage = ClientStorage;

  getQuestionsByQSID(qs_id: number) {
    try {
      this.clientStorage.client
        .query<Query>({
          query: GET_QUESTIONS_FROM_QS_BY_ID,
          variables: {
            id: qs_id,
          },
        })
        .then((response) => response.data.questionSequenceById)
        .then(
          (qs_data) =>
            (this.selectedQuestions = qs_data?.sequenceData?.sequence),
        );
    } catch (e) {
      console.log(e);
    }
  }

  getAllQuestions() {
    try {
      this.clientStorage.client
        .query<Query>({
          query: GET_ALL_QUESTIONS_ID,
          fetchPolicy: "network-only",
          variables: {},
        })
        .then((response) => response.data.question)
        .then((questions) => {
          if (questions) {
            this.selectedQuestions = questions.map((question) =>
              Number(question?.id),
            );
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  selectedQuestions: number[] = [];
}

export const TQAObject = new ToQuestionsArray();
