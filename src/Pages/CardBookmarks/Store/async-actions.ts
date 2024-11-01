import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../Shared/ServerLayer/QueryLayer/config";

export const loadCardBookmarks = createAsyncThunk("cardBookmarksSlice/loadCardBookmarks",
    () => {
        return axiosClient.get("page/personal-cabinet/my-bookmarks")
            .then((res) => res.data)
    })
