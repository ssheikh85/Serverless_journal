import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {BrowserRouter} from 'react-router-dom';
import {authConfig, apiEndpoint} from '../client_config';
import {useAuth0} from './AuthHandlerWeb';
import {Auth0Provider} from './AuthHandlerWeb';
import RootWeb from './RootWeb';
import history from './history';

const App = () => {
  //Get idToken
  const {getIdtokenClaims} = useAuth0;

  const getIdToken = () => {
    const claims = getIdtokenClaims();
    return claims.__raw;
  };

  // A function that routes the user to the right place
  // after login
  const onRedirectCallback = appState => {
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  };

  //Apollo Client set-up
  const httpLink = createHttpLink({
    uri: `${apiEndpoint}/entries`,
  });

  const authLink = setContext((_, {headers}) => {
    const token = getIdToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : token,
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <BrowserRouter>
      <Auth0Provider
        domain={authConfig.domain}
        client_id={authConfig.clientId}
        redirect_uri={authConfig.callbackUrl}
        onRedirectCallback={onRedirectCallback}>
        <ApolloProvider client={client}>
          <RootWeb />
        </ApolloProvider>
      </Auth0Provider>
    </BrowserRouter>
  );
};

export default App;
