import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';

export interface SelfStatisticPageData {
  ids: number[];
  activePage: number;
  numPages: number;
}

interface SelfStatisticPageRequest {
  page: number;
  // Partition private data by account in the cache. The server uses the JWT.
  userId: number;
}

export const selfStatisticApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['SelfStatistic'] })
  .injectEndpoints({
    endpoints: builder => ({
      getSelfStatisticPage: builder.query<
        SelfStatisticPageData,
        SelfStatisticPageRequest
      >({
        query: ({ page }) => ({
          url: '/page/self-statistic',
          params: { page },
        }),
        providesTags: ['SelfStatistic'],
        keepUnusedDataFor: 0,
      }),
    }),
  });

export const { useGetSelfStatisticPageQuery } = selfStatisticApi;
