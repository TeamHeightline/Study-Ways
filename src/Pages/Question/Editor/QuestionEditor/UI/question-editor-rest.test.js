import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { runInAction } from 'mobx';
import { studyWaysApi } from '../../../../../Shared/ServerLayer/QueryLayer/api';
import { questionReadApi } from '../../../question-read-api';
import axiosClient from '../../../../../Shared/ServerLayer/QueryLayer/config';
import { ClientStorage } from '../../../../../Shared/Store/ApolloStorage/ClientStorage';
import { QuestionEditorStorage as editor } from '../Store/QuestionEditorStorage';
import { EditQuestionByID } from './EditQuestionByID';

jest.mock('../../../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
}));
jest.mock('../../../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: {
    user_data: { id: 7 },
    userAccessLevel: 'TEACHER',
    isLogin: true,
  },
}));
jest.mock('../../../../../Shared/Store/ApolloStorage/ClientStorage', () => ({
  ClientStorage: { client: { query: jest.fn(), mutate: jest.fn() } },
}));
jest.mock('../../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
}));
jest.mock('./ui-connected-theme-selector', () => () => null);
jest.mock('./ui-statistic', () => () => null);
jest.mock('./ui-question-preview', () => ({ UiQuestionPreview: () => null }));
jest.mock(
  '../../AnswersEditor/EditAnswerByID/UI/answer-preview',
  () => () => null,
);

const act = React.act || legacyAct;
let container, root, reduxStore;
const answer = (id = 21) => ({
  id: String(id),
  question: { id: '42' },
  text: `Ответ ${id}`,
  isTrue: true,
  helpTextv1: 'Лёгкая подсказка',
  helpTextv2: 'Средняя подсказка',
  helpTextv3: 'Высокая подсказка',
  checkQueue: 10,
  hardLevelOfAnswer: 'EASY',
  isImageDeleted: false,
  isDeleted: false,
  isInvisible: false,
  isRequired: id === 21,
  onlyForExam: false,
  image: 'answer.png',
});
const data = (id = 42) => ({
  id: String(id),
  text: `Вопрос ${id}`,
  numberOfShowingAnswers: 8,
  connectedTheme: { id: '900' },
  author: [],
  theme: [],
  image: 'q.png',
  answers: [answer(21), answer(22)],
});
const button = text =>
  [...container.querySelectorAll('button')].find(item =>
    item.textContent.includes(text),
  );
async function render(id = '42') {
  await act(async () =>
    root.render(
      <Provider store={reduxStore}>
        <MemoryRouter>
          <EditQuestionByID questionID={id} />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  axiosClient.get.mockResolvedValue({ data: [] });
  axiosClient.post.mockResolvedValue({ data: { id: 42 } });
  axiosClient.request.mockImplementation(async ({ url }) => ({
    data: url.includes('/answers/')
      ? answer(Number(url.split('/')[4]))
      : data(Number(url.split('/')[3])),
  }));
  ClientStorage.client.mutate.mockResolvedValue({
    data: { updateAnswer: { errors: [] } },
  });
  runInAction(() => {
    editor.questionHasBeenSelected = false;
    editor.clearAllStatisticData();
  });
  reduxStore = configureStore({
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
    reduxStore.dispatch(studyWaysApi.util.resetApiState());
  });
  clearTimeout(editor.savingTimer);
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('loads all editor answers in one REST batch without auto-saving initial data or fetching each answer', async () => {
  await render();
  await act(async () => jest.advanceTimersByTime(2000));
  expect(editor.questionHasBeenSelected).toBe(true);
  expect(editor.NumberOfAllAnswers).toBe(2);
  expect(editor.NumberOfRequiredAnswers).toBe(1);
  expect(container.querySelectorAll('article.sw-qedit-answer')).toHaveLength(2);
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0].url).toBe(
    '/page/question-read/42/editor',
  );
  expect(ClientStorage.client.query).not.toHaveBeenCalled();
  expect(axiosClient.post).not.toHaveBeenCalled();
  expect(ClientStorage.client.mutate).not.toHaveBeenCalled();
});

test('answer settings work after batch hydration; editing a hint saves and cache refresh preserves the draft', async () => {
  await render();
  await act(async () => button('Настройки и подсказки').click());
  const article = container.querySelector('article');
  const fields = [...article.querySelectorAll('textarea:not([aria-hidden])')];
  expect(fields.map(field => field.value)).toEqual([
    'Ответ 21',
    'Лёгкая подсказка',
    'Средняя подсказка',
    'Высокая подсказка',
  ]);
  await act(async () => {
    fields[1].value = 'Новая подсказка';
    Simulate.change(fields[1]);
  });
  await act(async () => jest.advanceTimersByTime(1600));
  expect(ClientStorage.client.mutate).toHaveBeenCalledTimes(1);
  expect(ClientStorage.client.mutate.mock.calls[0][0].variables).toMatchObject({
    id: '21',
    helpTextv1: 'Новая подсказка',
    isTrue: true,
  });
  expect(fields[1].value).toBe('Новая подсказка');
  expect(
    axiosClient.request.mock.calls.some(([request]) =>
      request.url.includes('/answers/'),
    ),
  ).toBe(false);
});

test('editing the question saves through the existing writer and invalidates previews without overwriting a later edit', async () => {
  await render();
  const field = container.querySelector('textarea');
  await act(async () => {
    field.value = 'Новая формулировка';
    Simulate.change(field);
  });
  await act(async () => jest.advanceTimersByTime(1600));
  expect(axiosClient.post).toHaveBeenCalledWith(
    '/page/edit-question-by-id/update-question',
    expect.objectContaining({
      id: 42,
      text: 'Новая формулировка',
      connected_theme_id: 900,
    }),
  );
  expect(field.value).toBe('Новая формулировка');
  await act(async () => {
    field.value = 'Ещё не сохранено';
    Simulate.change(field);
  });
  await act(async () =>
    reduxStore.dispatch(
      questionReadApi.util.invalidateTags([{ type: 'QuestionEditor', id: 42 }]),
    ),
  );
  expect(field.value).toBe('Ещё не сохранено');
});

test('only a newly created answer needs a separate REST read', async () => {
  await render();
  ClientStorage.client.mutate.mockResolvedValueOnce({
    data: { createAnswer: { answer: { id: '23' } } },
  });
  await act(async () => button('Добавить ответ').click());
  expect(
    axiosClient.request.mock.calls
      .filter(([request]) => request.url.includes('/answers/'))
      .map(([request]) => request.url),
  ).toEqual(['/page/question-read/answers/23/editor']);
  expect(container.querySelectorAll('article.sw-qedit-answer')).toHaveLength(3);
});

test('editor read errors can be retried', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('network'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить вопрос');
  await act(async () => button('Повторить').click());
  expect(container.querySelectorAll('article.sw-qedit-answer')).toHaveLength(2);
});

test('a late question save cannot mark a newer edit as saved', async () => {
  await render();
  let finishSave;
  axiosClient.post.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finishSave = resolve;
      }),
  );
  const field = container.querySelector('textarea');
  await act(async () => {
    field.value = 'Первая правка';
    Simulate.change(field);
  });
  await act(async () => jest.advanceTimersByTime(1600));
  await act(async () => {
    field.value = 'Вторая правка';
    Simulate.change(field);
  });
  await act(async () => finishSave({ data: { id: 42 } }));
  expect(field.value).toBe('Вторая правка');
  expect(editor.unsavedFlag).toBe(true);
  await act(async () => jest.advanceTimersByTime(1600));
  expect(editor.unsavedFlag).toBe(false);
  expect(axiosClient.post.mock.calls.at(-1)[1].text).toBe('Вторая правка');
});
