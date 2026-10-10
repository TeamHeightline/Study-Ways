import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import StatusEditorPage from './StatusEditorPage';
import reducer from '../redux-store/StatusEditorSlice';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const act = React.act || legacyAct;
const people = [
  {
    id: 1,
    username: 'anna@example.com',
    user_access_level: 'STUDENT',
    users_userprofile: {
      firstname: 'Анна',
      lastname: 'Иванова',
      users_educationorganization: { organization_name: 'Университет ИТМО' },
    },
  },
  {
    id: 2,
    username: 'empty@example.com',
    user_access_level: 'CARD_EDITOR',
    users_userprofile: null,
  },
  {
    id: 3,
    username: 'teacher@example.com',
    user_access_level: 'TEACHER',
    users_userprofile: { firstname: 'Пётр', lastname: 'Соколов' },
  },
  {
    id: 4,
    username: 'admin@example.com',
    user_access_level: 'ADMIN',
    users_userprofile: {},
  },
];
let store, root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  axiosClient.get.mockResolvedValue({ data: { allUsers: people } });
  axiosClient.post.mockImplementation((_, data) =>
    Promise.resolve({
      data: {
        updatedUser: {
          ...people.find(user => user.id === data.user_id),
          user_access_level: data.user_access_level,
        },
      },
    }),
  );
  store = configureStore({ reducer: { statusEditor: reducer } });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function render() {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <StatusEditorPage />
      </Provider>,
    ),
  );
  await act(async () => jest.advanceTimersByTime(500));
}
async function click(node) {
  await act(async () => node.click());
  await act(async () => jest.advanceTimersByTime(500));
}
const button = label =>
  [...document.querySelectorAll('button')].find(
    node => node.textContent.trim() === label,
  );
const open = () =>
  click(
    container.querySelector(
      '[aria-label="Изменить уровень доступа: anna@example.com"]',
    ),
  );
async function choose(value) {
  await click(document.querySelector(`input[type="radio"][value="${value}"]`));
}
async function search(value) {
  const input = container.querySelector('input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('search and role filters work with missing profiles and reset together', async () => {
  await render();
  expect(container.textContent).toContain('Имя не указано');
  await search('empty@example');
  expect(container.textContent).toContain('empty@example.com');
  expect(container.textContent).not.toContain('anna@example.com');
  await click(
    [...container.querySelectorAll('[aria-pressed]')].find(node =>
      node.textContent.includes('Преподаватели'),
    ),
  );
  expect(container.textContent).toContain('Пользователи не найдены');
  await click(button('Сбросить фильтры'));
  expect(container.querySelector('input').value).toBe('');
  expect(container.textContent).toContain('anna@example.com');
  expect(container.textContent).toContain('empty@example.com');
  await search('петр');
  expect(container.textContent).toContain('teacher@example.com');
  await search('ИТМО');
  expect(container.textContent).toContain('anna@example.com');
  expect(axiosClient.get).toHaveBeenCalledTimes(1);
});

test('cancel leaves the user role unchanged and CARD_EDITOR can be saved', async () => {
  await render();
  await open();
  expect(button('Сохранить').disabled).toBe(true);
  await choose('TEACHER');
  expect(store.getState().statusEditor.users[0].user_access_level).toBe(
    'STUDENT',
  );
  await click(button('Отмена'));
  expect(store.getState().statusEditor.users[0].user_access_level).toBe(
    'STUDENT',
  );
  expect(axiosClient.post).not.toHaveBeenCalled();
  await open();
  await choose('CARD_EDITOR');
  await click(button('Сохранить'));
  expect(axiosClient.post).toHaveBeenCalledWith('/user/status/update', {
    user_id: 1,
    user_access_level: 'CARD_EDITOR',
  });
  expect(store.getState().statusEditor.selectedUser).toBeNull();
  expect(store.getState().statusEditor.users[0].user_access_level).toBe(
    'CARD_EDITOR',
  );
  expect(document.body.textContent).toContain('Уровень доступа обновлён');
});

test('failed save preserves the draft, shows an error and allows retry', async () => {
  axiosClient.post.mockRejectedValueOnce(new Error('Unavailable'));
  await render();
  await open();
  await choose('ADMIN');
  await click(button('Сохранить'));
  expect(document.body.textContent).toContain(
    'Не удалось сохранить уровень доступа',
  );
  expect(store.getState().statusEditor.selectedUser.user_access_level).toBe(
    'ADMIN',
  );
  expect(store.getState().statusEditor.users[0].user_access_level).toBe(
    'STUDENT',
  );
  await click(button('Сохранить'));
  expect(store.getState().statusEditor.users[0].user_access_level).toBe(
    'ADMIN',
  );
  expect(store.getState().statusEditor.selectedUser).toBeNull();
});

test('saving disables dismissal and prevents duplicate requests', async () => {
  let finish;
  axiosClient.post.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await render();
  await open();
  await choose('TEACHER');
  await click(button('Сохранить'));
  expect(button('Сохранить').disabled).toBe(true);
  expect(button('Отмена').disabled).toBe(true);
  expect(
    document.querySelector('[aria-label="Закрыть выбор уровня доступа"]')
      .disabled,
  ).toBe(true);
  await click(button('Сохранить'));
  expect(axiosClient.post).toHaveBeenCalledTimes(1);
  await act(async () =>
    finish({
      data: { updatedUser: { ...people[0], user_access_level: 'TEACHER' } },
    }),
  );
  await act(async () => jest.advanceTimersByTime(500));
  expect(store.getState().statusEditor.selectedUser).toBeNull();
});

test('list loading failure can be retried', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Unavailable'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить пользователей');
  await click(button('Повторить'));
  expect(container.textContent).toContain('anna@example.com');
  expect(container.textContent).not.toContain(
    'Не удалось загрузить пользователей',
  );
});
