import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {IBasicUserInformation} from "../../../../ServerLayer/Types/user.types";
import {loadAllUsersAsync} from './AsyncActions';

const initialState = {
    is_users_loading: true,
    is_users_loading_error: false,
    users: [] as IBasicUserInformation[],
}

const statusEditorSlice = createSlice({
    name: 'statusEditor',
    initialState,
    reducers: {},
    extraReducers: {
        [loadAllUsersAsync.pending.type]: (state) => {
            state.is_users_loading = true
            state.is_users_loading_error = false
        },
        [loadAllUsersAsync.fulfilled.type]: (state, action: PayloadAction<IBasicUserInformation[]>) => {
            state.is_users_loading = false
            state.is_users_loading_error = false
            state.users = action.payload
        },
        [loadAllUsersAsync.rejected.type]: (state, action: PayloadAction<string>) => {
            state.is_users_loading = false
            state.is_users_loading_error = true
            state.users = []
        }
    }
})


export default statusEditorSlice.reducer
