import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RootReducer } from '../../../../../../App/ReduxStore/RootReducer';
import { studyWaysApi } from '../../../../../../Shared/ServerLayer/QueryLayer/api';
import axiosClient, {
  setAccessToken,
} from '../../../../../../Shared/ServerLayer/QueryLayer/config';
import { setTestUser } from '../../../../../../Shared/Store/UserStore/user-session.test-utils';
import { clearUserSession } from '../../../../../../Shared/Store/UserStore/session-lifecycle';
import { questionReadApi } from '../../../../question-read-api';
import {
  initializeAnswer,
  changeAnswerField,
} from '../model/answer-editor-slice';
import { useAnswerEditorController } from '../model/use-answer-editor';
import EditAnswerByID from './edit-answer-by-id';
import { AnswersEditor } from './AnswersEditor';

jest.mock('../../../../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
  useAppSelector: require('react-redux').useSelector,
}));
const act = React.act || legacyAct;
const answer = (id = 21) => ({
  id: String(id),
  question: { id: '42', createdById: 7 },
  text: `Ответ ${id}`,
  isTrue: true,
  helpTextv1: '',
  helpTextv2: 'Ваш ответ следует дополнить',
  helpTextv3: 'Особая подсказка',
  checkQueue: 10,
  hardLevelOfAnswer: 'EASY',
  isImageDeleted: false,
  isDeleted: false,
  isInvisible: false,
  isRequired: id === 21,
  onlyForExam: false,
  image: 'answers/original.png',
});
const written = (draft, body = {}) => ({
  id: Number(draft.id),
  question_id: Number(draft.question.id),
  text: draft.text,
  is_true: draft.isTrue,
  help_textV1: draft.helpTextv1,
  help_textV2: draft.helpTextv2,
  help_textV3: draft.helpTextv3,
  check_queue: draft.checkQueue,
  hard_level_of_answer: draft.hardLevelOfAnswer,
  is_deleted: draft.isDeleted,
  is_invisible: draft.isInvisible,
  is_required: draft.isRequired,
  is_image_deleted: draft.isImageDeleted,
  only_for_exam: draft.onlyForExam,
  ...body,
});
let root, container, store, request, records, reports, controller, outstanding;
function Harness({ id = 21 }) {
  controller = useAnswerEditorController(`7:${id}`, 7);
  return null;
}
function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  outstanding.push(resolve);
  return { resolve, promise };
}
const draft = (id = 21) => store.getState().answerEditor.entries[`7:${id}`];
const calls = method =>
  request.mock.calls
    .map(([args]) => args)
    .filter(args => args.method === method);
const button = text =>
  [...document.querySelectorAll('button')].find(node =>
    node.textContent.includes(text),
  );
async function render(element = <EditAnswerByID answer_id={21} />) {
  await act(async () =>
    root.render(<Provider store={store}>{element}</Provider>),
  );
}
async function setupHarness(initial = answer()) {
  store.dispatch(initializeAnswer({ key: `7:${initial.id}`, draft: initial }));
  await render(<Harness id={Number(initial.id)} />);
}
async function change(field, value) {
  await act(async () => controller.changeValue(field, value));
}
const flush = () => act(async () => jest.advanceTimersByTime(1600));

beforeEach(async () => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  setAccessToken('test-token');
  outstanding = [];
  records = new Map([
    [21, answer()],
    [22, answer(22)],
  ]);
  reports = [
    {
      id: 91,
      answer_id: 21,
      text: 'Проверьте формулировку',
      createdAt: '2026-01-01',
      is_closed: false,
      users_customuser: { username: 'reviewer', users_userprofile: null },
    },
  ];
  request = jest
    .spyOn(axiosClient, 'request')
    .mockImplementation(async ({ url, method, data }) => {
      const id = Number(url.split('/').at(-1));
      if (url.endsWith('/42/editor'))
        return {
          data: {
            id: '42',
            createdById: 7,
            text: 'Физика',
            numberOfShowingAnswers: 8,
            author: [],
            theme: [],
            connectedTheme: null,
            image: null,
            answers: [...records.values()].filter(row => !row.isDeleted),
          },
        };
      if (url.startsWith('/page/question-read/answers/'))
        return { data: records.get(Number(url.split('/')[4])) ?? null };
      if (url.includes('/answer-report-by-id/'))
        return {
          data: reports.filter(
            report => report.answer_id === id && !report.is_closed,
          ),
        };
      if (url.includes('/answer-statistics/'))
        return {
          data: {
            number_of_all_answer_choices: 4,
            number_of_incorrect_answer_choices: 1,
          },
        };
      if (url.includes('/answer-reports/') && method === 'PUT') {
        reports = reports.map(report => ({ ...report, is_closed: true }));
        return { data: { id: 91 } };
      }
      if (url.includes('/images/'))
        return { data: { image: 'answers/uploaded.png' } };
      if (method === 'POST') {
        const result = written(answer(23), data);
        records.set(23, {
          ...answer(23),
          text: result.text,
          isTrue: result.is_true,
        });
        return { data: result };
      }
      if (method === 'PUT') {
        const result = written(records.get(id), data);
        records.set(id, {
          ...records.get(id),
          text: result.text,
          isDeleted: result.is_deleted,
        });
        return { data: result };
      }
      throw Error(`Unexpected request: ${url}`);
    });
  store = configureStore({
    reducer: RootReducer,
    middleware: get =>
      get({ serializableCheck: false }).concat(studyWaysApi.middleware),
  });
  await setTestUser(store, { id: 7, user_access_level: 'TEACHER' });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => {
    clearUserSession(store.dispatch);
    root.unmount();
    outstanding.forEach(resolve => resolve({ data: written(answer()) }));
  });
  container.remove();
  request.mockRestore();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('settings open and reopen with Redux drafts, and initial hydration never saves', async () => {
  await render();
  await act(async () => button('Настройки и подсказки').click());
  const fields = [...container.querySelectorAll('textarea:not([aria-hidden])')];
  expect(fields.map(field => field.value)).toEqual([
    'Ответ 21',
    '',
    'Ваш ответ следует дополнить',
    'Особая подсказка',
  ]);
  await act(async () => button('Свернуть редактор').click());
  await act(async () => button('Настройки и подсказки').click());
  expect(
    container
      .querySelector('[aria-controls="qedit-answer-settings-21"]')
      .getAttribute('aria-expanded'),
  ).toBe('true');
  await flush();
  expect(calls('PUT')).toHaveLength(0);
  expect(container.textContent).toContain('Верный выбор · 75%');
});

test('full question cache supplies answers without individual reads; counters follow draft edits', async () => {
  await render(<AnswersEditor questionId={42} numberOfShowingAnswers={8} />);
  expect(container.querySelectorAll('article')).toHaveLength(2);
  expect(
    request.mock.calls.filter(([args]) =>
      args.url.startsWith('/page/question-read/'),
    ),
  ).toHaveLength(1);
  await act(async () =>
    store.dispatch(
      changeAnswerField({ key: '7:22', field: 'isRequired', value: true }),
    ),
  );
  expect(
    [...container.querySelectorAll('.sw-qedit-answer-summary strong')].map(
      node => node.textContent,
    ),
  ).toEqual(['2', '2', '2']);
});

test('validity changes only boilerplate hints; difficulty, mandatory and exam flags persist', async () => {
  await setupHarness();
  await act(async () => {
    controller.changeIsTrue();
    controller.changeIsRequired();
    controller.changeOnlyForExam();
    controller.changeHardLevelSimpleMode();
  });
  expect(draft().draft).toMatchObject({
    isTrue: false,
    isRequired: false,
    onlyForExam: true,
    hardLevelOfAnswer: 'MEDIUM',
    helpTextv1: 'Вы допустили одну или более ошибок',
    helpTextv2: 'Вы допустили одну или более ошибок',
    helpTextv3: 'Особая подсказка',
  });
  await flush();
  expect(calls('PUT')[0].data).toMatchObject({
    is_true: false,
    is_required: false,
    only_for_exam: true,
    hard_level_of_answer: 'MEDIUM',
  });
});

test('saves serialize and a late response cannot overwrite a newer edit', async () => {
  await setupHarness();
  const pending = deferred();
  request.mockImplementationOnce(() => pending.promise);
  await change('text', 'Первая');
  await flush();
  await change('text', 'Вторая');
  await flush();
  expect(calls('PUT')).toHaveLength(1);
  await act(async () =>
    pending.resolve({ data: written(answer(), { text: 'Первая' }) }),
  );
  expect(calls('PUT').map(args => args.data.text)).toEqual([
    'Первая',
    'Вторая',
  ]);
  expect(draft().draft.text).toBe('Вторая');
  expect(draft().saveState).toBe('saved');
});

test('failed saves retain drafts and can be retried', async () => {
  await setupHarness();
  request.mockRejectedValueOnce(new Error('offline'));
  await change('helpTextv1', 'Новая подсказка');
  await flush();
  expect(draft().saveState).toBe('error');
  await act(async () => controller.updateAnswerData());
  expect(draft().saveState).toBe('saved');
  expect(calls('PUT').at(-1).data.help_textV1).toBe('Новая подсказка');
});

test('a newer revision is saved even when the previous request fails', async () => {
  await setupHarness();
  const pending = deferred();
  request.mockImplementationOnce(() => pending.promise);
  await change('text', 'Старая');
  await flush();
  await change('text', 'Последняя');
  await act(async () => pending.resolve(Promise.reject(new Error('offline'))));
  expect(calls('PUT').at(-1).data.text).toBe('Последняя');
  expect(draft().saveState).toBe('saved');
});

test('unmount flushes pending edits; failed drafts survive a return to the editor', async () => {
  await setupHarness();
  await change('text', 'Не потерять');
  request.mockRejectedValueOnce(new Error('offline'));
  await render(null);
  expect(draft().saveState).toBe('error');
  await setupHarness();
  expect(controller.draft.text).toBe('Не потерять');
  await act(async () => controller.updateAnswerData());
  expect(draft().saveState).toBe('saved');
});

test('deletion errors keep the answer visible; successful retry updates the list and counters', async () => {
  await render(<AnswersEditor questionId={42} numberOfShowingAnswers={8} />);
  await act(async () =>
    container.querySelector('[aria-label="Действия с ответом №21"]').click(),
  );
  await act(async () =>
    [...document.querySelectorAll('[role="menuitem"]')]
      .find(node => node.textContent === 'Удалить')
      .click(),
  );
  request.mockRejectedValueOnce(new Error('offline'));
  await act(async () => button('Удалить ответ').click());
  expect(container.querySelectorAll('article')).toHaveLength(2);
  expect(document.body.textContent).toContain('Не удалось удалить ответ');
  await act(async () => button('Удалить ответ').click());
  expect(container.querySelectorAll('article')).toHaveLength(1);
  expect(
    container.querySelector('.sw-qedit-answer-summary strong').textContent,
  ).toBe('1');
});

test('copy and creation appear immediately in the shared question cache', async () => {
  await store.dispatch(
    questionReadApi.endpoints.getQuestionEditorData.initiate({
      id: 42,
      userId: 7,
    }),
  );
  await setupHarness();
  await change('text', 'Текст копии');
  await act(async () => controller.createNewAnswerBasedOnExist());
  expect(calls('PUT')[0].data.text).toBe('Текст копии');
  expect(calls('POST')[0].data.text).toBe('Текст копии');
  expect(
    questionReadApi.endpoints.getQuestionEditorData
      .select({ id: 42, userId: 7 })(store.getState())
      .data.answers.some(row => row.id === '23'),
  ).toBe(true);
});

test('upload failure preserves a deleted image; retry restores it only after successful upload', async () => {
  await setupHarness({ ...answer(), isImageDeleted: true });
  request.mockRejectedValueOnce(new Error('offline'));
  const file = new File(['image'], 'answer.png', { type: 'image/png' });
  await act(async () => controller.updateImage(file));
  expect(controller.draft.isImageDeleted).toBe(true);
  expect(controller.canRetryUpload).toBe(true);
  await act(async () => controller.retryUpload());
  expect(controller.imageUrl).toContain('uploaded.png');
  expect(controller.draft.isImageDeleted).toBe(false);
  await flush();
  expect(calls('PUT').at(-1).data.is_image_deleted).toBe(false);
});

test('reports use RTK cache, tolerate an empty profile and refresh after moderation', async () => {
  await render();
  await act(async () => button('Замечания').click());
  expect(document.body.textContent).toContain('reviewer');
  await act(async () => button('Отметить обработанным').click());
  expect(document.body.textContent).toContain('Все замечания обработаны');
  expect(
    request.mock.calls.filter(([args]) =>
      args.url.includes('/answer-report-by-id/21'),
    ),
  ).toHaveLength(2);
});

test.each(['STUDENT', 'CARD_EDITOR'])(
  '%s cannot load the answer editor',
  async role => {
    await setTestUser(store, { id: 7, user_access_level: role });
    await render();
    expect(container.textContent).toContain('доступно преподавателям');
    expect(request).not.toHaveBeenCalled();
  },
);

test('teachers cannot edit other owners answers; administrators can', async () => {
  records.set(21, { ...answer(), question: { id: '42', createdById: 8 } });
  await render();
  expect(container.textContent).toContain('автор вопроса или администратор');
  expect(draft()).toBeUndefined();
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'ADMIN' }),
  );
  expect(container.querySelector('article')).not.toBeNull();
});

test('logout cancels the debounce and clears local drafts without saving them', async () => {
  await setupHarness();
  await change('text', 'Личная правка');
  await act(async () => clearUserSession(store.dispatch));
  await flush();
  expect(calls('PUT')).toHaveLength(0);
  expect(store.getState().answerEditor.entries).toEqual({});
});

test('late save responses after account switch cannot change the new session drafts', async () => {
  await setupHarness();
  const pending = deferred();
  request.mockImplementationOnce(() => pending.promise);
  await change('text', 'Старая сессия');
  await flush();
  await act(async () => {
    clearUserSession(store.dispatch);
    await setTestUser(store, { id: 8, user_access_level: 'TEACHER' });
  });
  await act(async () => pending.resolve({ data: written(answer()) }));
  expect(store.getState().answerEditor.entries).toEqual({});
  expect(calls('PUT')).toHaveLength(1);
});

test('successful saves update shared cache even when the subsequent refetch fails', async () => {
  const args = { id: 42, userId: 7 };
  await store.dispatch(
    questionReadApi.endpoints.getQuestionEditorData.initiate(args),
  );
  await setupHarness();
  const original = request.getMockImplementation();
  request.mockImplementation(params =>
    params.url.endsWith('/42/editor')
      ? Promise.reject(new Error('offline'))
      : original(params),
  );
  await change('helpTextv1', 'Уже сохранено на сервере');
  await flush();
  const cached = questionReadApi.endpoints.getQuestionEditorData.select(args)(
    store.getState(),
  );
  expect(cached.isError).toBe(true);
  expect(cached.data.answers[0].helpTextv1).toBe('Уже сохранено на сервере');
  expect(cached.data.answers[0].image).toBe('answers/original.png');
  expect(cached.data.answers[0].question.createdById).toBe(7);
  expect(draft().saveState).toBe('saved');
});
