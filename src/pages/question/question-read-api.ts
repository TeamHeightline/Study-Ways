import { studyWaysApi } from '../../shared/server-layer/query-layer/api';
import CryptoJS from 'crypto-js';
import type {
  EditorAnswer,
  ReviewAnswer,
} from '../../shared/server-layer/types/question.type';
export type {
  EditorAnswer,
  ReviewAnswer,
} from '../../shared/server-layer/types/question.type';
export interface QuestionPreview {
  id: string;
  text: string;
  ownerUsername: string;
  questionImage: string | null;
}
export interface QuestionEditorData {
  createdById: number | null;
  id: string;
  text: string;
  numberOfShowingAnswers: number;
  connectedTheme: { id: string } | null;
  author: { id: string }[];
  theme: { id: string }[];
  answers: EditorAnswer[];
  image: string | null;
}
export interface PlayerQuestionData {
  question: {
    id: number;
    text: string;
    number_of_showing_answers: number;
    image: string | null;
  };
  answers: Array<{
    id: number;
    text: string;
    is_true: boolean;
    check_queue: number;
    help_textV1: string | null;
    help_textV2: string | null;
    help_textV3: string | null;
    hard_level_of_answer: string;
    is_image_deleted: boolean;
    is_required: boolean;
    is_deleted: boolean;
    image: string | null;
  }>;
}
export const questionReadApi = studyWaysApi
  .enhanceEndpoints({
    addTagTypes: [
      'Question',
      'QuestionAnswers',
      'QuestionEditor',
      'AnswerEditor',
    ],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getQuestionPlayerData: builder.query<
        PlayerQuestionData,
        { id: number; examMode: boolean; userId?: number }
      >({
        query: ({ id, examMode }) => ({
          url: `/page/question-read/${id}/play`,
          params: { examMode },
        }),
        transformResponse: (response: { encryptedQuestionData: string }) =>
          JSON.parse(
            CryptoJS.AES.decrypt(
              response.encryptedQuestionData,
              'sw-secret-key',
            ).toString(CryptoJS.enc.Utf8),
          ),
        providesTags: (result, error, { id }) => [{ type: 'Question', id }],
      }),
      getQuestionEditorData: builder.query<
        QuestionEditorData | null,
        { id: number; userId?: number }
      >({
        query: ({ id }) => ({ url: `/page/question-read/${id}/editor` }),
        providesTags: (result, error, { id }) => [
          { type: 'QuestionEditor', id },
        ],
      }),
      getEditorAnswer: builder.query<
        EditorAnswer | null,
        { id: number; userId?: number }
      >({
        query: ({ id }) => ({
          url: `/page/question-read/answers/${id}/editor`,
        }),
        providesTags: (result, error, { id }) => [{ type: 'AnswerEditor', id }],
      }),
      getQuestionPreview: builder.query<QuestionPreview | null, number>({
        query: id => ({ url: `/page/question-read/${id}/preview` }),
        providesTags: (result, error, id) => [{ type: 'Question', id }],
      }),
      getReviewAnswers: builder.query<
        ReviewAnswer[],
        { id: number; userId?: number }
      >({
        query: ({ id }) => ({
          url: `/page/question-read/${id}/review-answers`,
        }),
        providesTags: (result, error, { id }) => [
          { type: 'QuestionAnswers', id },
        ],
      }),
    }),
  });
export const {
  useGetQuestionPreviewQuery,
  useGetReviewAnswersQuery,
  useLazyGetQuestionEditorDataQuery,
  useGetQuestionEditorDataQuery,
  useGetEditorAnswerQuery,
  useGetQuestionPlayerDataQuery,
} = questionReadApi;
