import themeReducer from '../../../../shared/theme/theme-store';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
import axiosClient from '../../../../shared/server-layer/query-layer/config';
import UiJSONExport from './ui-json-export';

jest.mock('../../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));

const act = React.act || legacyAct;
let root, container, store, downloads;
const button = () => container.querySelector('button');
const click = () => act(async () => button().click());

beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  downloads = [];
  jest
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(function () {
      downloads.push({
        filename: this.download,
        href: this.getAttribute('href'),
      });
    });
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  axiosClient.request.mockResolvedValue({ data: { students: [] } });
  store = configureStore({
    reducer: {
      theme: themeReducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
      examResultsByIDReducer: (state = { exam_id: 42 }, action) =>
        action.type === 'exam/change' ? { exam_id: action.payload } : state,
    },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <Provider store={store}>
        <UiJSONExport />
      </Provider>,
    ),
  );
});

afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('requests analytics only on click and downloads fresh JSON on each export', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  const first = { students: [{ username: 'student', score: 12 }] };
  const second = { students: [{ username: 'student', score: 15 }] };
  axiosClient.request
    .mockResolvedValueOnce({ data: first })
    .mockResolvedValueOnce({ data: second });
  await click();
  await click();
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(axiosClient.request.mock.calls[0][0].url).toBe(
    '/exam/analytics/cheating/42',
  );
  expect(downloads.map(item => item.filename)).toEqual([
    'exam_42_ai_analytics.json',
    'exam_42_ai_analytics.json',
  ]);
  expect(
    downloads.map(item =>
      JSON.parse(decodeURIComponent(item.href.split(',')[1])),
    ),
  ).toEqual([first, second]);
  expect(document.querySelector('a[download]')).toBeNull();
});

test('disables export while loading and uses the requested exam in the filename', async () => {
  let resolveRequest;
  axiosClient.request.mockReturnValueOnce(
    new Promise(resolve => {
      resolveRequest = resolve;
    }),
  );
  await click();
  expect(button().disabled).toBe(true);
  await click();
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  await act(async () => store.dispatch({ type: 'exam/change', payload: 99 }));
  await act(async () => resolveRequest({ data: { students: [] } }));
  expect(downloads[0].filename).toBe('exam_42_ai_analytics.json');
  expect(button().disabled).toBe(false);
});

test('shows a failed request without downloading and allows a fresh retry', async () => {
  axiosClient.request.mockRejectedValueOnce({
    response: { status: 500, data: 'failed' },
  });
  await click();
  expect(window.alert).toHaveBeenCalledWith(
    'Не удалось скачать данные для анализа ИИ',
  );
  expect(downloads).toHaveLength(0);
  expect(button().disabled).toBe(false);
  await click();
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(downloads).toHaveLength(1);
});

test.each([0, -1, 'invalid'])(
  'does not request analytics for invalid exam ID %s',
  async id => {
    await act(async () => store.dispatch({ type: 'exam/change', payload: id }));
    await click();
    expect(window.alert).toHaveBeenCalledWith('ID экзамена не найден');
    expect(axiosClient.request).not.toHaveBeenCalled();
    expect(downloads).toHaveLength(0);
  },
);
