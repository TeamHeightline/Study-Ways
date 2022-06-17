import produce from "immer";
import {initialState} from "./initial-state";
import * as Actions from "./actions";
import {ActionType} from "typesafe-actions";

import * as ActionTypes from "./action-types";

export type ExamResultsByIDAction = ActionType<typeof Actions>;

export const examResultsByIDReducer = produce((state: typeof initialState = initialState, action: ExamResultsByIDAction) => {
    switch (action.type) {


        case ActionTypes.START_LOADING_EXAM_RESULTS:
            state.loading_exam_results = true;
            break;

        case ActionTypes.EXAM_RESULTS_LOAD_SUCCESS:
            state.loading_exam_results = false;
            state.exam_results = action.payload;
            break;

        case ActionTypes.EXAM_RESULTS_LOAD_FAIL:
            state.loading_exam_results = false;
            state.exam_results_load_error = action.payload;
            break;

        case ActionTypes.CHANGE_EXAM_ID:
            state.exam_id = action.payload;
            break;

        default:
            return state;
    }
})
