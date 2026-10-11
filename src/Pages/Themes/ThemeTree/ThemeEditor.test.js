import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  connectedThemesApi,
  useGetConnectedThemesQuery,
} from '../../../Shared/ConnectedThemes/api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import ThemeEditor from './ThemeEditor';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
}));
jest.mock('./ThemeTreeView', () => ({
  ThemeTreeView: ({ treeData, setTreeData, setSelectedThemeID }) => (
    <div>
      <output data-testid="draft">
        {treeData.map(node => node.text).join(',')}
      </output>
      <button onClick={() => setSelectedThemeID(treeData[0].id)}>
        Выбрать тему
      </button>
      <button onClick={() => setTreeData([...treeData].reverse())}>
        Переместить темы
      </button>
    </div>
  ),
}));
function SharedRead() {
  const { data } = useGetConnectedThemesQuery();
  return (
    <output data-testid="shared">
      {data?.map(theme => theme.text).join(',')}
    </output>
  );
}
const act = React.act || legacyAct;
const themes = [
  { id: 1, text: 'Физика', parentId: null },
  { id: 2, text: 'Оптика', parentId: 1 },
];
let root, container, store;
const render = () =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <ThemeEditor />
        <SharedRead />
      </Provider>,
    ),
  );
const click = text =>
  act(async () =>
    [...container.querySelectorAll('button')]
      .find(node => node.textContent.trim() === text)
      .click(),
  );
const enterText = text =>
  act(async () => {
    const field = container.querySelector('input');
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request
    .mockReset()
    .mockImplementation(async ({ url, method, data }) => {
      if (url.endsWith('/theme-order'))
        return { data: { sequence: data.ids.join(',') } };
      if (method === 'PUT') return { data: { id: 1, ...data } };
      if (method === 'POST') return { data: { id: 3, ...data } };
      return { data: themes };
    });
  store = configureStore({
    reducer: { [connectedThemesApi.reducerPath]: connectedThemesApi.reducer },
    middleware: getDefault =>
      getDefault().concat(connectedThemesApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(connectedThemesApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('initial REST loading does not query GraphQL or save the unchanged order', async () => {
  await render();
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Физика,Оптика',
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls.some(([args]) => args.method)).toBe(
    false,
  );
});

test('successful renaming refreshes shared selectors while preserving the editor draft', async () => {
  await render();
  await click('Выбрать тему');
  await click('Переименовать');
  await enterText('Новая физика');
  axiosClient.request.mockImplementation(async ({ method }) => ({
    data:
      method === 'PUT'
        ? { id: 1 }
        : [{ ...themes[0], text: 'Новая физика' }, themes[1]],
  }));
  await click('Сохранить название темы');
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/themes/1',
      method: 'PUT',
      data: { parentId: null, text: 'Новая физика' },
    }),
  );
  expect(container.querySelector('[data-testid="shared"]').textContent).toBe(
    'Новая физика,Оптика',
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Новая физика,Оптика',
  );
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/theme-order'),
    ),
  ).toHaveLength(0);
});

test('refetches cannot overwrite an edited order while its save is pending', async () => {
  await render();
  axiosClient.request.mockImplementationOnce(() => new Promise(() => {}));
  await click('Переместить темы');
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/theme-order'),
    ),
  ).toHaveLength(1);
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/theme-order',
      data: { ids: [2, 1] },
    }),
  );
  axiosClient.request.mockResolvedValue({
    data: [...themes, { id: 3, text: 'Волны', parentId: 2 }],
  });
  await act(async () =>
    store.dispatch(connectedThemesApi.util.invalidateTags(['ConnectedThemes'])),
  );
  expect(container.querySelector('[data-testid="shared"]').textContent).toBe(
    'Физика,Оптика,Волны',
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Оптика,Физика',
  );
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/theme-order'),
    ),
  ).toHaveLength(1);
});

test('creating a sibling root keeps the numeric tree root and refreshes the shared list', async () => {
  await render();
  await click('Выбрать тему');
  await click('Добавить тему рядом');
  await enterText('Механика');
  axiosClient.request.mockImplementation(async ({ method, data }) => ({
    data:
      method === 'POST'
        ? { id: 3 }
        : method === 'PUT'
          ? { sequence: data.ids.join(',') }
          : [...themes, { id: 3, text: 'Механика', parentId: null }],
  }));
  await click('Создать тему');
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/themes',
      method: 'POST',
      data: { text: 'Механика', parentId: null },
    }),
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Физика,Оптика,Механика',
  );
  expect(container.querySelector('[data-testid="shared"]').textContent).toBe(
    'Физика,Оптика,Механика',
  );
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/theme-order'),
    ),
  ).toHaveLength(1);
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/theme-order',
      data: { ids: [1, 2, 3] },
    }),
  );
});

test('a failed order save stays in the draft and can be retried', async () => {
  await render();
  axiosClient.request.mockRejectedValueOnce(new Error('Unavailable'));
  await click('Переместить темы');
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Не удалось сохранить порядок',
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Оптика,Физика',
  );
  await click('Повторить порядок');
  expect(
    axiosClient.request.mock.calls.filter(([args]) =>
      args.url.endsWith('/theme-order'),
    ),
  ).toHaveLength(2);
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test('an empty hierarchy can create its first root without a selection', async () => {
  axiosClient.request.mockResolvedValueOnce({ data: [] });
  await render();
  await click('Добавить тему');
  await enterText('Физика');
  await click('Создать тему');
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/themes',
      method: 'POST',
      data: { text: 'Физика', parentId: null },
    }),
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Физика',
  );
});
