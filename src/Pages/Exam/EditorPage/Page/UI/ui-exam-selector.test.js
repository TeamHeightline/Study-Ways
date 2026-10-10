import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import UIExamSelector from './ui-exam-selector';
import { examEditorPageReducer } from '../redux-store/reducer';
import axiosClient from '../../../../../Shared/ServerLayer/QueryLayer/config';
import { ClientStorage } from '../../../../../Shared/Store/ApolloStorage/ClientStorage';

jest.mock('../../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
jest.mock('../../../../../Shared/Store/ApolloStorage/ClientStorage', () => ({
  ClientStorage: { client: null },
}));

const act = React.act || legacyAct;
const sequence = {
  id: '42',
  name: 'Механика',
  description: '',
  sequence_data: { sequence: [11, 12, 13] },
};
const exam = {
  id: '7',
  name: 'Итоговый экзамен',
  uid: 'exam-seven',
  access_mode: 'open',
  minutes: 45,
  question_sequence_id: 42,
  question_sequence: sequence,
};
let root, container, store, failSeries;
function EditorDestination() {
  return <p>Редактор экзамена №{useParams().id}</p>;
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  failSeries = false;
  axiosClient.get.mockImplementation(url =>
    Promise.resolve({
      data:
        url === '/exam/my-exams'
          ? {
              exams: [
                exam,
                {
                  ...exam,
                  id: '8',
                  name: 'Биология',
                  uid: 'exam-eight',
                  access_mode: 'closed',
                },
              ],
            }
          : { questionSequence: sequence },
    }),
  );
  axiosClient.post.mockResolvedValue({
    data: { createdExam: { ...exam, id: '9', name: 'Новый экзамен' } },
  });
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
  });
  ClientStorage.client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(
      () =>
        new Observable(observer => {
          if (failSeries) observer.error(new Error('Unavailable'));
          else {
            observer.next({
              data: {
                questionSequence: [
                  {
                    id: '42',
                    name: 'Механика',
                    sequenceData: { sequence: [11, 12, 13] },
                  },
                ],
              },
            });
            observer.complete();
          }
        }),
    ),
  });
  store = configureStore({ reducer: { examEditorPageReducer } });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  ClientStorage.client.stop();
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
async function render() {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/editor/exam']}>
          <Routes>
            <Route path="/editor/exam" element={<UIExamSelector />} />
            <Route
              path="/editor/exam/select/:id"
              element={<EditorDestination />}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
  );
  await settle();
}
async function settle() {
  await act(async () => jest.advanceTimersByTime(500));
}
async function click(node) {
  await act(async () => node.click());
  await settle();
}
const button = text =>
  [...document.querySelectorAll('button')].find(
    node => node.textContent.trim() === text,
  );
async function fill(input, value) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function prepareCreate() {
  await click(button('Создать экзамен'));
  await fill(
    document
      .querySelector('#sw-create-exam-title')
      .closest('[role="dialog"]')
      .querySelector('input'),
    '  Новый экзамен  ',
  );
  await click(
    button('Выбрать серию вопросовВопросы этой серии войдут в экзамен'),
  );
  await click(
    document.querySelector('[aria-label="Выбрать серию «Механика»"]'),
  );
}

test('search, access filters and links use the loaded exams', async () => {
  await render();
  expect(container.textContent).toContain('Вопросов: 3');
  await fill(container.querySelector('input'), 'механика');
  expect(container.textContent).toContain('Итоговый экзамен');
  await click(
    [...container.querySelectorAll('[aria-pressed]')].find(node =>
      node.textContent.includes('Закрытый доступ'),
    ),
  );
  expect(container.textContent).toContain('Биология');
  expect(container.textContent).not.toContain('Итоговый экзамен');
  await fill(container.querySelector('input'), 'несуществующий');
  expect(container.textContent).toContain('Экзамены не найдены');
  await click(button('Сбросить фильтры'));
  expect(
    container
      .querySelector('[aria-label="Редактировать экзамен «Итоговый экзамен»"]')
      .getAttribute('href'),
  ).toBe('/editor/exam/select/7');
  await click(
    container.querySelector('[aria-label="Скопировать ссылку на экзамен №7"]'),
  );
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    `${window.location.origin}/exam/exam-seven`,
  );
});

test('creating an exam with a selected series opens its editor and updates the list state', async () => {
  await render();
  await prepareCreate();
  expect(button('Создать').disabled).toBe(false);
  await click(button('Создать'));
  expect(axiosClient.post).toHaveBeenCalledWith('/exam/create', {
    examData: { question_sequence_id: 42, name: 'Новый экзамен' },
  });
  expect(container.textContent).toContain('Редактор экзамена №9');
  expect(store.getState().examEditorPageReducer.exams[0].id).toBe('9');
  expect(
    store.getState().examEditorPageReducer.exam_qs_id_for_create,
  ).toBeNull();
});

test('creation errors keep the entered data and allow retry', async () => {
  axiosClient.post.mockRejectedValueOnce(new Error('Unavailable'));
  await render();
  await prepareCreate();
  await click(button('Создать'));
  expect(document.body.textContent).toContain('Не удалось создать экзамен');
  expect(store.getState().examEditorPageReducer.exam_name_for_create).toBe(
    '  Новый экзамен  ',
  );
  expect(store.getState().examEditorPageReducer.exam_qs_id_for_create).toBe(42);
  await click(button('Создать'));
  expect(container.textContent).toContain('Редактор экзамена №9');
});

test('pending creation blocks dismissal and duplicate requests', async () => {
  let finish;
  axiosClient.post.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await render();
  await prepareCreate();
  await click(button('Создать'));
  expect(button('Создать').disabled).toBe(true);
  expect(button('Отмена').disabled).toBe(true);
  expect(
    document.querySelector('[aria-label="Закрыть создание экзамена"]').disabled,
  ).toBe(true);
  await click(button('Создать'));
  expect(axiosClient.post).toHaveBeenCalledTimes(1);
  await act(async () =>
    finish({ data: { createdExam: { ...exam, id: '9' } } }),
  );
  await settle();
  expect(container.textContent).toContain('Редактор экзамена №9');
});

test('loading failure is visible and retry restores the list', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Unavailable'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить экзамены');
  await click(button('Повторить'));
  expect(container.textContent).toContain('Итоговый экзамен');
});

test('series loading failure is visible and can be retried', async () => {
  failSeries = true;
  await render();
  await click(button('Создать экзамен'));
  await click(
    button('Выбрать серию вопросовВопросы этой серии войдут в экзамен'),
  );
  expect(document.body.textContent).toContain(
    'Не удалось загрузить серии вопросов',
  );
  failSeries = false;
  await click(button('Повторить'));
  expect(
    document.querySelector('[aria-label="Выбрать серию «Механика»"]'),
  ).not.toBeNull();
});
