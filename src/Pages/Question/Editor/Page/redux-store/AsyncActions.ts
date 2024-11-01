import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";

type loadQuestionsThunkType = {
    ordering_by_created_at: "asc" | "desc",
    show_only_filled_questions: boolean
}
export const loadQuestionsThunk = createAsyncThunk(
    'questionEditorPage/loadQuestions',
    async ({ordering_by_created_at, show_only_filled_questions = false}: loadQuestionsThunkType
    ) => {
        return axiosClient.get('/page/question-editor-page/my-questions', {
            params: {
                ordering_by_created_at,
                show_only_filled_questions
            }
        }).then(res => res.data)
    }
)

export const loadAuthorsThunk = createAsyncThunk(
    'questionEditorPage/loadAuthors',
    async () => {
        return axiosClient.get('/page/question-editor-page/authors').then(res => res.data)
    }
)
