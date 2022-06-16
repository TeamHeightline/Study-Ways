import {action} from "typesafe-actions";
import * as ActionTypes from "./action-types";

export const changeExamID = (exam_id: number) => action(ActionTypes.CHANGE_EXAM_ID, exam_id);
export const startLoadingExamResults = () => action(ActionTypes.START_LOADING_EXAM_RESULTS);
export const examResultsLoadSuccess = (users_results: any) => action(ActionTypes.EXAM_RESULTS_LOAD_SUCCESS, users_results);
export const examResultsLoadFail = (error: any) => action(ActionTypes.EXAM_RESULTS_LOAD_FAIL, error);
