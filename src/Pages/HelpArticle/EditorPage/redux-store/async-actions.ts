import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../../ServerLayer/QueryLayer/config";

export const createHelpArticle = createAsyncThunk(
    'helpArticleEditorPage/createHelpArticle',
    async (data: any) => {
        return axiosClient.post(`page/help-article/create`, data)
            .then((res) => res.data)
    }
)

export const updateHelpArticle = createAsyncThunk(
    "helpArticleEditorPage/updateHelpArticle",
    async (data: any) => {
        return axiosClient.post(`page/help-article/update`, data)
            .then((res) => res.data)
    }
)
