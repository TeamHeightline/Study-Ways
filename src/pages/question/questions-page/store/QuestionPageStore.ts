import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
interface Question {
  id: number;
  text: string;
}
const publicQuestionsApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: ['QuestionList'] })
  .injectEndpoints({
    endpoints: build => ({
      getPublicQuestions: build.query<Question[], void>({
        query: () => ({ url: 'page/question-page/all-questions' }),
        transformResponse: (questions: Question[]) =>
          questions.filter(q => q.text !== 'Новый вопрос'),
        providesTags: ['QuestionList'],
      }),
    }),
  });
export const { useGetPublicQuestionsQuery } = publicQuestionsApi;
