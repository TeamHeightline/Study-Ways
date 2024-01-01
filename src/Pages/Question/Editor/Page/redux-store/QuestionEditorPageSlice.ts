import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadAuthorsThunk, loadQuestionsThunk} from "./AsyncActions";

interface IQuestion {
    id: number,
    created_by_id: number,
    text: string,
    sumOfAnswersReports: number
}

interface IAuthors {
    id: number,
    username: string,
    users_userprofile: {
        firstname: string,
        lastname: string
    }

}

const initialState = {
    questions: [] as IQuestion[],

    authors: [] as IAuthors[],

    author_filter: "my" as "my" | "all" | string,

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
        },
        changeAuthorFilter: (state, action) => {
            state.author_filter = action.payload
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
        },
        [loadAuthorsThunk.fulfilled.type]: (state, action) => {
            state.authors = action.payload
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
    finishCreatingNewQuestion,
    changeAuthorFilter
} = questionEditorPageSlice.actions;