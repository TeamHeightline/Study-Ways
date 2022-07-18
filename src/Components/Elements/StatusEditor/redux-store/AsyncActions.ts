import {createAsyncThunk} from '@reduxjs/toolkit'
import {loadAllUsers} from '../../../../ServerLayer/QueryLayer/user.query'

export const loadAllUsersAsync = createAsyncThunk(
    'statusEditor/loadAllUsers',
    async () => {
        const res = await loadAllUsers();
        return res.data.allUsers;
    })
