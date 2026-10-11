import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useId, useRef } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../app/redux-store/hooks';
import { shuffle } from '../../../../shared/utils/array';
import { FILE_URL } from '../../../../settings';
import { PlayerQuestionData } from '../../question-read-api';
import {
  useCreateStatisticMutation,
  useCreateAnswerReportMutation,
} from '../../../../shared/server-layer/query-layer/write-api';
import { useUserSession } from '../../../../shared/store/user-store/user-session';
interface Answer {
  id: number;
  answerText: string;
  answerImageUrl: string;
  isTrue: boolean;
  checkQueue: number;
  hardLevelOfAnswer: string;
  helpTextv1: string;
  helpTextv2: string;
  helpTextv3: string;
  isImageDeleted: boolean;
}
interface PlayerState {
  questionID: number;
  questionText: string;
  questionImageUrl: string;
  answersArray: Answer[];
  selectedAnswers: number[];
  hardLevelOfHelpText: string;
  questionHasBeenStarted: boolean;
  questionHasBeenCompleted: boolean;
  numberOfPasses: number;
  oneTimeCheckError: boolean;
  IndexOfMostWantedError: number;
  historyOfWrongSelectedAnswers: number[][];
  historyOfAnswerPoints: number[];
  maxSumOfPoints: number;
  numberOfSelectAnswersOnThisPass: number;
  isUseExamMode: boolean;
  isDataLoaded: boolean;
  isAcceptDefeat: boolean;
  userMarks: ('none' | 'false' | 'unknown')[];
  answerIndexForCreateErrorReport?: number;
  answerReportText: string;
  answerReportSavedMessageArray: boolean[];
}
export const emptyPlayer: PlayerState = {
  questionID: 0,
  questionText: '',
  questionImageUrl: '',
  answersArray: [],
  selectedAnswers: [],
  hardLevelOfHelpText: '0',
  questionHasBeenStarted: false,
  questionHasBeenCompleted: false,
  numberOfPasses: 0,
  oneTimeCheckError: false,
  IndexOfMostWantedError: -1,
  historyOfWrongSelectedAnswers: [],
  historyOfAnswerPoints: [],
  maxSumOfPoints: 0,
  numberOfSelectAnswersOnThisPass: 0,
  isUseExamMode: false,
  isDataLoaded: false,
  isAcceptDefeat: false,
  userMarks: [],
  answerReportText: '',
  answerReportSavedMessageArray: [],
};
const points = (level: string) =>
  level === 'EASY' ? 5 : level === 'MEDIUM' ? 10 : 15;
export function preparePlayer(
  data: PlayerQuestionData,
  examMode: boolean,
): PlayerState {
  const available = data.answers.filter(a => !a.is_deleted);
  const count = Math.max(0, data.question.number_of_showing_answers);
  const required = shuffle(available.filter(a => a.is_required)).slice(
    0,
    count,
  );
  const chosen = shuffle([
    ...required,
    ...shuffle(available.filter(a => !a.is_required)).slice(
      0,
      count - required.length,
    ),
  ]);
  const answersArray: Answer[] = chosen.map(a => ({
    id: a.id,
    answerText: a.text,
    answerImageUrl: a.image ? FILE_URL + '/' + a.image : '',
    isTrue: a.is_true,
    checkQueue: a.check_queue,
    hardLevelOfAnswer: a.hard_level_of_answer,
    helpTextv1: a.help_textV1 || '',
    helpTextv2: a.help_textV2 || '',
    helpTextv3: a.help_textV3 || '',
    isImageDeleted: a.is_image_deleted,
  }));
  return {
    ...emptyPlayer,
    questionID: data.question.id,
    questionText: data.question.text,
    questionImageUrl: data.question.image
      ? FILE_URL + '/' + data.question.image
      : '',
    answersArray,
    userMarks: answersArray.map(() => 'none'),
    maxSumOfPoints: answersArray.reduce(
      (sum, a) => sum + points(a.hardLevelOfAnswer),
      0,
    ),
    isUseExamMode: examMode,
    isDataLoaded: true,
  };
}
const slice = createSlice({
  name: 'questionPlayer',
  initialState: {} as Record<string, PlayerState>,
  reducers: {
    initialized(
      state,
      action: PayloadAction<{ key: string; player: PlayerState }>,
    ) {
      if (!state[action.payload.key])
        state[action.payload.key] = action.payload.player;
    },
    released(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    changed(
      state,
      action: PayloadAction<{ key: string; patch: Partial<PlayerState> }>,
    ) {
      if (state[action.payload.key])
        Object.assign(state[action.payload.key], action.payload.patch);
    },
    answerToggled(state, action: PayloadAction<{ key: string; id: number }>) {
      const s = state[action.payload.key];
      if (!s || s.questionHasBeenCompleted || s.isAcceptDefeat) return;
      const index = s.selectedAnswers.indexOf(action.payload.id);
      if (index < 0) s.selectedAnswers.push(action.payload.id);
      else s.selectedAnswers.splice(index, 1);
    },
    checked(state, action: PayloadAction<string>) {
      const s = state[action.payload];
      if (
        !s ||
        !s.questionHasBeenStarted ||
        s.questionHasBeenCompleted ||
        s.isAcceptDefeat
      )
        return;
      const errors: number[] = [];
      let earned = 0;
      let lost = 0;
      let queue = Infinity;
      let index = -1;
      s.answersArray.forEach((a, i) => {
        if (a.isTrue !== s.selectedAnswers.includes(a.id)) {
          errors.push(a.id);
          lost += 20 - points(a.hardLevelOfAnswer);
          if (Number(a.checkQueue) < queue) {
            queue = Number(a.checkQueue);
            index = i;
          }
        } else earned += points(a.hardLevelOfAnswer);
      });
      s.oneTimeCheckError = true;
      s.numberOfPasses++;
      s.numberOfSelectAnswersOnThisPass = s.selectedAnswers.length;
      s.historyOfAnswerPoints.push(earned - lost);
      s.historyOfWrongSelectedAnswers.push(errors);
      s.IndexOfMostWantedError = index;
      s.questionHasBeenCompleted = errors.length === 0;
    },
    markToggled(
      state,
      action: PayloadAction<{
        key: string;
        index: number;
        mark: 'false' | 'unknown';
      }>,
    ) {
      const s = state[action.payload.key];
      if (s)
        s.userMarks[action.payload.index] =
          s.userMarks[action.payload.index] === action.payload.mark
            ? 'none'
            : action.payload.mark;
    },
    reportResult(
      state,
      action: PayloadAction<{ key: string; success: boolean; text: string }>,
    ) {
      const s = state[action.payload.key];
      if (!s) return;
      s.answerReportSavedMessageArray.push(action.payload.success);
      if (
        action.payload.success &&
        s.answerReportText === action.payload.text
      ) {
        s.answerReportText = '';
        s.answerIndexForCreateErrorReport = undefined;
      }
    },
    messageRemoved(state, action: PayloadAction<string>) {
      state[action.payload]?.answerReportSavedMessageArray.shift();
    },
  },
});
export const questionPlayerActions = slice.actions;
export default slice.reducer;
export function useQuestionPlayer(
  questionID: number,
  examMode: boolean,
  restart: number,
  data?: PlayerQuestionData,
) {
  const instance = useId();
  const session = useUserSession();
  const key =
    instance +
    ':' +
    session.user?.id +
    ':' +
    questionID +
    ':' +
    examMode +
    ':' +
    restart;
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s.questionPlayer[key] || emptyPlayer);
  const [saveStatistic, statisticMutation] = useCreateStatisticMutation();
  const [report, reportMutation] = useCreateAnswerReportMutation();
  const sent = useRef<string>();
  useEffect(() => {
    if (data && data.question.id === questionID)
      dispatch(
        slice.actions.initialized({
          key,
          player: preparePlayer(data, examMode),
        }),
      );
  }, [dispatch, key, data, questionID, examMode]);
  useEffect(
    () => () => {
      dispatch(slice.actions.released(key));
    },
    [dispatch, key],
  );
  const ArrayForShowAnswerPoints = state.historyOfAnswerPoints.map(
    (answerPoints, i) => ({ numberOfPasses: i + 1, answerPoints }),
  );
  const ArrayForShowWrongAnswers = state.historyOfWrongSelectedAnswers.map(
    (numberOfWrongAnswers, i) => ({
      numberOfPasses: i + 1,
      numberOfWrongAnswers,
    }),
  );
  const persist = () =>
    saveStatistic({
      question_id: questionID,
      user_name: session.user?.username || 'Анонимный пользователь',
      is_login: !!session.user?.id,
      question_has_been_completed: state.questionHasBeenCompleted,
      statistic: {
        numberOfPasses: state.numberOfPasses,
        ArrayForShowAnswerPoints,
        ArrayForShowWrongAnswers,
      },
      is_useExamMode: examMode,
      max_sum_of_answers_point: state.maxSumOfPoints,
      answers_id_array: state.answersArray.map(a => a.id),
    }).unwrap();
  useEffect(() => {
    if (
      (state.questionHasBeenCompleted || state.isAcceptDefeat) &&
      sent.current !== key
    ) {
      sent.current = key;
      void persist().catch(() => {});
    }
  }, [key, state.questionHasBeenCompleted, state.isAcceptDefeat]);
  const patch = (patch: Partial<PlayerState>) =>
    dispatch(slice.actions.changed({ key, patch }));
  const wrong = state.answersArray[state.IndexOfMostWantedError];
  return {
    ...state,
    selectedAnswers: new Set(state.selectedAnswers),
    ArrayForShowAnswerPoints,
    ArrayForShowWrongAnswers,
    ArrayForShowNumberOfWrongAnswers: ArrayForShowWrongAnswers.map(a => ({
      ...a,
      numberOfWrongAnswers: a.numberOfWrongAnswers.length,
    })),
    chartDataNumberOfWrongAnswers: ArrayForShowWrongAnswers.map(a => ({
      numberOfPasses: String(a.numberOfPasses),
      numberOfWrongAnswers: a.numberOfWrongAnswers.length,
    })),
    chartDataArrayForShowAnswerPoints: ArrayForShowAnswerPoints.map(a => ({
      ...a,
      numberOfPasses: String(a.numberOfPasses),
    })),
    HelpTextForShow:
      state.numberOfSelectAnswersOnThisPass === 0 && state.numberOfPasses === 1
        ? 'Среди предложенных вариантов ответа есть хотя бы один правильный, проверьте еще раз'
        : state.hardLevelOfHelpText === '0'
          ? wrong?.helpTextv1
          : state.hardLevelOfHelpText === '1'
            ? wrong?.helpTextv2
            : wrong?.helpTextv3,
    selectAnswerHandleChange: (id: number) =>
      dispatch(slice.actions.answerToggled({ key, id })),
    changeHardLevelOfHelpText: (level: string) =>
      patch({ hardLevelOfHelpText: level }),
    startQuestion: () => patch({ questionHasBeenStarted: true }),
    checkErrors: () => dispatch(slice.actions.checked(key)),
    onAcceptDefeat: () => patch({ isAcceptDefeat: true }),
    onQuestionButtonClick: (index: number) =>
      dispatch(slice.actions.markToggled({ key, index, mark: 'false' })),
    onUnknownButtonClick: (index: number) =>
      dispatch(slice.actions.markToggled({ key, index, mark: 'unknown' })),
    onReportAnswerButtonClick: (index: number) =>
      patch({ answerIndexForCreateErrorReport: index }),
    onCloseAnswerReportDialog: () =>
      patch({
        answerIndexForCreateErrorReport: undefined,
        answerReportText: '',
      }),
    changeAnswerReportText: (e: any) =>
      patch({ answerReportText: e.target.value }),
    onSendAnswerReportButtonClick: async () => {
      const answer =
        state.answersArray[state.answerIndexForCreateErrorReport ?? -1];
      const text = state.answerReportText;
      if (!text.trim() || !answer || reportMutation.isLoading) return;
      try {
        await report({ answer_id: answer.id, text }).unwrap();
        dispatch(slice.actions.reportResult({ key, success: true, text }));
      } catch {
        dispatch(slice.actions.reportResult({ key, success: false, text }));
      }
    },
    removeAnswerReportSavedMessage: () =>
      dispatch(slice.actions.messageRemoved(key)),
    statisticSaveError: statisticMutation.isError,
    statisticSaving: statisticMutation.isLoading,
    saveDetailStatistic: persist,
  };
}
export type QuestionPlayerStore = ReturnType<typeof useQuestionPlayer>;
