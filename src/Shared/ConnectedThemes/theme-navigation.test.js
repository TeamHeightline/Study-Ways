import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { runInAction } from 'mobx';
import { studyWaysApi } from '../ServerLayer/QueryLayer/api';
import axiosClient from '../ServerLayer/QueryLayer/config';
import { ThemeBreadcrumbs } from './ThemeBreadcrumbs';
import {
  CardRouteBreadcrumbs,
  selectedCardThemes,
} from '../../Pages/Cards/CardByID/UI/card-route-breadcrumbs';
import { useGetCardQuery } from '../../Pages/Cards/CardByID/API/card-api';
import { MainCardPublicView } from '../../Pages/Cards/Page/MainCardPublicView';
import { CSSObject } from '../../Pages/Cards/Selector/Store/CardSelectorStore';
import { AISObject } from '../../Pages/Cards/Page/AISearch/Store/AISearch';

jest.mock('../ServerLayer/QueryLayer/config', () => ({ request: jest.fn() }));

jest.mock('../Store/UserStore/UserStore', () => ({
  UserStorage: { user_data: { id: 7 } },
}));
jest.mock('../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
}));
jest.mock('../../Pages/Cards/CardMicroView/store/async-actions', () => ({
  loadAllCardsData: () => ({ type: 'previews/load' }),
}));
jest.mock('../Authors/AuthorFilter', () => ({ AuthorFilter: () => null }));
jest.mock('../Theme/ThemeManulNote', () => ({ ThemeManulNote: () => null }));
jest.mock('../../Pages/Cards/Selector/UI/CleverSearching', () => ({
  CleverSearching: () => null,
}));
jest.mock('../../Pages/Cards/Selector/UI/HardLevel', () => ({
  HardLevel: () => null,
}));
jest.mock('../../Pages/Cards/Selector/UI/ContentType', () => ({
  ContentType: () => null,
}));
jest.mock('../../Pages/Cards/Selector/UI/MicroCardField', () => ({
  MicroCardField: ({ cardIds }) => <div data-cards>{cardIds.join(',')}</div>,
}));
jest.mock('../../Pages/Cards/Page/AISearch/Store/Query', () => ({
  getAutocompleteCardDataAsync: jest.fn(),
  selectRecommendedCardReport: jest.fn(),
}));
jest.mock('../../Pages/Cards/Page/AISearch/UI/AICardSelector', () => ({
  AICardSelector: props => {
    const Filter =
      require('../../Pages/Cards/Page/AISearch/UI/AIThemeFilter').default;
    return <Filter {...props} />;
  },
}));

const act = React.act || legacyAct;
const themes = [
  { id: 10, text: 'Физика', parentId: null },
  { id: 11, text: 'Оптика', parentId: 10 },
  { id: 12, text: 'Волны', parentId: 11 },
  { id: 13, text: 'Резонанс', parentId: 12 },
];
const card = {
  id: 2063,
  title: 'Элементы баллистики',
  cards_card_connected_theme: [
    { cards_unstructuredtheme: { id: 13, text: 'Резонанс', parent_id: 12 } },
  ],
};
let root, container, store;
function Location() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output>
        {location.pathname}
        {location.search}
      </output>
      <button onClick={() => navigate(-1)}>Назад</button>
    </>
  );
}
function CardHeading() {
  const { currentData } = useGetCardQuery(2063);
  return <ThemeBreadcrumbs selected={selectedCardThemes(currentData)} />;
}
const render = (content, url = '/card/2063') =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[url]}>{content}</MemoryRouter>
      </Provider>,
    ),
  );
const click = node => act(async () => node.click());
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
const themeTitle = text =>
  [...document.querySelectorAll('[data-theme-text]')].find(
    node => node.textContent === text,
  );
const searchCalls = () =>
  axiosClient.request.mock.calls
    .map(([args]) => args)
    .filter(args => args.url === '/page/card-selector');

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  runInAction(() => {
    CSSObject.searching_string = 'старый поиск';
    CSSObject.authorID = 9;
    CSSObject.hardLevel = 'A_3';
    CSSObject.activePage = 4;
    CSSObject.cardConnectedTheme = undefined;
    AISObject.setThemeFilter(undefined, []);
  });
  axiosClient.request.mockImplementation(async ({ url }) => {
    if (url === '/page/connected-themes') return { data: themes };
    if (url.includes('/card-data-by-id/')) return { data: card };
    if (url === '/page/card-selector')
      return { data: { IDs: ['2063'], activePage: 1, numPages: 1 } };
    throw new Error(`Unexpected request ${url}`);
  });
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
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
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  clearTimeout(AISObject.debounceTimer);
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('upper breadcrumbs and card heading show every ancestor and share both REST requests', async () => {
  await render(
    <>
      <CardRouteBreadcrumbs id={2063} />
      <CardHeading />
      <Location />
    </>,
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  const paths = container.querySelectorAll('[aria-label="Иерархия темы"]');
  expect(paths).toHaveLength(2);
  for (const path of paths)
    expect(
      [...path.querySelectorAll('a')].map(link => link.textContent),
    ).toEqual(['Физика', 'Оптика', 'Волны', 'Резонанс']);
  expect(container.querySelector('[aria-label="Show path"]')).toBeNull();
  for (const [index, link] of [...paths[0].querySelectorAll('a')].entries())
    expect(link.getAttribute('href')).toBe(
      `/cards?searchType=DSearch&theme=${10 + index}`,
    );
  await click(paths[0].querySelectorAll('a')[1]);
  expect(container.querySelector('output').textContent).toBe(
    '/cards?searchType=DSearch&theme=11',
  );
});

test('a breadcrumb opens filtered REST search with the selected theme and clears previous filters', async () => {
  await render(
    <>
      <Routes>
        <Route path="/card/:id" element={<CardRouteBreadcrumbs id={2063} />} />
        <Route path="/cards" element={<MainCardPublicView />} />
      </Routes>
      <Location />
    </>,
  );
  await click(
    [...container.querySelectorAll('a')].find(
      link => link.textContent === 'Оптика',
    ),
  );
  expect(container.querySelector('[role=combobox]').value).toBe('Оптика');
  expect(searchCalls()).toHaveLength(1);
  expect(searchCalls()[0].params).toMatchObject({
    page: 1,
    themeId: 11,
    search: '',
    authorId: undefined,
    hardLevel: undefined,
  });
  expect(container.querySelector('[data-cards]').textContent).toBe('2063');
  await click(container.querySelector('[aria-label="Сбросить тему"]'));
  expect(container.querySelector('output').textContent).toBe(
    '/cards?searchType=DSearch',
  );
  expect(searchCalls().at(-1).params.themeId).toBeUndefined();
  await click(button('Назад'));
  expect(container.querySelector('[role=combobox]').value).toBe('Оптика');
});

test('switching search modes and changing the AI selection preserves all descendants in the URL-selected filter', async () => {
  await render(
    <>
      <MainCardPublicView />
      <Location />
    </>,
    '/cards?searchType=DSearch&theme=11',
  );
  await click(button('AI поиск'));
  expect(container.querySelector('output').textContent).toBe(
    '/cards?searchType=AISearch&theme=11',
  );
  expect(AISObject.themeWithPatentIDArray).toEqual(['11', '12', '13']);
  await click(container.querySelector('[aria-label="Открыть темы"]'));
  await click(themeTitle('Физика'));
  expect(container.querySelector('output').textContent).toBe(
    '/cards?searchType=AISearch&theme=10',
  );
  expect(AISObject.themeWithPatentIDArray).toEqual(['10', '11', '12', '13']);
  await click(button('Обычный поиск'));
  expect(container.querySelector('[role=combobox]').value).toBe('Физика');
  expect(searchCalls().at(-1).params.themeId).toBe(10);
  expect(
    axiosClient.request.mock.calls.filter(
      ([args]) => args.url === '/page/connected-themes',
    ),
  ).toHaveLength(1);
});
