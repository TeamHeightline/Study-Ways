import {initialState} from "./initial-state";
import produce from "immer";
import {LOAD_MY_EXAMS_ERROR, LOAD_MY_EXAMS_SUCCESS, START_LOADING_MY_EXAMS} from "./action-types";
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

            default:
                return state
        }
    }
)
