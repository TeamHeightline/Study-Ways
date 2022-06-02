import {initialState} from "./initial-state";
import {
    CHANGE_ACCESS_TYPE,
    CHANGE_EXAM_ID,
    CHANGE_EXAM_MINUTES,
    CHANGE_EXAM_NAME,
    CHANGE_SELECTED_QS_ID,
    LOAD_EXAM_DATA_SUCCESS,
    LOAD_QS_SUCCESS,
    START_LOADING_EXAM_DATA,
    START_LOADING_QS,
    START_UPDATE_EXAM,
    UPDATE_EXAM_ERROR,
    UPDATE_EXAM_SUCCESS
} from "./action-types";
import produce from "immer";
import {ActionType} from "typesafe-actions";
import * as Actions from './actions';

export type ExamEditorAction = ActionType<typeof Actions>;


export const examEditorReducer = produce((state: typeof initialState = initialState, action
    :
    ExamEditorAction
) => {
    switch (action.type) {
        case CHANGE_SELECTED_QS_ID:
            if (state.exam_data) {
                state.exam_data.question_sequence_id = Number(action.payload.qs_id)
            }
            break;

        case START_LOADING_QS:
            state.selected_qs_data_loading = true;
            break;

        case LOAD_QS_SUCCESS:
            state.selected_qs_data_loading = false;
            state.selected_qs_data = action.payload.qs_data;
            break;

        case CHANGE_ACCESS_TYPE:
            state.access_type = action.payload.access_type;
            break;

        case CHANGE_EXAM_ID:
            state.exam_id = action.payload.exam_id;
            break;

        case LOAD_EXAM_DATA_SUCCESS:
            state.exam_data_loading = false;
            state.exam_data = action.payload.exam_data;
            break;

        case START_LOADING_EXAM_DATA:
            state.exam_data_loading = true
            break

        case START_UPDATE_EXAM:
            state.update_exam_loading = true;
            break;

        case UPDATE_EXAM_SUCCESS:
            state.update_exam_loading = false;
            break


        case UPDATE_EXAM_ERROR:
            state.update_exam_loading = false;
            state.update_exam_error = action.payload.error;
            break

        case CHANGE_EXAM_NAME:
            if (state.exam_data) {
                state.exam_data.name = action.payload.name;
            }
            break

        case CHANGE_EXAM_MINUTES:
            if (state.exam_data) {
                state.exam_data.minutes = action.payload.minutes;
            }
            break

        default:
            return state;
    }

})
