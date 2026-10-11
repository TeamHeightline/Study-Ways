import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadMyProfile, updateProfile } from './async-acrions';
import { IProfile } from './types';
const profileSlice = createSlice({
  name: 'profileSlice',
  initialState: {
    profileData: null as IProfile | null,
    savedProfileData: null as IProfile | null,
    pending: true,
    pendingUpdate: false,
    loadError: false,
    saveError: false,
    saved: false,
  },
  reducers: {
    changeProfileData(
      state,
      action: PayloadAction<{
        key: keyof IProfile;
        value: IProfile[keyof IProfile];
      }>,
    ) {
      if (!state.profileData || state.pendingUpdate) return;
      state.profileData = {
        ...state.profileData,
        [action.payload.key]: action.payload.value,
      };
      state.saved = false;
      state.saveError = false;
    },
    resetProfileChanges(state) {
      if (!state.pendingUpdate) {
        state.profileData = state.savedProfileData;
        state.saveError = false;
        state.saved = false;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(loadMyProfile.pending, state => {
      state.pending = true;
      state.loadError = false;
    });
    builder.addCase(loadMyProfile.fulfilled, (state, action) => {
      state.profileData = action.payload;
      state.savedProfileData = action.payload;
      state.pending = false;
    });
    builder.addCase(loadMyProfile.rejected, state => {
      state.pending = false;
      state.loadError = true;
    });
    builder.addCase(updateProfile.pending, state => {
      state.pendingUpdate = true;
      state.saveError = false;
      state.saved = false;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.pendingUpdate = false;
      state.savedProfileData = action.meta.arg;
      state.saved = true;
    });
    builder.addCase(updateProfile.rejected, state => {
      state.pendingUpdate = false;
      state.saveError = true;
    });
  },
});
export default profileSlice.reducer;
export const { changeProfileData, resetProfileChanges } = profileSlice.actions;
