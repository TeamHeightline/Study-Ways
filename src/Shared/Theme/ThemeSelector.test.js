import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { observer } from 'mobx-react';
import { ThemeSelector } from './ThemeSelector';
import { ThemeStore, THEME_STORAGE_KEY } from './theme-store';

const act = React.act || legacyAct;
let container, root, store;
const menu = () => document.querySelector('[role="menu"]');
const choice = label =>
  [...document.querySelectorAll('[role="menuitemradio"]')].find(
    node =>
      node.querySelector('.sw-theme-name')?.firstChild?.textContent === label,
  );
const finishTransition = () =>
  act(async () => new Promise(resolve => setTimeout(resolve, 250)));

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  store = new ThemeStore();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  const App = observer(() => (
    <ThemeProvider theme={store.theme}>
      <ThemeSelector store={store} />
    </ThemeProvider>
  ));
  act(() => root.render(<App />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('every theme can be selected and restored', async () => {
  for (const [id, label] of [
    ['forest', 'Тёмный лес'],
    ['graphite', 'Графит'],
    ['midnight', 'Полночь'],
    ['high-contrast', 'Высокий контраст'],
    ['high-contrast-dark', 'Высокий контраст · тёмный'],
    ['manul', 'Манулья'],
    ['sage', 'Шалфей'],
  ]) {
    await act(async () => container.querySelector('button').click());
    expect(menu().getAttribute('aria-label')).toBe('Оформление');
    expect(menu().querySelectorAll('[role="menuitemradio"]').length).toBe(7);
    expect(menu().querySelector('[aria-checked="true"]').textContent).toContain(
      store.definition.label,
    );
    await act(async () => choice(label).click());
    await finishTransition();
    expect(store.id).toBe(id);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(id);
    expect(new ThemeStore().id).toBe(id);
    expect(
      container.querySelector('button').getAttribute('aria-expanded'),
    ).toBe('false');
  }
});

test('menu supports keyboard navigation, selection, Escape and focus restoration', async () => {
  const trigger = container.querySelector('button');
  trigger.focus();
  await act(async () => trigger.click());
  expect(document.activeElement).toBe(choice('Шалфей'));
  await act(async () =>
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    ),
  );
  expect(document.activeElement).toBe(choice('Тёмный лес'));
  await act(async () =>
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    ),
  );
  await finishTransition();
  expect(store.id).toBe('forest');
  expect(document.activeElement).toBe(trigger);
  await act(async () => trigger.click());
  await act(async () =>
    menu().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    ),
  );
  await finishTransition();
  expect(store.id).toBe('forest');
  expect(document.activeElement).toBe(trigger);
});
