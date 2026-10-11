import { executeMutation } from '../../../shared/server-layer/query-layer/execute-mutation';
import { writeApi } from '../../../shared/server-layer/query-layer/write-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../shared/server-layer/query-layer/config';

export const loadMyProfile = createAsyncThunk('loadMyProfile', async () =>
  axiosClient.get<IProfile>('/page/profile/my-profile').then(res => res.data),
);

import { IProfile } from './types';

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (profileData: IProfile) =>
    executeMutation(writeApi.endpoints.saveProfile.initiate(profileData)),
);
