import { createTheme } from '@mui/material/styles';
import { makeAutoObservable } from 'mobx';
import { colors, defaultTheme, themes } from './theme-tokens';

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
export const DEFAULT_THEME = 'sage';

export class ThemeStore {
  id = DEFAULT_THEME;
  private definitions: Record<string, ThemeDefinition>;

  constructor(definitions: Record<string, ThemeDefinition> = themes) {
    this.definitions = definitions;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && Object.prototype.hasOwnProperty.call(definitions, saved))
        this.id = saved;
    } catch {
      // Themes still work when the browser disables persistent storage.
    }
    makeAutoObservable<this, 'definitions'>(
      this,
      { definitions: false },
      { autoBind: true },
    );
    this.applyToDocument();
  }

  get definition() {
    return this.definitions[this.id] || defaultTheme;
  }

  get availableThemes() {
    return Object.entries(this.definitions).map(([id, definition]) => ({
      id,
      label: definition.label,
      illustrations: definition.illustrations,
      mode: definition.mode,
      accessibility: definition.accessibility,
      colors: { ...colors, ...definition.colors },
    }));
  }

  get palette() {
    return { ...colors, ...this.definition.colors };
  }

  get mode() {
    return this.definition.mode;
  }

  get isLightTheme() {
    return this.mode === 'light';
  }

  get backgroundColor() {
    return this.palette.canvas;
  }

  get textColor() {
    return this.palette.ink;
  }

  get primaryColor() {
    return this.palette.accent;
  }

  get theme() {
    const palette = this.palette;
    return createTheme({
      typography: {
        fontFamily: this.definition.fontFamily || defaultTheme.fontFamily,
        fontSize: 14 * (this.definition.fontScale ?? 1),
        button: { textTransform: 'none', fontWeight: 600 },
      },
      palette: {
        mode: this.mode,
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
      shape: { borderRadius: 12 * (this.definition.radiusScale ?? 1) },
      components: {
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
              colorScheme: this.mode,
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
              '.ck-editor': {
                '--ck-color-toolbar-background': 'var(--sw-surface)',
                '--ck-color-base-background': 'var(--sw-surface)',
                '--ck-color-toolbar-border': 'var(--sw-border)',
                '--ck-color-base-border': 'var(--sw-border)',
                '--ck-color-text': 'var(--sw-ink)',
                '--ck-color-input-text': 'var(--sw-ink)',
                '--ck-color-input-disabled-text': 'var(--sw-secondary)',
              },
              '.ck-content': {
                color: 'var(--sw-ink)',
                backgroundColor: 'var(--sw-surface)',
              },
            },
          },
        },
      },
    });
  }

  setTheme(id: string) {
    if (!Object.prototype.hasOwnProperty.call(this.definitions, id))
      return false;
    this.id = id;
    this.applyToDocument();
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // The current session can switch themes without localStorage.
    }
    return true;
  }

  private applyToDocument() {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = this.id;
      document.documentElement.dataset.colorScheme = this.mode;
      document.documentElement.dataset.illustrations =
        this.definition.illustrations || 'none';
      document.documentElement.dataset.accessibility =
        this.definition.accessibility || 'standard';
      document.documentElement.style.colorScheme = this.mode;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', this.backgroundColor);
    }
  }
}
