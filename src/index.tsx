import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { onError } from 'apollo-link-error'

import { ApolloClient, InMemoryCache, gql, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import {setContext} from "@apollo/client/link/context";
import {unstable_createMuiStrictModeTheme} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';
import User from "./Store/UserStore/UserStore"
import {observer} from "mobx-react";

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
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
