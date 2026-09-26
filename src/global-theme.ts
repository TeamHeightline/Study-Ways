import { createTheme } from '@mui/material/styles';
import { makeAutoObservable } from 'mobx';
import { Property } from 'csstype';

class ThemeStore {
  constructor() {
    makeAutoObservable(this);
    // autorun(() => this.setModeToLocalStorage())
  }

  mode: 'dark' | 'light' | 'dark2' = this.getMode;

  get getMode(): 'dark' | 'light' | 'dark2' {
    const mode = localStorage.getItem('themeMode');
    if (mode == 'dark' || mode == 'light' || mode == 'dark2') {
      return mode;
    } else {
      return 'light';
    }
  }

  get isOffButtonShiny() {
    return !(this.mode === 'dark');
  }

  setModeToLocalStorage(mode: 'dark' | 'light' | 'dark2') {
    localStorage.setItem('themeMode', mode);
    this.mode = mode;
    // window.location.reload();
  }

  changeMode = () => {
    if (this.mode == 'light') {
      this.setModeToLocalStorage('dark');
    } else if (this.mode == 'dark') {
      this.setModeToLocalStorage('dark2');
    } else if (this.mode == 'dark2') {
      this.setModeToLocalStorage('light');
    }
  };

  get isLightTheme() {
    return this.mode === 'light';
  }

  get backgroundColor(): Property.BackgroundColor | undefined {
    if (this.mode === 'light') {
      return '#f7f8fa';
    } else if (this.mode === 'dark2') {
      return '#222226';
    } else {
      return '#0A1929';
    }
  }

  get textColor() {
    if (this.isLightTheme) {
      return 'rgba(0, 0, 0, 0.87)';
    } else {
      return '#ffffff';
    }
  }

  get primaryColor() {
    return this.isLightTheme ? '#286b53' : '#8bc7aa';
  }

  get theme() {
    const theme = createTheme({
      typography: { fontFamily: 'Manrope, sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
      palette: {
        mode: this.isLightTheme ? 'light' : 'dark',
        background: {
          default: this.backgroundColor,
          paper: this.isLightTheme ? '#ffffff' : this.backgroundColor,
        },
        primary: {
          main: this.primaryColor,
        },
        secondary: {
          main: '#8b789f',
        },
      },
      // Скругление углов у всех элементов
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              fontFamily: 'Manrope, sans-serif',
            },
          },
        },
        MuiButton: this.isOffButtonShiny
          ? {}
          : {
              styleOverrides: {
                root: {
                  boxShadow: '0 0 22px 0 rgb(75 135 184 / 22%)',
                },
                text: {
                  boxShadow: 'none',
                },
                outlinedSecondary: {
                  boxShadow: '0 0 22px 0 rgb(245 0 87 / 22%)',
                },
                containedSecondary: {
                  boxShadow: '0 0 22px 0 rgb(245 0 87 / 22%)',
                },
                outlinedError: {
                  boxShadow: '0 0 22px 0 rgb(245 0 87 / 22%)',
                },
                containedError: {
                  boxShadow: '0 0 22px 0 rgb(245 0 87 / 22%)',
                },
              },
            },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontFamily: 'Manrope, sans-serif',
              backgroundColor: this.backgroundColor,
              '--sw-bg': this.backgroundColor,
              '--sw-paper': this.isLightTheme ? '#ffffff' : '#20362f',
              '--sw-ink': this.isLightTheme ? '#202e2b' : '#e6eee9',
              '--sw-muted': this.isLightTheme ? '#77817e' : '#a4b8ad',
              '--sw-line': this.isLightTheme ? '#e4e8e5' : '#3b5147',
              '--ck-color-base-border': this.backgroundColor,
              '.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)': {
                borderColor: this.backgroundColor,
              },
              scrollbarColor: this.backgroundColor,
              '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                backgroundColor: this.backgroundColor,
              '--sw-bg': this.backgroundColor,
              '--sw-paper': this.isLightTheme ? '#ffffff' : '#20362f',
              '--sw-ink': this.isLightTheme ? '#202e2b' : '#e6eee9',
              '--sw-muted': this.isLightTheme ? '#77817e' : '#a4b8ad',
              '--sw-line': this.isLightTheme ? '#e4e8e5' : '#3b5147',
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: this.backgroundColor,
              '--sw-bg': this.backgroundColor,
              '--sw-paper': this.isLightTheme ? '#ffffff' : '#20362f',
              '--sw-ink': this.isLightTheme ? '#202e2b' : '#e6eee9',
              '--sw-muted': this.isLightTheme ? '#77817e' : '#a4b8ad',
              '--sw-line': this.isLightTheme ? '#e4e8e5' : '#3b5147',
                border: '1px solid #2296F3',
              },
              '.ck-editor': {
                '--ck-color-toolbar-background': this.backgroundColor,
                '--ck-color-toolbar-border': this.backgroundColor,
                '--ck-color-input-disabled-text': this.textColor,
                '--ck-color-text': this.textColor,
              },
              '.ck-content': {
                color: this.textColor,
                backgroundColor: this.backgroundColor,
              '--sw-bg': this.backgroundColor,
              '--sw-paper': this.isLightTheme ? '#ffffff' : '#20362f',
              '--sw-ink': this.isLightTheme ? '#202e2b' : '#e6eee9',
              '--sw-muted': this.isLightTheme ? '#77817e' : '#a4b8ad',
              '--sw-line': this.isLightTheme ? '#e4e8e5' : '#3b5147',
              },
              'ck-editor__editable_inline': {
                '--ck-color-toolbar-background': this.backgroundColor,
                '--ck-color-base-background': this.backgroundColor,
                '--ck-color-base-border': this.backgroundColor,
                '--ck-color-text': this.textColor,
                '--ck-color-input-text': this.textColor,
                '--ck-color-input-disabled-text': this.textColor,
                borderColor: this.backgroundColor,
              },
              'ck-editor': {
                '--ck-color-toolbar-background': this.backgroundColor,
                '--ck-color-base-background': this.backgroundColor,
                '--ck-color-base-border': this.backgroundColor,
              },
              '.ck-widget': {
                filter: 'invert(1)',
              },
              // делает все подписи в статистике белыми
              // ".Component-root-4": {
              //     filter: "invert(1)"
              // }
            },
          },
        },
      },
    });
    return theme;
  }
}

const ThemeStoreObject = new ThemeStore();
export default ThemeStoreObject;

