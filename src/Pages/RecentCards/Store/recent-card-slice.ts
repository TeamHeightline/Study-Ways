import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadRecentCardsThunk } from "./async-actions";

const initialState = {
  recent_card_id_array: [] as number[],
  unique_recent_card_id_array: [] as number[],
  is_loading_recent_card_id_array: true,
  is_hide_duplicates: true,
};

const recentCardSlice = createSlice({
  name: "recentCardPage",
  initialState,
  reducers: {
    setIsHideDuplicates: (state, action: PayloadAction<boolean>) => {
      state.is_hide_duplicates = action.payload;
    },
  },
  extraReducers: {
    [loadRecentCardsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<number[]>,
    ) => {
      state.recent_card_id_array = action.payload;
      state.unique_recent_card_id_array = [...new Set(action.payload)];
      state.is_loading_recent_card_id_array = false;
    },
    [loadRecentCardsThunk.pending.type]: (state) => {
      state.is_loading_recent_card_id_array = true;
    },
    [loadRecentCardsThunk.rejected.type]: (state) => {
      state.is_loading_recent_card_id_array = false;
    },
  },
});

export const { setIsHideDuplicates } = recentCardSlice.actions;
export default recentCardSlice.reducer;
