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
  delete document.documentElement.dataset.colorScheme;
  delete document.documentElement.dataset.accessibility;
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
    const store = new ThemeStore();
    store.setTheme(id);
    const palette = store.palette;
    expect(store.mode).toBe('dark');
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
    expect(store.theme.palette.primary.main).toBe(themes[id].colors.accent);
    expect(store.availableThemes.map(theme => theme.id)).toEqual([
      'sage',
      'forest',
      'graphite',
      'midnight',
      'high-contrast',
      'high-contrast-dark',
    ]);
  },
);

test.each(['high-contrast', 'high-contrast-dark'])(
  '%s uses enlarged type and strongly contrasting text across shared surfaces',
  id => {
    const { colors, themes, themeVariables } = require('./theme-tokens');
    const store = new ThemeStore();
    store.setTheme(id);
    const palette = store.palette;
    expect(document.documentElement.dataset.accessibility).toBe('enhanced');
    expect(store.theme.typography.fontSize).toBeCloseTo(18.2);
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
    store.setTheme('sage');
    expect(document.documentElement.dataset.accessibility).toBe('standard');
    expect(store.theme.typography.fontSize).toBe(14);
  },
);
