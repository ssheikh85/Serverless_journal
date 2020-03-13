import React from 'react';
// import {Platform} from 'react-native';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import Root from '../components/root';
import {apiEndpoint} from '../client_config';
// import {useAuth0} from '../auth/authHandlerWeb';
// import authHandlerMobile from '../auth/authHandlerMobile';

// let idToken = '';

// const {getTokenSilently} = useAuth0();

// const getToken = async () => {
//   const idTokenMobile = await authHandlerMobile.getIdToken();
//   idToken = idTokenMobile;
// };

// if (Platform.OS === 'web') {
//   idToken = getTokenSilently();
// } else {
//   getToken();
// }

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
    <>
      <Root />
    </>
  </ApolloProvider>
);

export default App;
