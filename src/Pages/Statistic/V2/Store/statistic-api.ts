import { studyWaysApi } from '../../../../Shared/ServerLayer/QueryLayer/api';

interface StatisticPageData {
  ids: number[];
  activePage: number;
  numPages: number;
}

export interface StatisticQuestion {
  id: number;
  text: string;
}

export interface StatisticRequest {
  userId: number;
  page: number;
  questions: number[];
  userName: string;
  afterTime: string;
  onlyInExam: boolean;
  onlyInQs: boolean;
}

export const statisticApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getStatisticAttempts: builder.query<StatisticPageData, StatisticRequest>({
      query: ({ userId, questions, ...params }) => ({
        url: '/page/statistic/attempts',
        params: { ...params, questions: questions.join(',') },
      }),
      keepUnusedDataFor: 0,
    }),
    getStatisticQuestions: builder.query<StatisticQuestion[], number>({
      // The argument isolates authenticated users in the cache, not on the server.
      query: () => ({ url: '/page/statistic/questions' }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetStatisticAttemptsQuery, useGetStatisticQuestionsQuery } =
  statisticApi;
