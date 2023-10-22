import {createAsyncThunk} from '@reduxjs/toolkit'
import axiosClient from "../../../ServerLayer/QueryLayer/config";

export const loadAllUsersAsync = createAsyncThunk(
    'statusEditor/loadAllUsers',
    async () => {
        const res = await axiosClient.get<{ allUsers: User[] }>("/user/all/data")
        return res.data.allUsers;
    })

export interface UsersUserprofile {
    firstname: string;
    lastname: string;
}

export interface User {
    id: number;
    username: string;
    user_access_level: string;
    users_userprofile: UsersUserprofile;
}

export const searchUserAsync = createAsyncThunk(
    'statusEditor/searchUser',
    async (searchQuery: string, T) => {
        const res = await axiosClient.get<User[]>(`/user/search?search=${searchQuery}`)
        return res.data;
    }
)
export const updateUserStatusAsync = createAsyncThunk(
    'statusEditor/updateUserStatus',
    async ({user_id, user_access_level}: { user_id: number, user_access_level: string }) => {
        const res = await axiosClient.post<{ updatedUser: User }>(`/user/status/update`, {user_id, user_access_level})
        return res.data.updatedUser;
    }
)
