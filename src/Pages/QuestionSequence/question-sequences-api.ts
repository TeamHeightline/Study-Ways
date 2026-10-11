import { studyWaysApi } from '../../Shared/ServerLayer/QueryLayer/api';

export interface QuestionSequenceSummary {
  id: string;
  name: string | null;
  description: string | null;
  sequenceData: { sequence?: Array<number | string> } | null;
}
export const questionSequencesApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['QuestionSequences'] })
  .injectEndpoints({
    endpoints: builder => ({
      getQuestionSequences: builder.query<QuestionSequenceSummary[], void>({
        query: () => ({ url: '/page/question-sequences' }),
        providesTags: ['QuestionSequences'],
      }),
      getMyQuestionSequences: builder.query<
        QuestionSequenceSummary[],
        number | undefined
      >({
        query: () => ({ url: '/page/question-sequences/my' }),
        providesTags: ['QuestionSequences'],
      }),
    }),
  });
export const { useGetQuestionSequencesQuery, useGetMyQuestionSequencesQuery } =
  questionSequencesApi;
