import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";

export const getArticles = createAsyncThunk(
  "articleByURL/getArticles",
  async () =>
    axiosClient.get("page/help-article/get-articles").then((res) => res.data),
);
