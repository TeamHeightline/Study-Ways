import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { runInAction } from 'mobx';
import { selfStatisticApi } from '../Store/self-statistic-api';
import { SelfStatisticPage } from './self-statistic-page';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('@auth0/auth0-react', () => {
  const React = require('react');
  const AuthContext = React.createContext(null);
  return {
    Auth0Provider: AuthContext.Provider,
    useAuth0: () => React.useContext(AuthContext),
  };
});
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: require('mobx').observable({ user_data: { id: 7 } }),
}));
jest.mock('../../../Shared/Theme/ThemeManulNote', () => ({
  ThemeManulNote: () => null,
}));
jest.mock(
  '../../../App/SharedComponents/Notifications/RequireLogInAlert',
  () => ({
    RequireLogInAlert: () => <div>Войдите в аккаунт</div>,
  }),
);
jest.mock(
  '../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable',
  () => ({
    ShowStatisticTable: ({ attempt_id_array, pageChanger }) => (
      <>
        <div data-testid="attempts">{attempt_id_array.join(',')}</div>
        {pageChanger}
      </>
    ),
  }),
);

const act = React.act || legacyAct;
let container, root, store, auth;
const attempts = () => container.querySelector('[data-testid="attempts"]');
const pageTwo = () =>
  container.querySelector('button[aria-label="Go to page 2"]');

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  auth = { isLoading: false, isAuthenticated: true };
  runInAction(() => {
    UserStorage.user_data = { id: 7 };
  });
  axiosClient.request.mockReset().mockImplementation(async ({ params }) => ({
    data: {
      ids: params.page === 1 ? [105, 104] : [55],
      activePage: params.page,
      numPages: 2,
    },
  }));
  store = configureStore({
    reducer: { [selfStatisticApi.reducerPath]: selfStatisticApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(selfStatisticApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(selfStatisticApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function render(path = '/selfstatistic') {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <Auth0Provider value={auth}>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/selfstatistic" element={<SelfStatisticPage />} />
              <Route path="/courses" element={<div>Каталог</div>} />
            </Routes>
          </MemoryRouter>
        </Auth0Provider>
      </Provider>,
    ),
  );
}

test('importing the page and opening another route never requests private statistics', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  await render('/courses');
  expect(container.textContent).toBe('Каталог');
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('does not request statistics for anonymous users or while Auth0 is loading', async () => {
  auth = { isLoading: false, isAuthenticated: false };
  await render();
  expect(container.textContent).toContain('Войдите в аккаунт');
  expect(axiosClient.request).not.toHaveBeenCalled();
  auth = { isLoading: true, isAuthenticated: true };
  await render();
  expect(container.querySelector('[role="status"]')).not.toBeNull();
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('waits for authenticated Axios setup and the current user before requesting the list', async () => {
  runInAction(() => {
    UserStorage.user_data = null;
  });
  await render();
  expect(axiosClient.request).not.toHaveBeenCalled();
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = { id: 7 };
    }),
  );
  expect(attempts().textContent).toBe('105,104');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0]).toEqual(
    expect.objectContaining({
      url: '/page/self-statistic',
      params: { page: 1 },
    }),
  );
});

test('loads the selected page and hides IDs from the previous page while it is loading', async () => {
  await render();
  let finish;
  axiosClient.request.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await act(async () => pageTwo().click());
  expect(attempts()).toBeNull();
  expect(container.querySelector('[role="status"]')).not.toBeNull();
  expect(axiosClient.request.mock.calls[1][0].params).toEqual({ page: 2 });
  await act(async () =>
    finish({ data: { ids: [55], activePage: 2, numPages: 2 } }),
  );
  expect(attempts().textContent).toBe('55');
});

test('shows an empty state without rendering statistic rows', async () => {
  axiosClient.request.mockResolvedValue({
    data: { ids: [], activePage: 1, numPages: 1 },
  });
  await render();
  expect(container.textContent).toContain('У вас пока нет сохранённых попыток');
  expect(attempts()).toBeNull();
  expect(container.querySelector('nav')).toBeNull();
});

test('allows retrying a failed REST request', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Network unavailable'));
  await render();
  expect(container.textContent).toContain(
    'Не удалось загрузить вашу статистику',
  );
  await act(async () =>
    [...container.querySelectorAll('button')]
      .find(node => node.textContent === 'Повторить')
      .click(),
  );
  expect(attempts().textContent).toBe('105,104');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});

test('resets pagination and isolates private results when the current account changes', async () => {
  await render();
  await act(async () => pageTwo().click());
  expect(attempts().textContent).toBe('55');
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
  expect(attempts()).toBeNull();
  expect(axiosClient.request.mock.calls[2][0].params).toEqual({ page: 1 });
  await act(async () =>
    finish({ data: { ids: [999], activePage: 1, numPages: 1 } }),
  );
  expect(attempts().textContent).toBe('999');
  auth = { isLoading: false, isAuthenticated: false };
  await render();
  expect(attempts()).toBeNull();
  expect(axiosClient.request).toHaveBeenCalledTimes(3);
});

test('requests fresh statistics when the user returns to the page', async () => {
  await render();
  await act(async () =>
    root.render(
      <Provider store={store}>
        <div>Каталог</div>
      </Provider>,
    ),
  );
  await render();
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(attempts().textContent).toBe('105,104');
});
