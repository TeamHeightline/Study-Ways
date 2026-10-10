import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import reducer from '../redux-store';
import ProfilePage from './ProfilePage';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';

jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: require('react-redux').useDispatch,
  useAppSelector: require('react-redux').useSelector,
}));
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { isLogin: true },
}));
jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
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
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.get.mockReset().mockResolvedValue({ data: empty });
  axiosClient.post.mockReset().mockResolvedValue({ data: {} });
  store = configureStore({ reducer: { profile: reducer } });
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
  axiosClient.post.mockRejectedValueOnce(new Error('Offline'));
  await render();
  await fill('Имя', 'Анна');
  await act(async () => button('Сохранить').click());
  expect(container.textContent).toContain('Не удалось сохранить профиль');
  expect(input('Имя').value).toBe('Анна');
  expect(axiosClient.get).toHaveBeenCalledTimes(1);
  await act(async () => button('Сохранить').click());
  expect(axiosClient.post).toHaveBeenLastCalledWith(
    '/page/profile/update-profile',
    { profileData: { ...empty, firstname: 'Анна' } },
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
  axiosClient.post.mockImplementation(
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
