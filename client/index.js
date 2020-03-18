/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '../client/src/mobile/App';
import {name as appName} from './app.json';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import authHandlerMobile from './src/mobile/AuthHandlerMobile';
import {apiEndpoint} from '../client_config';

//Apollo Client set-up
const httpLink = createHttpLink({
  uri: `${apiEndpoint}/entries`,
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = authHandlerMobile.getIdToken();
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

AppRegistry.registerComponent(appName, () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
));
