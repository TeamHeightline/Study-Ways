import { studyWaysApi } from '../../../../Shared/ServerLayer/QueryLayer/api';

export interface CardSearchParams {
  page: number;
  search: string;
  authorId?: number;
  themeId?: number;
  hardLevel?: number;
  contentType?: number;
  mine: boolean;
  userId?: number;
}
export const cardSelectorApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['CardList'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCardSelectorPage: builder.query<
        { IDs: string[]; activePage: number; numPages: number },
        CardSearchParams
      >({
        query: ({ mine, userId, ...params }) => ({
          url: mine ? '/page/card-selector/my' : '/page/card-selector',
          params,
        }),
        providesTags: ['CardList'],
      }),
    }),
  });
export const { useGetCardSelectorPageQuery } = cardSelectorApi;
