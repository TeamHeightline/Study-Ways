import React from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { studyWaysApi } from '../../../../Shared/ServerLayer/QueryLayer/api';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';
import reducer, {
  resetExam,
  setAccessPassword,
} from '../redux-store/ExamPlayerSlice';
import { openExamPageThunk } from '../redux-store/AsyncActions';
import UIAccessPassword from './ui-access-password';
let mockStore;
jest.mock('../../../../App/ReduxStore/RootStore', () => ({
  __esModule: true,
  default: { dispatch: (...args) => mockStore.dispatch(...args) },
  useAppDispatch: () => require('react-redux').useDispatch(),
  useAppSelector: require('react-redux').useSelector,
}));
jest.mock('../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { username: 'student' },
}));
const act = React.act || legacyAct;
let root, host;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  mockStore = configureStore({
    reducer: {
      examPlayer: reducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
    },
    middleware: getDefault =>
      getDefault({ serializableCheck: false }).concat(studyWaysApi.middleware),
  });
  axiosClient.request.mockReset();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  mockStore.dispatch(studyWaysApi.util.resetApiState());
  host.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
test('typing a password never unlocks an exam; rejected server validation keeps it locked and retry can succeed', async () => {
  axiosClient.request
    .mockRejectedValueOnce({
      response: { status: 403, data: { message: 'Неверный пароль экзамена' } },
    })
    .mockResolvedValue({ data: { id: 1, question_statuses: [] } });
  await act(async () =>
    root.render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/exam/example']}>
          <Routes>
            <Route path="/exam/:uid" element={<UIAccessPassword />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
  );
  await act(async () => {
    const field = host.querySelector('input');
    field.value = 'guess';
    Simulate.change(field);
  });
  expect(mockStore.getState().examPlayer.is_password_check_passed).toBe(false);
  expect(axiosClient.request).not.toHaveBeenCalled();
  await act(async () => Simulate.submit(host.querySelector('form')));
  expect(mockStore.getState().examPlayer.is_password_check_passed).toBe(false);
  expect(host.textContent).toContain('Неверный пароль экзамена');
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/exams/example/open',
      method: 'POST',
      data: { password: 'guess' },
    }),
  );
  await act(async () => {
    mockStore.dispatch(setAccessPassword('correct'));
  });
  await act(async () => Simulate.submit(host.querySelector('form')));
  expect(mockStore.getState().examPlayer.is_password_check_passed).toBe(true);
});
test('a late response from an earlier exam cannot restore access after leaving it', async () => {
  let finish;
  axiosClient.request.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  const request = mockStore.dispatch(
    openExamPageThunk({ uid: 'old', password: 'old' }),
  );
  mockStore.dispatch(resetExam());
  finish({ data: { id: 1, question_statuses: [{ id: 1, question_id: 42 }] } });
  await request;
  expect(mockStore.getState().examPlayer.is_password_check_passed).toBe(false);
  expect(mockStore.getState().examPlayer.question_statuses).toEqual([]);
});
