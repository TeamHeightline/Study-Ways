import { createSlice } from "@reduxjs/toolkit";
import { getArticles } from "./async-actions";
import { IHelpArticle } from "./types";

const helpArticleByURLSlice = createSlice({
  name: "articleByURL",
  initialState: {
    articles: [] as IHelpArticle[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArticles.fulfilled, (state, action) => {
      state.articles = action.payload;
    });
  },
});

export default helpArticleByURLSlice.reducer;
