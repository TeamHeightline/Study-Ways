import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserGroup } from "./types";

const defaultUserGroup = {
  name: "",
};

const userGroupEditorPageSlice = createSlice({
  name: "userGroupEditorPage",
  initialState: {
    is_open_delete_modal: false,

    create_or_update_dialog: {
      is_open: false,
      data: defaultUserGroup,
    },
  },
  reducers: {
    setIsOpenDeleteModal: (state, action) => {
      state.is_open_delete_modal = action.payload;
    },
    openUpdateDialog: (state, action: PayloadAction<UserGroup>) => {
      state.create_or_update_dialog.is_open = true;
      state.create_or_update_dialog.data = action.payload;
    },
    openCreateDialog: (state) => {
      state.create_or_update_dialog.is_open = true;
      state.create_or_update_dialog.data = defaultUserGroup;
    },
    closeCreateOrUpdateDialog: (state) => {
      state.create_or_update_dialog.is_open = false;
      state.create_or_update_dialog.data = defaultUserGroup;
    },
  },
});

export const {
  setIsOpenDeleteModal,
  openUpdateDialog,
  openCreateDialog,
  closeCreateOrUpdateDialog,
} = userGroupEditorPageSlice.actions;

export default userGroupEditorPageSlice.reducer;
