import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import AppHook from '../../../app.hook';
import Auth0Logout from '../../../pages/auth0/auth0-logout';
import { RootReducer } from '../../../app/redux-store/RootReducer';
import { userApi, useUserSession, selectUserSession } from './user-session';
import { clearUserSession } from './session-lifecycle';
import axiosClient from '../../server-layer/query-layer/config';
import { isAuthSessionActive } from '../../server-layer/query-layer/auth-session';
import { setTestUser } from './user-session.test-utils';
import { writeApi } from '../../server-layer/query-layer/write-api';
import { changeExamNameForCreate } from '../../../pages/exam/editor-page/page/redux-store/actions';

jest.mock('@auth0/auth0-react', () => ({ useAuth0: jest.fn() }));
jest.mock('../../../app/redux-store/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
}));

const act = React.act || legacyAct;
const teacher = { id: 7, username: 'teacher', user_access_level: 'TEACHER' };
const student = { id: 8, username: 'student', user_access_level: 'STUDENT' };
let store, root, host, auth, request;
function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  return { promise, resolve };
}
function Identity() {
  const { user, role, isLogin, recommendationUserId } = useUserSession();
  return (
    <output>
      {JSON.stringify({ id: user?.id, role, isLogin, recommendationUserId })}
    </output>
  );
}
function App() {
  const { isLoading } = AppHook();
  return (
    <>
      <span>{isLoading ? 'Подготовка' : 'Готово'}</span>
      <Identity />
    </>
  );
}
async function render() {
  useAuth0.mockReturnValue(auth);
  await act(async () =>
    root.render(
      <Provider store={store}>
        <App />
      </Provider>,
    ),
  );
}
const identity = () => JSON.parse(host.querySelector('output').textContent);

beforeEach(() => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  store = configureStore({
    reducer: RootReducer,
    middleware: get =>
      get({ serializableCheck: false }).concat(userApi.middleware),
  });
  request = jest
    .spyOn(axiosClient, 'request')
    .mockResolvedValue({ data: teacher });
  auth = {
    isLoading: false,
    isAuthenticated: true,
    user: { sub: 'auth0|teacher' },
    getAccessTokenSilently: jest.fn().mockResolvedValue('teacher-token'),
    logout: jest.fn(),
  };
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => {
    root.unmount();
    clearUserSession(store.dispatch);
  });
  host.remove();
  jest.restoreAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('one authenticated REST read supplies reactive consumers without extra requests', async () => {
  const token = deferred();
  auth.getAccessTokenSilently.mockReturnValue(token.promise);
  await render();
  expect(request).not.toHaveBeenCalled();
  expect(identity().isLogin).toBe(false);
  expect(host.textContent).toContain('Подготовка');
  await act(async () => token.resolve('teacher-token'));
  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith(
    expect.objectContaining({ url: '/page/me/basic-data' }),
  );
  expect(axiosClient.defaults.headers.common.Authorization).toBe(
    'Bearer teacher-token',
  );
  expect(identity()).toEqual({
    id: 7,
    role: 'TEACHER',
    isLogin: true,
    recommendationUserId: '7',
  });
  expect(host.textContent).toContain('Готово');
  await render();
  expect(request).toHaveBeenCalledTimes(1);
  await act(async () => jest.advanceTimersByTime(300001));
  expect(identity().id).toBe(7);
  expect(request).toHaveBeenCalledTimes(1);
  await act(async () =>
    setTestUser(store, { ...teacher, user_access_level: 'CARD_EDITOR' }),
  );
  expect(identity().role).toBe('CARD_EDITOR');
});

test('anonymous users never request private user data and retain the anonymous recommendation ID', async () => {
  auth.isAuthenticated = false;
  await render();
  expect(auth.getAccessTokenSilently).not.toHaveBeenCalled();
  expect(request).not.toHaveBeenCalled();
  expect(identity()).toEqual({
    role: 'STUDENT',
    isLogin: false,
    recommendationUserId: '-1',
  });
});

test('waits for Auth0 initialization before requesting a token or current user', async () => {
  auth.isLoading = true;
  await render();
  expect(auth.getAccessTokenSilently).not.toHaveBeenCalled();
  expect(request).not.toHaveBeenCalled();
  expect(identity().isLogin).toBe(false);
  auth.isLoading = false;
  await render();
  expect(identity().id).toBe(7);
  expect(request).toHaveBeenCalledTimes(1);
});

test('switching accounts clears the previous identity before loading another one', async () => {
  await render();
  const response = deferred();
  request.mockReturnValueOnce(response.promise);
  auth = { ...auth, user: { sub: 'auth0|student' } };
  auth.getAccessTokenSilently.mockResolvedValue('student-token');
  await render();
  expect(identity().isLogin).toBe(false);
  expect(identity().role).toBe('STUDENT');
  await act(async () => response.resolve({ data: student }));
  expect(identity().id).toBe(8);
  expect(selectUserSession(store.getState()).username).toBe('student');
  expect(axiosClient.defaults.headers.common.Authorization).toBe(
    'Bearer student-token',
  );
});

test('an obsolete account response cannot restore an old user or role', async () => {
  const obsolete = deferred();
  request.mockReturnValueOnce(obsolete.promise);
  await render();
  auth = { ...auth, user: { sub: 'auth0|student' } };
  auth.getAccessTokenSilently.mockResolvedValue('student-token');
  request.mockResolvedValueOnce({ data: student });
  await render();
  expect(identity().id).toBe(8);
  await act(async () =>
    obsolete.resolve({ data: { ...teacher, user_access_level: 'ADMIN' } }),
  );
  expect(identity().id).toBe(8);
  expect(identity().role).toBe('STUDENT');
});

test('logout clears token, identity and private drafts, and ignores an in-flight user response', async () => {
  const response = deferred();
  request.mockReturnValueOnce(response.promise);
  await render();
  store.dispatch(changeExamNameForCreate('Личный черновик'));
  expect(store.getState().examEditorPageReducer.exam_name_for_create).toBe(
    'Личный черновик',
  );
  await act(async () => clearUserSession(store.dispatch));
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(isAuthSessionActive()).toBe(false);
  expect(identity().isLogin).toBe(false);
  expect(store.getState().studyWaysApi.queries).toEqual({});
  expect(store.getState().examEditorPageReducer).toEqual(
    RootReducer(undefined, { type: '@@INIT' }).examEditorPageReducer,
  );
  await act(async () => response.resolve({ data: teacher }));
  expect(identity().isLogin).toBe(false);
  expect(store.getState().studyWaysApi.queries).toEqual({});
});

test('a delayed token cannot reactivate the session after logout', async () => {
  const token = deferred();
  auth.getAccessTokenSilently.mockReturnValue(token.promise);
  await render();
  await act(async () => clearUserSession(store.dispatch));
  await act(async () => token.resolve('obsolete-token'));
  expect(request).not.toHaveBeenCalled();
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(isAuthSessionActive()).toBe(false);
  expect(identity().isLogin).toBe(false);
});

test('a failed current-user request leaves no privileged identity or active token', async () => {
  request.mockRejectedValueOnce(new Error('Unauthorized'));
  await render();
  expect(identity().isLogin).toBe(false);
  expect(identity().role).toBe('STUDENT');
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(isAuthSessionActive()).toBe(false);
  expect(host.textContent).toContain('Готово');
});

test('changing the current user role refreshes the shared identity cache', async () => {
  await render();
  request.mockImplementation(async ({ url }) => ({
    data:
      url === '/page/me/basic-data'
        ? { ...teacher, user_access_level: 'STUDENT' }
        : teacher,
  }));
  await act(async () =>
    store
      .dispatch(
        writeApi.endpoints.setUserRole.initiate({ id: 7, role: 'STUDENT' }),
      )
      .unwrap(),
  );
  expect(identity().role).toBe('STUDENT');
  expect(
    request.mock.calls.filter(([args]) => args.url === '/page/me/basic-data'),
  ).toHaveLength(2);
});

test('changing another user role does not refetch the current identity', async () => {
  await render();
  await act(async () =>
    store
      .dispatch(
        writeApi.endpoints.setUserRole.initiate({ id: 99, role: 'TEACHER' }),
      )
      .unwrap(),
  );
  expect(identity().role).toBe('TEACHER');
  expect(
    request.mock.calls.filter(([args]) => args.url === '/page/me/basic-data'),
  ).toHaveLength(1);
});

test('REST requests use Auth0 renewal while the cached identity and role stay intact', async () => {
  await render();
  auth.getAccessTokenSilently.mockClear().mockResolvedValue('renewed-token');
  const version =
    require('../../server-layer/query-layer/auth-session').getAuthSessionVersion();
  const adapter = jest.fn(async config => ({
    data: config.headers.Authorization,
    status: 200,
    headers: {},
    config,
  }));
  let response;
  await act(async () => {
    response = await axiosClient.get('/test', { adapter });
  });
  expect(response.data).toBe('Bearer renewed-token');
  expect(auth.getAccessTokenSilently).toHaveBeenCalledTimes(1);
  expect(auth.getAccessTokenSilently.mock.calls[0]).toEqual([]);
  expect(
    require('../../server-layer/query-layer/auth-session').getAuthSessionVersion(),
  ).toBe(version);
  expect(identity().id).toBe(7);
  expect(identity().role).toBe('TEACHER');
  expect(request).toHaveBeenCalledTimes(1);
});

test('a temporary Auth0 network failure keeps RTK identity and permits recovery', async () => {
  await render();
  const error = new Error('Network unavailable');
  auth.getAccessTokenSilently.mockRejectedValueOnce(error);
  const adapter = jest.fn(async config => ({
    data: 'ok',
    status: 200,
    headers: {},
    config,
  }));
  await act(async () => {
    await expect(axiosClient.get('/test', { adapter })).rejects.toBe(error);
  });
  expect(adapter).not.toHaveBeenCalled();
  expect(identity().id).toBe(7);
  expect(isAuthSessionActive()).toBe(true);
  expect(auth.logout).not.toHaveBeenCalled();
  // A transient SDK state change must not discard an established REST identity.
  auth = { ...auth, isAuthenticated: false, user: undefined };
  await render();
  expect(identity().id).toBe(7);
  expect(identity().role).toBe('TEACHER');
  expect(isAuthSessionActive()).toBe(true);
  auth.getAccessTokenSilently.mockResolvedValue('recovered-token');
  await act(async () => {
    await axiosClient.get('/test', { adapter });
  });
  expect(adapter).toHaveBeenCalledTimes(1);
  auth = { ...auth, isAuthenticated: true, user: { sub: 'auth0|teacher' } };
  await render();
  expect(identity().id).toBe(7);
  expect(request).toHaveBeenCalledTimes(1);
});

test('an expired Auth0 session clears private RTK data and offers login without a redirect', async () => {
  await render();
  store.dispatch(changeExamNameForCreate('Личный черновик'));
  auth.getAccessTokenSilently.mockRejectedValueOnce({
    error: 'login_required',
  });
  const adapter = jest.fn();
  await act(async () => {
    await expect(axiosClient.get('/test', { adapter })).rejects.toMatchObject({
      error: 'login_required',
    });
  });
  expect(adapter).not.toHaveBeenCalled();
  expect(identity().isLogin).toBe(false);
  expect(identity().role).toBe('STUDENT');
  expect(isAuthSessionActive()).toBe(false);
  expect(store.getState().studyWaysApi.queries).toEqual({});
  expect(store.getState().examEditorPageReducer).toEqual(
    RootReducer(undefined, { type: '@@INIT' }).examEditorPageReducer,
  );
  expect(auth.logout).toHaveBeenCalledWith({ openUrl: false });
});

test('the logout page clears private data and uses Auth0 v2 logoutParams', async () => {
  await render();
  expect(identity().isLogin).toBe(true);
  await act(async () =>
    root.render(
      <Provider store={store}>
        <Auth0Logout />
      </Provider>,
    ),
  );
  expect(auth.logout).toHaveBeenCalledWith({
    logoutParams: { returnTo: window.location.origin },
  });
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(isAuthSessionActive()).toBe(false);
  expect(store.getState().studyWaysApi.queries).toEqual({});
});

test('an absent token from SDK v2 cannot initialize an authenticated REST session', async () => {
  auth.getAccessTokenSilently.mockResolvedValue(undefined);
  await render();
  expect(request).not.toHaveBeenCalled();
  expect(identity().isLogin).toBe(false);
  expect(isAuthSessionActive()).toBe(false);
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(host.textContent).toContain('Готово');
});

test('an absent token during renewal never sends the previous token and can recover', async () => {
  await render();
  auth.getAccessTokenSilently.mockResolvedValueOnce(undefined);
  const adapter = jest.fn(async config => ({
    data: config.headers.Authorization,
    status: 200,
    headers: {},
    config,
  }));
  await act(async () => {
    await expect(axiosClient.get('/test', { adapter })).rejects.toThrow(
      'Auth0 не вернул токен доступа.',
    );
  });
  expect(adapter).not.toHaveBeenCalled();
  expect(identity().id).toBe(7);
  expect(auth.logout).not.toHaveBeenCalled();
  auth.getAccessTokenSilently.mockResolvedValue('recovered-token');
  let response;
  await act(async () => {
    response = await axiosClient.get('/test', { adapter });
  });
  expect(response.data).toBe('Bearer recovered-token');
  expect(adapter).toHaveBeenCalledTimes(1);
});
