import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../Shared/ServerLayer/QueryLayer/config";

export const loadCardBookmarks = createAsyncThunk(
  "cardBookmarksSlice/loadCardBookmarks",
  () =>
    axiosClient
      .get("page/personal-cabinet/my-bookmarks")
      .then((res) => res.data),
);
