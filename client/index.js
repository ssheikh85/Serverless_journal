/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '../client/src/mobile/App';
import {name as appName} from './app.json';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import authHandlerMobile from './src/mobile/AuthHandlerMobile';
import {apiEndpoint} from '../client_config';

//Apollo Client set-up
const client = new ApolloClient({
  uri: `${apiEndpoint}/entries`,
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: authHandlerMobile.getIdToken(),
      },
    }));
  },
  cache: new InMemoryCache(),
});

AppRegistry.registerComponent(appName, () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
));
