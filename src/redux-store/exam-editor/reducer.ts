import {initialState} from "./initial-state";
import {
    CHANGE_ACCESS_TYPE,
    CHANGE_EXAM_ID,
    CHANGE_SELECTED_QS_ID,
    LOAD_EXAM_DATA_SUCCESS,
    LOAD_QS_SUCCESS,
    START_LOADING_EXAM_DATA,
    START_LOADING_QS
} from "./action-types";

export const examEditorReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SELECTED_QS_ID:
            return {
                ...state,
                exam_data: {
                    ...state.exam_data,
                    question_sequence_id: action.qs_id
                }
            }

        case START_LOADING_QS:
            return {
                ...state,
                selected_qs_data_loading: true
            }
        case LOAD_QS_SUCCESS:
            return {
                ...state,
                selected_qs_data: action.qs_data,
                selected_qs_data_loading: false
            }

        case CHANGE_ACCESS_TYPE:
            return {
                ...state,
                access_type: action.access_type
            }

        case CHANGE_EXAM_ID:
            return {
                ...state,
                exam_id: action.exam_id
            }

        case LOAD_EXAM_DATA_SUCCESS:
            return {
                ...state,
                exam_data: action.exam_data,
                exam_data_loading: false
            }
        case START_LOADING_EXAM_DATA:
            return {
                ...state,
                exam_data_loading: true
            }


        default:
            return state;
    }

}
