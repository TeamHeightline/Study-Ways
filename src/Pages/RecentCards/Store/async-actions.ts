import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../Shared/ServerLayer/QueryLayer/config";

export const loadRecentCardsThunk = createAsyncThunk(
  "recentCardPage/loadRecentCards",
  async (number_of_cards?: number) =>
    axiosClient
      .get("page/personal-cabinet/my-card-history", {
        data: {
          number_of_cards,
        },
      })
      .then((res) => res.data),
);
