import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useQuery } from '@apollo/client';
import {
  connectedThemesApi,
  useGetConnectedThemesQuery,
} from '../../../Shared/ConnectedThemes/api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import ThemeEditor from './ThemeEditor';

const mockMutations = new Map();
const mockOptions = new Map();
jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
}));
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(() => {
    throw new Error('Theme reads must use REST');
  }),
  useMutation: (document, options) => {
    const name = document.definitions[0].name.value;
    mockOptions.set(name, options);
    return [mockMutations.get(name), { loading: false }];
  },
}));
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
  axiosClient.request.mockReset().mockResolvedValue({ data: themes });
  mockOptions.clear();
  mockMutations.clear();
  for (const name of [
    'UpdateTheme',
    'CreateTheme',
    'SAVE_NEW_THEMES_SEQUENCE',
  ]) {
    mockMutations.set(
      name,
      jest.fn(async () => {
        const options = mockOptions.get(name);
        const data =
          name === 'UpdateTheme'
            ? { updateUnstructuredTheme: { theme: { id: '1' } } }
            : name === 'CreateTheme'
              ? { unstructuredTheme: { theme: { id: '3' } } }
              : {
                  usThemeSequence: {
                    uSThemeSequence: { sequence: options.variables.sequence },
                  },
                };
        options.onCompleted?.(data);
        return { data };
      }),
    );
  }
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
  expect(useQuery).not.toHaveBeenCalled();
  for (const mutation of mockMutations.values())
    expect(mutation).not.toHaveBeenCalled();
});

test('successful renaming refreshes shared selectors while preserving the editor draft', async () => {
  await render();
  await click('Выбрать тему');
  await click('Переименовать');
  await enterText('Новая физика');
  axiosClient.request.mockResolvedValue({
    data: [{ ...themes[0], text: 'Новая физика' }, themes[1]],
  });
  await click('Сохранить название темы');
  expect(mockMutations.get('UpdateTheme')).toHaveBeenCalledTimes(1);
  expect(mockOptions.get('UpdateTheme').variables).toMatchObject({
    id: '1',
    parent: 0,
    text: 'Новая физика',
  });
  expect(container.querySelector('[data-testid="shared"]').textContent).toBe(
    'Новая физика,Оптика',
  );
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Новая физика,Оптика',
  );
  expect(mockMutations.get('SAVE_NEW_THEMES_SEQUENCE')).not.toHaveBeenCalled();
});

test('refetches cannot overwrite an edited order while its save is pending', async () => {
  mockMutations
    .get('SAVE_NEW_THEMES_SEQUENCE')
    .mockImplementation(() => new Promise(() => {}));
  await render();
  await click('Переместить темы');
  expect(mockMutations.get('SAVE_NEW_THEMES_SEQUENCE')).toHaveBeenCalledTimes(
    1,
  );
  expect(mockOptions.get('SAVE_NEW_THEMES_SEQUENCE').variables.sequence).toBe(
    '2,1',
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
  expect(mockMutations.get('SAVE_NEW_THEMES_SEQUENCE')).toHaveBeenCalledTimes(
    1,
  );
});

test('creating a sibling root keeps the numeric tree root and refreshes the shared list', async () => {
  await render();
  await click('Выбрать тему');
  await click('Добавить тему рядом');
  await enterText('Механика');
  axiosClient.request.mockResolvedValue({
    data: [...themes, { id: 3, text: 'Механика', parentId: null }],
  });
  await click('Создать тему');
  expect(mockMutations.get('CreateTheme')).toHaveBeenCalledTimes(1);
  expect(mockOptions.get('CreateTheme').variables.parent).toBe(0);
  expect(container.querySelector('[data-testid="draft"]').textContent).toBe(
    'Физика,Оптика,Механика',
  );
  expect(container.querySelector('[data-testid="shared"]').textContent).toBe(
    'Физика,Оптика,Механика',
  );
  expect(mockMutations.get('SAVE_NEW_THEMES_SEQUENCE')).toHaveBeenCalledTimes(
    1,
  );
  expect(mockOptions.get('SAVE_NEW_THEMES_SEQUENCE').variables.sequence).toBe(
    '1,2,3',
  );
});
