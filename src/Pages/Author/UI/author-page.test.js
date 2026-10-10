import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { authorApi } from '../Store/author-api';
import { Author } from './index';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppSelector: require('react-redux').useSelector,
}));

const act = React.act || legacyAct;
const profile = { firstname: 'Анна', lastname: 'Иванова', avatar_src: null };
const author = {
  id: 1,
  username: 'anna',
  users_userprofile: profile,
  cards_cardcourse: [{ id: 7 }, { id: 9 }],
  cards_card: [{ id: 11 }],
  usertests_question: [{ id: 100 }],
};
const course = (id, name) => ({
  id,
  name,
  course_data: [
    { SameLine: [{ CourseFragment: [{ CourseElement: { id: '11' } }] }] },
  ],
  users_customuser: { users_userprofile: profile },
});
const card = (id, title = `Карточка ${id}`) => ({
  id,
  title,
  card_content_type: 2,
  hard_level: 1,
  cards_cardimage: null,
  cards_card_connected_theme: [],
  users_customuser: { users_userprofile: null },
});
let container, root, store;
const buttons = () => [...container.querySelectorAll('button')];
const button = text => buttons().find(node => node.textContent.includes(text));
const filter = text =>
  [...container.querySelectorAll('[aria-pressed]')].find(node =>
    node.textContent.includes(text),
  );
const heading = () => container.querySelector('h1')?.textContent;

function Navigation() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/author/2')}>Автор 2</button>
      <button onClick={() => navigate('/author/1')}>Автор 1</button>
    </>
  );
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.scrollTo = jest.fn();
  axiosClient.request.mockReset().mockImplementation(async ({ url }) => ({
    data: url.startsWith('/page/author/')
      ? author
      : url === '/page/course'
        ? [
            course(7, 'Оптика'),
            course(8, 'Чужой курс'),
            course(9, 'Название курса по умолчанию'),
          ]
        : { 11: card(11, 'Отражение света'), 12: card(12, 'Магнитное поле') },
  }));
  store = configureStore({
    reducer: { [authorApi.reducerPath]: authorApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authorApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(authorApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function render(path = '/author/1') {
  await act(async () => {
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Navigation />
          <Routes>
            <Route path="/author/:id" element={<Author />} />
            <Route path="/course" element={<h1>Просмотр курса</h1>} />
            <Route path="/card/:id" element={<h1>Просмотр карточки</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  });
}
const click = node => act(async () => node.click());
async function search(value) {
  await act(async () => {
    const input = container.querySelector('input[type="search"]');
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('loads the author and catalogs through RTK Query and shows only their published materials', async () => {
  await render();
  expect(heading()).toBe('Анна Иванова');
  expect(container.textContent).toContain('Оптика');
  expect(container.textContent).not.toContain('Чужой курс');
  expect(container.textContent).not.toContain('Название курса по умолчанию');
  expect(axiosClient.request).toHaveBeenCalledTimes(3);
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/author/1',
      signal: expect.any(AbortSignal),
    }),
  );
  await click(filter('Карточки'));
  expect(container.textContent).toContain('Отражение света');
  expect(container.textContent).not.toContain('undefined');
  await click(container.querySelector('.sw-mini-card button'));
  expect(heading()).toBe('Просмотр карточки');
});

test('opens courses with their first resource position', async () => {
  await render();
  await click(container.querySelector('.sw-course-open'));
  expect(heading()).toBe('Просмотр курса');
});

test('a route change cannot show the previous author and returning reuses cached data', async () => {
  await render();
  const originalRequest = axiosClient.request.getMockImplementation();
  let resolveAuthor;
  axiosClient.request.mockImplementation(args =>
    args.url === '/page/author/2'
      ? new Promise(resolve => {
          resolveAuthor = resolve;
        })
      : originalRequest(args),
  );
  await click(button('Автор 2'));
  expect(container.textContent).toContain('Загружаем страницу автора');
  expect(container.textContent).not.toContain('Анна Иванова');
  await act(async () =>
    resolveAuthor({
      data: {
        id: 2,
        username: 'new-author',
        users_userprofile: null,
        cards_card: [{ id: 12 }],
      },
    }),
  );
  expect(heading()).toBe('new-author');
  expect(container.textContent).toContain('Магнитное поле');
  expect(container.textContent).not.toContain('Отражение света');
  await click(button('Автор 1'));
  expect(heading()).toBe('Анна Иванова');
  expect(axiosClient.request).toHaveBeenCalledTimes(4);
});

test('an empty profile and empty lists work without downloading catalogs', async () => {
  axiosClient.request.mockResolvedValue({
    data: {
      id: 1,
      users_userprofile: null,
      username: null,
      first_name: null,
      last_name: null,
    },
  });
  await render();
  expect(heading()).toBe('Автор №1');
  expect(container.textContent).toContain('Курсы ещё впереди');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  await click(filter('Карточки'));
  expect(container.textContent).toContain('Карточки появятся здесь');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
});

test.each(['abc', '0', '-1', '9007199254740992'])(
  'invalid author ID %s never makes a request',
  async id => {
    await render(`/author/${id}`);
    expect(heading()).toBe('Автор не найден');
    expect(axiosClient.request).not.toHaveBeenCalled();
  },
);

test('404 and a null author show the not-found state', async () => {
  axiosClient.request.mockRejectedValueOnce({
    response: { status: 404, data: 'Not found' },
  });
  await render();
  expect(heading()).toBe('Автор не найден');
  axiosClient.request.mockResolvedValueOnce({ data: null });
  await click(button('Автор 2'));
  expect(heading()).toBe('Автор не найден');
});

test('network errors have a working retry', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(heading()).toBe('Не удалось загрузить автора');
  await click(button('Повторить'));
  expect(heading()).toBe('Анна Иванова');
});

test('a failed catalog does not block the other section and retries independently', async () => {
  const originalRequest = axiosClient.request.getMockImplementation();
  let failCourses = true;
  axiosClient.request.mockImplementation(args => {
    if (args.url === '/page/course' && failCourses)
      return Promise.reject(new Error('Offline'));
    return originalRequest(args);
  });
  await render();
  expect(container.textContent).toContain('Не удалось загрузить курсы автора');
  await click(filter('Карточки'));
  expect(container.textContent).toContain('Отражение света');
  await click(filter('Курсы'));
  failCourses = false;
  await click(button('Повторить'));
  expect(container.textContent).toContain('Оптика');
  expect(
    axiosClient.request.mock.calls.filter(
      ([args]) => args.url === '/page/author/1',
    ),
  ).toHaveLength(1);
});

test('search covers all materials beyond the first batch and load-more reveals them', async () => {
  const cards = Array.from({ length: 13 }, (_, index) =>
    card(index + 1, index === 12 ? 'Особая лекция' : `Лекция ${index + 1}`),
  );
  axiosClient.request.mockImplementation(async ({ url }) => ({
    data: url.includes('/author/')
      ? {
          id: 1,
          username: 'author',
          cards_card: cards.map(({ id }) => ({ id })),
        }
      : Object.fromEntries(cards.map(item => [item.id, item])),
  }));
  await render();
  expect(container.querySelectorAll('.sw-mini-card')).toHaveLength(12);
  await click(button('Показать ещё'));
  expect(container.querySelectorAll('.sw-mini-card')).toHaveLength(13);
  await search('ОСОБАЯ');
  expect(container.querySelectorAll('.sw-mini-card')).toHaveLength(1);
  expect(container.textContent).toContain('Особая лекция');
  await search('ничего такого');
  expect(container.textContent).toContain('Ничего не нашлось');
  await click(button('Сбросить поиск'));
  expect(container.querySelectorAll('.sw-mini-card')).toHaveLength(12);
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});
