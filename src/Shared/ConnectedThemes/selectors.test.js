import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { runInAction } from 'mobx';
import { connectedThemesApi } from './api';
import axiosClient from '../ServerLayer/QueryLayer/config';
import { ConnectedThemes } from '../../Pages/Cards/Selector/UI/ConnectedThemes';
import { UiConnectedThemeSelector } from '../../Pages/Cards/Editor/EditorByIDV2/UI/ui-connected-theme-selector';
import ConnectedThemeSelector from '../../Pages/Question/Editor/QuestionEditor/UI/ui-connected-theme-selector';
import AIThemeFilter from '../../Pages/Cards/Page/AISearch/UI/AIThemeFilter';
import { CSSObject } from '../../Pages/Cards/Selector/Store/CardSelectorStore';
import { CESObject } from '../../Pages/Cards/Editor/EditorByIDV2/Store/CardEditorStorage';
import { QuestionEditorStorage } from '../../Pages/Question/Editor/QuestionEditor/Store/QuestionEditorStorage';
import { AISObject } from '../../Pages/Cards/Page/AISearch/Store/AISearch';
import { getAutocompleteCardDataAsync } from '../../Pages/Cards/Page/AISearch/Store/Query';

jest.mock('antd/es/tree-select', () => require('antd/lib/tree-select'));
jest.mock('../ServerLayer/QueryLayer/config', () => ({ request: jest.fn() }));
jest.mock('../../Pages/Cards/Selector/Store/CardSelectorStore', () => ({
  CSSObject: require('mobx').makeAutoObservable({
    cardConnectedTheme: undefined,
  }),
}));
jest.mock(
  '../../Pages/Cards/Editor/EditorByIDV2/Store/CardEditorStorage',
  () => ({
    CESObject: require('mobx').makeAutoObservable(
      {
        card_object: { connectedTheme: [] },
        changeFieldByValue: jest.fn(function (field, value) {
          this.card_object[field] = value;
        }),
      },
      { changeFieldByValue: false },
    ),
  }),
);
jest.mock(
  '../../Pages/Question/Editor/QuestionEditor/Store/QuestionEditorStorage',
  () => ({
    QuestionEditorStorage: require('mobx').makeAutoObservable({
      selectedConnectedTheme: undefined,
    }),
  }),
);
jest.mock('../../Pages/Cards/Page/AISearch/Store/Query', () => ({
  getAutocompleteCardDataAsync: jest.fn(),
  selectRecommendedCardReport: jest.fn(),
}));

const act = React.act || legacyAct;
const themes = [
  { id: 10, text: 'Физика', parentId: null },
  { id: 11, text: 'Оптика', parentId: 10 },
  { id: 12, text: 'Волны', parentId: 11 },
  { id: 20, text: 'Механика', parentId: null },
];
let root, container, store;
const render = content =>
  act(async () => root.render(<Provider store={store}>{content}</Provider>));
const mouseDown = element =>
  act(async () =>
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })),
  );
const click = element => act(async () => element.click());
const title = text =>
  [...document.querySelectorAll('.ant-select-tree-title')].find(
    node => node.textContent === text,
  );
const expand = text =>
  click(
    title(text)
      .closest('.ant-select-tree-treenode')
      .querySelector('.ant-select-tree-switcher'),
  );

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockReset().mockResolvedValue({ data: themes });
  getAutocompleteCardDataAsync.mockClear();
  CESObject.changeFieldByValue.mockImplementation(function (field, value) {
    runInAction(() => { this.card_object[field] = value; });
  });
  runInAction(() => {
    CSSObject.cardConnectedTheme = undefined;
    CESObject.card_object.connectedTheme = [];
    QuestionEditorStorage.selectedConnectedTheme = undefined;
    AISObject.setThemeFilter(undefined, []);
  });
  store = configureStore({
    reducer: { [connectedThemesApi.reducerPath]: connectedThemesApi.reducer },
    middleware: getDefault =>
      getDefault().concat(connectedThemesApi.middleware),
  });
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({
      width: 400,
      height: 40,
      top: 0,
      bottom: 40,
      left: 0,
      right: 400,
      x: 0,
      y: 0,
      toJSON() {},
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
  clearTimeout(AISObject.debounceTimer);
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('all selectors share one lazy REST read and loading never changes saved selections', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  runInAction(() => {
    CESObject.card_object.connectedTheme = [12];
    QuestionEditorStorage.selectedConnectedTheme = '11';
    AISObject.setThemeFilter(10, ['10']);
  });
  let finish;
  axiosClient.request.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await render(
    <>
      <ConnectedThemes />
      <UiConnectedThemeSelector />
      <ConnectedThemeSelector />
      <AIThemeFilter />
    </>,
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0]).toMatchObject({
    url: '/page/connected-themes',
  });
  expect(container.querySelectorAll('.ant-select-disabled')).toHaveLength(4);
  await act(async () => finish({ data: themes }));
  expect(container.querySelectorAll('.ant-select-disabled')).toHaveLength(0);
  expect(CESObject.changeFieldByValue).not.toHaveBeenCalled();
  expect(CESObject.card_object.connectedTheme).toEqual([12]);
  expect(QuestionEditorStorage.selectedConnectedTheme).toBe('11');
  expect(AISObject.themeWithPatentIDArray).toEqual(['10', '11', '12']);
  expect(AISObject.AIQueryFilterString).toContain('{"10", "11", "12"}');
  expect(getAutocompleteCardDataAsync).toHaveBeenLastCalledWith(
    '',
    AISObject.AIQueryFilterString,
    expect.any(Function),
    50,
  );
});

test('ordinary search can select a nested theme and clear it', async () => {
  await render(<ConnectedThemes />);
  await mouseDown(container.querySelector('.ant-select-selector'));
  await expand('Физика');
  await expand('Оптика');
  await click(title('Волны'));
  expect(CSSObject.cardConnectedTheme).toBe(12);
  expect(
    container.querySelector('.ant-select-selection-item').textContent,
  ).toBe('Волны');
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(CSSObject.cardConnectedTheme).toBeUndefined();
});

test('card editor saves multiple string IDs while question editor saves a single ID', async () => {
  await render(<UiConnectedThemeSelector />);
  await mouseDown(container.querySelector('.ant-select-selector'));
  await expand('Физика');
  await expand('Оптика');
  await click(title('Волны'));
  await click(title('Механика'));
  expect(CESObject.changeFieldByValue).toHaveBeenLastCalledWith(
    'connectedTheme',
    ['12', '20'],
  );
  await render(<ConnectedThemeSelector />);
  await mouseDown(container.querySelector('.ant-select-selector'));
  await expand('Физика');
  await click(title('Оптика'));
  expect(QuestionEditorStorage.selectedConnectedTheme).toBe('11');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
});

test('AI selection and cache refresh include newly added descendants and clear the filter', async () => {
  await render(<AIThemeFilter />);
  await mouseDown(container.querySelector('.ant-select-selector'));
  await click(title('Физика'));
  expect(AISObject.themeWithPatentIDArray).toEqual(['10', '11', '12']);
  axiosClient.request.mockResolvedValue({
    data: [...themes, { id: 13, text: 'Резонанс', parentId: 12 }],
  });
  await act(async () =>
    store.dispatch(connectedThemesApi.util.invalidateTags(['ConnectedThemes'])),
  );
  expect(AISObject.themeWithPatentIDArray).toEqual(['10', '11', '12', '13']);
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(AISObject.themeWithPatentIDArray).toEqual([]);
  expect(AISObject.AIQueryFilterString).not.toContain('connected_theme');
});

test('failed requests expose a working retry instead of permanently disabling selection', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render(<ConnectedThemeSelector />);
  expect(container.textContent).toContain('Не удалось загрузить темы');
  expect(container.querySelector('.ant-select-disabled')).not.toBeNull();
  await click(
    [...container.querySelectorAll('button')].find(
      node => node.textContent === 'Повторить',
    ),
  );
  expect(container.querySelector('.ant-select-disabled')).toBeNull();
  expect(container.textContent).not.toContain('Не удалось загрузить темы');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});
