import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {unstable_createMuiStrictModeTheme} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';

const theme = unstable_createMuiStrictModeTheme({
    palette: {
        primary: {
            50: "#e3f2fd",
            100: "#bbdefb",
            200: "#90caf9",
            300: "#64b5f6",
            400: "#42a5f5",
            500: "#2196f3",
            600: "#1e88e5",
            700: "#1976d2",
            800: "#1565c0",
            900: "#0d47a1",
            A100: "#82b1ff",
            A200: "#448aff",
            A400: "#2979ff",
            A700: "#2962ff",
            // contrastDefaultColor: "light"
        }
    },
});

ReactDOM.render(
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>,
  document.getElementById('root')
);


reportWebVitals();
