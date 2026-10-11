import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../../../shared/server-layer/query-layer/config';
import { ICourseData } from './types';

export const loadCourseDataThunk = createAsyncThunk(
  'coursePage/loadCourseData',
  async (search?: string) =>
    axiosClient
      .get<
        ICourseData[]
      >(!search ? '/page/course' : `/page/course?search=${search}`)
      .then((res) => res.data),
);
