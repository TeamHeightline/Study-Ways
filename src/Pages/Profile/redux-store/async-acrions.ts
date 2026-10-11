import { executeMutation } from '../../../Shared/ServerLayer/QueryLayer/execute-mutation';
import { writeApi } from '../../../Shared/ServerLayer/QueryLayer/write-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';

export const loadMyProfile = createAsyncThunk('loadMyProfile', async () =>
  axiosClient.get<IProfile>('/page/profile/my-profile').then(res => res.data),
);

import { IProfile } from './types';

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (profileData: IProfile) =>
    executeMutation(writeApi.endpoints.saveProfile.initiate(profileData)),
);
