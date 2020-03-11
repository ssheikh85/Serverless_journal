import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
import Root from '../components/root';
import {apiEndpoint} from '../client_config';

//Apollo Client set-up
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({graphQLErrors, networkError}) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({message, locations, path}) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: apiEndpoint,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <>
      <Root />
    </>
  </ApolloProvider>
);

export default App;
