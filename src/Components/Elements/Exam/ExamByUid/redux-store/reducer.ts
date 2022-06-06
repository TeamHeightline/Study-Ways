import * as Actions from './actions';
import {initialState, IQuestionStatus} from "./initial-state";
import {ActionType} from "typesafe-actions";
import {
    CHANGE_EXAM_NAME,
    CHANGE_SELECTED_QUESTION_ID,
    EXAM_BY_UID_LOAD_ERROR,
    EXAM_BY_UID_LOAD_SUCCESS,
    START_LOADING_EXAM_BY_UID
} from "./action-types";
import produce from "immer";

export type ExamByIDAction = ActionType<typeof Actions>;

export const ExamByUIDReducer = produce((state: typeof initialState = initialState, action: ExamByIDAction) => {
    switch (action.type) {

        case START_LOADING_EXAM_BY_UID:
            state.loading_question_statuses = true;
            break

        case EXAM_BY_UID_LOAD_ERROR:
            state.loading_question_statuses = false;
            state.question_statuses_load_error = action.payload.error;
            break

        case EXAM_BY_UID_LOAD_SUCCESS:
            const questionStatuses: IQuestionStatus[] = action.payload.examPassData.question_statuses
            let selectedQuestionStatus: IQuestionStatus | null = null
            for (let i in questionStatuses) {
                if (!questionStatuses[i].statistic_id && selectedQuestionStatus == null) {
                    selectedQuestionStatus = questionStatuses[i]
                }
            }

            state.loading_question_statuses = false;
            state.question_statuses = questionStatuses;
            if (selectedQuestionStatus) {
                state.selected_question_id = selectedQuestionStatus.question_id
            }
            break

        case CHANGE_SELECTED_QUESTION_ID:
            state.selected_question_id = action.payload.selectedQuestionId;
            break

        case CHANGE_EXAM_NAME:
            state.exam_name = action.payload.examName;
            break

        default:
            return state
    }
})
