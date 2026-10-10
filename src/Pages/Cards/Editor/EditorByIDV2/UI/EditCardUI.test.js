import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studyWaysApi } from '../../../../../Shared/ServerLayer/QueryLayer/api';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { runInAction } from 'mobx';
import { CESObject } from '../Store/CardEditorStorage';
import { saveCard } from '../API/save-card';
import { ClientStorage } from '../../../../../Shared/Store/ApolloStorage/ClientStorage';
import axiosClient from '../../../../../Shared/ServerLayer/QueryLayer/config';
import EditCardUI from './EditCardUI';

jest.mock('antd/es/message', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('antd/es/upload', () => require('antd/lib/upload'));
jest.mock('antd/es/tree-select', () => require('antd/lib/tree-select'));

jest.mock('@ckeditor/ckeditor5-react', () => ({ CKEditor: () => null }));
jest.mock('@ckeditor/ckeditor5-build-classic', () => ({}));
jest.mock('../../../../../Shared/Store/ApolloStorage/ClientStorage', () => ({
  ClientStorage: {
    client: {
      query: jest.fn(({ variables }) =>
        Promise.resolve({
          data: {
            questionById: {
              id: String(variables?.id || 42),
              text: 'Текст вопроса',
            },
          },
        }),
      ),
    },
  },
}));
jest.mock(
  '../../../../../Shared/Store/UserStore/utils/HaveStatus',
  () => () => true,
);
jest.mock('../../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  post: jest.fn(() => Promise.resolve({})),
  request: jest.fn(() => Promise.resolve({ data: [] })),
}));
jest.mock('../API/get-card-data', () => ({ getCardData: jest.fn() }));
jest.mock('../API/save-card', () => ({
  saveCard: jest.fn(() => Promise.resolve({})),
}));

const act = React.act || legacyAct;
let container;
let root;
let store;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  jest.useFakeTimers();
  saveCard.mockResolvedValue({});
  axiosClient.post.mockResolvedValue({});
  ClientStorage.client.query.mockImplementation(({ variables }) =>
    Promise.resolve({
      data: {
        questionById: {
          id: String(variables?.id || 42),
          text: 'Текст вопроса',
        },
      },
    }),
  );
  runInAction(() => {
    CESObject.cardDataLoaded = false;
    CESObject.card_object = undefined;
    CESObject.hasSaveError = false;
    CESObject.stateOfSave = true;
    CESObject.card_object = {
      id: 812,
      title: 'Карточка',
      text: '',
      card_content_type: 2,
      connectedTheme: [],
      hard_level: 2,
      is_card_use_copyright: false,
      is_card_use_test_before_card: false,
      is_card_use_test_in_card: false,
      test_before_card_id: 42,
      test_in_card_id: 43,
    };
    CESObject.cardDataLoaded = true;
  });
  clearTimeout(CESObject.savingTimer);
  runInAction(() => {
    CESObject.stateOfSave = true;
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  store.dispatch(studyWaysApi.util.resetApiState());
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

const checkbox = label =>
  [...container.querySelectorAll('label')]
    .find(node => node.textContent === label)
    .querySelector('input');

test('question switches preserve question IDs in the saved card', async () => {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCardUI />
        </MemoryRouter>
      </Provider>,
    ),
  );
  await act(async () => checkbox('Вопрос перед ресурсом').click());
  await act(async () => checkbox('Вопрос после ресурса').click());
  expect(CESObject.card_object).toMatchObject({
    is_card_use_test_before_card: true,
    is_card_use_test_in_card: true,
    test_before_card_id: 42,
    test_in_card_id: 43,
  });
  await act(async () => checkbox('Вопрос перед ресурсом').click());
  await act(async () => jest.advanceTimersByTime(2000));
  expect(saveCard).toHaveBeenCalledWith(
    expect.objectContaining({
      is_card_use_test_before_card: false,
      is_card_use_test_in_card: true,
      test_before_card_id: 42,
      test_in_card_id: 43,
    }),
  );
  expect(CESObject.stateOfSave).toBe(true);
});

test('failed saves expose a retry and keep the editor unsaved', async () => {
  saveCard.mockRejectedValueOnce(new Error('Unavailable'));
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCardUI />
        </MemoryRouter>
      </Provider>,
    ),
  );
  await act(async () => checkbox('Указать авторские права').click());
  await act(async () => jest.advanceTimersByTime(2000));
  expect(CESObject.hasSaveError).toBe(true);
  expect(CESObject.stateOfSave).toBe(false);
  expect(container.textContent).toContain('Не удалось сохранить');
  const retry = [...container.querySelectorAll('button')].find(
    button => button.textContent === 'Повторить',
  );
  await act(async () => retry.click());
  expect(CESObject.hasSaveError).toBe(false);
  expect(CESObject.stateOfSave).toBe(true);
});

test('Rutube links autosave through the existing card API and reopen in the matching tab', async () => {
  runInAction(() => {
    CESObject.card_object.card_content_type = 0;
    CESObject.card_object.video_url = '';
    CESObject.card_object.vk_video_url = '';
  });
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCardUI />
        </MemoryRouter>
      </Provider>,
    ),
  );
  const rutube = [...container.querySelectorAll('button')].find(
    button => button.textContent === 'Rutube',
  );
  await act(async () => rutube.click());
  const label = [...container.querySelectorAll('label')].find(
    node => node.textContent === 'Ссылка на видео Rutube',
  );
  const field = document.getElementById(label.htmlFor);
  const url = 'https://rutube.ru/video/0123456789abcdef0123456789abcdef/';
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(field, url);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(container.querySelector('iframe').src).toBe(
    'https://rutube.ru/play/embed/0123456789abcdef0123456789abcdef/',
  );
  await act(async () => jest.advanceTimersByTime(2000));
  expect(saveCard).toHaveBeenLastCalledWith(
    expect.objectContaining({ video_url: url, vk_video_url: '' }),
  );
  await act(async () => root.render(null));
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCardUI />
        </MemoryRouter>
      </Provider>,
    ),
  );
  expect(
    container.querySelector('[value="Rutube"]').getAttribute('aria-pressed'),
  ).toBe('true');
  expect(container.querySelector('iframe').title).toBe('Видео Rutube');
});
