import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {unstable_createMuiStrictModeTheme} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const theme = unstable_createMuiStrictModeTheme({
        palette: {
            type: "dark",


            background:{
                default: "#0A1929",
                paper: "#0A1929"
            },
            text: {
                primary: "#ffffff",
                secondary: "#ffffff",
                disabled: "#ffffff"
            },
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
                contrastText: "#ffffff",

            },
        },
        typography: {
            allVariants: {
                color: "white"
            },
        },
});
//Этот файл полностью посвящен тму, чтобы создать темную тему во все проекте
//Для Material UI мы создаем ThemeProvider, для AntDesign - импортируем темную тему
ReactDOM.render(
    <ThemeProvider theme={theme}>
        <style>{'body {background-color: #0A1929}'}</style>
        <div>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </div>
    </ThemeProvider>,
  document.getElementById('root')
);


reportWebVitals();
