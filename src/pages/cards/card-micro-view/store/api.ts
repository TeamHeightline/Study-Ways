import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
import { CardHashMap } from './type';

const emptyCards: CardHashMap = {};

export const cardPreviewsApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['Card', 'CardList'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCardPreviews: builder.query<CardHashMap, void>({
        query: () => ({ url: '/page/card-micro-view/all' }),
        providesTags: ['Card', 'CardList'],
      }),
    }),
  });

export const { useGetCardPreviewsQuery } = cardPreviewsApi;

export function useCardPreviewMap() {
  return useGetCardPreviewsQuery(undefined, {
    selectFromResult: ({ data }) => ({ cards: data ?? emptyCards }),
  }).cards;
}
