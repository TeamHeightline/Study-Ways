import { createTheme } from '@mui/material/styles';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { colors, DEFAULT_THEME, defaultTheme, themes } from './theme-tokens';
export interface ThemeDefinition {
  label: string;
  illustrations?: string;
  mode: 'light' | 'dark';
  accessibility?: 'standard' | 'enhanced';
  colors: Partial<typeof colors>;
  fontFamily?: string;
  radiusScale?: number;
  fontScale?: number;
}

export const THEME_STORAGE_KEY = 'studyways.theme';
export { DEFAULT_THEME } from './theme-tokens';

export function restoreTheme() {
  try {
    const id = localStorage.getItem(THEME_STORAGE_KEY);
    if (id && Object.prototype.hasOwnProperty.call(themes, id)) return id;
  } catch {}
  return DEFAULT_THEME;
}
const slice = createSlice({
  name: 'theme',
  initialState: () => ({ id: restoreTheme() }),
  reducers: {
    themeChanged(state, action: PayloadAction<string>) {
      if (Object.prototype.hasOwnProperty.call(themes, action.payload))
        state.id = action.payload;
    },
  },
});
export const themeActions = slice.actions;
export default slice.reducer;
export function getThemeSettings(
  id: string,
  definitions: Record<string, ThemeDefinition> = themes,
) {
  const definition = Object.prototype.hasOwnProperty.call(definitions, id)
    ? definitions[id]
    : defaultTheme;
  const palette = { ...colors, ...definition.colors };
  const theme = buildMuiTheme(definition, palette);
  return {
    id,
    definition,
    palette,
    mode: definition.mode,
    isLightTheme: definition.mode === 'light',
    backgroundColor: palette.canvas,
    textColor: palette.ink,
    primaryColor: palette.accent,
    theme,
    availableThemes: Object.entries(definitions).map(([id, definition]) => ({
      id,
      ...definition,
      colors: { ...colors, ...definition.colors },
    })),
  };
}
function buildMuiTheme(definition: ThemeDefinition, palette: typeof colors) {
  return createTheme({
    typography: {
      fontFamily: definition.fontFamily || defaultTheme.fontFamily,
      fontSize: 14 * (definition.fontScale ?? 1),
      button: { textTransform: 'none', fontWeight: 600 },
    },
    palette: {
      mode: definition.mode,
      background: { default: palette.canvas, paper: palette.surface },
      text: { primary: palette.ink, secondary: palette.secondary },
      primary: { main: palette.accent, contrastText: palette['on-accent'] },
      secondary: { main: palette['violet-600'] },
      error: { main: palette['danger-600'] },
      warning: { main: palette['warning-600'] },
      info: { main: palette['info-600'] },
      success: { main: palette['accent-700'] },
      divider: palette.border,
    },
    shape: { borderRadius: 12 * (definition.radiusScale ?? 1) },
    components: {
      MuiGrid: {
        styleOverrides: {
          root: {
            // Preserve full-width containers inside centered flex layouts.
            variants: [
              { props: { container: true }, style: { width: '100%' } },
            ],
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: palette.tooltip,
            color: palette['tooltip-ink'],
          },
          arrow: { color: palette.tooltip },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: 'var(--sw-ink)',
            backgroundColor: 'var(--sw-canvas)',
            fontFamily: 'var(--sw-font-sans)',
            colorScheme: definition.mode,
            scrollbarColor: 'var(--sw-accent-400) var(--sw-accent-100)',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--sw-accent-100)',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--sw-accent-400)',
              borderRadius: 'var(--sw-radius-10)',
            },
          },
        },
      },
    },
  });
}
export function applyThemeToDocument(id: string) {
  const definition = Object.prototype.hasOwnProperty.call(themes, id)
    ? themes[id]
    : defaultTheme;
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    html.dataset.theme = id;
    html.dataset.colorScheme = definition.mode;
    html.dataset.illustrations = definition.illustrations || 'none';
    html.dataset.accessibility = definition.accessibility || 'standard';
    html.style.colorScheme = definition.mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', definition.colors.canvas || colors.canvas);
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {}
}
export function installThemePersistence(store: {
  getState: () => { theme: { id: string } };
  subscribe: (listener: () => void) => () => void;
}) {
  let previous: string | undefined;
  const synchronize = () => {
    const id = store.getState().theme.id;
    if (id !== previous) {
      previous = id;
      applyThemeToDocument(id);
    }
  };
  synchronize();
  return store.subscribe(synchronize);
}
