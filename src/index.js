import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { onError } from 'apollo-link-error'

import { ApolloClient, InMemoryCache, gql, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import {setContext} from "@apollo/client/link/context";

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

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    // uri: 'https://iot-experemental.herokuapp.com/graphql/',
    cache: new InMemoryCache()
});



ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </ApolloProvider>,
  document.getElementById('root')
);


reportWebVitals();
