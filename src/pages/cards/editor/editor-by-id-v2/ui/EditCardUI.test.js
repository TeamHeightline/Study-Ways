import React from 'react';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { RootReducer } from '../../../../../app/redux-store/RootReducer';
import { studyWaysApi } from '../../../../../shared/server-layer/query-layer/api';
import axiosClient, {
  setAccessToken,
} from '../../../../../shared/server-layer/query-layer/config';
import { clearUserSession } from '../../../../../shared/store/user-store/session-lifecycle';
import { setTestUser } from '../../../../../shared/store/user-store/user-session.test-utils';
import { cardEditorApi } from '../model/card-editor-api';
import { editableDefaults } from '../model/types';
import { EditCardByID } from './EditCardByID';

jest.mock('./ui-rich-text-editor', () => ({ UiRichTextEditor: () => null }));
jest.mock('react-player', () => ({
  __esModule: true,
  default: ({ url }) =>
    require('react').createElement('div', { 'data-video-url': url }),
}));
jest.mock('../../../../../app/redux-store/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
  useAppSelector: require('react-redux').useSelector,
}));

const act = React.act || legacyAct;
let root, container, store, request, cards, deferreds, saved;
const card = (id = 812) => ({
  ...editableDefaults,
  id,
  created_by_id: 7,
  title: `Карточка ${id}`,
  card_content_type: 2,
  hard_level: 2,
  test_before_card_id: 42,
  test_in_card_id: 43,
  cards_card_connected_theme: [{ unstructuredtheme_id: 12 }],
  cards_cardimage: { image: 'cards/initial.png' },
});
function deferred() {
  let resolve;
  const promise = new Promise(done => {
    resolve = done;
  });
  deferreds.push(resolve);
  return { promise, resolve };
}
const calls = (method = 'PUT') =>
  request.mock.calls
    .map(([args]) => args)
    .filter(args => args.method === method);
const draft = (id = 812) => store.getState().cardEditor.entries[`7:${id}`];
const checkbox = label =>
  [...container.querySelectorAll('label')]
    .find(node => node.textContent === label)
    .querySelector('input');
const button = label =>
  [...document.querySelectorAll('button')].find(
    node => node.textContent === label,
  );
function Location() {
  return <output>{useLocation().pathname}</output>;
}
async function render(id = 812) {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/editor/card2/card/812']}>
          <EditCardByID id={id} onSaveStateChange={saved} />
          <Location />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
async function fill(label, value) {
  await act(async () => {
    const node = [...container.querySelectorAll('label')].find(
      node => node.textContent === label,
    );
    const input = document.getElementById(node.htmlFor);
    Simulate.change(input, { target: { value } });
  });
}
const flush = () => act(async () => jest.advanceTimersByTime(2000));

beforeEach(async () => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  deferreds = [];
  saved = jest.fn();
  setAccessToken('test-token');
  cards = new Map([
    [812, card()],
    [813, card(813)],
  ]);
  request = jest
    .spyOn(axiosClient, 'request')
    .mockImplementation(async ({ url, method, data }) => {
      if (url.startsWith('/page/edit-card-by-id/card-by-id/'))
        return { data: cards.get(Number(url.split('/').at(-1))) ?? null };
      if (url === '/page/connected-themes')
        return { data: [{ id: 12, text: 'Оптика', parentId: null }] };
      if (url.endsWith('/preview'))
        return {
          data: {
            id: url.split('/')[3],
            text: 'Текст вопроса',
            ownerUsername: '',
            questionImage: null,
          },
        };
      if (url.endsWith('/copy'))
        return { data: { ...card(813), title: 'Копия' } };
      if (url.startsWith('/page/write/images/')) {
        const id = Number(url.split('/').at(-1));
        cards.set(id, {
          ...cards.get(id),
          cards_cardimage: { image: 'cards/uploaded.png' },
        });
        return { data: { image: 'cards/uploaded.png' } };
      }
      if (method === 'PUT') {
        const id = Number(url.split('/').at(-1));
        cards.set(id, {
          ...cards.get(id),
          ...data,
          cards_card_connected_theme: data.connectedTheme.map(
            unstructuredtheme_id => ({ unstructuredtheme_id }),
          ),
        });
        return { data: { id } };
      }
      throw new Error(`Unexpected request: ${url}`);
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
    deferreds.forEach(resolve => resolve({ data: { id: 812 } }));
  });
  container.remove();
  jest.restoreAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('loads card and image from a shared RTK request without autosaving initial data', async () => {
  expect(request).not.toHaveBeenCalled();
  await render();
  expect(request.mock.calls.map(([args]) => args.url)).toEqual([
    '/page/edit-card-by-id/card-by-id/812',
    '/page/connected-themes',
  ]);
  expect(container.querySelector('img').src).toContain('/cards/initial.png');
  await flush();
  expect(calls()).toHaveLength(0);
  await act(async () =>
    store
      .dispatch(
        cardEditorApi.endpoints.getCardEditorData.initiate(
          { id: 812, userId: 7 },
          { subscribe: false },
        ),
      )
      .unwrap(),
  );
  expect(request).toHaveBeenCalledTimes(2);
});

test('question switches preserve question IDs and debounce a single REST save', async () => {
  await render();
  await act(async () => checkbox('Вопрос перед ресурсом').click());
  await act(async () => checkbox('Вопрос после ресурса').click());
  expect(draft().draft).toMatchObject({
    is_card_use_test_before_card: true,
    is_card_use_test_in_card: true,
    test_before_card_id: 42,
    test_in_card_id: 43,
  });
  await act(async () => checkbox('Вопрос перед ресурсом').click());
  expect(saved).toHaveBeenLastCalledWith(false);
  await flush();
  expect(calls()).toHaveLength(1);
  expect(calls()[0]).toMatchObject({
    url: '/page/write/cards/812',
    data: {
      is_card_use_test_before_card: false,
      is_card_use_test_in_card: true,
      test_before_card_id: 42,
      test_in_card_id: 43,
      connectedTheme: [12],
    },
  });
  expect(calls()[0].data).not.toHaveProperty('created_by_id');
  expect(calls()[0].data).not.toHaveProperty('cards_cardimage');
  expect(draft().saveState).toBe('saved');
  expect(saved).toHaveBeenLastCalledWith(true);
});

test('failed saves expose a retry and preserve unsaved edits', async () => {
  await render();
  request.mockRejectedValueOnce(new Error('Unavailable'));
  await act(async () => checkbox('Указать авторские права').click());
  await flush();
  expect(draft().saveState).toBe('error');
  expect(draft().draft.is_card_use_copyright).toBe(true);
  expect(container.textContent).toContain('Не удалось сохранить');
  expect(button('Назад').disabled).toBe(true);
  await act(async () => button('Повторить').click());
  expect(draft().saveState).toBe('saved');
  expect(button('Назад').disabled).toBe(false);
});

test('Rutube links save through RTK Query and reopen in the matching tab', async () => {
  cards.set(812, { ...card(), card_content_type: 0 });
  await render();
  await selectOption('Видеоплатформа', 'Rutube');
  const url = 'https://rutube.ru/video/0123456789abcdef0123456789abcdef/';
  await fill('Ссылка на видео Rutube', url);
  expect(container.querySelector('iframe').src).toBe(
    'https://rutube.ru/play/embed/0123456789abcdef0123456789abcdef/',
  );
  await flush();
  expect(calls().at(-1).data.video_url).toBe(url);
  await act(async () => root.render(null));
  await render();
  expect(container.querySelector('input[value="Rutube"]')).not.toBeNull();
});

test('edits made during a save survive invalidation and are persisted in order', async () => {
  await render();
  const first = deferred();
  request.mockImplementationOnce(() => first.promise);
  await fill('Название карточки', 'Первая версия');
  await flush();
  await fill('Название карточки', 'Последняя версия');
  expect(calls()).toHaveLength(1);
  await act(async () =>
    first.resolve({ data: { id: 812, title: 'Первая версия' } }),
  );
  expect(calls()).toHaveLength(2);
  expect(calls().map(call => call.data.title)).toEqual([
    'Первая версия',
    'Последняя версия',
  ]);
  expect(draft().draft.title).toBe('Последняя версия');
  expect(draft().saveState).toBe('saved');
});

test('leaving the editor flushes its pending changes and does not save them into another card', async () => {
  await render();
  await fill('Название карточки', 'Исправлено перед переходом');
  await render(813);
  expect(calls()[0]).toMatchObject({
    url: '/page/write/cards/812',
    data: { title: 'Исправлено перед переходом' },
  });
  expect(container.textContent).toContain('Карточка №813');
  expect(draft(813).draft.title).toBe('Карточка 813');
});

test('late reads cannot replace the currently opened card', async () => {
  const old = deferred();
  request.mockImplementationOnce(() => old.promise);
  await render();
  await render(813);
  expect(container.textContent).toContain('Карточка №813');
  await act(async () => old.resolve({ data: card(812) }));
  expect(container.textContent).toContain('Карточка №813');
  expect(container.textContent).not.toContain('Карточка №812');
});

test('logout cancels pending autosave and clears private drafts', async () => {
  await render();
  await fill('Название карточки', 'Личные изменения');
  await act(async () => clearUserSession(store.dispatch));
  await flush();
  expect(calls()).toHaveLength(0);
  expect(store.getState().cardEditor.entries).toEqual({});
  expect(container.textContent).toContain('Недостаточно прав');
});

test('students cannot request the editor, and teachers cannot edit somebody else’s card', async () => {
  await setTestUser(store, { id: 7, user_access_level: 'STUDENT' });
  await render();
  expect(request).not.toHaveBeenCalled();
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'TEACHER' }),
  );
  expect(container.textContent).toContain('Карточка №812');
  cards.set(813, { ...card(813), created_by_id: 99 });
  await render(813);
  expect(container.textContent).toContain(
    'Можно редактировать только свои карточки',
  );
  expect(calls()).toHaveLength(0);
});

test('copying uses the RTK mutation and navigates to the new card', async () => {
  await render();
  await act(async () => button('Создать копию').click());
  const create = [...document.querySelectorAll('[role="dialog"] button')].find(
    node => node.textContent === 'Создать копию',
  );
  await act(async () => create.click());
  expect(calls('POST').at(-1)).toMatchObject({
    url: '/page/write/cards/812/copy',
  });
  expect(container.querySelector('output').textContent).toBe(
    '/editor/card2/card/813',
  );
});

test('load failures retry through RTK Query', async () => {
  request.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить карточку');
  await act(async () => button('Повторить').click());
  expect(container.textContent).toContain('Карточка №812');
});

test('uploading images uses the RTK mutation and does not overwrite unsaved text', async () => {
  await render();
  await fill('Название карточки', 'С новым изображением');
  const upload = deferred();
  request.mockReturnValueOnce(upload.promise);
  const file = new File(['image-bytes'], 'image.png', { type: 'image/png' });
  await act(async () =>
    Simulate.change(container.querySelector('input[type=file]'), {
      target: { files: [file], value: '' },
    }),
  );
  expect(calls()[0]).toMatchObject({
    url: '/page/write/images/card/812',
    data: file,
    headers: { 'Content-Type': 'image/png' },
  });
  expect(saved).toHaveBeenLastCalledWith(false);
  await act(async () =>
    upload.resolve({ data: { image: 'cards/uploaded.png' } }),
  );
  expect(container.querySelector('img').src).toContain(
    '/cards/uploaded.png?v=1',
  );
  expect(draft().draft.title).toBe('С новым изображением');
  expect(draft().saveState).toBe('pending');
  await flush();
  expect(calls().at(-1).data.title).toBe('С новым изображением');
  expect(saved).toHaveBeenLastCalledWith(true);
});

test('revoking editor permissions prevents pending writes', async () => {
  await render();
  await fill('Название карточки', 'Изменение до отзыва прав');
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'STUDENT' }),
  );
  await flush();
  expect(calls()).toHaveLength(0);
  expect(container.textContent).toContain('Недостаточно прав');
});

test('a save response from an old session cannot mark new private edits as saved', async () => {
  await render();
  const oldSave = deferred();
  request.mockReturnValueOnce(oldSave.promise);
  await fill('Название карточки', 'Старая сессия');
  await flush();
  await act(async () => clearUserSession(store.dispatch));
  setAccessToken('new-token');
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'TEACHER' }),
  );
  await fill('Название карточки', 'Новая сессия');
  await act(async () => oldSave.resolve({ data: { id: 812 } }));
  expect(draft().draft.title).toBe('Новая сессия');
  expect(draft().saveState).toBe('pending');
  expect(draft().savedRevision).toBe(0);
  expect(calls()).toHaveLength(1);
  await flush();
  expect(calls().at(-1).data.title).toBe('Новая сессия');
  expect(draft().saveState).toBe('saved');
});

test('failed drafts survive closing and reopening the editor until a successful retry', async () => {
  await render();
  await fill('Название карточки', 'Не потерять при ошибке сети');
  request.mockRejectedValueOnce(new Error('Offline'));
  await act(async () => root.render(null));
  expect(draft().saveState).toBe('error');
  await render();
  expect(draft().draft.title).toBe('Не потерять при ошибке сети');
  expect(container.textContent).toContain('Не удалось сохранить');
  await act(async () => button('Повторить').click());
  expect(calls().at(-1).data.title).toBe('Не потерять при ошибке сети');
  expect(draft().saveState).toBe('saved');
});

test('administrators can edit cards owned by another author', async () => {
  cards.set(812, { ...card(), created_by_id: 99 });
  await setTestUser(store, { id: 7, user_access_level: 'ADMIN' });
  await render();
  await fill('Название карточки', 'Исправление администратора');
  await flush();
  expect(calls().at(-1)).toMatchObject({
    url: '/page/write/cards/812',
    data: { title: 'Исправление администратора' },
  });
  expect(draft().saveState).toBe('saved');
});

test('a failed older save does not leave newer edits stuck in a pending state', async () => {
  await render();
  let reject;
  const oldSave = new Promise((_resolve, fail) => {
    reject = fail;
  });
  request.mockReturnValueOnce(oldSave);
  await fill('Название карточки', 'Первая версия');
  await flush();
  await fill('Название карточки', 'Последняя версия');
  await flush();
  expect(calls()).toHaveLength(1);
  await act(async () => reject(new Error('Temporary failure')));
  expect(calls().map(call => call.data.title)).toEqual([
    'Первая версия',
    'Последняя версия',
  ]);
  expect(draft().saveState).toBe('saved');
  expect(draft().draft.title).toBe('Последняя версия');
});

test('legacy images without a database relation remain visible when editing', async () => {
  cards.set(812, { ...card(), cards_cardimage: null });
  await render();
  expect(container.querySelector('img').src).toContain(
    '/cards-images/card/812',
  );
  expect(
    container.querySelector('button[aria-label="Заменить изображение"]'),
  ).not.toBeNull();
  expect(container.textContent).not.toContain('Для кого и к каким темам');
  await flush();
  expect(calls()).toHaveLength(0);
});

async function selectOption(label, option) {
  const control = [...container.querySelectorAll('[role="combobox"]')].find(
    node =>
      (node.getAttribute('aria-labelledby') || '')
        .split(' ')
        .some(id => document.getElementById(id)?.textContent === label),
  );
  await act(async () => Simulate.mouseDown(control, { button: 0 }));
  await act(async () =>
    [...document.querySelectorAll('[role="option"]')]
      .find(node => node.textContent === option)
      .click(),
  );
}

test('material selector saves a numeric type while preserving video links', async () => {
  cards.set(812, {
    ...card(),
    card_content_type: 0,
    video_url: 'https://www.youtube.com/watch?v=Q0_WXvufBco',
    vk_video_url: 'https://vkvideo.ru/video1_2',
  });
  await render();
  await selectOption('Тип материала', 'Изображение');
  await flush();
  expect(calls().at(-1).data).toMatchObject({
    card_content_type: 2,
    video_url: 'https://www.youtube.com/watch?v=Q0_WXvufBco',
    vk_video_url: 'https://vkvideo.ru/video1_2',
  });
  expect(
    container.querySelector('button[aria-label="Заменить изображение"]'),
  ).not.toBeNull();
});

test('video platform selector keeps alternate links and only saves actual text edits', async () => {
  cards.set(812, {
    ...card(),
    card_content_type: 0,
    video_url: 'https://www.youtube.com/watch?v=Q0_WXvufBco',
    vk_video_url: 'https://vkvideo.ru/video1_2',
  });
  await render();
  await selectOption('Видеоплатформа', 'YouTube');
  await flush();
  expect(calls()).toHaveLength(0);
  await fill(
    'Ссылка на видео YouTube',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  );
  await flush();
  expect(calls().at(-1).data).toMatchObject({
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    vk_video_url: 'https://vkvideo.ru/video1_2',
  });
});
