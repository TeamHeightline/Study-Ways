import { createAction, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { setAccessToken } from '../../server-layer/query-layer/config';
import { studyWaysApi } from '../../server-layer/query-layer/api';

export const resetSession = createAction('session/reset');

export function clearUserSession(dispatch: ThunkDispatch<any, any, AnyAction>) {
  setAccessToken(null);
  dispatch(studyWaysApi.util.resetApiState());
  dispatch(resetSession());
}
