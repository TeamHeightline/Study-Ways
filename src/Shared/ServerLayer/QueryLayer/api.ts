import { createApi } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosClient from './config';

export interface ApiError {
  status: number | 'FETCH_ERROR';
  data: unknown;
}

// Reuse the application's Axios client, including its authentication interceptor.
const axiosBaseQuery: BaseQueryFn<
  AxiosRequestConfig,
  unknown,
  ApiError
> = async (args, { signal }) => {
  try {
    const response = await axiosClient.request({ ...args, signal });
    return { data: response.data };
  } catch (error) {
    const requestError = error as AxiosError;
    return {
      error: {
        status: requestError.response?.status ?? 'FETCH_ERROR',
        data: requestError.response?.data ?? requestError.message,
      },
    };
  }
};

export const studyWaysApi = createApi({
  reducerPath: 'studyWaysApi',
  baseQuery: axiosBaseQuery,
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
});
