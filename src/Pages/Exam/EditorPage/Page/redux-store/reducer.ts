import {initialState} from "./initial-state";
import produce from "immer";
import {
    CHANGE_EXAM_NAME_FOR_CREATE,
    CHANGE_EXAM_QS_ID_FOR_CREATE,
    CHANGE_IS_OPEN_CREATE_EXAM_DIALOG,
    CLOSE_DIALOG_AND_CLEAR_CREATE_DATA,
    CREATE_EXAM_ERROR,
    CREATE_EXAM_PENDING,
    CREATE_EXAM_SUCCESS,
    LOAD_MY_EXAMS_ERROR,
    LOAD_MY_EXAMS_SUCCESS,
    LOAD_QS_DATA_SUCCESS,
    START_LOADING_MY_EXAMS
} from "./action-types";
import {ActionType} from "typesafe-actions";
import * as Actions from "./actions";

export type IActionsType = ActionType<typeof Actions>;

export const examEditorPageReducer = produce((state: typeof initialState = initialState, action: IActionsType) => {
        switch (action.type) {

            case START_LOADING_MY_EXAMS:
                state.loading_exams = false;
                break;

            case LOAD_MY_EXAMS_SUCCESS:
                state.loading_exams = false;
                state.exams = action.payload.exams;
                break;

            case LOAD_MY_EXAMS_ERROR:
                state.loading_exams = false;
                state.exams_load_error = action.payload.error;
                break;

            case CHANGE_EXAM_NAME_FOR_CREATE:
                state.exam_name_for_create = action.payload;
                break;

            case CHANGE_EXAM_QS_ID_FOR_CREATE:
                state.exam_qs_id_for_create = action.payload;
                break;

            case CHANGE_IS_OPEN_CREATE_EXAM_DIALOG:
                state.is_open_create_exam_dialog = action.payload;
                break;

            case LOAD_QS_DATA_SUCCESS:
                state.selected_qs_data = action.payload;
                break

            case CREATE_EXAM_PENDING:
                state.create_exam_pending = true;
                break;

            case CREATE_EXAM_SUCCESS:
                state.create_exam_pending = false;
                break

            case CREATE_EXAM_ERROR:
                state.create_exam_pending = false;
                break

            case CLOSE_DIALOG_AND_CLEAR_CREATE_DATA:
                state.is_open_create_exam_dialog = false;
                state.exam_name_for_create = "";
                state.exam_qs_id_for_create = null;
                break;

            default:
                return state
        }
    }
)
