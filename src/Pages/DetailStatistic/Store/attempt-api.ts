import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';
export interface AttemptData {
  id: string;
  userName: string;
  isLogin: boolean;
  isUseexammode: boolean;
  maxSumOfAnswersPoint: number | null;
  questionHasBeenCompleted: boolean;
  question: { id: string } | null;
  questionText: string;
  questionSequence: { id: string } | null;
  statistic: {
    numberOfPasses: number;
    ArrayForShowAnswerPoints: Array<{
      numberOfPasses: number;
      answerPoints: number;
    }>;
    ArrayForShowWrongAnswers: Array<{
      numberOfPasses: number;
      numberOfWrongAnswers: Array<number | string>;
    }>;
  };
  createdAt: string | null;
  authorizedUser: {
    userprofile: {
      firstname: string | null;
      lastname: string | null;
      avatarSrc: string | null;
    } | null;
  } | null;
}
export const attemptApi = studyWaysApi.injectEndpoints({
  endpoints: builder => ({
    getAttempt: builder.query<AttemptData, { id: number; userId?: number }>({
      query: ({ id }) => ({ url: `/page/attempt-read/${id}` }),
    }),
  }),
});
export const { useGetAttemptQuery } = attemptApi;
