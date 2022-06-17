import {action} from "typesafe-actions";
import * as ActionTypes from "./action-types";
import {IExamResult} from "../../../../../ServerLayer/Types/exam.types";

export const startLoadingExamResults = () => action(ActionTypes.START_LOADING_EXAM_RESULTS);
export const examResultsLoadSuccess = (users_results: IExamResult[]) => action(ActionTypes.EXAM_RESULTS_LOAD_SUCCESS, users_results);
export const examResultsLoadFail = (error: any) => action(ActionTypes.EXAM_RESULTS_LOAD_FAIL, error);

export const changeExamID = (exam_id: number) => action(ActionTypes.CHANGE_EXAM_ID, exam_id);
