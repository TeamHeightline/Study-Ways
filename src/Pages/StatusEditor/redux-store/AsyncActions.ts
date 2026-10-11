import { executeMutation } from '../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../Shared/ServerLayer/QueryLayer/write-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import {
  IBasicUserInformation,
  user_access_level,
} from '../../../Shared/ServerLayer/Types/user.types';

export const loadAllUsersAsync = createAsyncThunk(
  'statusEditor/loadAllUsers',
  async () => {
    const res = await axiosClient.get<{ allUsers: IBasicUserInformation[] }>(
      '/user/all/data',
    );
    return res.data.allUsers;
  },
);

export const updateUserStatusAsync = createAsyncThunk(
  'statusEditor/updateUserStatus',
  async ({
    user_id,
    user_access_level,
  }: {
    user_id: number;
    user_access_level: user_access_level;
  }) => {
    const updatedUser = await executeMutation(
      writeApi.endpoints.setUserRole.initiate({
        id: user_id,
        role: user_access_level,
      }),
    );
    if (!updatedUser?.id) throw new Error('No updated user returned');
    return updatedUser;
  },
);
