import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { configure } from "mobx"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./Components/Elements/Cards/CardView/RichTextPreviewStyle.css"


export const theme = createTheme( {
    palette: {
        mode: 'dark',
        background: {
            default: '#0A1929',
            paper: "#0A1929"
        },
        primary: {
            main: "#2196f3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: '#f50057',
        },
        text: {
            primary: "#ffffff",
            secondary: "#ffffff",
            disabled: "#ffffff"
        },

    },
    typography: {
        allVariants: {
            color: "white"
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // body:  darkScrollbar(),
                body: {
                    scrollbarColor: "#0A1929",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#1A202C",
                        width: "8px"
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: "10px",
                        backgroundColor: "#1A202C",
                        border: "1px solid #2296F3"
                    },
                    ".ck-editor": {
                        "--ck-color-toolbar-background": "#0A1929",
                        "--ck-color-toolbar-border": "#0A1929",
                        "--ck-color-input-disabled-text": "#ffffff",
                        "--ck-color-text": "#ffffff"
                    },
                    ".ck-content" : {
                        color: "#ffffff"
                    },
                    ".ck-widget":{
                        filter: "invert(1)"
                    }
                }
            },
        },
    },
})

configure({
    enforceActions: "never",
})

//Этот файл полностью посвящен тму, чтобы создать темную тему во все проекте
//Для Material UI мы создаем ThemeProvider, для AntDesign - импортируем темную тему
ReactDOM.render(

        <ThemeProvider theme={theme}>
            <CssBaseline />
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
