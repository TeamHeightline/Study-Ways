import {action} from "typesafe-actions";
import {
    CHANGE_EXAM_NAME,
    CHANGE_HELP_TEXT,
    CHANGE_SELECTED_ANSWERS_ID,
    CHANGE_SELECTED_QUESTION_ID,
    CHECK_ANSWERS,
    EXAM_BY_UID_LOAD_ERROR,
    EXAM_BY_UID_LOAD_SUCCESS,
    QUESTION_DATA_LOAD_SUCCESS,
    SAVE_DETAIL_STATISTIC_ERROR,
    SAVE_DETAIL_STATISTIC_SUCCESS,
    START_LOADING_EXAM_BY_UID,
    START_LOADING_QUESTION_DATA,
    START_SAVING_DETAIL_STATISTIC
} from "./action-types";
import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";
import {IDetailStatistic} from "../../../../../ServerLayer/Types/detail-statistic.types";

export const startLoadingExamByUid = () => action(START_LOADING_EXAM_BY_UID);
export const examByUidLoadSuccess = (examPassData: any) => action(EXAM_BY_UID_LOAD_SUCCESS, {examPassData});
export const examByUidLoadError = (error: any) => action(EXAM_BY_UID_LOAD_ERROR, {error});
export const changeExamName = (examName: string) => action(CHANGE_EXAM_NAME, {examName});
export const changeSelectedQuestionId = (selectedQuestionId: number | null) => action(CHANGE_SELECTED_QUESTION_ID, {selectedQuestionId});
export const startLoadingQuestionData = (selectedQuestionID: number) => action(START_LOADING_QUESTION_DATA, {selectedQuestionID})
export const questionDataLoadSuccess = (questionData: IQuestionWithAnswers) => action(QUESTION_DATA_LOAD_SUCCESS, {questionData})
export const changeHelpText = (helpText: string) => action(CHANGE_HELP_TEXT, {helpText})
export const changeSelectedAnswersId = (answerId: number) => action(CHANGE_SELECTED_ANSWERS_ID, {answerId})
export const checkAnswers = () => action(CHECK_ANSWERS)
export const startSavingDetailStatistic = () => action(START_SAVING_DETAIL_STATISTIC)
export const saveDetailStatisticSuccess = (statistic: IDetailStatistic) => action(SAVE_DETAIL_STATISTIC_SUCCESS, {statistic})
export const saveDetailStatisticError = (error) => action(SAVE_DETAIL_STATISTIC_ERROR, {error})
