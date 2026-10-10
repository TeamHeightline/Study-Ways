import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { runInAction } from 'mobx';
import SelectQuestionAndOpenIt from './select-question-and-open-it';
import { questionReviewApi } from '../Store/question-review-api';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';

jest.mock('../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('@auth0/auth0-react', () => {
  const React = require('react');
  const Context = React.createContext(null);
  return {
    Auth0Provider: Context.Provider,
    useAuth0: () => React.useContext(Context),
  };
});
jest.mock('../../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: require('mobx').observable({ user_data: null }),
}));
jest.mock(
  '../../../../App/SharedComponents/Notifications/RequireLogInAlert',
  () => ({ RequireLogInAlert: () => <div>Войдите в аккаунт</div> }),
);

const act = React.act || legacyAct;
let root, container, store, auth;
const items = (id = '100') => [
  { id, text: `Оптика ${id}`, ownerUsername: 'physics' },
  { id: String(Number(id) - 1), text: '', ownerUsername: null },
];
const page = (id = '100', activePage = 1) => ({
  items: items(id),
  activePage,
  numPages: 3,
});
const listCalls = () =>
  axiosClient.request.mock.calls
    .map(([args]) => args)
    .filter(args => args.url.startsWith('/page/question-selector'));
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
const click = node => act(async () => node.click());
const listText = () =>
  container.querySelector('.sw-review-question-grid')?.textContent || '';
function Location() {
  return <output>{useLocation().pathname}</output>;
}
async function render(visible = true) {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <Auth0Provider value={auth}>
          <MemoryRouter initialEntries={['/editor/checkquestion']}>
            <Routes>
              <Route
                path="/editor/checkquestion/*"
                element={
                  visible ? (
                    <SelectQuestionAndOpenIt />
                  ) : (
                    <div>Другая страница</div>
                  )
                }
              />
            </Routes>
            <Location />
          </MemoryRouter>
        </Auth0Provider>
      </Provider>,
    ),
  );
}
async function selectAuthor(label) {
  await click(container.querySelector('[aria-label="Выбрать автора"]'));
  await click(
    [...document.querySelectorAll('[role="option"]')].find(node =>
      node.textContent.includes(label),
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  auth = { isAuthenticated: true, isLoading: false };
  runInAction(() => {
    UserStorage.user_data = { id: 7 };
  });
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ url, params }) => ({
      data: url.endsWith('/authors')
        ? [
            {
              id: 7,
              username: 'physics',
              users_userprofile: { firstname: 'Анна', lastname: null },
            },
            { id: 8, username: 'no-profile', users_userprofile: null },
          ]
        : page(params.page === 1 ? '100' : '52', params.page),
    }));
  store = configureStore({
    reducer: { [questionReviewApi.reducerPath]: questionReviewApi.reducer },
    middleware: get => get().concat(questionReviewApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({
      width: 300,
      height: 44,
      top: 100,
      bottom: 144,
      left: 100,
      right: 400,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(questionReviewApi.util.resetApiState());
  });
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('importing the page or mounting another page starts no list requests', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  await render(false);
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('one REST page supplies all 48 cards without per-question requests and retains navigation', async () => {
  const summaries = Array.from({ length: 48 }, (_, i) => ({
    id: String(100 - i),
    text: i ? '' : 'Оптика',
    ownerUsername: i ? null : 'physics',
  }));
  axiosClient.request.mockImplementation(async ({ url }) => ({
    data: url.endsWith('/authors')
      ? []
      : { items: summaries, activePage: 1, numPages: 2 },
  }));
  await render();
  expect(
    axiosClient.request.mock.calls.map(([args]) => args.url).sort(),
  ).toEqual(['/page/question-editor-page/authors', '/page/question-selector']);
  expect(listCalls()[0].params).toEqual({ page: 1 });
  expect(container.querySelectorAll('.sw-review-question-card')).toHaveLength(
    48,
  );
  expect(listText()).toContain('Автор не указан');
  expect(listText()).toContain('Вопрос без текста');
  expect(listText()).not.toContain('undefined');
  await click(container.querySelector('.sw-review-question-action'));
  expect(container.querySelector('output').textContent).toBe(
    '/editor/checkquestion/question/100',
  );
});

test('pagination and author changes query the server and author changes reset page 1', async () => {
  await render();
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  expect(listCalls().at(-1).params).toEqual({ page: 2 });
  expect(container.textContent).toContain('Страница 2 из 3');
  expect(listText()).toContain('Оптика 52');
  expect(listText()).not.toContain('Оптика 100');
  await selectAuthor('Анна');
  expect(listCalls().at(-1).params).toEqual({ page: 1, authorId: '7' });
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  expect(listCalls().at(-1).params).toEqual({ page: 2, authorId: '7' });
  await click(container.querySelector('[aria-label="Сбросить автора"]'));
  expect(listCalls().at(-1).params).toEqual({ page: 1 });
});

test('new filters hide old results and delayed responses cannot replace the selected author', async () => {
  await render();
  let finish;
  axiosClient.request.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await selectAuthor('Анна');
  expect(
    container.querySelector('[aria-label="Загрузка вопросов"]'),
  ).not.toBeNull();
  expect(listText()).not.toContain('Оптика 100');
  axiosClient.request.mockResolvedValueOnce({ data: page('80') });
  await selectAuthor('no-profile');
  expect(listText()).toContain('Оптика 80');
  await act(async () => finish({ data: page('70') }));
  expect(listText()).toContain('Оптика 80');
  expect(listText()).not.toContain('Оптика 70');
});

test('personal questions wait for authenticated Axios setup and never send an owner ID', async () => {
  auth = { isAuthenticated: true, isLoading: true };
  runInAction(() => {
    UserStorage.user_data = null;
  });
  await render();
  await selectAuthor('Мои вопросы');
  expect(listCalls()).toHaveLength(1);
  auth = { isAuthenticated: true, isLoading: false };
  await render();
  expect(listCalls()).toHaveLength(1);
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = { id: 7 };
    }),
  );
  expect(listCalls().at(-1).url).toBe('/page/question-selector/my');
  expect(listCalls().at(-1).params).toEqual({ page: 1 });
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  expect(listCalls().at(-1).params).toEqual({ page: 2 });
});

test('anonymous users can browse authors and are asked to sign in for personal questions', async () => {
  auth = { isAuthenticated: false, isLoading: false };
  runInAction(() => {
    UserStorage.user_data = null;
  });
  await render();
  expect(listText()).toContain('Оптика 100');
  await selectAuthor('Мои вопросы');
  expect(container.textContent).toContain('Войдите в аккаунт');
  expect(listCalls()).toHaveLength(1);
  expect(listText()).not.toContain('Оптика 100');
  await selectAuthor('Все авторы');
  expect(listText()).toContain('Оптика 100');
});

test('personal cached questions never cross accounts or remain visible after logout', async () => {
  await render();
  await selectAuthor('Мои вопросы');
  let finish;
  axiosClient.request.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = { id: 8 };
    }),
  );
  expect(listText()).not.toContain('Оптика 100');
  await act(async () => finish({ data: page('88') }));
  expect(listText()).toContain('Оптика 88');
  expect(listCalls().filter(args => args.url.endsWith('/my'))).toHaveLength(2);
  auth = { isAuthenticated: false, isLoading: false };
  await render();
  expect(container.textContent).toContain('Войдите в аккаунт');
  expect(listText()).not.toContain('Оптика 88');
});

test('network failures retry the selected filters and empty results can refresh', async () => {
  await render();
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await selectAuthor('Анна');
  expect(container.textContent).toContain('Не удалось загрузить вопросы');
  expect(listText()).not.toContain('Оптика 100');
  axiosClient.request.mockResolvedValueOnce({
    data: { items: [], activePage: 1, numPages: 1 },
  });
  await click(button('Повторить'));
  expect(container.textContent).toContain('Вопросов пока нет');
  expect(listCalls().at(-1).params).toEqual({ page: 1, authorId: '7' });
  await click(button('Обновить список'));
  expect(listText()).toContain('Оптика 100');
  expect(listCalls().at(-1).params).toEqual({ page: 1, authorId: '7' });
});

test('each mounted page owns its filters instead of retaining a global selector state', async () => {
  await render();
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  await selectAuthor('Анна');
  await render(false);
  await render();
  expect(listCalls().at(-1).params).toEqual({ page: 1 });
  expect(container.querySelector('input[role="combobox"]').value).toBe(
    'Все авторы',
  );
});
