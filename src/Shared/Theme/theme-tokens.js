// This palette is shared by Tailwind, CSS variables and Material UI.
// New themes extend these semantic colors; page styles never select a theme.
// Keep this CommonJS module free of Babel helper imports: Node loads it too.
const colors = {
  canvas: '#f7f8fa',
  surface: '#ffffff',
  'surface-subtle': '#fbfdfb',
  ink: '#202e2b',
  secondary: '#687970',
  muted: '#77817e',
  subtle: '#98a99e',
  border: '#dce7df',
  'border-subtle': '#e6eee8',
  'border-strong': '#c7d8cc',
  accent: '#286b53',
  'accent-hover': '#205941',
  'on-accent': '#ffffff',
  'accent-50': '#f4f9f5',
  'accent-100': '#edf5ef',
  'accent-150': '#e4f0e6',
  'accent-200': '#d5e7db',
  'accent-300': '#b7d2bf',
  'accent-400': '#8db39a',
  'accent-500': '#6a9779',
  'accent-600': '#4f805f',
  'accent-700': '#347452',
  'accent-800': '#31583f',
  'accent-900': '#294535',
  'accent-950': '#192d29',
  'sage-50': '#f8faf4',
  'sage-100': '#eef2e7',
  'sage-200': '#dfe8d0',
  'sage-300': '#c2d1b5',
  'sage-400': '#a4b78f',
  'sage-500': '#839178',
  'sage-600': '#658452',
  'sage-700': '#526c45',
  'neutral-100': '#f0f3f1',
  'neutral-200': '#e4e8e5',
  'neutral-300': '#c7d1cb',
  'neutral-400': '#a2b1a8',
  'neutral-500': '#84968b',
  'neutral-600': '#6c7d72',
  'neutral-700': '#52645a',
  'neutral-800': '#3d5746',
  'danger-50': '#fff5f5',
  'danger-100': '#fceaea',
  'danger-200': '#edcccc',
  'danger-300': '#dfa8a8',
  'danger-400': '#c88c8c',
  'danger-500': '#b96767',
  'danger-600': '#a35454',
  'danger-700': '#8f3e3e',
  'warning-50': '#fffbf2',
  'warning-100': '#f8f0de',
  'warning-200': '#e8d7b1',
  'warning-400': '#c3a47b',
  'warning-600': '#a88c50',
  'warning-800': '#78643c',
  'info-50': '#f0f7fb',
  'info-100': '#e2eaf0',
  'info-300': '#b7cfdf',
  'info-400': '#8eaab9',
  'info-600': '#61869d',
  'info-800': '#345a73',
  'violet-100': '#e9e6f0',
  'violet-300': '#c7bfd9',
  'violet-400': '#a59dbd',
  'violet-600': '#8b789f',
  'violet-800': '#665076',
  sidebar: '#192d29',
  'sidebar-hover': '#233e35',
  'sidebar-active': '#304d3e',
  'sidebar-panel': '#223a32',
  'sidebar-border': '#3b5247',
  'sidebar-text': '#bac9c3',
  'sidebar-muted': '#82958e',
  'sidebar-heading': '#ffffff',
  'sidebar-accent': '#daf0c6',
  'sidebar-icon': '#b9e4a1',
  'sidebar-action': '#c5dfa9',
  'sidebar-action-ink': '#203c2c',
  shadow: '#284c39',
  backdrop: '#0b1c22',
  focus: '#69ac8f',
  'cover-sage': '#e3ecdf',
  'art-sage': '#94af89',
  'cover-sand': '#f0e8da',
  'art-sand': '#c3a47b',
  'cover-lavender': '#e9e6f0',
  'art-lavender': '#a59dbd',
  'cover-blue': '#e2eaf0',
  'art-blue': '#8eaab9',
};
const defaultTheme = {
  label: 'Шалфей',
  mode: /** @type {'light' | 'dark'} */ ('light'),
  colors,
  fontFamily: 'Manrope, sans-serif',
  radiusScale: 1,
  fontScale: 1,
};
const definitions = require('./themes.json');
/** @type {Record<string, typeof defaultTheme>} */
const themes = {};
Object.keys(definitions).forEach(id => {
  const definition = definitions[id];
  themes[id] = Object.assign({}, defaultTheme, definition, {
    colors: Object.assign({}, colors, definition.colors),
  });
});
const spacing = Object.fromEntries(
  [
    0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5,
    3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.5, 7, 7.5, 8, 8.5, 9,
    9.5, 10, 10.5, 11, 11.5, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30,
    32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
  ].map(value => [String(value), `${value * 4}px`]),
);
const radii = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23, 24,
  26, 28, 30, 32,
];
const fontSizes = Array.from({ length: 74 }, (_, i) => i + 7);
function rgb(hex) {
  return hex
    .slice(1)
    .match(/../g)
    .map(value => parseInt(value, 16))
    .join(' ');
}
function themeVariables(definition = defaultTheme) {
  const palette = Object.assign({}, colors, definition.colors);
  const variables = {};
  Object.keys(palette).forEach(name => {
    const value = palette[name];
    variables[`--sw-${name}-rgb`] = rgb(value);
    variables[`--sw-${name}`] = `rgb(var(--sw-${name}-rgb))`;
  });
  Object.assign(variables, {
    '--sw-bg': 'var(--sw-canvas)',
    '--sw-paper': 'var(--sw-surface)',
    '--sw-line': 'var(--sw-neutral-200)',
    '--sw-green': 'var(--sw-accent)',
    '--sw-font-sans': definition.fontFamily || defaultTheme.fontFamily,
    '--sw-radius-scale': String(definition.radiusScale ?? 1),
    '--sw-font-scale': String(definition.fontScale ?? 1),
    '--sw-sidebar-width': '246px',
    '--sw-sidebar-compact-width': '220px',
    '--sw-topbar-height': '72px',
    '--sw-topbar-mobile-height': '64px',
  });
  Object.keys(spacing).forEach(name => {
    variables[`--sw-space-${name.replace('.', '_')}`] = spacing[name];
  });
  radii.forEach(size => {
    variables[`--sw-radius-${size}`] =
      `calc(${size}px * var(--sw-radius-scale))`;
  });
  fontSizes.forEach(size => {
    variables[`--sw-font-size-${size}`] =
      `calc(${size}px * var(--sw-font-scale))`;
  });
  return variables;
}
module.exports = {
  colors,
  defaultTheme,
  themes,
  spacing,
  radii,
  fontSizes,
  themeVariables,
};
