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

        case ActionTypes.CREATE_ARRAY_FOR_CHART:
            state.result_array_for_chart =
                state.exam_results
                    .map((result) => result.sumOfAllPasses)
                    .sort((a, b) => a - b)
                    .map((result, index) => {
                        return ({index, result})
                    });
            break;

        case ActionTypes.CREATE_EXAM_RESULTS_ORDER_BY_SUM:
            state.exam_results_order_by_sum = JSON.parse(JSON.stringify(state.exam_results))

            state.exam_results_order_by_sum.sort((a, b) => Number(b.sumOfAllPasses) - Number(a.sumOfAllPasses))
            break


        case ActionTypes.CHANGE_SHOW_RESULTS_BY_SUM:
            state.show_results_by_sum = !state.show_results_by_sum;
            break;


        default:
            return state;
    }
})
