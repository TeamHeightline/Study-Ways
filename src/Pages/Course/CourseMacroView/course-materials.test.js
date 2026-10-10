import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import CourseMacroView from './index';
import { courseMaterialsApi } from '../course-materials-api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  get: jest.fn(),
  request: jest.fn(),
}));
const fragment = (...ids) => ({
  CourseFragment: ids.map(id => ({ CourseElement: { id } })),
});
const course = {
  id: 24,
  name: 'Физика [1]',
  course_data: [
    { SameLine: [fragment('11', '12,13'), fragment('14')] },
    { SameLine: [fragment('21', '11'), fragment('22')] },
  ],
};
const card = id => ({
  id,
  title: `Тема ${id}`,
  video_url: null,
  card_content_type: 2,
  cards_cardimage: { image: `card/${id}.png` },
});
const act = React.act || legacyAct;
let root, container, store, select;
const render = (page = 1) =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseMacroView
            courseID={24}
            positionData={{
              activePage: page,
              selectedPage: page,
              selectedRow: 0,
              selectedIndex: 0,
            }}
            onCardSelect={select}
          />
        </MemoryRouter>
      </Provider>,
    ),
  );
const titles = () =>
  [...container.querySelectorAll('.sw-course-material-title')].map(
    node => node.textContent,
  );
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  select = jest.fn();
  axiosClient.get.mockReset().mockResolvedValue({ data: course });
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ params }) => ({
      data: (params.page === 1 ? [11, 12, 13, 21] : [14, 22]).map(card),
    }));
  store = configureStore({
    reducer: { [courseMaterialsApi.reducerPath]: courseMaterialsApi.reducer },
    middleware: getDefault =>
      getDefault().concat(courseMaterialsApi.middleware),
  });
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

test('desktop previews share one page batch, preserve collections and reuse cached pages', async () => {
  await render();
  expect(titles()).toEqual([
    'Тема 11',
    'Подборка · 2 материалов',
    'Тема 21',
    'Тема 11',
  ]);
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0]).toMatchObject({
    url: '/page/course-by-id/24/cards',
    params: { page: 1 },
  });
  expect(select).toHaveBeenLastCalledWith('11');
  await render(2);
  expect(titles()).toEqual(['Тема 14', 'Тема 22']);
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  await render(1);
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(titles()).toContain('Тема 21');
  expect(axiosClient.get).toHaveBeenCalledTimes(1);
  expect(axiosClient.get).toHaveBeenCalledWith(
    '/page/course-by-id/get-course-by-id/24',
  );
});

test('late batches cannot put old page data on the current nodes', async () => {
  const pending = {};
  axiosClient.request.mockImplementation(
    ({ params }) =>
      new Promise(resolve => {
        pending[params.page] = resolve;
      }),
  );
  await render(1);
  await render(2);
  await act(async () => pending[2]({ data: [card(14), card(22)] }));
  expect(titles()).toEqual(['Тема 14', 'Тема 22']);
  await act(async () =>
    pending[1]({ data: [card(11), card(12), card(13), card(21)] }),
  );
  expect(titles()).toEqual(['Тема 14', 'Тема 22']);
  await render(1);
  expect(titles()).toContain('Тема 11');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});

test('failed batches expose a working page retry and missing cards stop loading', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.textContent).toContain(
    'Не удалось загрузить материалы страницы курса',
  );
  axiosClient.request.mockResolvedValue({ data: [card(11)] });
  await act(async () =>
    [...container.querySelectorAll('button')]
      .find(node => node.textContent === 'Повторить')
      .click(),
  );
  expect(container.textContent).not.toContain(
    'Не удалось загрузить материалы страницы курса',
  );
  expect(titles()).toContain('Тема 11');
  expect(titles()).toContain('Материал недоступен');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});
