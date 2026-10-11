import { studyWaysApi } from '../../../../../Shared/ServerLayer/QueryLayer/api';
import { CardEditorData } from './types';

export const cardEditorApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['CardEditor'] })
  .injectEndpoints({
    endpoints: builder => ({
      getCardEditorData: builder.query<
        CardEditorData | null,
        { id: number; userId: number }
      >({
        query: ({ id }) => ({ url: `/page/edit-card-by-id/card-by-id/${id}` }),
        providesTags: (_data, _error, { id }) => [{ type: 'CardEditor', id }],
      }),
    }),
  });

export const { useGetCardEditorDataQuery } = cardEditorApi;
