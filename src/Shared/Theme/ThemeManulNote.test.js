import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { ThemeManulNote } from './ThemeManulNote';
import { ThemeStore } from './theme-store';
import {
  getManulContext,
  manulNotes,
  pickManulThoughts,
} from './manul-content';

const act = React.act || legacyAct;

test('random triplets have matching art, exclude the previous visit, and retain the requested counting quote', () => {
  const pool = Object.values(manulNotes).flatMap(note =>
    note.quotes.map((quote, index) => ({
      quote,
      variant: note.variants[index],
    })),
  );
  expect(pool.map(thought => thought.quote)).toContain(
    'один манул, два манула, три манула, четыре манула и так до 100 манулов ',
  );
  const first = pickManulThoughts('library');
  const next = pickManulThoughts('library', first);
  for (const batch of [first, next]) {
    expect(batch).toHaveLength(3);
    expect(new Set(batch.map(thought => thought.quote)).size).toBe(3);
    for (const thought of batch) expect(pool).toContainEqual(thought);
  }
  expect(
    next.every(thought => !first.some(old => old.quote === thought.quote)),
  ).toBe(true);
  expect(
    [...first, ...next].every(
      thought => !manulNotes.completion.quotes.includes(thought.quote),
    ),
  ).toBe(true);
});

test('a note cycles three stable thoughts, resets on context change, refreshes on a later visit and follows the theme', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  const random = jest.spyOn(Math, 'random').mockReturnValue(0.25);
  const store = new ThemeStore();
  const container = document.createElement('div');
  document.body.appendChild(container);
  let root = createRoot(container);
  const readBatch = async () => {
    const quotes = [];
    for (let index = 0; index < 3; index++) {
      quotes.push(container.querySelector('blockquote').textContent);
      await act(async () => container.querySelector('button').click());
    }
    expect(new Set(quotes).size).toBe(3);
    expect(container.querySelector('blockquote').textContent).toBe(quotes[0]);
    return quotes;
  };
  try {
    await act(async () =>
      root.render(<ThemeManulNote context="history" store={store} />),
    );
    expect(container.textContent).toBe('');
    await act(async () => store.setTheme('manul'));
    expect(container.textContent).toContain('Мысль 1 из 3');
    expect(container.querySelector('img').getAttribute('aria-hidden')).toBe(
      'true',
    );
    const firstVisit = await readBatch();
    await act(async () => store.setTheme('forest'));
    expect(container.textContent).toBe('');
    await act(async () => store.setTheme('manul'));
    expect(container.querySelector('blockquote').textContent).toBe(
      firstVisit[0],
    );
    await act(async () => container.querySelector('button').click());
    await act(async () =>
      root.render(<ThemeManulNote context="library" store={store} />),
    );
    expect(container.textContent).toContain('Мысль 1 из 3');
    await act(async () => root.unmount());
    root = createRoot(container);
    await act(async () =>
      root.render(<ThemeManulNote context="history" store={store} />),
    );
    const nextVisit = await readBatch();
    expect(nextVisit.every(quote => !firstVisit.includes(quote))).toBe(true);
    await act(async () => store.setTheme('high-contrast-dark'));
    expect(container.textContent).toBe('');
  } finally {
    await act(async () => root.unmount());
    container.remove();
    localStorage.clear();
    random.mockRestore();
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
