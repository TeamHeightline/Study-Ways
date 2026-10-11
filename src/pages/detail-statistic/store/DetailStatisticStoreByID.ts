import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useId } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/redux-store/hooks';
import { AttemptData } from './attempt-api';
interface StatisticView {
  isOpenDetailStatistic: boolean;
  openedSteps: number[];
}
const empty: StatisticView = { isOpenDetailStatistic: false, openedSteps: [] };
const slice = createSlice({
  name: 'statisticView',
  initialState: {} as Record<string, StatisticView>,
  reducers: {
    toggled(state, action: PayloadAction<string>) {
      const s = (state[action.payload] ||= { ...empty });
      s.isOpenDetailStatistic = !s.isOpenDetailStatistic;
    },
    stepToggled(state, action: PayloadAction<{ key: string; index: number }>) {
      const s = (state[action.payload.key] ||= { ...empty });
      const i = s.openedSteps.indexOf(action.payload.index);
      if (i < 0) s.openedSteps.push(action.payload.index);
      else s.openedSteps.splice(i, 1);
    },
    released(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});
export default slice.reducer;
export function getStatisticRow(data?: AttemptData) {
  const points = data?.statistic?.ArrayForShowAnswerPoints || [];
  const wrong = data?.statistic?.ArrayForShowWrongAnswers || [];
  const passes = data?.statistic?.numberOfPasses || 0;
  const max =
    data?.maxSumOfAnswersPoint ||
    (data?.questionHasBeenCompleted
      ? points[points.length - 1]?.answerPoints || 0
      : 0);
  const average = passes
    ? Math.ceil(
        points.reduce((sum, p) => sum + Number(p.answerPoints), 0) /
          Math.ceil(passes),
      )
    : 0;
  const errors = wrong.reduce(
    (sum, p) => sum + (p.numberOfWrongAnswers?.length || 0),
    0,
  );
  const denominator = points.reduce((sum, _, i) => sum + max * 0.7 ** i, 0);
  const weighted = points.reduce(
    (sum, p, i) => sum + Number(p.answerPoints) * 0.7 ** i,
    0,
  );
  const profile = data?.authorizedUser?.userprofile;
  return {
    username: data?.userName,
    lastname: profile?.lastname,
    firstname: profile?.firstname,
    profileName:
      [profile?.firstname, profile?.lastname]
        .map(n => n?.trim())
        .filter(Boolean)
        .join(' ') || 'Не указаны',
    avatarSrc: profile?.avatarSrc,
    isLogin: data?.isLogin ? 'да' : 'нет',
    numberOfPasses: passes,
    arithmeticMeanNumberOfWrongAnswer: errors
      ? (
          errors /
          Math.max(1, passes - (data?.questionHasBeenCompleted ? 1 : 0))
        ).toFixed(1)
      : 'Ошибок нет',
    numberOfWrongAnswers: errors,
    arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints:
      average +
      '/' +
      max +
      ' (' +
      (max ? Math.ceil((average / max) * 100) : 0) +
      '%)',
    minAnswerPoint: points.length
      ? Math.min(...points.map(p => Number(p.answerPoints)))
      : 0,
    questionID: data?.question?.id,
    attemptID: data?.id,
    ArrayForShowAnswerPoints: points,
    ArrayOfNumberOfWrongAnswers: wrong.map(p => ({
      numberOfPasses: p.numberOfPasses,
      numberOfWrongAnswers: p.numberOfWrongAnswers?.length || 0,
    })),
    ArrayForShowWrongAnswers: wrong,
    questionHasBeenCompleted: data?.questionHasBeenCompleted,
    SumOFPointsWithNewMethod: denominator
      ? Math.ceil((weighted / denominator) * 100)
      : 'Невозможно рассчитать',
    FormattedCreatedAt: data?.createdAt
      ? new Date(data.createdAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      : 'Дата не сохранена',
  };
}
export function useStatisticView(
  id: number,
  data: AttemptData | undefined,
  loadError: boolean,
  reload: () => unknown,
) {
  const instance = useId();
  const key = instance + ':' + id;
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s.statisticView[key] || empty);
  useEffect(
    () => () => {
      dispatch(slice.actions.released(key));
    },
    [dispatch, key],
  );
  return {
    ...state,
    attempt_id: id,
    attemptData: data,
    loadError,
    questionText: data?.questionText || '',
    loadingData: !data?.id,
    dataForRow: getStatisticRow(data),
    openedSteps: new Set(state.openedSteps),
    changeIsOpenDetailStatistic: () => dispatch(slice.actions.toggled(key)),
    addOrRemoveOpenedSteps: (index: number) =>
      dispatch(slice.actions.stepToggled({ key, index })),
    loadAttemptFromServer: reload,
  };
}
export type DSSObjectType = ReturnType<typeof useStatisticView>;
export type rowType = ReturnType<typeof getStatisticRow>;
