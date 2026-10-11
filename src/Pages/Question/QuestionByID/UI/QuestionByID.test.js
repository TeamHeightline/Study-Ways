import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { studyWaysApi } from '../../../../Shared/ServerLayer/QueryLayer/api';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import { createDetailStatistic } from '../../../../Shared/ServerLayer/QueryLayer/detail-statistic.query';
import { QuestionByID } from './QuestionByID';

jest.mock('../../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { isLogin: true, user_data: { id: 7 }, username: 'student' },
}));
jest.mock('../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock(
  '../../../../Shared/ServerLayer/QueryLayer/detail-statistic.query',
  () => ({ createDetailStatistic: jest.fn() }),
);
jest.mock(
  '../../../../App/SharedComponents/Notifications/RequireLogInAlert',
  () => ({ RequireLogInAlert: () => <p>Войдите в аккаунт</p> }),
);
jest.mock('./ui-select-hard-level', () => ({
  __esModule: true,
  default: ({ questionStore }) => (
    <button onClick={() => questionStore.startQuestion()}>
      Начать {questionStore.questionText}
    </button>
  ),
}));
jest.mock('./ui-question-data', () => ({
  __esModule: true,
  default: props => (
    <>
      <h1>{props.questionText}</h1>
      <button onClick={props.onClick1}>Проверить</button>
    </>
  ),
}));
jest.mock('./ui-answers', () => ({
  __esModule: true,
  default: ({ questionStore }) => (
    <div data-testid="answers">
      {questionStore.answersArray.map(answer => (
        <button
          key={answer.id}
          data-answer-id={answer.id}
          onClick={() => questionStore.selectAnswerHandleChange(answer.id)}
        >
          {answer.answerText}
        </button>
      ))}
    </div>
  ),
}));
jest.mock('./ui-statistic', () => ({
  __esModule: true,
  default: ({ questionStore, restartQuestion }) => (
    <>
      <p>
        Завершено: {questionStore.numberOfPasses} попыток;{' '}
        {questionStore.maxSumOfPoints} баллов
      </p>
      <button onClick={restartQuestion}>Заново</button>
    </>
  ),
}));
jest.mock('./ui-create-answer-error-report', () => () => null);
jest.mock('./ui-help-text', () => () => null);
jest.mock('./ui-answer-report-success-saved-message', () => () => null);
jest.mock('./no-answers', () => ({ NoAnswers: () => <p>Нет ответов</p> }));

const act = React.act || legacyAct;
let container, root, store, originalFetch;
const makeData = (id = 42) => ({
  question: {
    id,
    text: `Вопрос ${id}`,
    number_of_showing_answers: 2,
    image: 'question.png',
  },
  answers: [
    {
      id: 11,
      text: 'Обязательный',
      is_true: true,
      is_required: true,
      hard_level_of_answer: 'EASY',
      check_queue: 1,
      image: 'answer.png',
      help_textV1: 'Легко',
      is_deleted: false,
      is_image_deleted: false,
    },
    {
      id: 12,
      text: 'Обычный',
      is_true: false,
      is_required: false,
      hard_level_of_answer: 'MEDIUM',
      check_queue: 2,
      image: null,
      is_deleted: false,
      is_image_deleted: true,
    },
    {
      id: 13,
      text: 'Удалённый',
      is_true: true,
      is_required: true,
      hard_level_of_answer: 'HARD',
      is_deleted: true,
      image: null,
    },
  ],
});
const encrypted = data => ({
  data: {
    encryptedQuestionData: CryptoJS.AES.encrypt(
      JSON.stringify(data),
      'sw-secret-key',
    ).toString(),
  },
});
async function render(id = 42, url = '/question/42', completed = undefined) {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[url]}>
          <QuestionByID id={id} questionHasBeenCompleted={completed} />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
function button(text) {
  return [...container.querySelectorAll('button')].find(item =>
    item.textContent.includes(text),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  UserStorage.isLogin = true;
  createDetailStatistic.mockResolvedValue({});
  axiosClient.request.mockImplementation(async ({ url }) =>
    encrypted(makeData(Number(url.split('/')[3]))),
  );
  originalFetch = global.fetch;
  global.fetch = jest.fn();
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  container.remove();
  global.fetch = originalFetch;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('reads the encrypted REST batch, keeps required answers, scores completion and restarts from cache', async () => {
  const completed = jest.fn();
  await render(42, '/question/42', completed);
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0]).toMatchObject({
    url: '/page/question-read/42/play',
    params: { examMode: false },
  });
  expect(button('Начать Вопрос 42')).toBeTruthy();
  await act(async () => button('Начать').click());
  expect(
    [...container.querySelectorAll('[data-answer-id]')]
      .map(node => node.textContent)
      .sort(),
  ).toEqual(['Обычный', 'Обязательный']);
  expect(global.fetch).not.toHaveBeenCalled();
  await act(async () =>
    container.querySelector('[data-answer-id="11"]').click(),
  );
  await act(async () => button('Проверить').click());
  expect(container.textContent).toContain('Завершено: 1 попыток; 15 баллов');
  expect(completed).toHaveBeenCalledWith(true);
  expect(createDetailStatistic).toHaveBeenCalledTimes(1);
  expect(createDetailStatistic).toHaveBeenCalledWith(
    expect.objectContaining({
      question_id: 42,
      question_has_been_completed: true,
      max_sum_of_answers_point: 15,
      is_useExamMode: false,
    }),
  );
  await act(async () => button('Заново').click());
  expect(button('Начать Вопрос 42')).toBeTruthy();
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  await act(async () => button('Начать').click());
  await act(async () => button('Проверить').click());
  expect(container.textContent).not.toContain('Завершено');
  expect(createDetailStatistic).toHaveBeenCalledTimes(1);
});

test('does not fetch private question data before login', async () => {
  UserStorage.isLogin = false;
  await render();
  expect(container.textContent).toContain('Войдите в аккаунт');
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('exam mode is recognized among other URL parameters and passed to the endpoint', async () => {
  await render(42, '/question/42?from=course&exam=true');
  expect(axiosClient.request.mock.calls[0][0].params.examMode).toBe(true);
  await act(async () => button('Начать').click());
  await act(async () =>
    container.querySelector('[data-answer-id="11"]').click(),
  );
  await act(async () => button('Проверить').click());
  expect(createDetailStatistic.mock.calls[0][0].is_useExamMode).toBe(true);
});

test('failed reads can be retried', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('network'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить вопрос');
  await act(async () => button('Повторить').click());
  expect(button('Начать Вопрос 42')).toBeTruthy();
});

test('late results from the previous question cannot replace the current question', async () => {
  let resolvePrevious;
  axiosClient.request.mockImplementation(({ url }) =>
    url.includes('/42/')
      ? new Promise(resolve => {
          resolvePrevious = resolve;
        })
      : Promise.resolve(encrypted(makeData(43))),
  );
  await render(42);
  await render(43);
  expect(button('Начать Вопрос 43')).toBeTruthy();
  await act(async () => resolvePrevious(encrypted(makeData(42))));
  expect(button('Начать Вопрос 43')).toBeTruthy();
  expect(container.textContent).not.toContain('Вопрос 42');
});
