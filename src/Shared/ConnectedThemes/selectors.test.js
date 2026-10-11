import React from 'react';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { runInAction } from 'mobx';
import { connectedThemesApi } from './api';
import axiosClient from '../ServerLayer/QueryLayer/config';
import { ConnectedThemes } from '../../Pages/Cards/Selector/UI/ConnectedThemes';
import { UiConnectedThemeSelector as CardThemeSelector } from '../../Pages/Cards/Editor/EditorByIDV2/UI/ui-connected-theme-selector';
import ConnectedThemeSelector from '../../Pages/Question/Editor/QuestionEditor/UI/ui-connected-theme-selector';
import AIThemeFilter from '../../Pages/Cards/Page/AISearch/UI/AIThemeFilter';
import { CSSObject } from '../../Pages/Cards/Selector/Store/CardSelectorStore';
import cardEditorReducer, {
  initializeDraft,
  changeCardField,
} from '../../Pages/Cards/Editor/EditorByIDV2/model/card-editor-slice';
import { editableDefaults } from '../../Pages/Cards/Editor/EditorByIDV2/model/types';
import { CardEditorProvider } from '../../Pages/Cards/Editor/EditorByIDV2/model/use-card-editor';
import { QuestionEditorStorage } from '../../Pages/Question/Editor/QuestionEditor/Store/QuestionEditorStorage';
import { AISObject } from '../../Pages/Cards/Page/AISearch/Store/AISearch';
import { getAutocompleteCardDataAsync } from '../../Pages/Cards/Page/AISearch/Store/Query';

jest.mock('../ServerLayer/QueryLayer/config', () => ({ request: jest.fn() }));
jest.mock('../../Pages/Cards/Selector/Store/CardSelectorStore', () => ({
  CSSObject: require('mobx').makeAutoObservable({
    cardConnectedTheme: undefined,
  }),
}));
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

function UiConnectedThemeSelector() {
  const draft = useSelector(state => state.cardEditor.entries.test.draft);
  const dispatch = useDispatch();
  return (
    <CardEditorProvider
      value={{
        draft,
        changeFieldByValue: (field, value) =>
          dispatch(changeCardField({ key: 'test', field, value })),
      }}
    >
      <CardThemeSelector />
    </CardEditorProvider>
  );
}
const cardDraft = () => store.getState().cardEditor.entries.test.draft;
const setCardThemes = value =>
  store.dispatch(
    changeCardField({ key: 'test', field: 'connectedTheme', value }),
  );
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
  [...document.querySelectorAll('[data-theme-text]')].find(
    node => node.textContent === text,
  );
const expand = text =>
  click(document.querySelector(`[aria-label="Развернуть «${text}»"]`));
const open = () =>
  click(container.querySelector('[aria-label="Открыть темы"]'));

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockReset().mockResolvedValue({ data: themes });
  getAutocompleteCardDataAsync.mockClear();
  runInAction(() => {
    CSSObject.cardConnectedTheme = undefined;
    QuestionEditorStorage.selectedConnectedTheme = undefined;
    AISObject.setThemeFilter(undefined, []);
  });
  store = configureStore({
    reducer: {
      [connectedThemesApi.reducerPath]: connectedThemesApi.reducer,
      cardEditor: cardEditorReducer,
    },
    middleware: getDefault =>
      getDefault().concat(connectedThemesApi.middleware),
  });
  store.dispatch(
    initializeDraft({
      key: 'test',
      draft: {
        ...editableDefaults,
        id: 812,
        created_by_id: 7,
        connectedTheme: [],
      },
      imagePath: '',
    }),
  );
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
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
    setCardThemes([12]);
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
  expect(container.querySelectorAll('[role=combobox]:disabled')).toHaveLength(
    4,
  );
  await act(async () => finish({ data: themes }));
  expect(container.querySelectorAll('[role=combobox]:disabled')).toHaveLength(
    0,
  );
  expect(store.getState().cardEditor.entries.test.revision).toBe(1);
  expect(cardDraft().connectedTheme).toEqual([12]);
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
  await open();
  await expand('Физика');
  await expand('Оптика');
  await click(title('Волны'));
  expect(CSSObject.cardConnectedTheme).toBe(12);
  expect(container.querySelector('[role=combobox]').value).toBe('Волны');
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(CSSObject.cardConnectedTheme).toBeUndefined();
});

test('card editor saves multiple numeric IDs while question editor saves a single ID', async () => {
  await render(<UiConnectedThemeSelector />);
  await open();
  await expand('Физика');
  await expand('Оптика');
  await click(title('Волны'));
  await click(title('Механика'));
  expect(cardDraft().connectedTheme).toEqual([12, 20]);
  await render(<ConnectedThemeSelector />);
  await open();
  await expand('Физика');
  await click(title('Оптика'));
  expect(QuestionEditorStorage.selectedConnectedTheme).toBe('11');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
});

test('AI selection and cache refresh include newly added descendants and clear the filter', async () => {
  await render(<AIThemeFilter />);
  await open();
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
  expect(container.querySelector('[role=combobox]:disabled')).not.toBeNull();
  await click(
    [...container.querySelectorAll('button')].find(
      node => node.textContent === 'Повторить',
    ),
  );
  expect(container.querySelector('[role=combobox]:disabled')).toBeNull();
  expect(container.textContent).not.toContain('Не удалось загрузить темы');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});

test('search finds a collapsed descendant and keeps its ancestors visible', async () => {
  await render(<ConnectedThemeSelector />);
  const field = container.querySelector('[role=combobox]');
  await open();
  await act(async () => {
    Simulate.change(field, { target: { value: 'волны' } });
  });
  expect(
    [...document.querySelectorAll('[data-theme-id]')].map(
      node => node.dataset.themeId,
    ),
  ).toEqual(['10', '11', '12']);
  await click(title('Волны'));
  expect(QuestionEditorStorage.selectedConnectedTheme).toBe('12');
  await open();
  expect(title('Волны')).toBeDefined();
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(QuestionEditorStorage.selectedConnectedTheme).toBeUndefined();
});

test('keyboard navigation expands branches and selects a deeply nested theme', async () => {
  await render(<ConnectedThemeSelector />);
  const field = container.querySelector('[role=combobox]');
  await act(async () => field.focus());
  const press = key => act(async () => Simulate.keyDown(field, { key }));
  await press('ArrowDown');
  await press('ArrowRight');
  await press('ArrowDown');
  await press('ArrowRight');
  await press('ArrowDown');
  await press('Enter');
  expect(QuestionEditorStorage.selectedConnectedTheme).toBe('12');
});

test('removing one selected chip and clearing the rest preserves independent multi-selection', async () => {
  runInAction(() => {
    setCardThemes([12, 20]);
  });
  await render(<UiConnectedThemeSelector />);
  expect(
    [...container.querySelectorAll('.MuiChip-label')].map(
      node => node.textContent,
    ),
  ).toEqual(['Волны', 'Механика']);
  await act(async () =>
    Simulate.click(container.querySelector('.MuiChip-deleteIcon')),
  );
  expect(cardDraft().connectedTheme).toEqual([20]);
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(cardDraft().connectedTheme).toEqual([]);
});

test('closing search with Escape and reopening keeps the visible query and its results in sync', async () => {
  await render(<ConnectedThemeSelector />);
  const field = container.querySelector('[role=combobox]');
  await act(async () => field.focus());
  await act(async () => Simulate.change(field, { target: { value: 'волны' } }));
  await act(async () => Simulate.keyDown(field, { key: 'Escape' }));
  expect(document.querySelector('[role=listbox]')).toBeNull();
  await open();
  expect(field.value).toBe('волны');
  expect(
    [...document.querySelectorAll('[data-theme-id]')].map(
      node => node.dataset.themeId,
    ),
  ).toEqual(['10', '11', '12']);
});
