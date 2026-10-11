import { studyWaysApi } from '../../../../../../Shared/ServerLayer/QueryLayer/api';

export interface AnswerReport {
  id: number;
  answer_id: number;
  text: string;
  createdAt: string;
  is_closed: boolean;
  users_customuser: {
    username: string;
    users_userprofile: {
      firstname: string | null;
      lastname: string | null;
    } | null;
  } | null;
}
export interface AnswerStatistics {
  id: number;
  answer_id: number;
  number_of_incorrect_answer_choices: number;
  number_of_all_answer_choices: number;
}
export const answerEditorApi = studyWaysApi
  .enhanceEndpoints({
    addTagTypes: ['AnswerReports', 'AnswerStatistics'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getAnswerReports: builder.query<
        AnswerReport[],
        { id: number; userId: number }
      >({
        query: ({ id }) => ({
          url: `/page/edit-answer-by-id/answer-report-by-id/${id}`,
        }),
        providesTags: (result, error, { id }) => [
          { type: 'AnswerReports', id },
        ],
      }),
      getAnswerStatistics: builder.query<
        AnswerStatistics | null,
        { id: number; userId: number }
      >({
        query: ({ id }) => ({
          url: `/page/edit-answer-by-id/answer-statistics/${id}`,
        }),
        providesTags: (result, error, { id }) => [
          { type: 'AnswerStatistics', id },
        ],
      }),
    }),
  });
export const { useGetAnswerReportsQuery, useGetAnswerStatisticsQuery } =
  answerEditorApi;
