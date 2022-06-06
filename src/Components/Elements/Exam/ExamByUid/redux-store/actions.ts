import {action} from "typesafe-actions";
import {
    CHANGE_EXAM_NAME,
    CHANGE_SELECTED_QUESTION_ID,
    EXAM_BY_UID_LOAD_ERROR,
    EXAM_BY_UID_LOAD_SUCCESS,
    START_LOADING_EXAM_BY_UID
} from "./action-types";

export const startLoadingExamByUid = () => action(START_LOADING_EXAM_BY_UID);
export const examByUidLoadSuccess = (examPassData: any) => action(EXAM_BY_UID_LOAD_SUCCESS, {examPassData});
export const examByUidLoadError = (error: any) => action(EXAM_BY_UID_LOAD_ERROR, {error});
export const changeExamName = (examName: string) => action(CHANGE_EXAM_NAME, {examName});
export const changeSelectedQuestionId = (selectedQuestionId: number) => action(CHANGE_SELECTED_QUESTION_ID, {selectedQuestionId});
