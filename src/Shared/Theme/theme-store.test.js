import { autorun } from 'mobx';
import { ThemeStore, THEME_STORAGE_KEY } from './theme-store';
import { defaultTheme, themeVariables } from './theme-tokens';

const definitions = {
  sage: defaultTheme,
  night: {
    ...defaultTheme,
    label: 'Тестовая тема',
    mode: 'dark',
    colors: {
      canvas: '#111827',
      surface: '#1f2937',
      ink: '#f9fafb',
      accent: '#a78bfa',
    },
    fontFamily: 'Arial, sans-serif',
    radiusScale: 1.5,
  },
};

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
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty('color-scheme');
  jest.restoreAllMocks();
});

test('a theme change updates the document, MUI and the shared CSS palette together', () => {
  const store = new ThemeStore(definitions);
  const observed = [];
  const dispose = autorun(() =>
    observed.push(store.theme.palette.primary.main),
  );
  expect(store.setTheme('night')).toBe(true);
  expect(document.documentElement.dataset.theme).toBe('night');
  expect(document.documentElement.style.colorScheme).toBe('dark');
  expect(themeMeta.content).toBe('#111827');
  expect(store.theme.palette.background.default).toBe('#111827');
  expect(store.theme.palette.primary.main).toBe('#a78bfa');
  expect(store.theme.shape.borderRadius).toBe(18);
  expect(store.theme.typography.fontFamily).toBe('Arial, sans-serif');
  expect(themeVariables(definitions.night)['--sw-accent-rgb']).toBe(
    '167 139 250',
  );
  expect(themeVariables(definitions.night)['--sw-border']).toBe(
    'rgb(var(--sw-border-rgb))',
  );
  expect(observed).toEqual([defaultTheme.colors.accent, '#a78bfa']);
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('night');
  dispose();
});

test('restores a saved theme and falls back safely when a theme was removed', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'night');
  expect(new ThemeStore(definitions).mode).toBe('dark');
  localStorage.setItem(THEME_STORAGE_KEY, 'removed');
  const store = new ThemeStore(definitions);
  expect(store.id).toBe('sage');
  expect(store.setTheme('unknown')).toBe(false);
  expect(store.setTheme('__proto__')).toBe(false);
  expect(store.id).toBe('sage');
});

test('works without browser storage', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Storage disabled');
  });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage disabled');
  });
  const store = new ThemeStore(definitions);
  expect(store.setTheme('night')).toBe(true);
  expect(store.isLightTheme).toBe(false);
  expect(document.documentElement.dataset.theme).toBe('night');
});
