import {createSlice} from "@reduxjs/toolkit";
import {loadQuestionsThunk} from "./AsyncActions";

interface IQuestion {
    id: number,
    text: string,
    sumOfAnswersReports: number
}

const initialState = {
    questions: [] as IQuestion[],
    is_pending_questions: true,
    is_loading_questions_error: false,

    show_only_filled_questions: false,
    ordering_by_created_at: 'desc' as 'asc' | 'desc',

    is_open_create_question_dialog: false,
    is_new_question_now_creating: false,
}

const questionEditorPageSlice = createSlice({
    name: 'questionEditorPage',
    initialState: initialState,
    reducers: {
        changeShowOnlyFilledQuestions: (state) => {
            state.show_only_filled_questions = !state.show_only_filled_questions
        },
        changeOrderingByCreatedAt: (state) => {
            state.ordering_by_created_at = state.ordering_by_created_at === 'asc' ? 'desc' : 'asc'
        },
        openCreateQuestionDialog: (state) => {
            state.is_open_create_question_dialog = true
        },
        closeCreateQuestionDialog: (state) => {
            state.is_open_create_question_dialog = false
        },
        startCreatingNewQuestion: (state) => {
            state.is_new_question_now_creating = true
        },
        finishCreatingNewQuestion: (state) => {
            state.is_new_question_now_creating = false
        }
    },
    extraReducers: {
        [loadQuestionsThunk.pending.type]: (state) => {
            state.is_pending_questions = true
            state.is_loading_questions_error = false
        },
        [loadQuestionsThunk.fulfilled.type]: (state, action) => {
            state.questions = action.payload
            state.is_pending_questions = false
            state.is_loading_questions_error = false
        },
        [loadQuestionsThunk.rejected.type]: (state) => {
            state.is_pending_questions = false
            state.is_loading_questions_error = true
        }
    }
})


export default questionEditorPageSlice.reducer;
export const {
    changeShowOnlyFilledQuestions,
    changeOrderingByCreatedAt,
    openCreateQuestionDialog,
    closeCreateQuestionDialog,
    startCreatingNewQuestion,
    finishCreatingNewQuestion
} = questionEditorPageSlice.actions;