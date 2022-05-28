import {
    CHANGE_ACCESS_TYPE,
    CHANGE_EXAM_ID,
    CHANGE_SELECTED_QS_ID,
    LOAD_EXAM_DATA_SUCCESS,
    LOAD_QS_ERROR,
    LOAD_QS_SUCCESS,
    START_LOADING_EXAM_DATA,
    START_LOADING_QS
} from "./action-types";
import {action} from "typesafe-actions";

export const changeExamEditorSelectedQsId = (qs_id: string) => action(CHANGE_SELECTED_QS_ID, {qs_id});
export const startLoadingExamEditorSelectedQsData = () => action(START_LOADING_QS);
export const loadExamEditorSelectedQsDataSuccess = (qs_data) => action(LOAD_QS_SUCCESS, {qs_data});
export const loadExamEditorSelectedQsDataError = (error) => action(LOAD_QS_ERROR, {error});
export const changeAccessType = (access_type: "manual" | "timeInterval") => action(CHANGE_ACCESS_TYPE, {access_type});
export const changeExamID = (exam_id: string) => action(CHANGE_EXAM_ID, {exam_id});
export const successLoadExamData = (exam_data) => action(LOAD_EXAM_DATA_SUCCESS, {exam_data});
export const startLoadingExamData = () => action(START_LOADING_EXAM_DATA);

