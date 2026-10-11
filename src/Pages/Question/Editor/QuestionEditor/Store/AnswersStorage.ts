import { makeAutoObservable } from 'mobx';
import { EditorAnswer } from '../../../question-read-api';

export class Answer {
  id = null;
  isDeleted = false;
  data?: EditorAnswer;

  constructor(store, answer?) {
    makeAutoObservable(this, {});
    if (answer) {
      if (answer.text !== undefined) this.data = answer;
      this.id = answer?.id;
      this.isDeleted = answer?.isDeleted;
    }
  }
}

const answerStoreObject = new Answer(undefined);

export type answerStoreType = typeof answerStoreObject;
