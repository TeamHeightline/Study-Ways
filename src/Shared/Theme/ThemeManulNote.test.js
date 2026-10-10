import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ThemeManulNote } from './ThemeManulNote';
import { ThemeStore } from './theme-store';
import { getManulContext, manulNotes } from './manul-content';

const act = React.act || legacyAct;

test('contextual notes appear only in the Manul theme, cycle quotes, and reset for another page', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  const store = new ThemeStore();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await act(async () =>
      root.render(<ThemeManulNote context="history" store={store} />),
    );
    expect(container.textContent).toBe('');
    await act(async () => store.setTheme('manul'));
    expect(container.querySelector('blockquote').textContent).toBe(
      'один манул, два манула, три манула, четыре манула и так до 100 манулов ',
    );
    expect(container.querySelector('img').getAttribute('aria-hidden')).toBe(
      'true',
    );
    const button = container.querySelector('button');
    for (const quote of [
      manulNotes.history.quotes[1],
      manulNotes.history.quotes[2],
      manulNotes.history.quotes[0],
    ]) {
      await act(async () => button.click());
      expect(container.querySelector('blockquote').textContent).toBe(quote);
    }
    await act(async () => button.click());
    await act(async () =>
      root.render(<ThemeManulNote context="library" store={store} />),
    );
    expect(container.querySelector('blockquote').textContent).toBe(
      manulNotes.library.quotes[0],
    );
    await act(async () => store.setTheme('high-contrast-dark'));
    expect(container.textContent).toBe('');
  } finally {
    await act(async () => root.unmount());
    container.remove();
    localStorage.clear();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});

test.each([
  ['/cards', 'library'],
  ['/card/327', 'library'],
  ['/recent-cards', 'history'],
  ['/bookmarks', 'bookmarks'],
  ['/all-questions', 'questions'],
  ['/iq/327', 'questions'],
  ['/selfstatistic', 'results'],
  ['/profile', 'profile'],
  ['/editor/course/24', 'editor'],
  ['/course', 'course'],
  ['/ai-course', 'course'],
  ['/courses', 'catalog'],
  ['/cards-unknown', 'catalog'],
  ['/constructor', 'catalog'],
])('sidebar context for %s is %s', (path, context) => {
  expect(getManulContext(path)).toBe(context);
});
