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
import DateAdapter from '@mui/lab/AdapterMoment';
import {LocalizationProvider} from "@mui/lab";
import 'antd/dist/antd.dark.min.css';
import {theme} from "./global-theme";
import { Auth0Provider } from "@auth0/auth0-react";

configure({
    enforceActions: "never",
})

//Этот файл полностью посвящен тму, чтобы создать темную тему во все проекте
//Для Material UI мы создаем ThemeProvider, для AntDesign - импортируем темную тему
ReactDOM.render(
    <LocalizationProvider dateAdapter={DateAdapter}>
        <Auth0Provider
            domain="dev-29gfcwkx.us.auth0.com"
            clientId="A0jSyVnfS1vB1KMmi0G8XsDRcyNYBXJS"
            redirectUri={window.location.origin}
            audience="https://dev-29gfcwkx.us.auth0.com/api/v2/"
            scope="read:current_user update:current_user_metadata"
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <style>{'body {background-color: #0A1929}'}</style>
                <div>
                    <DndProvider backend={HTML5Backend}>
                        <App />
                    </DndProvider>
                </div>
            </ThemeProvider>
        </Auth0Provider>
    </LocalizationProvider>,
  document.getElementById('root')
);


reportWebVitals();
