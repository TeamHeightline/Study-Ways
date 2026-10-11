import { createAction, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { setAccessToken } from '../../ServerLayer/QueryLayer/config';
import { studyWaysApi } from '../../ServerLayer/QueryLayer/api';

export const resetSession = createAction('session/reset');

export function clearUserSession(dispatch: ThunkDispatch<any, any, AnyAction>) {
  setAccessToken(null);
  dispatch(studyWaysApi.util.resetApiState());
  dispatch(resetSession());
}
