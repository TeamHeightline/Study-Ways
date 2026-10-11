import statisticView from '../store/DetailStatisticStoreByID';
import themeReducer from '../../../shared/theme/theme-store';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { attemptApi } from '../store/attempt-api';
import axiosClient from '../../../shared/server-layer/query-layer/config';
import { DetailStatisticByID } from './DetailStatisticByID';

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));

jest.mock('./ChartAndStepByStepStatistic', () => ({
  ChartAndStepByStepStatistic: () => null,
}));

const act = React.act || legacyAct;
let root, container, attempt, store, failNetwork;
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  failNetwork = false;
  attempt = {
    id: '7',
    userName: 'student@example.com',
    isLogin: true,
    isUseexammode: false,
    maxSumOfAnswersPoint: 10,
    question: { id: '33' },
    questionText: 'Тестовый вопрос',
    questionHasBeenCompleted: true,
    questionSequence: null,
    statistic: {
      numberOfPasses: 2,
      ArrayForShowAnswerPoints: [
        { numberOfPasses: 1, answerPoints: 5 },
        { numberOfPasses: 2, answerPoints: 10 },
      ],
      ArrayForShowWrongAnswers: [
        { numberOfPasses: 1, numberOfWrongAnswers: [42] },
        { numberOfPasses: 2, numberOfWrongAnswers: [] },
      ],
    },
    createdAt: '2026-10-10T10:00:00Z',
    authorizedUser: { userprofile: null },
  };
  axiosClient.request.mockImplementation(async () => {
    if (failNetwork) throw new Error('Network unavailable');
    return {
      data: {
        ...attempt,
        userName: attempt.userName || 'Анонимный пользователь',
      },
    };
  });
  store = configureStore({
    reducer: {
      statisticView,
      theme: themeReducer,
      [attemptApi.reducerPath]: attemptApi.reducer,
    },
    middleware: getDefault => getDefault().concat(attemptApi.middleware),
  });
  await setTestUser(store, {
    id: 7,
    username: 'student',
    user_access_level: 'TEACHER',
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  store.dispatch(attemptApi.util.resetApiState());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function renderResult() {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <table>
          <tbody>
            <DetailStatisticByID attempt_id={7} />
          </tbody>
        </table>
      </Provider>,
    ),
  );
  await act(async () => new Promise(resolve => setTimeout(resolve, 0)));
}
function expectStatistic() {
  expect(container.textContent).toContain('student@example.com');
  expect(container.textContent).toContain('8/10 (80%)');
  expect(container.querySelector('[role="alert"]')).toBeNull();
}

test.each([
  [
    'completely empty profile',
    { firstname: null, lastname: null, avatarSrc: null },
  ],
  ['missing lastname', { firstname: 'Анна', lastname: null, avatarSrc: null }],
  [
    'missing firstname',
    { firstname: null, lastname: 'Иванова', avatarSrc: null },
  ],
])('REST statistics renders nullable fields for %s', async (_, profile) => {
  attempt.authorizedUser.userprofile = profile;
  await renderResult();
  expectStatistic();
  expect(container.textContent).toContain(
    [profile.firstname, profile.lastname].filter(Boolean).join(' ') ||
      'Не указаны',
  );
});

test.each([
  ['no profile record', null],
  ['blank strings', { firstname: ' ', lastname: '', avatarSrc: null }],
])('statistics renders with %s', async (_, profile) => {
  attempt.authorizedUser.userprofile = profile;
  await renderResult();
  expectStatistic();
  expect(container.textContent).toContain('Не указаны');
  expect(container.querySelector('img')).toBeNull();
});

test('a filled profile still shows its name and avatar', async () => {
  attempt.authorizedUser.userprofile = {
    firstname: 'Анна',
    lastname: 'Иванова',
    avatarSrc: '/avatar.jpg',
  };
  await renderResult();
  expectStatistic();
  expect(container.textContent).toContain('Анна Иванова');
  expect(container.querySelector('img').getAttribute('src')).toBe(
    '/avatar.jpg',
  );
});

test('an anonymous attempt does not require an authorized user', async () => {
  attempt.authorizedUser = null;
  attempt.userName = null;
  attempt.isLogin = false;
  await renderResult();
  expect(container.textContent).toContain('Анонимный пользователь');
  expect(container.textContent).toContain('8/10 (80%)');
  expect(container.textContent).toContain('Не указаны');
});

test('network failure offers retry instead of an unhandled rejection', async () => {
  failNetwork = true;
  await renderResult();
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Не удалось загрузить результат №7',
  );
  failNetwork = false;
  await act(async () => container.querySelector('button').click());
  await act(async () => new Promise(resolve => setTimeout(resolve, 0)));
  expectStatistic();
});

test('changing results ignores a late response from the previous attempt', async () => {
  let finishOld;
  axiosClient.request.mockImplementation(({ url }) =>
    url.endsWith('/7')
      ? new Promise(resolve => {
          finishOld = resolve;
        })
      : Promise.resolve({
          data: { ...attempt, id: '8', userName: 'new@example.com' },
        }),
  );
  await renderResult();
  await act(async () =>
    root.render(
      <Provider store={store}>
        <table>
          <tbody>
            <DetailStatisticByID attempt_id={8} />
          </tbody>
        </table>
      </Provider>,
    ),
  );
  expect(container.textContent).toContain('new@example.com');
  await act(async () => finishOld({ data: attempt }));
  expect(container.textContent).not.toContain('student@example.com');
});
