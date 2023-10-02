import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";

export const createOrUpdateHelpArticle = createAsyncThunk(
    'helpArticleEditorPage/createHelpArticle',
    async (data: any) => {
        return axiosClient.post(`page/help-article/create`, data)
            .then((res) => res.data)
    }
)
