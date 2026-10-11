import themeReducer from '../../../shared/theme/theme-store';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
let mockStore;
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import reducer from '../redux-store';
import ProfilePage from './ProfilePage';
import axiosClient from '../../../shared/server-layer/query-layer/config';

jest.mock('../../../app/redux-store/RootStore', () => ({
  __esModule: true,
  default: {
    dispatch: (...args) => mockStore.dispatch(...args),
    getState: () => mockStore.getState(),
  },
  useAppDispatch: require('react-redux').useDispatch,
  useAppSelector: require('react-redux').useSelector,
}));

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  get: jest.fn(),
  request: jest.fn(),
}));
const act = React.act || legacyAct;
const empty = {
  user_id: 7,
  users_customuser: null,
  firstname: null,
  lastname: null,
  avatar_src: null,
  group: null,
  study_in_id: null,
};
let container, root, store;
const button = title =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === title,
  );
const input = label => {
  const node = [...container.querySelectorAll('label')].find(
    node => node.textContent === label,
  );
  return document.getElementById(node.htmlFor);
};
async function fill(label, value) {
  await act(async () => {
    const field = input(label);
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(field, value);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.get.mockReset().mockResolvedValue({ data: empty });
  axiosClient.request.mockReset().mockResolvedValue({ data: {} });
  store = mockStore = configureStore({
    reducer: {
      theme: themeReducer,
      profile: reducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
    },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  await setTestUser(store, {
    id: 7,
    username: 'student',
    user_access_level: 'STUDENT',
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const render = () =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>,
    ),
  );
test('a completely empty profile remains editable, and cancel restores nullable fields', async () => {
  await render();
  expect(input('Фамилия').value).toBe('');
  expect(container.textContent).toContain('Ваше имя');
  expect(button('Сохранить').disabled).toBe(true);
  await fill('Имя', 'Анна');
  await fill('Фамилия', 'Иванова');
  expect(container.querySelector('aside h2').textContent).toBe('Анна Иванова');
  await act(async () => button('Отменить').click());
  expect(input('Имя').value).toBe('');
  expect(store.getState().profile.profileData.firstname).toBeNull();
});
test('a failed save preserves the draft and succeeds on retry without reloading it', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render();
  await fill('Имя', 'Анна');
  await act(async () => button('Сохранить').click());
  expect(container.textContent).toContain('Не удалось сохранить профиль');
  expect(input('Имя').value).toBe('Анна');
  expect(axiosClient.get).toHaveBeenCalledTimes(1);
  await act(async () => button('Сохранить').click());
  expect(axiosClient.request).toHaveBeenLastCalledWith(
    expect.objectContaining({
      url: '/page/write/profile',
      method: 'PUT',
      data: { ...empty, firstname: 'Анна' },
    }),
  );
  expect(container.textContent).toContain('Профиль сохранён');
  expect(button('Сохранить').disabled).toBe(true);
});
test('pending save blocks duplicate submissions and invalid avatar links cannot be saved', async () => {
  await render();
  await fill('Ссылка на изображение', 'javascript:alert(1)');
  expect(button('Сохранить').disabled).toBe(true);
  await fill('Ссылка на изображение', '');
  await fill('Группа', '101');
  let finish;
  axiosClient.request.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await act(async () => button('Сохранить').click());
  expect(input('Имя').disabled).toBe(true);
  expect(button('Сохраняем…').disabled).toBe(true);
  await act(async () => finish({ data: {} }));
  expect(input('Имя').disabled).toBe(false);
});
test('loading can be retried after a network error', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить профиль');
  await act(async () => button('Повторить').click());
  expect(input('Имя').value).toBe('');
});
