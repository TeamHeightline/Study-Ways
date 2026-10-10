import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { runInAction } from 'mobx';
import { StatisticV2 } from './StatisticV2';
import { statisticApi } from './Store/statistic-api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
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
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: require('mobx').observable({ user_data: null }),
}));
jest.mock(
  '../../../App/SharedComponents/Notifications/RequireLogInAlert',
  () => ({
    RequireLogInAlert: () => <div>Войдите в аккаунт</div>,
  }),
);
jest.mock('./show-statistic-for-selected-questions/ShowStatisticTable', () => ({
  ShowStatisticTable: ({ attempt_id_array, pageChanger }) => (
    <>
      <div data-testid="attempts">{attempt_id_array.join(',')}</div>
      {pageChanger}
    </>
  ),
}));
jest.mock('@mui/x-date-pickers/DateTimePicker', () => ({
  DateTimePicker: ({ label, value, onChange }) => (
    <input
      aria-label={label}
      value={value?.toISOString() ?? ''}
      onChange={event =>
        onChange(event.target.value ? new Date(event.target.value) : null)
      }
    />
  ),
}));

const act = React.act || legacyAct;
let root, container, store, auth;
const attempts = () => container.querySelector('[data-testid="attempts"]');
const calls = () =>
  axiosClient.request.mock.calls
    .map(([args]) => args)
    .filter(args => args.url.endsWith('/attempts'));
const pageTwo = () =>
  container.querySelector('button[aria-label="Go to page 2"]');

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  auth = { isLoading: false, isAuthenticated: true };
  runInAction(() => {
    UserStorage.user_data = { id: 7, user_access_level: 'TEACHER' };
  });
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ url, params }) => ({
      data: url.endsWith('/questions')
        ? [
            { id: 33, text: 'Оптика' },
            { id: 34, text: 'Магнитное поле' },
          ]
        : {
            ids: params.page === 1 ? [105, 104] : [55],
            activePage: params.page,
            numPages: 2,
          },
    }));
  store = configureStore({
    reducer: { [statisticApi.reducerPath]: statisticApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(statisticApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(statisticApi.util.resetApiState());
  });
  container.remove();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function render(visible = true) {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <Auth0Provider value={auth}>
          {visible ? <StatisticV2 /> : <div>Каталог</div>}
        </Auth0Provider>
      </Provider>,
    ),
  );
}
async function fill(input, value) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('importing the statistics page and mounting another page sends no requests', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  await render(false);
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('does not fetch before authentication is ready or for a student', async () => {
  auth = { isLoading: false, isAuthenticated: false };
  await render();
  expect(container.textContent).toContain('Войдите в аккаунт');
  auth = { isLoading: true, isAuthenticated: true };
  await render();
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = null;
    }),
  );
  auth = { isLoading: false, isAuthenticated: true };
  await render();
  expect(axiosClient.request).not.toHaveBeenCalled();
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = { id: 7, user_access_level: 'STUDENT' };
    }),
  );
  expect(container.textContent).toContain('Недостаточно прав');
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('loads IDs and all question labels with exactly two REST requests', async () => {
  await render();
  expect(attempts().textContent).toBe('105,104');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(calls()[0].params).toEqual(
    expect.objectContaining({
      page: 1,
      questions: '',
      userName: '',
      onlyInExam: false,
      onlyInQs: false,
    }),
  );
  expect(calls()[0].params.userId).toBeUndefined();
  await act(async () =>
    container.querySelector('button[title="Выбрать вопрос"]').click(),
  );
  expect(document.body.textContent).toContain('Магнитное поле');
  await act(async () =>
    [...document.querySelectorAll('[role="option"]')]
      .find(node => node.textContent.includes('Оптика'))
      .click(),
  );
  expect(calls()[1].params.questions).toBe('33');
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/questions'),
    ),
  ).toHaveLength(1);
});

test('filter changes reset pagination and debounce the user name', async () => {
  jest.useFakeTimers();
  await render();
  await act(async () => pageTwo().click());
  expect(attempts().textContent).toBe('55');
  await fill(container.querySelector('input[id]'), 'teacher');
  expect(calls()).toHaveLength(2);
  await act(async () => jest.advanceTimersByTime(350));
  expect(calls()).toHaveLength(3);
  expect(calls()[2].params).toEqual(
    expect.objectContaining({ page: 1, userName: 'teacher' }),
  );
  await act(async () => pageTwo().click());
  await act(async () =>
    container.querySelector('input[type="checkbox"]').click(),
  );
  expect(calls().at(-1).params).toEqual(
    expect.objectContaining({ page: 1, onlyInExam: true }),
  );
});

test('auto-refresh runs every seven seconds only while the page is mounted', async () => {
  jest.useFakeTimers();
  await render();
  expect(calls()).toHaveLength(1);
  await act(async () => jest.advanceTimersByTime(7000));
  expect(calls()).toHaveLength(2);
  await render(false);
  await act(async () => jest.advanceTimersByTime(14000));
  expect(calls()).toHaveLength(2);
});

test('invalid or cleared time does not send requests', async () => {
  await render();
  await fill(
    container.querySelector('input[aria-label="Результаты начиная с"]'),
    '',
  );
  expect(container.textContent).toContain('Укажите корректные дату и время');
  expect(calls()).toHaveLength(1);
});

test('empty data and a failed request have useful states and retry', async () => {
  axiosClient.request.mockImplementation(async ({ url }) => {
    if (url.endsWith('/questions')) return { data: [] };
    throw new Error('Offline');
  });
  await render();
  expect(container.textContent).toContain('Не удалось загрузить статистику');
  axiosClient.request.mockResolvedValue({
    data: { ids: [], activePage: 1, numPages: 1 },
  });
  await act(async () =>
    [...container.querySelectorAll('button')]
      .find(node => node.textContent === 'Повторить')
      .click(),
  );
  expect(container.textContent).toContain(
    'По выбранным фильтрам попытки не найдены',
  );
});

test('a failed question lookup does not block results or other filters', async () => {
  axiosClient.request.mockImplementation(async ({ url }) => {
    if (url.endsWith('/questions')) throw new Error('Offline');
    return { data: { ids: [99], activePage: 1, numPages: 1 } };
  });
  await render();
  expect(attempts().textContent).toBe('99');
  expect(container.textContent).toContain(
    'Не удалось загрузить список вопросов',
  );
});

test('switching accounts resets filters and never shows the previous account cache', async () => {
  await render();
  await act(async () => pageTwo().click());
  let finish;
  axiosClient.request.mockImplementation(({ url }) =>
    url.endsWith('/questions')
      ? Promise.resolve({ data: [] })
      : new Promise(resolve => {
          finish = resolve;
        }),
  );
  await act(async () =>
    runInAction(() => {
      UserStorage.user_data = { id: 8, user_access_level: 'ADMIN' };
    }),
  );
  expect(attempts()).toBeNull();
  expect(calls().at(-1).params.page).toBe(1);
  await act(async () =>
    finish({ data: { ids: [999], activePage: 1, numPages: 1 } }),
  );
  expect(attempts().textContent).toBe('999');
});
