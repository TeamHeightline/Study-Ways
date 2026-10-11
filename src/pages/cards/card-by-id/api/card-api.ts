import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
import { ICardData } from '../types/card-data';

export const cardApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['Card'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCard: builder.query<ICardData | null, number>({
        query: id => ({ url: `/page/card-by-id/card-data-by-id/${id}` }),
        providesTags: (_result, _error, id) => [{ type: 'Card', id }],
      }),
      getSimilarCards: builder.query<string[], { id: number; userId: string }>({
        query: ({ id, userId }) => ({
          url: `/page/card-by-id/${id}/similar`,
          params: { userId },
        }),
      }),
    }),
  });

export const { useGetCardQuery, useGetSimilarCardsQuery } = cardApi;
