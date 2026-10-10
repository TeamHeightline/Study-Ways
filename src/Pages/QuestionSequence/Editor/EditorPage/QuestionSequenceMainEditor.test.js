import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import QuestionSequenceMainEditor from './QuestionSequenceMainEditor';
import { GET_MY_QUESTION_SEQUENCE } from '../Struct';

jest.mock('../EditByID/UI/edit-question-sequence-ui', () => ({
  __esModule: true,
  default: ({ qsID, onChange }) => {
    const React = require('react');
    return React.createElement(
      'div',
      null,
      `Редактор серии №${qsID}`,
      React.createElement(
        'button',
        { onClick: () => onChange('goBack') },
        'К списку серий',
      ),
    );
  },
}));
const act = React.act || legacyAct;
const series = [
  {
    id: '11',
    name: 'Основы механики',
    description: 'Движение и законы Ньютона',
    sequenceData: { sequence: [1, 2, 3] },
  },
  { id: '12', name: 'Пустая серия', description: null, sequenceData: null },
  {
    id: '13',
    name: 'Подготовка к зачёту',
    description: 'Квантовая физика',
    sequenceData: { sequence: Array.from({ length: 40 }, (_, i) => 100 + i) },
  },
];
let root,
  container,
  client,
  request,
  rows,
  failLoad,
  failCreate,
  missingCreatedID;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  rows = [...series];
  failLoad = false;
  failCreate = false;
  missingCreatedID = false;
  request = jest.fn(
    operation =>
      new Observable(observer => {
        const timer = setTimeout(() => {
          if (operation.operationName === 'GET_MY_QUESTION_SEQUENCE') {
            if (failLoad) observer.error(new Error('Unavailable'));
            else observer.next({ data: { me: { questionsequenceSet: rows } } });
          } else if (failCreate) observer.error(new Error('Unavailable'));
          else if (missingCreatedID)
            observer.next({
              data: {
                createQuestionSequence: {
                  clientMutationId: null,
                  sequence: null,
                },
              },
            });
          else {
            const sequence = {
              id: '114',
              name: null,
              description: null,
              sequenceData: { sequence: [] },
            };
            rows = [...rows, sequence];
            observer.next({
              data: {
                createQuestionSequence: { clientMutationId: null, sequence },
              },
            });
          }
          observer.complete();
        }, 10);
        return () => clearTimeout(timer);
      }),
  );
  client = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: new ApolloLink(request),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  client.stop();
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function settle() {
  await act(async () => jest.advanceTimersByTime(500));
}
async function render() {
  await act(async () =>
    root.render(
      <ApolloProvider client={client}>
        <QuestionSequenceMainEditor />
      </ApolloProvider>,
    ),
  );
  await settle();
}
async function click(node) {
  await act(async () => node.click());
  await settle();
}
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent.trim() === text,
  );
const filter = text =>
  [...container.querySelectorAll('[aria-pressed]')].find(node =>
    node.textContent.includes(text),
  );
async function fill(value) {
  await act(async () => {
    const input = container.querySelector('input');
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
const cards = () => [...container.querySelectorAll('.sw-qslist-card')];
const creates = () =>
  request.mock.calls.filter(
    ([operation]) => operation.operationName === 'CREATE_QUESTION_SEQUENCE',
  );

test('searches names, descriptions and numbers; combines filters and keeps long series compact', async () => {
  await render();
  expect(cards()).toHaveLength(3);
  expect(cards()[0].textContent).toContain('Вопросов: 40');
  expect(
    cards()[0].querySelectorAll('.sw-qslist-questions > div > span'),
  ).toHaveLength(5);
  expect(cards()[0].textContent).toContain('ещё 36');
  await fill('ЗАЧЕТУ');
  expect(cards()).toHaveLength(1);
  await fill('Ньютона');
  expect(cards()[0].textContent).toContain('Основы механики');
  await click(filter('Пока пустых'));
  expect(cards()).toHaveLength(0);
  expect(container.textContent).toContain('Серии не найдены');
  await click(button('Сбросить фильтры'));
  expect(cards()).toHaveLength(3);
  await click(filter('Пока пустых'));
  expect(cards()).toHaveLength(1);
  expect(cards()[0].textContent).toContain('Пустая серия');
  await click(filter('С вопросами'));
  expect(cards()).toHaveLength(2);
  await fill('11');
  expect(cards()).toHaveLength(1);
});

test('opens the selected series without a delayed transition and can return to the list', async () => {
  await render();
  await act(async () =>
    container
      .querySelector('[aria-label="Редактировать серию «Основы механики»"]')
      .click(),
  );
  expect(container.textContent).toContain('Редактор серии №11');
  await click(button('К списку серий'));
  expect(cards()).toHaveLength(3);
});

test('creates once, opens its editor and retains the new series even if the refresh fails', async () => {
  await render();
  const create = button('Создать серию');
  await act(async () => {
    create.click();
    create.click();
  });
  expect(button('Создаём серию…').disabled).toBe(true);
  await settle();
  expect(creates()).toHaveLength(1);
  expect(creates()[0][0].variables).toEqual({ sequenceData: { sequence: [] } });
  expect(container.textContent).toContain('Редактор серии №114');
  expect(
    client.readQuery({ query: GET_MY_QUESTION_SEQUENCE }).me
      .questionsequenceSet,
  ).toHaveLength(4);
  failLoad = true;
  await click(button('К списку серий'));
  expect(container.textContent).toContain('Не удалось обновить список серий');
  expect(cards()[0].textContent).toContain('Серия №114');
  expect(cards()[0].textContent).toContain('Без названия');
});

test('creation errors and missing returned series are visible and allow retry', async () => {
  await render();
  failCreate = true;
  await click(button('Создать серию'));
  expect(container.textContent).toContain('Не удалось создать серию вопросов');
  failCreate = false;
  missingCreatedID = true;
  await click(button('Создать серию'));
  expect(container.textContent).toContain('Не удалось создать серию вопросов');
  missingCreatedID = false;
  await click(button('Создать серию'));
  expect(container.textContent).toContain('Редактор серии №114');
});

test('load failure can be retried and an empty account can create its first series', async () => {
  failLoad = true;
  await render();
  expect(container.textContent).toContain(
    'Не удалось загрузить серии вопросов',
  );
  expect(container.textContent).not.toContain('Создайте первую серию вопросов');
  failLoad = false;
  rows = [];
  await click(button('Повторить'));
  expect(container.textContent).toContain('Создайте первую серию вопросов');
  await click(button('Создать первую серию'));
  expect(container.textContent).toContain('Редактор серии №114');
});
