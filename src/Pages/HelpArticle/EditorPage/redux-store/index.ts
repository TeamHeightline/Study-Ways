import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createHelpArticle,
  deleteHelpArticle,
  updateHelpArticle,
} from "./async-actions";
import { IHelpArticle } from "../../HelpArticleByURL/redux-store/types";
import { getArticles } from "../../HelpArticleByURL/redux-store/async-actions";

interface ICreateOrUpdateArticle {
  id?: string;
  title: string;
  url: string;
  content: string;
  video_url: string;
}

const default_create_or_update_article_data: ICreateOrUpdateArticle = {
  title: "",
  url: "",
  content: "",
  video_url: "",
};
const helpArticleEditorPageSlice = createSlice({
  name: "helpArticleEditorPage",
  initialState: {
    is_open_create_dialog: false,
    is_loading_create_article: false,
    create_or_update_article_data: default_create_or_update_article_data,

    articles: [] as IHelpArticle[],
  },
  reducers: {
    openCreateDialog: (state) => {
      state.is_open_create_dialog = true;
      state.create_or_update_article_data =
        default_create_or_update_article_data;
    },
    closeCreateDialog: (state) => {
      state.is_open_create_dialog = false;
    },
    changeCreateArticleData: (
      state,
      action: PayloadAction<{ field: string; value: any }>,
    ) => {
      const { field, value } = action.payload;
      state.create_or_update_article_data[field] = value;
    },
    openEditDialog: (state, action: PayloadAction<IHelpArticle>) => {
      state.create_or_update_article_data = action.payload;
      state.is_open_create_dialog = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createHelpArticle.pending, (state) => {
      state.is_loading_create_article = true;
      state.is_open_create_dialog = false;
    });
    builder.addCase(createHelpArticle.rejected, (state) => {
      state.is_loading_create_article = false;
      state.is_open_create_dialog = true;
    });
    builder.addCase(createHelpArticle.fulfilled, (state) => {
      state.is_loading_create_article = false;
      state.is_open_create_dialog = false;
      state.create_or_update_article_data =
        default_create_or_update_article_data;
    });

    builder.addCase(updateHelpArticle.pending, (state) => {
      state.is_loading_create_article = true;
      state.is_open_create_dialog = false;
    });
    builder.addCase(updateHelpArticle.rejected, (state) => {
      state.is_loading_create_article = false;
      state.is_open_create_dialog = true;
    });
    builder.addCase(updateHelpArticle.fulfilled, (state) => {
      state.is_loading_create_article = false;
      state.is_open_create_dialog = false;
      state.create_or_update_article_data =
        default_create_or_update_article_data;
    });
    builder.addCase(getArticles.fulfilled, (state, action) => {
      state.articles = action.payload;
    });
    builder.addCase(deleteHelpArticle.pending, (state, action) => {
      state.articles = state.articles.filter(
        (article) => Number(article.id) != action.meta.arg,
      );
    });
  },
});

export const {
  closeCreateDialog,
  changeCreateArticleData,
  openEditDialog,
  openCreateDialog,
} = helpArticleEditorPageSlice.actions;
export default helpArticleEditorPageSlice.reducer;
