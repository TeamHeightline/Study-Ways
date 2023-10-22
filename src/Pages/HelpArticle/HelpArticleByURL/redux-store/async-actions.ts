import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../../ServerLayer/QueryLayer/config";

export const getArticles = createAsyncThunk("articleByURL/getArticles", async () => {
    return axiosClient.get("page/help-article/get-articles")
        .then((res) => res.data)
})
