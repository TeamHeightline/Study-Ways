import {action} from "typesafe-actions";
import {LOAD_MY_EXAMS_ERROR, LOAD_MY_EXAMS_SUCCESS, START_LOADING_MY_EXAMS} from "./action-types";
import {IExamDataWithQSData} from "../../../../../../ServerLayer/Types/exam.types";

export const startLoadingMyExam = () => action(START_LOADING_MY_EXAMS);
export const loadMyExamsSuccess = (exams: IExamDataWithQSData[]) => action(LOAD_MY_EXAMS_SUCCESS, {exams});
export const loadMyExamsError = (error) => action(LOAD_MY_EXAMS_ERROR, error);
