import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";

export const createHelpArticle = createAsyncThunk(
  "helpArticleEditorPage/createHelpArticle",
  async (data: any) =>
    axiosClient.post("page/help-article/create", data).then((res) => res.data),
);

export const updateHelpArticle = createAsyncThunk(
  "helpArticleEditorPage/updateHelpArticle",
  async (data: any) =>
    axiosClient.post("page/help-article/update", data).then((res) => res.data),
);

export const deleteHelpArticle = createAsyncThunk(
  "helpArticleEditorPage/deleteHelpArticle",
  async (id: number) =>
    axiosClient
      .post("page/help-article/delete", { id })
      .then((res) => res.data),
);
