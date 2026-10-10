import { studyWaysApi } from '../../../../Shared/ServerLayer/QueryLayer/api';

export interface ReviewQuestionSummary {
  id: string;
  text: string;
  ownerUsername: string | null;
}

interface QuestionReviewPage {
  items: ReviewQuestionSummary[];
  activePage: number;
  numPages: number;
}

interface QuestionReviewRequest {
  page: number;
  authorId: string | null;
  // Partition personal lists by account; the server derives the owner from JWT.
  userId?: number;
}

export const questionReviewApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getQuestionReviewPage: builder.query<
      QuestionReviewPage,
      QuestionReviewRequest
    >({
      query: ({ page, authorId }) => ({
        url:
          authorId === '-1'
            ? '/page/question-selector/my'
            : '/page/question-selector',
        params: {
          page,
          ...(authorId !== null && authorId !== '-1' ? { authorId } : {}),
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetQuestionReviewPageQuery } = questionReviewApi;
