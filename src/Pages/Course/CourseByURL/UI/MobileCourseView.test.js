import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { courseMaterialsApi } from '../../course-materials-api';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import MobileCourseView from './MobileCourseView';
import { courseNodes, mobilePosition } from './mobile-course-data';
import { normalizeCourseData } from '../../EditCourseByID/course-data';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';
jest.mock('../../../../Shared/ServerLayer/QueryLayer/config', () => ({
  get: jest.fn(),
  request: jest.fn(),
}));
const fragment = (...items) => ({
  CourseFragment: items.map(item => ({
    CourseElement: typeof item === 'object' ? item : { id: item },
  })),
});
const lines = normalizeCourseData([
  {
    SameLine: [
      fragment(null, 11, '12,13'),
      fragment(14, {
        id: null,
        type: 'course-link',
        course_link: '/course?id=25',
      }),
    ],
  },
  { SameLine: [fragment(null, 21), fragment(null)] },
  { SameLine: [fragment(null)] },
]);
const course = { id: 24, name: 'Биология [1]', course_data: lines };
test('positions skip gaps, preserve collections and course links, and recover from invalid addresses', () => {
  expect(courseNodes(lines).map(node => node.item.id)).toEqual([
    '11',
    '12,13',
    '14',
    null,
    '21',
  ]);
  expect(mobilePosition(lines, {}, false)).toEqual({
    activePage: 1,
    selectedPage: 1,
    selectedRow: 0,
    selectedIndex: 1,
  });
  expect(
    mobilePosition(lines, {
      activePage: 9,
      selectedPage: 9,
      selectedRow: NaN,
      selectedIndex: 999,
    }),
  ).toEqual({
    activePage: 1,
    selectedPage: 1,
    selectedRow: 0,
    selectedIndex: 1,
  });
  expect(
    mobilePosition(lines, {
      activePage: 2,
      selectedPage: 2,
      selectedRow: 1,
      selectedIndex: 1,
    }).selectedIndex,
  ).toBe(-1);
});
const act = React.act || legacyAct;
let container, root, select, store;
function Reader() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const position = Object.fromEntries(
    ['activePage', 'selectedPage', 'selectedRow', 'selectedIndex'].map(key => [
      key,
      Number(params.get(key)),
    ]),
  );
  return (
    <>
      <output>{location.pathname + location.search}</output>
      <button onClick={() => navigate(-1)}>История назад</button>
      <MobileCourseView
        key={params.get('id')}
        courseID={Number(params.get('id'))}
        position={position}
        explicitPosition={params.has('selectedRow')}
        onCardSelect={select}
      />
    </>
  );
}
const button = title =>
  [...container.querySelectorAll('button')].find(
    node =>
      node.textContent === title || node.getAttribute('aria-label') === title,
  );
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  select = jest.fn();
  store = configureStore({
    reducer: { [courseMaterialsApi.reducerPath]: courseMaterialsApi.reducer },
    middleware: getDefault =>
      getDefault().concat(courseMaterialsApi.middleware),
  });
  axiosClient.request.mockReset().mockImplementation(async ({ params }) => ({
    data: (params.page === 1 ? [11, 12, 13, 21] : [14]).map(id => ({
      id,
      title: `Тема ${id}`,
      card_content_type: 2,
      video_url: null,
      cards_cardimage: null,
    })),
  }));
  axiosClient.get.mockReset().mockImplementation(url =>
    Promise.resolve({
      data: { ...course, id: Number(url.split('/').pop()) },
    }),
  );
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(courseMaterialsApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const render = () =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/course?id=24']}>
          <Reader />
        </MemoryRouter>
      </Provider>,
    ),
  );
test('next crosses page boundaries, collections keep all IDs, and browser back restores the material', async () => {
  await render();
  expect(select).toHaveBeenLastCalledWith('11');
  await act(async () => button('Далее').click());
  expect(select).toHaveBeenLastCalledWith('12,13');
  await act(async () => button('Далее').click());
  expect(select).toHaveBeenLastCalledWith('14');
  expect(container.querySelector('output').textContent).toContain(
    'activePage=2',
  );
  await act(async () => button('История назад').click());
  expect(select).toHaveBeenLastCalledWith('12,13');
  await act(async () => button('Следующая страница курса').click());
  expect(select).toHaveBeenLastCalledWith('14');
  await act(async () =>
    container.querySelector('[aria-label="Уровень 1: Следующий курс"]').click(),
  );
  expect(container.querySelector('output').textContent).toContain(
    '/course?id=25',
  );
});
test('the map displays branches on different levels and supports direct selection and zoom', async () => {
  await render();
  expect(container.querySelectorAll('.sw-mobile-tree-node')).toHaveLength(3);
  expect(container.querySelectorAll('.sw-mobile-tree-forward')).toHaveLength(1);
  expect(
    container.querySelectorAll('.sw-mobile-tree-alternative'),
  ).toHaveLength(1);
  await act(async () =>
    container.querySelector('[aria-label="Уровень 2: Тема 21"]').click(),
  );
  expect(select).toHaveBeenLastCalledWith('21');
  expect(container.querySelector('output').textContent).toContain(
    'selectedRow=1',
  );
  expect(
    container.querySelector('[aria-current="step"]').textContent,
  ).toContain('Тема 21');
  await act(async () => button('Уменьшить карту').click());
  expect(container.textContent).toContain('80%');
  await act(async () => button('Вернуться к выбранному материалу').click());
  expect(container.textContent).toContain('100%');
  await act(async () => button('Следующая страница курса').click());
  expect(select).toHaveBeenLastCalledWith('14');
});
test('course loading has a retry after failure', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.textContent).toContain('Не удалось загрузить курс');
  await act(async () => button('Повторить').click());
  expect(select).toHaveBeenLastCalledWith('11');
});

test('one batch serves every card on a page and cached pages survive navigation', async () => {
  await render();
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0]).toMatchObject({
    url: '/page/course-by-id/24/cards',
    params: { page: 1 },
  });
  expect(container.textContent).toContain('Тема 11');
  expect(container.textContent).toContain('Тема 21');
  await act(async () => button('Далее').click());
  expect(select).toHaveBeenLastCalledWith('12,13');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  await act(async () => button('Далее').click());
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(axiosClient.request.mock.calls[1][0]).toMatchObject({
    params: { page: 2 },
  });
  expect(container.textContent).toContain('Тема 14');
  await act(async () => button('История назад').click());
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(container.textContent).toContain('Тема 21');
  expect(
    axiosClient.get.mock.calls.every(([url]) =>
      url.includes('get-course-by-id'),
    ),
  ).toBe(true);
});

test('a failed material batch keeps the map and retries the whole page once', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.querySelectorAll('.sw-mobile-tree-node')).toHaveLength(3);
  expect(container.textContent).toContain(
    'Не удалось загрузить материалы страницы курса',
  );
  await act(async () => button('Повторить').click());
  expect(container.textContent).toContain('Тема 21');
  expect(container.textContent).not.toContain(
    'Не удалось загрузить материалы страницы курса',
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});
