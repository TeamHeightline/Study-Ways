import themeReducer from '../../../shared/theme/theme-store';
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import axiosClient from '../../../shared/server-layer/query-layer/config';
import { ThemeTreeView } from './ThemeTreeView';

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));
const act = React.act || legacyAct;
const initial = [
  { id: '1', parent: 0, text: 'Физика' },
  { id: '2', parent: '1', text: 'Оптика' },
  { id: '3', parent: 0, text: 'Математика' },
];
let root, container, store;
function Harness() {
  const [treeData, setTreeData] = React.useState(initial);
  const [selectedThemeID, setSelectedThemeID] = React.useState('1');
  return (
    <>
      <ThemeTreeView
        {...{ treeData, setTreeData, selectedThemeID, setSelectedThemeID }}
      />
      <output data-testid="data">{JSON.stringify(treeData)}</output>
    </>
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockReset().mockResolvedValue({ data: { id: 1 } });
  store = configureStore({
    reducer: {
      theme: themeReducer,
      [studyWaysApi.reducerPath]: studyWaysApi.reducer,
    },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const render = () =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <Harness />
      </Provider>,
    ),
  );
const row = id =>
  container.querySelector(`[data-theme-id="${id}"] > .sw-theme-tree-row`);
const data = () =>
  JSON.parse(container.querySelector('[data-testid="data"]').textContent);
const click = text =>
  act(async () =>
    [...document.querySelectorAll('button')]
      .find(button => button.textContent === text)
      .click(),
  );
async function drag(source, target, y = 20) {
  const transfer = { effectAllowed: '', dropEffect: '', setData: jest.fn() };
  const dispatch = (node, type) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperties(event, {
      dataTransfer: { value: transfer },
      clientY: { value: y },
    });
    node.dispatchEvent(event);
  };
  target.getBoundingClientRect = () => ({ top: 0, height: 40, bottom: 40 });
  await act(async () => dispatch(source, 'dragstart'));
  await act(async () => dispatch(target, 'dragover'));
  await act(async () => dispatch(target, 'drop'));
}

test('native drag moves a branch through REST and keeps descendants attached', async () => {
  await render();
  await drag(row('1'), row('3'));
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/themes/1',
      method: 'PUT',
      data: { parentId: 3, text: 'Физика' },
    }),
  );
  expect(data().map(node => node.id)).toEqual(['3', '1', '2']);
  expect(data().find(node => node.id === '1').parent).toBe('3');
  expect(data().find(node => node.id === '2').parent).toBe('1');
});

test('dropping before a sibling changes only order', async () => {
  await render();
  await drag(row('3'), row('1'), 2);
  expect(data().map(node => node.id)).toEqual(['3', '1', '2']);
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('parent cycles are rejected before any request', async () => {
  await render();
  await act(async () =>
    row('1').querySelector('.MuiTreeItem-iconContainer').click(),
  );
  await drag(row('1'), row('2'));
  expect(data()).toEqual(initial);
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('failed parent save preserves the original structure and allows retry', async () => {
  await render();
  axiosClient.request.mockRejectedValueOnce(new Error('Unavailable'));
  await drag(row('1'), row('3'));
  expect(data()).toEqual(initial);
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Не удалось переместить',
  );
  await drag(row('1'), row('3'));
  expect(data().find(node => node.id === '1').parent).toBe('3');
});

test('keyboard move works with MUI focus and keeps the full subtree', async () => {
  await render();
  await act(async () =>
    container.querySelector('[data-theme-id="1"]').dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        altKey: true,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(data().map(node => node.id)).toEqual(['3', '1', '2']);
  expect(axiosClient.request).not.toHaveBeenCalled();
});

test('mobile move dialog can return a selected child to the root', async () => {
  await render();
  await act(async () =>
    row('1').querySelector('.MuiTreeItem-iconContainer').click(),
  );
  await act(async () => row('2').click());
  await click('Переместить');
  const dialog = document.querySelector('[role="dialog"]');
  await act(async () => dialog.querySelector('input[type="checkbox"]').click());
  await click('Переместить тему');
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/themes/2',
      data: { parentId: null, text: 'Оптика' },
    }),
  );
  expect(data().find(node => node.id === '2').parent).toBe(0);
});
