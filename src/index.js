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

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : "",
        }
    }
});
const httpLink = new HttpLink({
    uri: 'https://iot-experemental.herokuapp.com/graphql/'
    // Additional options
});
const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

export const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    // uri: 'https://iot-experemental.herokuapp.com/graphql/',
    cache: new InMemoryCache()
});

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
            contrastDefaultColor: "light"
        }
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </React.StrictMode>
    </ApolloProvider>,
  document.getElementById('root')
);


reportWebVitals();
