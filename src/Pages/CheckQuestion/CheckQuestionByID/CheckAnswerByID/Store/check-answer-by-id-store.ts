import { autorun, makeAutoObservable } from "mobx";
import { AnswerNode, Query } from "../../../../../SchemaTypes";
import { ClientStorage } from "../../../../../Shared/Store/ApolloStorage/ClientStorage";
import { AnswerDataByID } from "./query";
import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";

export class CheckAnswerByIdStore {
  constructor(answerID) {
    makeAutoObservable(this);
    this.answerID = answerID;
    autorun(() => this.loadAnswerData());
  }

  clientStorage = ClientStorage;
  answerID?: string;
  answerData?: AnswerNode;
  isAnswerDataLoaded = false;

  private loadAnswerData() {
    if (this.answerID) {
      this.clientStorage.client
        .query<Query>({
          query: AnswerDataByID,
          variables: {
            answerID: this.answerID,
          },
          fetchPolicy: "network-only",
        })
        .then((response) => response.data.answerById)
        .then((answerByIDResponseObject) => {
          if (Number(answerByIDResponseObject?.id) === Number(this.answerID)) {
            this.answerData = answerByIDResponseObject;
            this.isAnswerDataLoaded = true;
          }
        })
        .catch((e) => console.log(e));
    }
  }

  // Блок, посвященный созданию отчета об ошибке
  isOpenAnswerReportDialog = false;

  openAnswerReportDialog = () => {
    this.isOpenAnswerReportDialog = true;
  };
  closeAnswerReportDialog = () => {
    this.isOpenAnswerReportDialog = false;
    this.answerReportText = "";
  };

  answerReportText = "";
  changeAnswerReportText = (e) => {
    this.answerReportText = e.target.value;
  };

  saveAnswerReport = () => {
    if (this.answerReportText && this.answerID) {
      axiosClient
        .post("/page/question-page/create-answer-report", {
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
