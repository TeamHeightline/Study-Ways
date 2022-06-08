import {action} from "typesafe-actions";
import {
    CHANGE_EXAM_NAME,
    CHANGE_HELP_TEXT,
    CHANGE_SELECTED_ANSWERS_ID,
    CHANGE_SELECTED_QUESTION_ID,
    EXAM_BY_UID_LOAD_ERROR,
    EXAM_BY_UID_LOAD_SUCCESS,
    QUESTION_DATA_LOAD_SUCCESS,
    START_LOADING_EXAM_BY_UID,
    START_LOADING_QUESTION_DATA
} from "./action-types";
import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";

export const startLoadingExamByUid = () => action(START_LOADING_EXAM_BY_UID);
export const examByUidLoadSuccess = (examPassData: any) => action(EXAM_BY_UID_LOAD_SUCCESS, {examPassData});
export const examByUidLoadError = (error: any) => action(EXAM_BY_UID_LOAD_ERROR, {error});
export const changeExamName = (examName: string) => action(CHANGE_EXAM_NAME, {examName});
export const changeSelectedQuestionId = (selectedQuestionId: number) => action(CHANGE_SELECTED_QUESTION_ID, {selectedQuestionId});
export const startLoadingQuestionData = (selectedQuestionID: number) => action(START_LOADING_QUESTION_DATA, {selectedQuestionID})
export const questionDataLoadSuccess = (questionData: IQuestionWithAnswers) => action(QUESTION_DATA_LOAD_SUCCESS, {questionData})
export const changeHelpText = (helpText: string) => action(CHANGE_HELP_TEXT, {helpText})
export const changeSelectedAnswersId = (answerId: number) => action(CHANGE_SELECTED_ANSWERS_ID, {answerId})
