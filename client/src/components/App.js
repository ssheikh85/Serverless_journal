import React from 'react';
import ApolloClient from 'apollo-boost';
import ApolloProvider from 'apollo-boost';
import Root from '../components/root';
import {apiEndpoint} from '../client_config';

const client = new ApolloClient({
  uri: apiEndpoint,
});

const App = () => {
  <ApolloProvider client={client}>
    <>
      <Root />
    </>
  </ApolloProvider>;
};

export default App;
