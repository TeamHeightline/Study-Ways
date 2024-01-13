import {initialState} from "./initial-state";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IExamResult} from "../../../../ServerLayer/Types/exam.types";
import {loadExamResultsAsync} from "./async-actions";

const examResultsSlice = createSlice({
    name: 'examResults',
    initialState,
    reducers: {
        changeExamId(state, action: PayloadAction<number>) {
            state.exam_id = action.payload;
        },
        createArrayForChart(state) {
            state.result_array_for_chart = state.exam_results
                .map((result) => result.sumOfAllPasses)
                .sort((a, b) => a - b)
                .map((result, index) => ({index, result}));
        },
        createExamResultsOrderBySum(state) {
            state.exam_results_order_by_sum = [...state.exam_results]
                .sort((a, b) => b.sumOfAllPasses - a.sumOfAllPasses);
        },
        changeShowResultsBySum(state) {
            state.show_results_by_sum = !state.show_results_by_sum;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadExamResultsAsync.pending, (state) => {
                state.loading_exam_results = true;
            })
            .addCase(loadExamResultsAsync.fulfilled, (state, action: PayloadAction<IExamResult[]>) => {
                state.loading_exam_results = false;
                state.exam_results = action.payload;
            })
            .addCase(loadExamResultsAsync.rejected, (state, action: PayloadAction<any>) => {
                state.loading_exam_results = false;
                state.exam_results_load_error = action.payload;
            });
        // Можно добавить обработку других асинхронных экшенов
    },
});

export const {
    changeExamId,
    createArrayForChart,
    createExamResultsOrderBySum,
    changeShowResultsBySum,
} = examResultsSlice.actions;

export default examResultsSlice.reducer;