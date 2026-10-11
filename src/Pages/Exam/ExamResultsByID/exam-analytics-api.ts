import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';

export const examAnalyticsApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getExamAnalyticsExport: builder.query<unknown, number>({
      query: id => ({ url: `/exam/analytics/cheating/${id}` }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazyGetExamAnalyticsExportQuery } = examAnalyticsApi;
