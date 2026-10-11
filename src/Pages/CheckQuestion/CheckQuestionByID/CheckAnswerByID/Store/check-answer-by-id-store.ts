import { makeAutoObservable } from 'mobx';
import { ReviewAnswer } from '../../../../Question/question-read-api';
import axiosClient from '../../../../../Shared/ServerLayer/QueryLayer/config';

export class CheckAnswerByIdStore {
  constructor(answerID) {
    makeAutoObservable(this);
    this.answerID = answerID;
  }

  answerID?: string;
  answerData?: ReviewAnswer;
  isAnswerDataLoaded = false;
  hasLoadError = false;

  // Блок, посвященный созданию отчета об ошибке
  isOpenAnswerReportDialog = false;

  openAnswerReportDialog = () => {
    this.isOpenAnswerReportDialog = true;
  };
  closeAnswerReportDialog = () => {
    this.isOpenAnswerReportDialog = false;
    this.answerReportText = '';
  };

  answerReportText = '';
  changeAnswerReportText = e => {
    this.answerReportText = e.target.value;
  };

  saveAnswerReport = () => {
    if (this.answerReportText && this.answerID) {
      axiosClient
        .post('/page/question-page/create-answer-report', {
          report_data: {
            answer_id: Number(this.answerID),
            text: this.answerReportText,
          },
        })
        .then(() => {
          this.addAnswerReportSavedMessage();
        })
        .catch(() => {
          this.addAnswerReportErrorMessage();
        });
    }
  };

  answerReportSavedMessageArray: boolean[] = [];

  addAnswerReportSavedMessage = () => {
    this.answerReportSavedMessageArray.push(true);
  };

  addAnswerReportErrorMessage = () => {
    this.answerReportSavedMessageArray.push(false);
  };

  removeAnswerReportSavedMessage = () => {
    this.answerReportSavedMessageArray.shift();
  };

  onSendAnswerReportButtonClick = () => {
    this.saveAnswerReport();
    this.closeAnswerReportDialog();
  };
}
