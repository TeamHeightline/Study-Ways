import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ApolloClient, InMemoryCache, gql, ApolloProvider} from '@apollo/client';


const client = new ApolloClient({
    uri: 'https://iot-experemental.herokuapp.com/graphql/',
    cache: new InMemoryCache()
});

// client
//     .query({
//         query: gql`
//       query {
//         questionById(id: 5){
//           text
//           videoUrl
//         }}
//     `
//     })
//     .then(result => console.log(result));

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </ApolloProvider>,
  document.getElementById('root')
);


reportWebVitals();
