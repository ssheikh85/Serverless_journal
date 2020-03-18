import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {BrowserRouter} from 'react-router-dom';
import {apiEndpoint} from '../client_config';
import authHandlerWeb from './authHandlerWeb';
import App from './web/App';

//Apollo Client set-up
const client = new ApolloClient({
  uri: `${apiEndpoint}/entries`,
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: authHandlerWeb.getIdToken(),
      },
    }));
  },
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
