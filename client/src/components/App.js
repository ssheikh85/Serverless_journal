import React from 'react';
// import {Platform} from 'react-native';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {Provider} from 'react-redux';
import store from '../graphql-api/index';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import Root from './Root';
import {apiEndpoint} from '../client_config';

//Apollo Client set-up
const httpLink = createHttpLink({
  uri: `${apiEndpoint}/entries`,
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Root />
    </Provider>
  </ApolloProvider>
);

export default App;
