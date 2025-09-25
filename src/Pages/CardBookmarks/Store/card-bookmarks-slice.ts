import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCardBookmarks } from "./async-actions";

const initialState = {
  is_loading_card_bookmarks: true,
  card_bookmarks_id_array: [] as number[],
};

const cardBookmarksSlice = createSlice({
  name: "cardBookmarksSlice",
  initialState,
  reducers: {},
  extraReducers: {
    [loadCardBookmarks.pending.type]: (state) => {
      state.is_loading_card_bookmarks = true;
    },
    [loadCardBookmarks.fulfilled.type]: (
      state,
      action: PayloadAction<number[]>,
    ) => {
      state.card_bookmarks_id_array = action.payload;
      state.is_loading_card_bookmarks = false;
    },
    [loadCardBookmarks.rejected.type]: (state) => {
      state.is_loading_card_bookmarks = false;
    },
  },
});

export default cardBookmarksSlice.reducer;
