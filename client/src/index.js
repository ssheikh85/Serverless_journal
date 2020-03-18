import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {BrowserRouter} from 'react-router-dom';
import {apiEndpoint} from './client_config';
import authHandlerWeb from './web/AuthHandlerWeb';
import App from './web/App';

//Apollo Client set-up
const httpLink = createHttpLink({
  uri: `${apiEndpoint}/entries`,
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = authHandlerWeb.getIdToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
