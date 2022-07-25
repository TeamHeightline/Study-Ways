import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadExamDataThunk, loadQSDataThunk, updateExamThunk} from "./async-actions";
import {sequenceDataI} from "../../../../../../ServerLayer/Types/question-sequence.type";

const examEditorSlice = createSlice({
    name: "examEditor",
    initialState: {
        selected_qs_data: null as null | sequenceDataI,
        selected_qs_data_loading: true,
        selected_qs_data_error: null,

        exam_data: null as null | IExamData,
        exam_data_loading: true,
        exam_data_error: null,
        exam_id: null as null | string,

        update_exam_loading: false,
        update_exam_error: null,
    },
    reducers: {
        changeExamId: (state, action: PayloadAction<string>) => {
            state.exam_id = action.payload;
        },
        changeAccessMode: (state, action: PayloadAction<"manual" | "timeInterval">) => {
            if (state.exam_data) {
                state.exam_data.access_mode = action.payload;
            }
        },
        changeExamName: (state, action: PayloadAction<string>) => {
            if (state.exam_data) {
                state.exam_data.name = action.payload;
            }
        },
        changeExamMinutes: (state, action: PayloadAction<number>) => {
            if (state.exam_data) {
                state.exam_data.minutes = action.payload;
            }
        },
        prepareForUpdateExamData: (state) => {
            state.update_exam_loading = true;
        }
    },
    extraReducers: {


        //Загрузка данных серии вопросов
        [loadQSDataThunk.pending.type]: (state, action) => {
            state.selected_qs_data_loading = true;
            state.selected_qs_data = null;
            state.selected_qs_data_error = null;
        },
        [loadQSDataThunk.fulfilled.type]: (state, action) => {
            state.selected_qs_data_loading = false;
            state.selected_qs_data = action.payload;
        },
        [loadQSDataThunk.rejected.type]: (state, action) => {
            state.selected_qs_data_loading = false;
            state.selected_qs_data_error = action.payload;
        },


        //Загрузка данных экзамена
        [loadExamDataThunk.pending.type]: (state, action) => {
            state.exam_data_loading = true;
            state.exam_data = null;
        },
        [loadExamDataThunk.fulfilled.type]: (state, action) => {
            state.exam_data = action.payload;
            state.exam_data_loading = false;
        },
        [loadExamDataThunk.rejected.type]: (state, action) => {
            state.exam_data_loading = false;
            state.exam_data_error = action.payload;
        },


        //Обновление данных экзамена
        [updateExamThunk.pending.type]: (state, action) => {
            state.update_exam_loading = true;
        },
        [updateExamThunk.fulfilled.type]: (state, action) => {
            state.update_exam_loading = false;
        },
        [updateExamThunk.rejected.type]: (state, action) => {
            state.update_exam_loading = false;
            state.update_exam_error = action.payload;
        }

    }
})


export interface IExamData {
    "id": string,
    "name": string,
    "start_at": string,
    "end_at": string,
    "access_mode": "manual" | "timeInterval",
    "uid": string,
    "created_by_id": string,
    "minutes": number,
    question_sequence_id: number
}

export default examEditorSlice.reducer;

export const {
    changeExamId,
    changeExamName,
    changeExamMinutes,
    changeAccessMode,
    prepareForUpdateExamData
} = examEditorSlice.actions;