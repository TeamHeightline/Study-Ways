import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { observable, runInAction } from 'mobx';
import CoursePage from './course-page';
import CardFindInCourse from '../../../Cards/CardByID/UI/card-find-in-course';
import { courseCatalogApi } from '../Store/course-catalog-api';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';

jest.mock('../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../../../Shared/Theme/ThemeManulNote', () => ({
  ThemeManulNote: () => null,
}));
jest.mock('../../../../Shared/Theme/ThemeIllustration', () => ({
  ThemeHeroArt: () => null,
  ThemeIllustration: () => null,
}));

const act = React.act || legacyAct;
let root, container, store;
const course = (id, name) => ({
  id,
  name,
  course_data: [
    { SameLine: [{ CourseFragment: [{ CourseElement: { id: '42' } }] }] },
  ],
  users_customuser: { users_userprofile: null },
});
const catalogCalls = () =>
  axiosClient.request.mock.calls
    .map(([args]) => args)
    .filter(args => args.url.endsWith('/catalog'));
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
const click = node => act(async () => node.click());
const input = label => container.querySelector(`input[aria-label="${label}"]`);
async function fill(node, value) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(node, value);
    node.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
function Location() {
  return <output>{useLocation().search}</output>;
}
async function render(content = <CoursePage />) {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          {content}
          <Location />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ url, params }) => ({
      data: url.endsWith('/authors')
        ? [
            {
              id: 7,
              username: 'physics',
              users_userprofile: { firstname: 'Анна', lastname: null },
            },
          ]
        : url.includes('/card/')
          ? [
              {
                course_id: '8',
                course_name: 'Оптика',
                position: {
                  activePage: 2,
                  selectedPage: 2,
                  selectedRow: 1,
                  selectedIndex: 3,
                },
              },
            ]
          : {
              items: [
                course(
                  params.page === 1 ? 26 : 14,
                  params.page === 1 ? 'Оптика' : 'Механика',
                ),
              ],
              total: 26,
              numPages: 3,
              activePage: params.page,
            },
    }));
  store = configureStore({
    reducer: { [courseCatalogApi.reducerPath]: courseCatalogApi.reducer },
    middleware: get => get().concat(courseCatalogApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({
      width: 300,
      height: 44,
      top: 100,
      bottom: 144,
      left: 100,
      right: 400,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(courseCatalogApi.util.resetApiState());
  });
  container.remove();
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('only the mounted catalog fetches its page and course authors; navigation retains course positions', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  await render(<div>Другая страница</div>);
  expect(axiosClient.request).not.toHaveBeenCalled();
  await render();
  expect(
    axiosClient.request.mock.calls.map(([args]) => args.url).sort(),
  ).toEqual(['/page/course/authors', '/page/course/catalog']);
  expect(catalogCalls()[0].params).toEqual({
    page: 1,
    search: '',
    levels: 'all',
    sort: 'default',
  });
  expect(container.querySelector('#catalog-title').textContent).toContain('26');
  await click(container.querySelector('.sw-course-open'));
  expect(container.querySelector('output').textContent).toBe(
    '?id=26&activePage=1&selectedPage=1&selectedRow=0&selectedIndex=0',
  );
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  expect(catalogCalls().at(-1).params.page).toBe(2);
  expect(container.querySelector('.sw-course-grid').textContent).toContain(
    'Механика',
  );
  expect(container.querySelector('.sw-course-grid').textContent).not.toContain(
    'Оптика',
  );
});

test('server author, level, sort and debounced search filters reset pagination', async () => {
  await render();
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  await click(container.querySelector('[aria-label="Выбрать автора"]'));
  await click(document.querySelector('[role="option"]'));
  expect(catalogCalls().at(-1).params).toMatchObject({
    page: 1,
    authorId: '7',
  });
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  await click(button('Многоуровневые'));
  expect(catalogCalls().at(-1).params).toMatchObject({
    page: 1,
    authorId: '7',
    levels: 'multi',
  });
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  await act(async () => {
    const select = container.querySelector('select');
    select.value = 'name';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(catalogCalls().at(-1).params).toMatchObject({ page: 1, sort: 'name' });
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  jest.useFakeTimers();
  const count = catalogCalls().length;
  await fill(input('Поиск по названию курса или автору'), '  заряд  ');
  await act(async () => jest.advanceTimersByTime(349));
  expect(catalogCalls()).toHaveLength(count);
  await act(async () => jest.advanceTimersByTime(1));
  expect(catalogCalls().at(-1).params).toMatchObject({
    page: 1,
    search: 'заряд',
    authorId: '7',
    levels: 'multi',
    sort: 'name',
  });
  await click(container.querySelector('[aria-label="Очистить поиск"]'));
  expect(catalogCalls().at(-1).params.search).toBe('');
});

test('new pages hide old results while loading and a failed request can be retried with its filters', async () => {
  await render();
  let finish;
  axiosClient.request.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await click(container.querySelector('[aria-label="Go to page 2"]'));
  expect(
    container.querySelector('[aria-label="Загрузка курсов"]'),
  ).not.toBeNull();
  expect(container.querySelector('.sw-course-grid').textContent).not.toContain(
    'Оптика',
  );
  await act(async () =>
    finish({ data: { items: [], total: 26, activePage: 2, numPages: 3 } }),
  );
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await click(button('Один уровень'));
  expect(container.textContent).toContain('Не удалось загрузить курсы');
  await click(button('Повторить'));
  expect(container.querySelector('.sw-course-grid').textContent).toContain(
    'Оптика',
  );
  expect(catalogCalls().at(-1).params).toMatchObject({
    page: 1,
    levels: 'single',
  });
});

test('empty filtered results reset all filters including the author', async () => {
  await render();
  await click(container.querySelector('[aria-label="Выбрать автора"]'));
  axiosClient.request.mockResolvedValueOnce({
    data: { items: [], total: 0, activePage: 1, numPages: 1 },
  });
  await click(document.querySelector('[role="option"]'));
  expect(container.textContent).toContain('Пока ничего не нашлось');
  await click(button('Сбросить фильтры'));
  expect(catalogCalls().at(-1).params).toEqual({
    page: 1,
    search: '',
    levels: 'all',
    sort: 'default',
  });
  expect(container.querySelector('input[placeholder="Все авторы"]').value).toBe(
    '',
  );
});

test('card membership requests only a valid mounted card and navigates to its exact position', async () => {
  const cardStore = observable({ id: null });
  await render(<CardFindInCourse card_store={cardStore} />);
  expect(axiosClient.request).not.toHaveBeenCalled();
  await act(async () =>
    runInAction(() => {
      cardStore.id = 42;
    }),
  );
  expect(axiosClient.request.mock.calls[0][0].url).toBe('/page/course/card/42');
  expect(container.textContent).toContain('Материал входит в курс');
  await click(button('Оптика'));
  expect(container.querySelector('output').textContent).toBe(
    '?id=8&activePage=2&selectedPage=2&selectedRow=1&selectedIndex=3',
  );
  let finish;
  axiosClient.request.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await act(async () =>
    runInAction(() => {
      cardStore.id = 43;
    }),
  );
  expect(container.textContent).not.toContain('Оптика');
  await act(async () => finish({ data: [] }));
  expect(container.textContent).not.toContain('Материал входит');
});

test('card membership failure has a retry without loading all courses', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render(<CardFindInCourse card_store={observable({ id: 42 })} />);
  expect(container.textContent).toContain('Не удалось проверить');
  await click(button('Повторить'));
  expect(container.textContent).toContain('Материал входит в курс');
  expect(
    axiosClient.request.mock.calls.every(
      ([args]) => args.url === '/page/course/card/42',
    ),
  ).toBe(true);
});
