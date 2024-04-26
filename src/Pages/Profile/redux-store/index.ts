import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadMyProfile, updateProfile} from "./async-acrions";
import {IProfile} from "./types";

const profileSlice = createSlice({
    name: "profileSlice",
    initialState: {
        profileData: null as null | IProfile,
        pending: true,

        pendingUpdate: false
    },
    reducers: {
        changeProfileData(state, action: PayloadAction<{ key: keyof IProfile, value: IProfile[keyof IProfile] }>) {
            if (!state.profileData) {
                return
            }
            const {key, value} = action.payload

            state.profileData = {
                ...state.profileData,
                [key]: value
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(loadMyProfile.fulfilled, (state, action) => {
            state.profileData = action.payload
            state.pending = false
        })
        builder.addCase(updateProfile.pending, (state) => {
            state.pendingUpdate = true
        })
        builder.addCase(updateProfile.fulfilled, state => {
            state.pendingUpdate = false
        })
    }
})
export default profileSlice.reducer

export const {changeProfileData} = profileSlice.actions