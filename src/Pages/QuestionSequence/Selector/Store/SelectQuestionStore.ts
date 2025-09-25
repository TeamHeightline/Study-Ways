import { autorun, makeAutoObservable, toJS } from "mobx";
import { ClientStorage } from "../../../../Shared/Store/ApolloStorage/ClientStorage";
import { ALL_QUESTION_SEQUENCES } from "./Query";
import { Query, QuestionSequenceNode } from "../../../../SchemaTypes";

class SelectQuestionStore {
  constructor() {
    makeAutoObservable(this);
    autorun(() => this.loadQuestionSequences());
  }

  // Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
  clientStorage = ClientStorage;

  loadQuestionSequences() {
    try {
      this.clientStorage.client
        .query<Query>({ query: ALL_QUESTION_SEQUENCES })
        .then((response) => response.data.questionSequence)
        .then((sequences: any) => {
          if (sequences) {
            this.sequenceArrayForDisplay = sequences;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  sequenceArrayForDisplay: QuestionSequenceNode[] = [];

  selectedSequenceID?: number = undefined;

  sequenceHasBeenSelected = false;

  sequenceHandler(sequence_id) {
    this.selectedSequenceID = sequence_id;
    this.sequenceHasBeenSelected = true;
  }

  get selectedQuestions(): number[] {
    return toJS(
      this.sequenceArrayForDisplay.find(
        (sequence) => Number(sequence?.id) == this.selectedSequenceID,
      ),
    )?.sequenceData.sequence;
  }
}

export const SQSObject = new SelectQuestionStore();
