import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { studyWaysApi } from '../../../shared/server-layer/query-layer/api';
import axiosClient from '../../../shared/server-layer/query-layer/config';
import { setTestUser } from '../../../shared/store/user-store/user-session.test-utils';
import EditCourseItem from './EditCourseItem';

jest.mock('../../../shared/server-layer/query-layer/config', () => ({
  request: jest.fn(),
}));
jest.mock('../../cards/selector/ui/CardSelector', () => ({
  CardSelector: ({ onCardSelect }) =>
    require('react').createElement(
      'button',
      { onClick: () => onCardSelect(9654) },
      'Выбрать карточку 9654',
    ),
}));
const act = React.act || legacyAct;
let root, host, store, update;

function Harness({ initial }) {
  const [item, setItem] = useState(initial);
  return (
    <EditCourseItem
      item_data={item}
      item_position={0}
      level={1}
      updateItem={value => {
        update(value);
        setItem(value);
      }}
    />
  );
}
async function render(
  initial = { id: '812', type: 'card', extra: 'preserve' },
) {
  await act(async () =>
    setTestUser(store, { id: 7, user_access_level: 'ADMIN' }),
  );
  await act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <Harness initial={initial} />
        </MemoryRouter>
      </Provider>,
    ),
  );
}
const input = () => host.querySelector('input');
const dialog = () => document.querySelector('[role=dialog]');
async function change(node, value) {
  await act(async () => Simulate.change(node, { target: { value } }));
}
async function clickButton(text) {
  const button = [...document.querySelectorAll('button')].find(
    node => node.textContent === text,
  );
  expect(button).toBeDefined();
  await act(async () => Simulate.click(button));
}
async function openGroup() {
  await act(async () =>
    Simulate.click(host.querySelector('.sw-coedit-group-button')),
  );
}
async function openSearch() {
  await act(async () =>
    Simulate.click(
      host.querySelector(
        'button[aria-label="Найти карточку, уровень 1, позиция 1"]',
      ),
    ),
  );
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  update = jest.fn();
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: get => get().concat(studyWaysApi.middleware),
  });
  axiosClient.request.mockReset().mockImplementation(({ url }) =>
    Promise.resolve({
      data: {
        id: Number(url.split('/').pop()),
        title: 'Лекция по физике',
        created_by_id: 7,
        card_content_type: 2,
      },
    }),
  );
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

test('single ID is edited inline and commits on Enter or blur, preserving metadata', async () => {
  await render();
  await act(async () =>
    Simulate.click(host.querySelector('.sw-coedit-cell-open')),
  );
  expect(document.activeElement).toBe(input());
  expect(input().selectionStart).toBe(0);
  expect(dialog()).toBeNull();
  await change(input(), ' 9654 ');
  expect(update).not.toHaveBeenCalled();
  expect(axiosClient.request).toHaveBeenCalledTimes(1);
  await act(async () => Simulate.keyDown(input(), { key: 'Enter' }));
  expect(update).toHaveBeenLastCalledWith({
    id: '9654',
    type: 'card',
    extra: 'preserve',
  });
  expect(input().value).toBe('9654');
  await act(async () => Simulate.blur(input()));
  expect(update).toHaveBeenCalledTimes(1);
  await change(input(), '813');
  await act(async () => Simulate.blur(input()));
  expect(update).toHaveBeenLastCalledWith({
    id: '813',
    type: 'card',
    extra: 'preserve',
  });
  expect(dialog()).toBeNull();
});

test.each(['-2', '0', '12.5', 'text'])(
  'invalid ID %s does not change the course and Escape restores the saved value',
  async value => {
    await render();
    await change(input(), value);
    await act(async () => Simulate.blur(input()));
    await act(async () => Simulate.keyDown(input(), { key: 'Enter' }));
    expect(update).not.toHaveBeenCalled();
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(axiosClient.request).toHaveBeenCalledTimes(1);
    await act(async () => Simulate.keyDown(input(), { key: 'Escape' }));
    expect(input().value).toBe('812');
    expect(input().getAttribute('aria-invalid')).toBe('false');
  },
);

test('empty cells accept an ID directly and clearing it empties the same cell', async () => {
  await render({ id: null, extra: 'preserve' });
  expect(axiosClient.request).not.toHaveBeenCalled();
  expect(input()).not.toBeNull();
  await change(input(), '812');
  await act(async () => Simulate.blur(input()));
  expect(update).toHaveBeenLastCalledWith({
    id: '812',
    type: 'card',
    extra: 'preserve',
  });
  await change(input(), '');
  await act(async () => Simulate.keyDown(input(), { key: 'Enter' }));
  expect(update).toHaveBeenLastCalledWith({
    id: null,
    type: 'card',
    extra: 'preserve',
  });
  expect(
    host.querySelector('.sw-coedit-cell').classList.contains('is-empty'),
  ).toBe(true);
  expect(dialog()).toBeNull();
});

test('pasting comma-separated IDs opens only the group dialog and applies a normalized list', async () => {
  await render();
  await change(input(), '812, 813, 814');
  expect(dialog()).not.toBeNull();
  expect(dialog().textContent).toContain('Несколько карточек');
  expect(dialog().querySelector('input').value).toBe('812, 813, 814');
  expect(update).not.toHaveBeenCalled();
  await clickButton('Применить');
  expect(update).toHaveBeenLastCalledWith({
    id: '812,813,814',
    type: 'card',
    extra: 'preserve',
  });
  expect(host.querySelector('.sw-coedit-group-ids').textContent).toBe(
    '№ 812, 813, 814',
  );
  expect(
    host.querySelector('a[aria-label="Редактировать карточку 813"]').target,
  ).toBe('_blank');
});

test('cancelling a pasted list restores the inline ID and never changes the course', async () => {
  await render();
  await change(input(), '812,813');
  await clickButton('Отмена');
  await act(async () => jest.advanceTimersByTime(300));
  expect(dialog()).toBeNull();
  expect(input().value).toBe('812');
  expect(update).not.toHaveBeenCalled();
});

test('the group action is available for an empty cell and an existing group can become one card', async () => {
  await render({ id: null });
  await openGroup();
  await change(dialog().querySelector('input'), '812, 813');
  await clickButton('Применить');
  await act(async () => jest.advanceTimersByTime(300));
  await act(async () =>
    Simulate.click(host.querySelector('.sw-coedit-group-ids')),
  );
  await change(dialog().querySelector('input'), '814');
  await clickButton('Применить');
  expect(input().value).toBe('814');
  expect(update).toHaveBeenLastCalledWith({ id: '814', type: 'card' });
});

test('course-link editing is removed and choosing a card replaces legacy link data only on selection', async () => {
  await render({
    id: '812',
    type: 'course-link',
    course_link: '/course?id=24',
    extra: 'preserve',
  });
  expect(axiosClient.request).not.toHaveBeenCalled();
  expect(host.textContent).not.toContain('Переход на курс');
  expect(input().value).toBe('');
  expect(update).not.toHaveBeenCalled();
  await openSearch();
  await clickButton('Выбрать карточку 9654');
  expect(update).toHaveBeenLastCalledWith({
    id: '9654',
    type: 'card',
    extra: 'preserve',
  });
});

test('applying the original ID after pasting a comma restores a clean inline field', async () => {
  await render();
  await change(input(), '812,');
  await clickButton('Применить');
  await act(async () => jest.advanceTimersByTime(300));
  expect(dialog()).toBeNull();
  expect(input().value).toBe('812');
  expect(input().getAttribute('aria-invalid')).toBe('false');
});

test.each(['812', '812,813'])(
  'clear cross beside the number empties %s without a dialog',
  async id => {
    await render({ id, type: 'card', extra: 'preserve' });
    const cross = host.querySelector(
      '.sw-coedit-cell-footer button[aria-label="Очистить позицию 1, уровень 1"]',
    );
    expect(cross.disabled).toBe(false);
    await act(async () => Simulate.click(cross));
    expect(update).toHaveBeenLastCalledWith({
      id: null,
      type: 'card',
      extra: 'preserve',
    });
    expect(input().value).toBe('');
    expect(dialog()).toBeNull();
    expect(host.querySelector('.sw-coedit-clear-button').disabled).toBe(true);
    expect(host.querySelector('.sw-card-edit-link')).toBeNull();
  },
);

test('clear also discards invalid unsaved input', async () => {
  await render();
  await change(input(), 'invalid');
  await act(async () =>
    Simulate.click(host.querySelector('.sw-coedit-clear-button')),
  );
  expect(input().value).toBe('');
  expect(input().getAttribute('aria-invalid')).toBe('false');
  expect(update).toHaveBeenCalledTimes(1);
  expect(update).toHaveBeenLastCalledWith({
    id: null,
    type: 'card',
    extra: 'preserve',
  });
});

test.each([null, '812'])(
  'search button fills or replaces a single card %s immediately',
  async id => {
    await render({ id, type: 'card', extra: 'preserve' });
    await openSearch();
    expect(dialog().textContent).toContain('Выбор карточки');
    expect(dialog().textContent).not.toContain('Применить');
    await clickButton('Выбрать карточку 9654');
    expect(dialog().textContent).toContain('Выбор карточки');
    await act(async () => jest.advanceTimersByTime(300));
    expect(dialog()).toBeNull();
    expect(input().value).toBe('9654');
    expect(update).toHaveBeenLastCalledWith({
      id: '9654',
      type: 'card',
      extra: 'preserve',
    });
    expect(
      host.querySelector('a[aria-label="Редактировать карточку 9654"]').target,
    ).toBe('_blank');
  },
);

test('search appends to a group draft, preserves existing IDs and avoids duplicates until confirmed', async () => {
  await render({ id: '812,813', type: 'card', extra: 'preserve' });
  await openSearch();
  await clickButton('Выбрать карточку 9654');
  expect(dialog().querySelector('input').value).toBe('812,813,9654');
  expect(update).not.toHaveBeenCalled();
  await clickButton('Выбрать через поиск');
  await clickButton('Выбрать карточку 9654');
  expect(dialog().querySelector('input').value).toBe('812,813,9654');
  expect(dialog().textContent).not.toContain('Очистить позицию');
  await clickButton('Применить');
  expect(update).toHaveBeenLastCalledWith({
    id: '812,813,9654',
    type: 'card',
    extra: 'preserve',
  });
});

test('closing the card search leaves the current cell unchanged', async () => {
  await render();
  await openSearch();
  await act(async () =>
    Simulate.click(
      dialog().querySelector('button[aria-label="Закрыть выбор материала"]'),
    ),
  );
  await act(async () => jest.advanceTimersByTime(300));
  expect(dialog()).toBeNull();
  expect(input().value).toBe('812');
  expect(update).not.toHaveBeenCalled();
});
