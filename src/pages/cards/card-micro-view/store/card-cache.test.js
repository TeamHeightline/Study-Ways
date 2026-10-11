import React from 'react';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { RootReducer } from '../../../../app/redux-store/RootReducer';
import { studyWaysApi } from '../../../../shared/server-layer/query-layer/api';
import axiosClient, {
  setAccessToken,
} from '../../../../shared/server-layer/query-layer/config';
import { setTestUser } from '../../../../shared/store/user-store/user-session.test-utils';
import { clearUserSession } from '../../../../shared/store/user-store/session-lifecycle';
import { CardSelector } from '../../selector/ui/CardSelector';
import { EditCardByID } from '../../editor/editor-by-id-v2/ui/EditCardByID';
import { editableDefaults } from '../../editor/editor-by-id-v2/model/types';
jest.mock('../../../../app/redux-store/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
  useAppSelector: require('react-redux').useSelector,
}));
jest.mock('../../editor/editor-by-id-v2/ui/ui-rich-text-editor', () => ({
  UiRichTextEditor: () => null,
}));
jest.mock('../../../../shared/authors/AuthorFilter', () => ({
  AuthorFilter: () => null,
}));
jest.mock('../../selector/ui/CleverSearching', () => ({
  CleverSearching: () => null,
}));
jest.mock('../../selector/ui/HardLevel', () => ({ HardLevel: () => null }));
jest.mock('../../selector/ui/ContentType', () => ({ ContentType: () => null }));
jest.mock('../../selector/ui/ConnectedThemes', () => ({
  ConnectedThemes: () => null,
}));
const act = React.act || legacyAct;
let root, container, store, request, cards;
const count = url =>
  request.mock.calls.filter(([args]) => args.url === url).length;
const button = text =>
  [...container.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
function Selection() {
  const navigate = useNavigate();
  return (
    <CardSelector
      mode="onlyCreatedByMe"
      onCardSelect={id => navigate(`/edit/${id}`)}
    />
  );
}
function Editor() {
  return <EditCardByID id={useParams().id} />;
}
beforeEach(async () => {
  jest.useFakeTimers();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  cards = Object.fromEntries(
    [812, 813].map(id => [
      id,
      {
        ...editableDefaults,
        id,
        created_by_id: 7,
        title: `Карточка ${id}`,
        card_content_type: 2,
        cards_card_connected_theme: [],
        cards_cardimage: { image: `cards/${id}.png` },
        users_customuser: {
          users_userprofile: { firstname: 'Анна', lastname: 'Иванова' },
        },
      },
    ]),
  );
  setAccessToken('test-token');
  request = jest
    .spyOn(axiosClient, 'request')
    .mockImplementation(async ({ url, method, data }) => {
      if (url === '/page/card-selector/my')
        return { data: { IDs: ['812', '813'], activePage: 1, numPages: 1 } };
      if (url === '/page/card-micro-view/all') return { data: { ...cards } };
      if (url === '/page/connected-themes') return { data: [] };
      if (url.startsWith('/page/edit-card-by-id/card-by-id/'))
        return { data: cards[url.split('/').at(-1)] };
      if (url.startsWith('/page/write/cards/') && method === 'PUT') {
        const id = url.split('/').at(-1);
        cards[id] = { ...cards[id], ...data };
        return { data: { id: Number(id) } };
      }
      throw new Error(`Unexpected request: ${url}`);
    });
  store = configureStore({
    reducer: RootReducer,
    middleware: get =>
      get({ serializableCheck: false }).concat(studyWaysApi.middleware),
  });
  await setTestUser(store, { id: 7, user_access_level: 'TEACHER' });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => {
    clearUserSession(store.dispatch);
    root.unmount();
  });
  container.remove();
  jest.restoreAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
test('returning from the editor shows the saved version in the real card selection page', async () => {
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/select']}>
          <Routes>
            <Route path="/select" element={<Selection />} />
            <Route path="/edit/:id" element={<Editor />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    ),
  );
  expect(
    [...container.querySelectorAll('.sw-mini-title')].map(
      node => node.textContent,
    ),
  ).toEqual(['Карточка 812', 'Карточка 813']);
  expect(count('/page/card-micro-view/all')).toBe(1);
  await act(async () =>
    container.querySelector('.sw-mini-card-action').click(),
  );
  expect(container.querySelector('h1').textContent).toBe('Карточка №812');
  await act(async () => {
    const label = [...container.querySelectorAll('label')].find(
      node => node.textContent === 'Название карточки',
    );
    Simulate.change(document.getElementById(label.htmlFor), {
      target: { value: 'Обновлённая оптика' },
    });
    jest.advanceTimersByTime(2000);
  });
  // The debounce starts after React commits the changed draft.
  await act(async () => jest.advanceTimersByTime(2000));
  expect(container.textContent).toContain('Все изменения сохранены');
  await act(async () => button('Назад').click());
  expect(
    [...container.querySelectorAll('.sw-mini-title')].map(
      node => node.textContent,
    ),
  ).toEqual(['Обновлённая оптика', 'Карточка 813']);
  expect(count('/page/card-micro-view/all')).toBe(2);
  expect(count('/page/card-selector/my')).toBe(2);
});
