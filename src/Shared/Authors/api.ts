import { studyWaysApi } from '../ServerLayer/QueryLayer/api';
import { AuthorSummary, getAuthorName } from './types';

export type AuthorScope = 'cards' | 'questions';

export const authorsApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getAuthors: builder.query<AuthorSummary[], AuthorScope>({
      query: scope => ({
        url:
          scope === 'cards'
            ? '/page/card-page/authors'
            : '/page/question-editor-page/authors',
      }),
      transformResponse: (authors: AuthorSummary[]) =>
        [
          ...new Map(
            authors.map(author => [
              Number(author.id),
              { ...author, id: Number(author.id) },
            ]),
          ).values(),
        ]
          .filter(author => Number.isSafeInteger(author.id) && author.id > 0)
          .sort((first, second) =>
            getAuthorName(first).localeCompare(getAuthorName(second), 'ru'),
          ),
    }),
  }),
});

export const { useGetAuthorsQuery } = authorsApi;
