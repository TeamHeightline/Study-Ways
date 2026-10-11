import { getAuthSessionVersion, isAuthSessionActive } from './auth-session';
import { serializeWrite } from './write-queue';
import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import reduxStore from '../../../app/redux-store/RootStore';

// Bridge for remaining local form drafts. Server state, request status and
// invalidation belong to RTK Query; completed command entries are released.
export async function executeMutation<T>(
  operation: ThunkAction<
    { unwrap(): Promise<T>; reset(): void },
    any,
    any,
    AnyAction
  >,
): Promise<T> {
  const request = reduxStore.dispatch(operation);
  try {
    return await request.unwrap();
  } finally {
    request.reset();
  }
}

export function executeQueuedMutation<T>(
  key: string,
  operation: ThunkAction<
    { unwrap(): Promise<T>; reset(): void },
    any,
    any,
    AnyAction
  >,
): Promise<T> {
  if (!isAuthSessionActive())
    return Promise.reject(
      new Error('Сессия изменилась. Повторите сохранение после входа.'),
    );
  const session = getAuthSessionVersion();
  return serializeWrite(key, () => {
    if (getAuthSessionVersion() !== session)
      throw new Error('Сессия изменилась. Повторите сохранение после входа.');
    return executeMutation(operation);
  });
}
