import React from 'react';
import {Platform} from 'react-native';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
import Root from '../components/root';
import {apiEndpoint} from '../client_config';
import {useAuth0} from '../auth/react-auth0.spa';
import authHandlerMobile from '../auth/authHandlerMobile';

let idToken = '';

const {getIdTokenSilently} = useAuth0();

const getToken = async () => {
  const idTokenMobile = await authHandlerMobile.getIdToken();
  idToken = idTokenMobile;
};

if (Plaform.OS === 'web') {
  idtoken = getIdTokenSilently();
} else {
  getToken();
}

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
      uri: `${apiEndpoint}/entries`,
      headers: {
        ...context.headers,
        authorization: idToken,
      },
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
