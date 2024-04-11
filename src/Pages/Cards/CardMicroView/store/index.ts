import {createSlice} from "@reduxjs/toolkit";
import {loadAllCardsData} from "./async-actions";
import {CardHashMap} from "./type";

const cardMicroViewSlice = createSlice({
    name: "CardMicroView",
    initialState: {
        card_hash_map: {} as CardHashMap
    },
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(loadAllCardsData.fulfilled, (state, action) => {
                //state.card_hash_map = action.payload
            })
})

export default cardMicroViewSlice.reducer
