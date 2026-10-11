import questionEditor from '../../pages/question/editor/question-editor/store/QuestionEditorStorage';
import aiSearch from '../../pages/cards/page/ai-search/store/AISearch';
import cardSelector from '../../pages/cards/selector/store/CardSelectorStore';
import themeReducer from '../theme/theme-store';
import React from 'react';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { connectedThemesApi } from './api';
import axiosClient from '../server-layer/query-layer/config';
import { ConnectedThemes } from '../../pages/cards/selector/ui/ConnectedThemes';
import { UiConnectedThemeSelector as CardThemeSelector } from '../../pages/cards/editor/editor-by-id-v2/ui/ui-connected-theme-selector';
import QuestionThemeSelector from '../../pages/question/editor/question-editor/ui/ui-connected-theme-selector';
import AIThemeFilter from '../../pages/cards/page/ai-search/ui/AIThemeFilter';
import cardEditorReducer, {
  initializeDraft,
  changeCardField,
} from '../../pages/cards/editor/editor-by-id-v2/model/card-editor-slice';
import { editableDefaults } from '../../pages/cards/editor/editor-by-id-v2/model/types';
import { CardEditorProvider } from '../../pages/cards/editor/editor-by-id-v2/model/use-card-editor';
import { questionEditorActions } from '../../pages/question/editor/question-editor/store/QuestionEditorStorage';
import { QuestionEditorContext } from '../../pages/question/editor/question-editor/store/use-question-editor';
import {
  aiSearchActions,
  getAIQueryFilter,
} from '../../pages/cards/page/ai-search/store/AISearch';
jest.mock('../server-layer/query-layer/config', () => ({ request: jest.fn() }));
function ConnectedThemeSelector() {
  const entry = useSelector(s => s.questionEditor.entries.test);
  const dispatch = useDispatch();
  return (
    <QuestionEditorContext.Provider
      value={{
        selectedConnectedTheme: entry.draft.connectedThemeId,
        changeFields: patch =>
          dispatch(questionEditorActions.changed({ key: 'test', patch })),
      }}
    >
      <QuestionThemeSelector />
    </QuestionEditorContext.Provider>
  );
}
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
  store = configureStore({
    reducer: {
      questionEditor,
      aiSearch,
      cardSelector,
      theme: themeReducer,
      [connectedThemesApi.reducerPath]: connectedThemesApi.reducer,
      cardEditor: cardEditorReducer,
    },
    middleware: getDefault =>
      getDefault().concat(connectedThemesApi.middleware),
  });
  store.dispatch(
    questionEditorActions.initialized({
      key: 'test',
      data: {
        id: '42',
        createdById: 7,
        text: '',
        numberOfShowingAnswers: 8,
        connectedTheme: null,
        image: null,
        answers: [],
      },
    }),
  );
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
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
test('all selectors share one lazy REST read and loading never changes saved selections', async () => {
  expect(axiosClient.request).not.toHaveBeenCalled();
  (() => {
    setCardThemes([12]);
    store.dispatch(
      questionEditorActions.changed({
        key: 'test',
        patch: { connectedThemeId: '11' },
      }),
    );
    store.dispatch(aiSearchActions.themeChanged({ id: 10, ids: ['10'] }));
  })();
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
  expect(
    store.getState().questionEditor.entries.test.draft.connectedThemeId,
  ).toBe('11');
  expect(store.getState().aiSearch.themeWithPatentIDArray).toEqual([
    '10',
    '11',
    '12',
  ]);
  expect(getAIQueryFilter(store.getState().aiSearch)).toContain(
    '{"10", "11", "12"}',
  );
});
test('ordinary search can select a nested theme and clear it', async () => {
  await render(<ConnectedThemes />);
  await open();
  await expand('Физика');
  await expand('Оптика');
  await click(title('Волны'));
  expect(store.getState().cardSelector.cardConnectedTheme).toBe(12);
  expect(container.querySelector('[role=combobox]').value).toBe('Волны');
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(store.getState().cardSelector.cardConnectedTheme).toBeUndefined();
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
  expect(
    store.getState().questionEditor.entries.test.draft.connectedThemeId,
  ).toBe('11');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
});
test('AI selection and cache refresh include newly added descendants and clear the filter', async () => {
  await render(<AIThemeFilter />);
  await open();
  await click(title('Физика'));
  expect(store.getState().aiSearch.themeWithPatentIDArray).toEqual([
    '10',
    '11',
    '12',
  ]);
  axiosClient.request.mockResolvedValue({
    data: [...themes, { id: 13, text: 'Резонанс', parentId: 12 }],
  });
  await act(async () =>
    store.dispatch(connectedThemesApi.util.invalidateTags(['ConnectedThemes'])),
  );
  expect(store.getState().aiSearch.themeWithPatentIDArray).toEqual([
    '10',
    '11',
    '12',
    '13',
  ]);
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(store.getState().aiSearch.themeWithPatentIDArray).toEqual([]);
  expect(getAIQueryFilter(store.getState().aiSearch)).not.toContain(
    'connected_theme',
  );
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
  expect(
    store.getState().questionEditor.entries.test.draft.connectedThemeId,
  ).toBe('12');
  await open();
  expect(title('Волны')).toBeDefined();
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(
    store.getState().questionEditor.entries.test.draft.connectedThemeId,
  ).toBeUndefined();
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
  expect(
    store.getState().questionEditor.entries.test.draft.connectedThemeId,
  ).toBe('12');
});
test('removing one selected chip and clearing the rest preserves independent multi-selection', async () => {
  (() => {
    setCardThemes([12, 20]);
  })();
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
