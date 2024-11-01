import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../Shared/ServerLayer/QueryLayer/config";

export const loadMyProfile = createAsyncThunk("loadMyProfile",
    async () => {
        return axiosClient.get<IProfile>("/page/profile/my-profile")
            .then((res) => res.data)
    })

import {IProfile} from "./types";


export const updateProfile = createAsyncThunk(
    "updateProfile",
    async (profileData: IProfile) => {
        return axiosClient.post("/page/profile/update-profile", {profileData})
            .then((res) => res.data)
    }
)