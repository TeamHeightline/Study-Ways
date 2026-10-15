import React from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import axiosClient from '../../../shared/server-layer/query-layer/config';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import { CardEditLink } from './card-edit-link';
import { CardHoverPreview } from './card-hover-preview';
import { CardMicroViewByData } from '../card-micro-view';
import CardTitleWithId from '../card-by-id/ui/card-title-with-id';
import EditCourseItem from '../../course/edit-course-by-id/EditCourseItem';
import { cardImageUrl } from './card-image-url';

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../selector/ui/CardSelector', () => ({ CardSelector: () => null }));
const act = React.act || legacyAct;
const card = {
  id: 812,
  created_by_id: 7,
  title: 'Полное название материала по оптике',
  text: '<p>Первая строка описания.</p><p>Последняя строка без обрезки.</p>',
  additional_text: '<p>Дополнительные пояснения.</p>',
  card_content_type: 2,
  hard_level: 2,
  copyright: 'Иванов',
  test_before_card_id: 42,
  test_in_card_id: 43,
  is_card_use_test_before_card: true,
  is_card_use_test_in_card: true,
  cards_cardimage: null,
  users_customuser: {
    users_userprofile: { firstname: 'Анна', lastname: 'Иванова' },
  },
  cards_card_connected_theme: [{ cards_unstructuredtheme: { text: 'Оптика' } }],
};
let root, host, store;
async function render(content, role = 'ADMIN', userId = 7) {
  await act(async () =>
    setTestUser(store, { id: userId, user_access_level: role }),
  );
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>{content}</MemoryRouter>
      </Provider>,
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: get => get().concat(studyWaysApi.middleware),
  });
  axiosClient.request.mockReset().mockResolvedValue({ data: card });
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
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  ['ADMIN', 9, true],
  ['TEACHER', 7, true],
  ['CARD_EDITOR', 7, true],
  ['TEACHER', 9, false],
  ['CARD_EDITOR', 9, false],
  ['STUDENT', 7, false],
])(
  'edit access follows server ownership for %s user %s',
  async (role, userId, allowed) => {
    await render(<CardEditLink id={812} ownerId={7} />, role, userId);
    const link = host.querySelector('a');
    expect(!!link).toBe(allowed);
    if (allowed) {
      expect(link.getAttribute('href')).toBe('/editor/card2/card/812');
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    }
  },
);

test('card identity and edit action are present outside optional navigation', async () => {
  await render(<CardTitleWithId card_store={{ card_data: card }} />);
  expect(host.querySelector('.sw-material-number').textContent).toBe('№812');
  expect(host.querySelector('h1').textContent).toBe(card.title);
  expect(
    host.querySelector('a[aria-label="Редактировать карточку 812"]'),
  ).not.toBeNull();
});

test('mini-card pencil opens an independent tab without selecting the card', async () => {
  const select = jest.fn();
  await render(
    <div onClick={select}>
      <CardMicroViewByData cardID={812} cardData={card} />
    </div>,
  );
  const link = host.querySelector('a[aria-label="Редактировать карточку 812"]');
  await act(async () => Simulate.click(link));
  expect(select).not.toHaveBeenCalled();
  expect(link.target).toBe('_blank');
  expect(host.querySelector('.sw-mini-number').textContent).toBe('№812');
  expect(host.querySelector('button a')).toBeNull();
});

test('course editor pencil is a new-tab link and does not open the position dialog', async () => {
  await render(
    <EditCourseItem
      item_data={{ id: '812', type: 'card' }}
      item_position={0}
      level={1}
      updateItem={jest.fn()}
    />,
  );
  const link = host.querySelector('a[aria-label="Редактировать карточку 812"]');
  expect(link.getAttribute('href')).toBe('/editor/card2/card/812');
  expect(link.target).toBe('_blank');
  await act(async () => Simulate.click(link));
  expect(document.querySelector('[role=dialog]')).toBeNull();
});

test('course hover loads full details lazily, keeps all text, and reuses RTK cache', async () => {
  await render(
    <CardHoverPreview ids={['812', '812']}>
      <button>Материал</button>
    </CardHoverPreview>,
  );
  expect(axiosClient.request).not.toHaveBeenCalled();
  const trigger = host.querySelector('button');
  await act(async () => Simulate.mouseOver(trigger));
  await act(async () => jest.advanceTimersByTime(400));
  const popup = document.querySelector('[role=tooltip]');
  expect(popup).not.toBeNull();
  expect(popup.textContent).toContain('Последняя строка без обрезки.');
  expect(popup.textContent).toContain('Дополнительные пояснения.');
  expect(popup.textContent).toContain('Анна Иванова');
  expect(popup.textContent).toContain('Вопрос после ресурса: №43');
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  expect(axiosClient.request.mock.calls[0][0].url).toBe(
    '/page/card-by-id/card-data-by-id/812',
  );
  await act(async () => Simulate.mouseLeave(trigger));
  await act(async () => jest.advanceTimersByTime(500));
  await act(async () => Simulate.mouseOver(trigger));
  await act(async () => jest.advanceTimersByTime(400));
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
});

test('legacy, relative and absolute card images resolve without corrupting URLs', () => {
  expect(cardImageUrl(812)).toContain('/cards-images/card/812');
  expect(cardImageUrl(812, '/edited-images/photo.png')).toMatch(
    /\/edited-images\/photo\.png$/,
  );
  expect(cardImageUrl(812, 'https://example.com/photo.png?key=x#preview')).toBe(
    'https://example.com/photo.png?key=x#preview',
  );
  expect(
    cardImageUrl(812, 'https://example.com/photo.png?key=x#preview', 2),
  ).toBe('https://example.com/photo.png?key=x&v=2#preview');
});
