import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadExamDataThunk, loadQSDataThunk, updateExamThunk} from "./async-actions";
import {sequenceDataI} from "../../../../../../ServerLayer/Types/question-sequence.type";
import CryptoJS from "crypto-js";

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

        original_password: '',
    },
    reducers: {
        changeAccessMode: (state, action: PayloadAction<IExamData['access_mode']>) => {
            if (state.exam_data) {
                state.exam_data.access_mode = action.payload;
            }
        },
        changeExamName: (state, action: PayloadAction<string>) => {
            if (state.exam_data) {
                state.exam_data.name = action.payload;
            }
        },
        changeExamMinutes: (state, action: PayloadAction<IExamData['minutes']>) => {
            if (state.exam_data) {
                state.exam_data.minutes = action.payload;
            }
        },
        prepareForUpdateExamData: (state) => {
            state.update_exam_loading = true;
        },
        changeIsEnableHelpText: (state) => {
            if (state.exam_data) {
                state.exam_data.is_enable_help_text = !state.exam_data.is_enable_help_text
            }
        },
        changeHelpTextLevel: (state, action: PayloadAction<IExamData['help_text_level']>) => {
            if (state.exam_data) {
                state.exam_data.help_text_level = action.payload;
            }
        },
        changeIsEnableMaxQuestionAttempts: (state) => {
            if (state.exam_data) {
                state.exam_data.is_enable_max_question_attempts = !state.exam_data.is_enable_max_question_attempts
            }
        },
        changeMaxQuestionAttempts: (state, action: PayloadAction<IExamData['max_question_attempts']>) => {
            if (state.exam_data) {
                state.exam_data.max_question_attempts = action.payload;
            }
        },
        changeIsEnablePasswordCheck: (state) => {
            if (state.exam_data) {
                state.exam_data.is_enable_password_check = !state.exam_data.is_enable_password_check
            }
        },
        changeOriginalPassword: (state, action: PayloadAction<string>) => {
            if (state.exam_data) {
                state.original_password = action.payload;
            }
        },
        changePassword: (state, action: PayloadAction<string>) => {
            if (state.exam_data) {
                state.exam_data.password = action.payload;
            }
        },
        changeIsEnableStartAndFinishTime: (state) => {
            if (state.exam_data) {
                state.exam_data.is_enable_start_and_finish_time = !state.exam_data.is_enable_start_and_finish_time
            }
        }


    },
    extraReducers: {


        //Загрузка данных серии вопросов
        [loadQSDataThunk.pending.type]: (state) => {
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
        [loadExamDataThunk.pending.type]: (state) => {
            state.exam_data_loading = true;
            state.exam_data = null;
        },
        [loadExamDataThunk.fulfilled.type]: (state, action) => {
            state.exam_data = action.payload;
            if (action?.payload?.password) {
                state.original_password = CryptoJS.AES.decrypt(action.payload.password, "sw-secret-key").toString(CryptoJS.enc.Utf8)
            }
            state.exam_data_loading = false;
        },
        [loadExamDataThunk.rejected.type]: (state, action) => {
            state.exam_data_loading = false;
            state.exam_data_error = action.payload;
        },


        //Обновление данных экзамена
        [updateExamThunk.pending.type]: (state) => {
            state.update_exam_loading = true;
        },
        [updateExamThunk.fulfilled.type]: (state) => {
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
    "access_mode": "manual" | "timeInterval" | "open" | "closed" | "password",
    "uid": string,
    "created_by_id": string,
    "minutes": number,
    question_sequence_id: number,
    is_enable_help_text: boolean,
    is_enable_password_check: boolean,
    is_enable_start_and_finish_time: boolean,
    is_enable_max_question_attempts: boolean,
    help_text_level: 0 | 1 | 2,
    password: string | null,
    max_question_attempts: number,
}

export default examEditorSlice.reducer;

export const {
    changeExamName,
    changeExamMinutes,
    changeAccessMode,
    prepareForUpdateExamData,
    changeIsEnableHelpText,
    changeHelpTextLevel,
    changeIsEnableMaxQuestionAttempts,
    changeMaxQuestionAttempts,
    changeIsEnablePasswordCheck,
    changePassword,
    changeOriginalPassword
} = examEditorSlice.actions;
