import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  IBasicUserInformation,
  user_access_level,
} from '../../../Shared/ServerLayer/Types/user.types';
import { loadAllUsersAsync, updateUserStatusAsync } from './AsyncActions';

const initialState = {
  is_users_loading: true,
  is_users_loading_error: false,
  users: [] as IBasicUserInformation[],
  searchString: '',
  selectedUser: null as IBasicUserInformation | null,
  pending_update_user_status: false,
  update_user_status_error: false,
  loadRequestId: undefined as string | undefined,
};

const statusEditorSlice = createSlice({
  name: 'statusEditor',
  initialState,
  reducers: {
    changeSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
    changeSelectedUser: (state, action: PayloadAction<number>) => {
      if (state.pending_update_user_status) return;
      const user = state.users.find(user => user.id === action.payload);
      state.selectedUser = user ? { ...user } : null;
      state.update_user_status_error = false;
    },
    cancelUserEdit: state => {
      if (state.pending_update_user_status) return;
      state.selectedUser = null;
      state.update_user_status_error = false;
    },
    changeSelectedUserStatus: (
      state,
      action: PayloadAction<user_access_level>,
    ) => {
      if (state.selectedUser && !state.pending_update_user_status) {
        state.selectedUser.user_access_level = action.payload;
        state.update_user_status_error = false;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAllUsersAsync.pending, (state, action) => {
        state.is_users_loading = true;
        state.is_users_loading_error = false;
        state.loadRequestId = action.meta.requestId;
      })
      .addCase(loadAllUsersAsync.fulfilled, (state, action) => {
        if (state.loadRequestId !== action.meta.requestId) return;
        state.is_users_loading = false;
        state.is_users_loading_error = false;
        state.users = action.payload;
      })
      .addCase(loadAllUsersAsync.rejected, (state, action) => {
        if (state.loadRequestId !== action.meta.requestId) return;
        state.is_users_loading = false;
        state.is_users_loading_error = true;
      })
      .addCase(updateUserStatusAsync.pending, state => {
        state.pending_update_user_status = true;
        state.update_user_status_error = false;
      })
      .addCase(updateUserStatusAsync.fulfilled, (state, action) => {
        state.pending_update_user_status = false;
        state.update_user_status_error = false;
        state.users = state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user,
        );
      })
      .addCase(updateUserStatusAsync.rejected, state => {
        state.pending_update_user_status = false;
        state.update_user_status_error = true;
      });
  },
});

export const {
  changeSearchString,
  changeSelectedUser,
  cancelUserEdit,
  changeSelectedUserStatus,
} = statusEditorSlice.actions;
export default statusEditorSlice.reducer;
