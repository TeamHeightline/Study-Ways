import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {IBasicUserInformation} from "../../../Shared/ServerLayer/Types/user.types";
import {loadAllUsersAsync, searchUserAsync, updateUserStatusAsync} from './AsyncActions';

const initialState = {
    is_users_loading: true,
    is_users_loading_error: false,
    users: [] as IBasicUserInformation[],
    searchString: '',
    selectedUser: null as IBasicUserInformation | null,
    pending_update_user_status: false,
    update_user_status_error: false,
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
        },
        changeSelectedUserStatus: (state, action: PayloadAction<"STUDENT" | "ADMIN" | "TEACHER">) => {
            if (state.selectedUser) {
                state.selectedUser.user_access_level = action.payload;
            }
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
        [updateUserStatusAsync.pending.type]: (state) => {
            state.pending_update_user_status = true
            state.update_user_status_error = false
        },
        [updateUserStatusAsync.fulfilled.type]: (state, action: PayloadAction<IBasicUserInformation>) => {
            state.pending_update_user_status = false
            state.update_user_status_error = false
            state.users = state.users.map(user => {
                    if (user.id === action.payload.id) {
                        return action.payload
                    }
                    return user
                }
            )
        },
        [updateUserStatusAsync.rejected.type]: (state, action: PayloadAction<string>) => {
            state.pending_update_user_status = false
            state.update_user_status_error = true
        }

    }
})

export const {
    changeSearchString,
    changeSelectedUser,
    cancelUserEdit,
    changeSelectedUserStatus
} = statusEditorSlice.actions;
export default statusEditorSlice.reducer
