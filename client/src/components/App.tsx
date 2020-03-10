import React from 'react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';
import {apiEndpoint} from '../clientConfig';
import Navbar from './Navbar';
// import {View} from 'react-native';
// import Journal from './Journal';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `${apiEndpoint}`,
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Navbar />
    </ApolloProvider>
  );
};

/* <Journal /> */

export default App;
