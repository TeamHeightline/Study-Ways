import type { TagDescription } from '@reduxjs/toolkit/query';
import type { IProfile } from '../../../pages/profile/redux-store/types';
import type {
  IBasicUserInformation,
  user_access_level,
} from '../types/user.types';
import type { IDetailStatistic } from '../types/detail-statistic.types';
import type { IQuestionStatus } from '../../../pages/exam/exam-by-uid/redux-store/InitialState';
import { studyWaysApi } from './api';

export interface WrittenMaterial {
  id: number;
  name?: string | null;
  course_data?: unknown;
  sequence_data?: unknown;
  description?: string | null;
}
export interface WrittenAnswer {
  id: number;
  question_id: number;
  text: string;
  is_true: boolean;
  help_textV1: string | null;
  help_textV2: string | null;
  help_textV3: string | null;
  check_queue: number;
  hard_level_of_answer: string;
  is_deleted: boolean;
  is_invisible: boolean;
  is_required: boolean;
  is_image_deleted: boolean;
  only_for_exam: boolean;
}
const cardTags = [
  'CardEditor',
  'CardList',
  'Card',
  'Course',
  'CourseCatalog',
  'CardCourseLinks',
  'Authors',
] as const;
const questionTags = [
  'QuestionList',
  'Question',
  'QuestionAnswers',
  'QuestionEditor',
  'AnswerEditor',
  'AnswerReports',
  'AnswerStatistics',
] as const;
const courseTags = [
  'Course',
  'OwnCourses',
  'CourseCatalog',
  'CardCourseLinks',
  'Authors',
] as const;
const sequenceTags = [
  'QuestionSequences',
  'QuestionSequence',
  'Exams',
] as const;
const additionalTags = [
  'ConnectedThemes',
  'CardInteraction',
  'Bookmarks',
  'Profile',
  'Users',
  'CurrentUser',
  'SelfStatistic',
  'Statistic',
] as const;
const writeTags = [
  ...cardTags,
  ...questionTags,
  ...courseTags,
  ...sequenceTags,
  ...additionalTags,
] as const;
type WriteTag = TagDescription<(typeof writeTags)[number]>;
const success =
  (tags: readonly WriteTag[]) =>
  (_result: unknown, error: unknown): WriteTag[] =>
    error ? [] : [...tags];

const questionIdTags = (id: number): WriteTag[] => [
  'QuestionList',
  { type: 'Question', id },
  { type: 'QuestionAnswers', id },
  { type: 'QuestionEditor', id },
];
const materialChanged = (type: 'Card' | 'Course', id: number): WriteTag[] =>
  type === 'Card'
    ? [...cardTags]
    : [
        { type, id },
        'OwnCourses',
        'CourseCatalog',
        'CardCourseLinks',
        'Authors',
      ];

export const writeApi = studyWaysApi
  .enhanceEndpoints({ addTagTypes: writeTags })
  .injectEndpoints({
    endpoints: builder => ({
      createCard: builder.mutation<WrittenMaterial, void>({
        query: () => ({ url: '/page/write/cards', method: 'POST' }),
        invalidatesTags: success(cardTags),
      }),
      saveCard: builder.mutation<
        WrittenMaterial,
        { id: number; data: unknown }
      >({
        query: ({ id, data }) => ({
          url: `/page/write/cards/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (result, error, { id }) =>
          error ? [] : materialChanged('Card', id),
      }),
      copyCard: builder.mutation<WrittenMaterial, number>({
        query: id => ({ url: `/page/write/cards/${id}/copy`, method: 'POST' }),
        invalidatesTags: success(cardTags),
      }),
      createQuestion: builder.mutation<WrittenMaterial, void>({
        query: () => ({ url: '/page/write/questions', method: 'POST' }),
        invalidatesTags: success(questionTags),
      }),
      saveQuestion: builder.mutation<
        WrittenMaterial,
        { id: number; data: unknown }
      >({
        query: ({ id, data }) => ({
          url: `/page/write/questions/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (result, error, { id }) =>
          error ? [] : questionIdTags(id),
      }),
      copyQuestion: builder.mutation<WrittenMaterial, number>({
        query: id => ({
          url: `/page/write/questions/${id}/copy`,
          method: 'POST',
        }),
        invalidatesTags: success(questionTags),
      }),
      createAnswer: builder.mutation<
        WrittenAnswer,
        { questionId: number; data?: unknown }
      >({
        query: ({ questionId, data }) => ({
          url: `/page/write/questions/${questionId}/answers`,
          method: 'POST',
          data: data ?? {},
        }),
        invalidatesTags: (result, error, { questionId }) =>
          error ? [] : questionIdTags(questionId),
      }),
      saveAnswer: builder.mutation<
        WrittenAnswer,
        { id: number; data: unknown }
      >({
        query: ({ id, data }) => ({
          url: `/page/write/answers/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (result, error, { id }) =>
          error
            ? []
            : [
                { type: 'AnswerEditor', id },
                ...questionIdTags(result?.question_id ?? 0),
              ],
      }),
      createCourse: builder.mutation<WrittenMaterial, unknown>({
        query: course_data => ({
          url: '/page/write/courses',
          method: 'POST',
          data: { course_data },
        }),
        invalidatesTags: success(courseTags),
      }),
      saveCourse: builder.mutation<
        WrittenMaterial,
        { id: number; name: string; course_data: unknown }
      >({
        query: ({ id, ...data }) => ({
          url: `/page/write/courses/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (result, error, { id }) =>
          error ? [] : materialChanged('Course', id),
      }),
      createSequence: builder.mutation<WrittenMaterial, unknown>({
        query: sequence_data => ({
          url: '/page/write/sequences',
          method: 'POST',
          data: { sequence_data },
        }),
        invalidatesTags: success(sequenceTags),
      }),
      saveSequence: builder.mutation<
        WrittenMaterial,
        {
          id: number;
          name: string;
          description: string | null;
          sequence_data: unknown;
        }
      >({
        query: ({ id, ...data }) => ({
          url: `/page/write/sequences/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: (result, error, { id }) =>
          error
            ? []
            : ['QuestionSequences', { type: 'QuestionSequence', id }, 'Exams'],
      }),
      createTheme: builder.mutation<
        WrittenMaterial,
        { text: string; parentId: number | null }
      >({
        query: data => ({ url: '/page/write/themes', method: 'POST', data }),
        invalidatesTags: success(['ConnectedThemes', 'Card', 'QuestionEditor']),
      }),
      saveTheme: builder.mutation<
        WrittenMaterial,
        { id: number; text: string; parentId: number | null }
      >({
        query: ({ id, ...data }) => ({
          url: `/page/write/themes/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: success(['ConnectedThemes', 'Card', 'QuestionEditor']),
      }),
      saveThemeOrder: builder.mutation<{ sequence: string }, number[]>({
        query: ids => ({
          url: '/page/write/theme-order',
          method: 'PUT',
          data: { ids },
        }),
        invalidatesTags: success(['ConnectedThemes']),
      }),
      setCardBookmark: builder.mutation<
        { cardId: number; is_bookmarked: boolean },
        { id: number; bookmarked: boolean }
      >({
        query: ({ id, bookmarked }) => ({
          url: `/page/write/cards/${id}/bookmark`,
          method: 'PUT',
          data: { is_bookmarked: bookmarked },
        }),
        invalidatesTags: success(['CardInteraction', 'Bookmarks']),
      }),
      setCardRating: builder.mutation<
        { cardId: number; rating: number | null },
        { id: number; rating: number | null }
      >({
        query: ({ id, rating }) => ({
          url: `/page/write/cards/${id}/rating`,
          method: 'PUT',
          data: { rating },
        }),
        invalidatesTags: success(['CardInteraction']),
      }),
      saveProfile: builder.mutation<IProfile, IProfile>({
        query: data => ({ url: '/page/write/profile', method: 'PUT', data }),
        invalidatesTags: success([
          'Profile',
          'Authors',
          'Users',
          'Card',
          'Course',
        ]),
      }),
      setUserRole: builder.mutation<
        IBasicUserInformation,
        { id: number; role: user_access_level }
      >({
        query: ({ id, role }) => ({
          url: `/page/write/users/${id}/role`,
          method: 'PUT',
          data: { user_access_level: role },
        }),
        invalidatesTags: (_result, error, { id }) =>
          error ? [] : ['Users', { type: 'CurrentUser', id }],
      }),
      createAnswerReport: builder.mutation<
        { id: number },
        { answer_id: number; text: string }
      >({
        query: data => ({
          url: '/page/write/answer-reports',
          method: 'POST',
          data,
        }),
        invalidatesTags: success(['AnswerReports']),
      }),
      closeAnswerReport: builder.mutation<{ id: number }, number>({
        query: id => ({
          url: `/page/write/answer-reports/${id}/close`,
          method: 'PUT',
        }),
        invalidatesTags: success(['AnswerReports']),
      }),
      createExam: builder.mutation<
        any,
        { question_sequence_id: number; name: string }
      >({
        query: data => ({ url: '/page/write/exams', method: 'POST', data }),
        invalidatesTags: success(['Exams']),
      }),
      saveExam: builder.mutation<any, { id: number; data: unknown }>({
        query: ({ id, data }) => ({
          url: `/page/write/exams/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: success(['Exams']),
      }),
      openExam: builder.mutation<any, { uid: string; password?: string }>({
        query: ({ uid, password }) => ({
          url: `/page/write/exams/${encodeURIComponent(uid)}/open`,
          method: 'POST',
          data: { password },
        }),
      }),
      saveExamProgress: builder.mutation<
        IQuestionStatus,
        { id: number; statistic_id: number }
      >({
        query: ({ id, statistic_id }) => ({
          url: `/page/write/exam-progress/${id}`,
          method: 'PUT',
          data: { statistic_id },
        }),
        invalidatesTags: success(['Exams', 'Statistic']),
      }),
      createStatistic: builder.mutation<
        IDetailStatistic,
        IDetailStatistic & { answers_id_array: number[] }
      >({
        query: data => ({
          url: '/page/write/statistics',
          method: 'POST',
          data,
        }),
        invalidatesTags: success([
          'SelfStatistic',
          'Statistic',
          'AnswerStatistics',
        ]),
      }),
      uploadMaterialImage: builder.mutation<
        { image: string },
        {
          kind: 'card' | 'course' | 'question' | 'answer';
          id: number;
          file: File;
        }
      >({
        query: ({ kind, id, file }) => ({
          url: `/page/write/images/${kind}/${id}`,
          method: 'PUT',
          data: file,
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
        }),
        invalidatesTags: (result, error, { kind, id }) =>
          error
            ? []
            : kind === 'card'
              ? materialChanged('Card', id)
              : kind === 'course'
                ? materialChanged('Course', id)
                : kind === 'answer'
                  ? [
                      { type: 'AnswerEditor', id },
                      'QuestionAnswers',
                      'QuestionEditor',
                      'Question',
                    ]
                  : questionIdTags(id),
      }),
    }),
  });

export const {
  useCreateCardMutation,
  useSaveCardMutation,
  useCopyCardMutation,
  useCreateQuestionMutation,
  useSaveQuestionMutation,
  useCopyQuestionMutation,
  useCreateAnswerMutation,
  useSaveAnswerMutation,
  useCreateCourseMutation,
  useSaveCourseMutation,
  useCreateSequenceMutation,
  useSaveSequenceMutation,
  useCreateThemeMutation,
  useSaveThemeMutation,
  useSaveThemeOrderMutation,
  useSetCardBookmarkMutation,
  useSetCardRatingMutation,
  useSaveProfileMutation,
  useSetUserRoleMutation,
  useCreateExamMutation,
  useSaveExamMutation,
  useOpenExamMutation,
  useSaveExamProgressMutation,
  useCreateStatisticMutation,
  useCreateAnswerReportMutation,
  useCloseAnswerReportMutation,
  useUploadMaterialImageMutation,
} = writeApi;
