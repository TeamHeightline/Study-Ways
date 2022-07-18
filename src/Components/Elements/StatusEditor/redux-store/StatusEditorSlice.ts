import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {IBasicUserInformation} from "../../../../ServerLayer/Types/user.types";
import {loadAllUsersAsync, searchUserAsync} from './AsyncActions';

const initialState = {
    is_users_loading: true,
    is_users_loading_error: false,
    users: [] as IBasicUserInformation[],
    searchString: '',
    selectedUser: null as IBasicUserInformation | null,
}

const statusEditorSlice = createSlice({
    name: 'statusEditor',
    initialState,
    reducers: {
        changeSearchString: (state, action: PayloadAction<string>) => {
            state.searchString = action.payload;
        },
        changeSelectedUser: (state, action: PayloadAction<number | null>) => {
            const selectedUser = state.users.find(user => user.id === action.payload)
            if (selectedUser) {
                state.selectedUser = selectedUser;
            }
        },
        cancelUserEdit: (state) => {
            state.selectedUser = null;
        }
    },
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
        },
        [searchUserAsync.fulfilled.type]: (state, action: PayloadAction<IBasicUserInformation[]>) => {
            state.is_users_loading = false
            state.is_users_loading_error = false
            state.users = action.payload
        },
        [searchUserAsync.rejected.type]: (state, action: PayloadAction<string>) => {
            state.is_users_loading = false
            state.is_users_loading_error = true
            state.users = []
        },

    }
})

export const {changeSearchString, changeSelectedUser, cancelUserEdit} = statusEditorSlice.actions;
export default statusEditorSlice.reducer
