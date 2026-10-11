import { userApi } from './user-session';

export function setTestUser(store, user) {
  return store.dispatch(
    userApi.util.upsertQueryData(
      'getCurrentUser',
      undefined,
      user
        ? { username: 'student', user_access_level: 'STUDENT', ...user }
        : null,
    ),
  );
}
