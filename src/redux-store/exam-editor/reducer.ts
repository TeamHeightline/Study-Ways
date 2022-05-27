import {initialState} from "./initial-state";
import {
    EXAM_EDITOR_CHANGE_ACCESS_TYPE,
    EXAM_EDITOR_CHANGE_SELECTED_QS_ID,
    EXAM_EDITOR_LOAD_QS_SUCCESS,
    EXAM_EDITOR_START_LOADING_QS
} from "../ActionTypes";

export const examEditorReducer = (state = initialState, action) => {
    switch (action.type) {
        case EXAM_EDITOR_CHANGE_SELECTED_QS_ID:
            return {
                ...state,
                selected_qs_id: action.qs_id
            }
        case EXAM_EDITOR_START_LOADING_QS:
            return {
                ...state,
                selected_qs_data_loading: true
            }
        case EXAM_EDITOR_LOAD_QS_SUCCESS:
            return {
                ...state,
                selected_qs_data: action.qs_data,
                selected_qs_data_loading: false
            }

        case EXAM_EDITOR_CHANGE_ACCESS_TYPE:
            return {
                ...state,
                access_type: action.access_type
            }

        default:
            return state;
    }

}
