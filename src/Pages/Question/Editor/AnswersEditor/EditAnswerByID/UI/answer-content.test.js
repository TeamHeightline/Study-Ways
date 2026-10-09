import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { runInAction } from 'mobx';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';
import AnswerContent from './answer-content';
import IsEditAnswer from './is-edit-answer';

jest.mock('../../../../../../Shared/Store/ApolloStorage/ClientStorage', () => ({
  ClientStorage: { client: { query: jest.fn(), mutate: jest.fn() } },
}));
jest.mock('../../../../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: {},
}));
jest.mock('../../../../../../Shared/ServerLayer/QueryLayer/config', () => ({}));
jest.mock('../../../QuestionEditor/Store/QuestionEditorStorage', () => ({
  QuestionEditorStorage: {
    registerAnswerID: jest.fn(),
    removeAnswerID: jest.fn(),
    addOrDeleterRequiredAnswerID: jest.fn(),
    addOrDeleteOnlyExamAnswersID: jest.fn(),
  },
}));

const act = React.act || legacyAct;

let container;
let root;
let originalFetch;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => [{ image: '' }],
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  global.fetch = originalFetch;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('answer settings open and reopen with the real MobX store', async () => {
  const store = new EditAnswerByIdStore();
  runInAction(() => {
    store.isAnswerDataLoaded = true;
    store.answer_id = 501;
    store.answer_object = {
      id: '501',
      question: '1042',
      text: 'Текст ответа',
      hardLevelOfAnswer: 'EASY',
      isTrue: 'true',
      isRequired: false,
      onlyForExam: false,
      isDeleted: false,
      isImageDeleted: false,
      checkQueue: 10,
      helpTextv1: 'Лёгкая подсказка',
      helpTextv2: 'Средняя подсказка',
      helpTextv3: 'Сложная подсказка',
    };
  });
  await act(async () => {
    root.render(
      <>
        <IsEditAnswer answer_object={store} />
        <AnswerContent answer_object={store} />
      </>,
    );
  });

  const toggle = container.querySelector('button[aria-controls]');
  expect(toggle.textContent).toContain('Настройки и подсказки');
  await act(async () => toggle.click());

  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(
    [...container.querySelectorAll('textarea:not([aria-hidden])')].map(
      field => field.value,
    ),
  ).toEqual([
    'Текст ответа',
    'Лёгкая подсказка',
    'Средняя подсказка',
    'Сложная подсказка',
  ]);

  await act(async () => toggle.click());
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await act(async () => toggle.click());
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});
