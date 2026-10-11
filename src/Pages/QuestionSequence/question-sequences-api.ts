import { sequenceDataI } from '../../Shared/ServerLayer/Types/question-sequence.type';
import { IQuestionPreviewData } from '../../Shared/ServerLayer/Types/question.type';
import { studyWaysApi } from '../../Shared/ServerLayer/QueryLayer/api';

export interface QuestionSequenceSummary {
  id: string;
  name: string | null;
  description: string | null;
  sequenceData: { sequence?: Array<number | string> } | null;
}
export const questionSequencesApi = studyWaysApi
  .enhanceEndpoints({
    addTagTypes: ['QuestionSequences', 'QuestionSequence', 'QuestionList'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getQuestionSequence: builder.query<sequenceDataI, number>({
        query: id => ({ url: `/question-sequence/data/${id}` }),
        transformResponse: (response: { questionSequence: sequenceDataI }) =>
          response.questionSequence,
        providesTags: (result, error, id) => [{ type: 'QuestionSequence', id }],
      }),
      getSequenceQuestionSummaries: builder.query<IQuestionPreviewData[], void>(
        {
          query: () => ({ url: '/question/all/data' }),
          transformResponse: (response: {
            questions_data: IQuestionPreviewData[];
          }) => response.questions_data,
          providesTags: ['QuestionList'],
        },
      ),
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

export const {
  useGetQuestionSequenceQuery,
  useGetSequenceQuestionSummariesQuery,
} = questionSequencesApi;
