import { createTheme } from '@mui/material/styles';

// The application currently supports the light theme only.
localStorage.setItem('themeMode', 'light');
const backgroundColor = '#f7f8fa';
const textColor = '#202e2b';
const primaryColor = '#286b53';
const theme = createTheme({
  typography: { fontFamily: 'Manrope, sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  palette: {
    mode: 'light',
    background: { default: backgroundColor, paper: '#ffffff' },
    text: { primary: textColor, secondary: '#687970' },
    primary: { main: primaryColor },
    secondary: { main: '#8b789f' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: {
      body: {
        color: textColor, backgroundColor, fontFamily: 'Manrope, sans-serif', colorScheme: 'light',
        '--sw-bg': backgroundColor, '--sw-paper': '#ffffff', '--sw-ink': textColor,
        '--sw-muted': '#77817e', '--sw-line': '#e4e8e5',
        scrollbarColor: '#7ba38b #e7eee8',
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': { width: '8px', height: '8px', backgroundColor: '#e7eee8' },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': { backgroundColor: '#7ba38b', borderRadius: '10px' },
        '.ck-editor': {
          '--ck-color-toolbar-background': '#ffffff', '--ck-color-base-background': '#ffffff',
          '--ck-color-toolbar-border': '#dce7df', '--ck-color-base-border': '#dce7df',
          '--ck-color-text': textColor, '--ck-color-input-text': textColor,
          '--ck-color-input-disabled-text': '#687970',
        },
        '.ck-content': { color: textColor, backgroundColor: '#ffffff' },
      },
    } },
  },
});

const ThemeStoreObject = { mode: 'light' as const, isLightTheme: true, backgroundColor, textColor, primaryColor, theme };
export default ThemeStoreObject;
