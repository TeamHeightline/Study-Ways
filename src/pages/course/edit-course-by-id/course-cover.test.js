import React from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import axiosClient from '../../../shared/server-layer/query-layer/config';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import { FILE_URL } from '../../../settings';
import EditCourseByID from './EditCourseByID';

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../cards/selector/ui/CardSelector', () => ({
  CardSelector: () => null,
}));
const act = React.act || legacyAct;
let root, host, store, course, originalFetch;
const cover = () => host.querySelector('img[alt="Обложка курса"]');

async function render(path = 'edited-images/course/216-cover.png') {
  course.cards_cardcourseimage = path === null ? null : { image: path };
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'ADMIN' }),
  );
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCourseByID course_id={216} />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  course = {
    id: 216,
    name: 'Курс по физике',
    course_data: [],
    created_by_id: 7,
    cards_cardcourseimage: null,
    users_customuser: null,
  };
  originalFetch = global.fetch;
  global.fetch = jest.fn();
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: get => get().concat(studyWaysApi.middleware),
  });
  axiosClient.request
    .mockReset()
    .mockImplementation(async () => ({ data: course }));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  host.remove();
  global.fetch = originalFetch;
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  [
    'edited-images/course/216-cover.png',
    `${FILE_URL}/edited-images/course/216-cover.png`,
  ],
  [
    '/cards-course-images/course/216',
    `${FILE_URL}/cards-course-images/course/216`,
  ],
  [
    'https://example.com/cover.png?size=small#preview',
    'https://example.com/cover.png?size=small#preview',
  ],
  [null, `${FILE_URL}/cards-course-images/course/216`],
])(
  'editor displays REST or legacy cover %s without another metadata request',
  async (path, expected) => {
    await render(path);
    expect(cover().src).toBe(expected);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(axiosClient.request).toHaveBeenCalledTimes(1);
    expect(axiosClient.request.mock.calls[0][0].url).toBe(
      '/page/course-read/216',
    );
  },
);

test('replacing a failed image updates its URL immediately and busts the image cache even before course refetch finishes', async () => {
  await render();
  await act(async () => Simulate.error(cover()));
  expect(cover()).toBeNull();
  const savedImage = 'edited-images/course/216-cover.png';
  axiosClient.request.mockImplementation(async ({ method }) =>
    method === 'PUT' ? { data: { image: savedImage } } : new Promise(() => {}),
  );
  const file = new File(['image bytes'], 'cover.png', { type: 'image/png' });
  const version = Date.now();
  await act(async () =>
    Simulate.change(host.querySelector('input[type=file]'), {
      target: { files: [file], value: 'cover.png' },
    }),
  );
  const upload = axiosClient.request.mock.calls.find(
    ([args]) => args.method === 'PUT',
  )[0];
  expect(upload.url).toBe('/page/write/images/course/216');
  expect(upload.data).toBe(file);
  expect(cover().src).toBe(`${FILE_URL}/${savedImage}?v=${version}`);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('upload failure keeps the existing cover and shows an error', async () => {
  await render();
  const previous = cover().src;
  axiosClient.request.mockRejectedValueOnce(new Error('Upload failed'));
  await act(async () =>
    Simulate.change(host.querySelector('input[type=file]'), {
      target: {
        files: [new File(['bytes'], 'cover.png', { type: 'image/png' })],
        value: 'cover.png',
      },
    }),
  );
  expect(cover().src).toBe(previous);
  expect(host.querySelector('[role=alert]').textContent).toContain(
    'Не удалось загрузить обложку',
  );
});
