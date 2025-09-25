import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";

export const loadAllCardsData = createAsyncThunk(
  "AllCardsForMicroView",
  async () =>
    axiosClient.get("/page/card-micro-view/all").then((res) => res.data),
);
