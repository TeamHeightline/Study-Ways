import { sequenceDataI } from "./question-sequence.type";
import { IUserprofile } from "./user.types";

export interface IExamData {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  access_mode: string;
  uid: string;
  created_by_id: string;
  minutes: number;
  question_sequence_id: number;
}

export interface IExamDataWithQSData extends IExamData {
  question_sequence: sequenceDataI;
}

export interface IExamQuestionStatus {
  question_id: number;
  usertests_question: {
    text: string;
  };
  statistic_id?: number;
  percent?: number;
}

export interface IExamResult {
  question_statuses: IExamQuestionStatus[];
  users_customuser: {
    users_userprofile: IUserprofile;
    username: string;
  };
  sumOfAllPasses: number;
  exam_id: number;
}
