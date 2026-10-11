import '../../app/redux-store/RootStore';
import {
  getThemeSettings,
  themeActions,
  THEME_STORAGE_KEY,
  restoreTheme,
  installThemePersistence,
} from './theme-store';
import { createThemeTestStore, readTheme } from './theme-test-utils';
import { RootReducer } from '../../app/redux-store/RootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { resetSession } from '../store/user-store/session-lifecycle';
import { defaultTheme, themeVariables } from './theme-tokens';
let themeMeta;
beforeEach(() => {
  localStorage.clear();
  themeMeta = document.createElement('meta');
  themeMeta.name = 'theme-color';
  document.head.appendChild(themeMeta);
});
afterEach(() => {
  themeMeta.remove();
  localStorage.clear();
  jest.restoreAllMocks();
});
test('dispatching a theme change updates document, MUI, persistence and Redux subscribers together', () => {
  const store = createThemeTestStore();
  const observed = [];
  const unsubscribe = store.subscribe(() =>
    observed.push(readTheme(store).palette.accent),
  );
  store.dispatch(themeActions.themeChanged('forest'));
  const view = readTheme(store);
  expect(document.documentElement.dataset.theme).toBe('forest');
  expect(document.documentElement.style.colorScheme).toBe('dark');
  expect(themeMeta.content).toBe(view.palette.canvas);
  expect(view.theme.palette.background.default).toBe(view.palette.canvas);
  expect(observed).toEqual([view.palette.accent]);
  expect(restoreTheme()).toBe('forest');
  unsubscribe();
  const custom = getThemeSettings('custom', {
    custom: {
      ...defaultTheme,
      fontFamily: 'Arial, sans-serif',
      radiusScale: 1.5,
      colors: { accent: '#a78bfa' },
    },
  });
  expect(custom.theme.shape.borderRadius).toBe(18);
  expect(custom.theme.typography.fontFamily).toBe('Arial, sans-serif');
  expect(
    themeVariables({ ...defaultTheme, colors: { accent: '#a78bfa' } })[
      '--sw-accent-rgb'
    ],
  ).toBe('167 139 250');
});
test('defaults to the striped theme, restores saved choices and rejects unknown keys', () => {
  expect(restoreTheme()).toBe('manul');
  const initial = createThemeTestStore();
  expect(readTheme(initial).definition.label).toBe('Полосатая');
  expect(document.documentElement.dataset.illustrations).toBe('manul');
  localStorage.setItem(THEME_STORAGE_KEY, 'sage');
  expect(restoreTheme()).toBe('sage');
  localStorage.setItem(THEME_STORAGE_KEY, 'forest');
  expect(restoreTheme()).toBe('forest');
  localStorage.setItem(THEME_STORAGE_KEY, 'removed');
  const store = createThemeTestStore();
  store.dispatch(themeActions.themeChanged('unknown'));
  store.dispatch(themeActions.themeChanged('__proto__'));
  expect(store.getState().theme.id).toBe('manul');
});
test('theme changes work without browser storage', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw Error('disabled');
  });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('disabled');
  });
  const store = createThemeTestStore();
  store.dispatch(themeActions.themeChanged('forest'));
  expect(readTheme(store).isLightTheme).toBe(false);
  expect(document.documentElement.dataset.theme).toBe('forest');
});
test('changing accounts clears UI state while preserving the selected theme', () => {
  const store = configureStore({
    reducer: RootReducer,
    middleware: get => get({ serializableCheck: false }),
  });
  installThemePersistence(store);
  store.dispatch(themeActions.themeChanged('manul'));
  store.dispatch({
    type: 'cardSelector/filtersChanged',
    payload: { searching_string: 'private' },
  });
  store.dispatch(resetSession());
  expect(store.getState().theme.id).toBe('manul');
  expect(store.getState().cardSelector.searching_string).toBe('');
});
// Relative luminance and contrast per WCAG; these pairs occur throughout the UI.
const luminance = hex =>
  hex
    .slice(1)
    .match(/../g)
    .map(value => parseInt(value, 16) / 255)
    .map(value =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
    .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) /
  (Math.min(luminance(a), luminance(b)) + 0.05);

test.each(['forest', 'graphite', 'midnight'])(
  '%s has a complete dark palette and readable text, labels and buttons',
  id => {
    const { colors, themes } = require('./theme-tokens');
    const definitions = require('./themes.json');
    expect(Object.keys(definitions[id].colors).sort()).toEqual(
      Object.keys(colors).sort(),
    );
    const store = createThemeTestStore();
    store.dispatch(themeActions.themeChanged(id));
    const palette = readTheme(store).palette;
    expect(readTheme(store).mode).toBe('dark');
    expect(document.documentElement.dataset.colorScheme).toBe('dark');
    for (const background of ['canvas', 'surface', 'surface-subtle']) {
      for (const foreground of ['ink', 'secondary', 'muted', 'accent']) {
        expect(
          contrast(palette[foreground], palette[background]),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
    for (const background of ['accent', 'accent-hover', 'accent-700']) {
      expect(
        contrast(palette['on-accent'], palette[background]),
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const foreground of [
      'sidebar-text',
      'sidebar-muted',
      'sidebar-heading',
    ]) {
      expect(
        contrast(palette[foreground], palette.sidebar),
      ).toBeGreaterThanOrEqual(4.5);
    }
    expect(
      contrast(palette['tooltip-ink'], palette.tooltip),
    ).toBeGreaterThanOrEqual(4.5);
    expect(readTheme(store).theme.palette.primary.main).toBe(
      themes[id].colors.accent,
    );
    expect(readTheme(store).availableThemes.map(theme => theme.id)).toEqual([
      'sage',
      'forest',
      'graphite',
      'midnight',
      'high-contrast',
      'high-contrast-dark',
      'manul',
    ]);
  },
);

test.each(['high-contrast', 'high-contrast-dark'])(
  '%s uses enlarged type and strongly contrasting text across shared surfaces',
  id => {
    const { colors, themes, themeVariables } = require('./theme-tokens');
    const store = createThemeTestStore();
    store.dispatch(themeActions.themeChanged(id));
    const palette = readTheme(store).palette;
    expect(document.documentElement.dataset.accessibility).toBe('enhanced');
    expect(readTheme(store).theme.typography.fontSize).toBeCloseTo(18.2);
    expect(Object.keys(themes[id].colors).sort()).toEqual(
      Object.keys(colors).sort(),
    );
    for (const background of ['canvas', 'surface', 'surface-subtle']) {
      for (const foreground of [
        'ink',
        'secondary',
        'muted',
        'accent',
        'neutral-500',
      ]) {
        expect(
          contrast(palette[foreground], palette[background]),
        ).toBeGreaterThanOrEqual(7);
      }
    }
    expect(
      contrast(palette['on-accent'], palette.accent),
    ).toBeGreaterThanOrEqual(7);
    expect(
      contrast(palette['sidebar-accent'], palette['sidebar-active']),
    ).toBeGreaterThanOrEqual(7);
    expect(themeVariables(themes[id])['--sw-font-size-10']).toContain(
      'max(14px',
    );
    store.dispatch(themeActions.themeChanged('sage'));
    expect(document.documentElement.dataset.accessibility).toBe('standard');
    expect(readTheme(store).theme.typography.fontSize).toBe(14);
  },
);

test('the illustrated theme keeps text and actions readable on warm surfaces and persists its artwork pack', () => {
  const { colors, themes } = require('./theme-tokens');
  const store = createThemeTestStore();
  store.dispatch(themeActions.themeChanged('manul'));
  const palette = readTheme(store).palette;
  expect(Object.keys(themes.manul.colors).sort()).toEqual(
    Object.keys(colors).sort(),
  );
  for (const background of ['canvas', 'surface', 'surface-subtle']) {
    for (const foreground of ['ink', 'secondary', 'muted', 'accent']) {
      expect(
        contrast(palette[foreground], palette[background]),
      ).toBeGreaterThanOrEqual(4.5);
    }
  }
  expect(contrast(palette['on-accent'], palette.accent)).toBeGreaterThanOrEqual(
    4.5,
  );
  expect(
    contrast(palette['sidebar-text'], palette.sidebar),
  ).toBeGreaterThanOrEqual(4.5);
  expect(readTheme(createThemeTestStore()).definition.illustrations).toBe(
    'manul',
  );
  store.dispatch(themeActions.themeChanged('sage'));
  expect(document.documentElement.dataset.illustrations).toBe('none');
});
