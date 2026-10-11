import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useId } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/hooks';
import { ReviewAnswer } from '../../../../question/question-read-api';
import { useCreateAnswerReportMutation } from '../../../../../shared/server-layer/query-layer/write-api';
interface ReportState {
  isOpenAnswerReportDialog: boolean;
  answerReportText: string;
  answerReportSavedMessageArray: boolean[];
}
const empty: ReportState = {
  isOpenAnswerReportDialog: false,
  answerReportText: '',
  answerReportSavedMessageArray: [],
};
const slice = createSlice({
  name: 'reviewReport',
  initialState: {} as Record<string, ReportState>,
  reducers: {
    changed(
      state,
      action: PayloadAction<{ key: string; patch: Partial<ReportState> }>,
    ) {
      state[action.payload.key] = {
        ...(state[action.payload.key] || empty),
        ...action.payload.patch,
      };
    },
    result(
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
        s.isOpenAnswerReportDialog = false;
      }
    },
    messageRemoved(state, action: PayloadAction<string>) {
      state[action.payload]?.answerReportSavedMessageArray.shift();
    },
    released(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});
export default slice.reducer;
export function useAnswerReview(answerID: string, answerData: ReviewAnswer) {
  const instance = useId();
  const key = instance + ':' + answerID;
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s.reviewReport[key] || empty);
  const [report, request] = useCreateAnswerReportMutation();
  useEffect(
    () => () => {
      dispatch(slice.actions.released(key));
    },
    [dispatch, key],
  );
  const patch = (patch: Partial<ReportState>) =>
    dispatch(slice.actions.changed({ key, patch }));
  const saveAnswerReport = async () => {
    const text = state.answerReportText;
    if (!text.trim() || request.isLoading) return;
    try {
      await report({ answer_id: Number(answerID), text }).unwrap();
      dispatch(slice.actions.result({ key, success: true, text }));
    } catch {
      dispatch(slice.actions.result({ key, success: false, text }));
    }
  };
  return {
    ...state,
    answerID,
    answerData,
    isAnswerDataLoaded: !!answerData,
    hasLoadError: false,
    openAnswerReportDialog: () => patch({ isOpenAnswerReportDialog: true }),
    closeAnswerReportDialog: () =>
      patch({ isOpenAnswerReportDialog: false, answerReportText: '' }),
    changeAnswerReportText: (e: any) =>
      patch({ answerReportText: e.target.value }),
    saveAnswerReport,
    onSendAnswerReportButtonClick: saveAnswerReport,
    removeAnswerReportSavedMessage: () =>
      dispatch(slice.actions.messageRemoved(key)),
  };
}
export type CheckAnswerByIdStore = ReturnType<typeof useAnswerReview>;
