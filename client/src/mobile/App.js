import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {ApolloProvider} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import authHandlerMobile from './AuthHandlerMobile';
import {apiEndpoint} from '../client_config';
import {EntriesM} from './EntriesM';

const App = () => {
  const [idToken, setIdToken] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState(' ');
  const [userId, setUserId] = useState(' ');

  const login = async () => {
    try {
      const credentials = await authHandlerMobile.handleLogin();
      const user = await authHandlerMobile.getUserInfo(credentials.accessToken);
      setAccessToken(credentials.accessToken);
      setIdToken(credentials.idToken);
      setName(user.givenName);
      setUserId(user.sub);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    const sucess = await authHandlerMobile.handleLogout();

    if (sucess) {
      setAccessToken(null);
    } else {
      Alert.alert('An error occurred in logging you out');
    }
  };

  //Apollo Client set-up
  const httpLink = createHttpLink({
    uri: `${apiEndpoint}/entries`,
  });

  const authLink = setContext((_, {headers}) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: idToken ? `bearer ${idToken}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <>
        {!accessToken && (
          <>
            <View style={styles.loggedOut}>
              <Text>Please log in</Text>
              <Button onPress={() => login()} title="Login" />
            </View>
          </>
        )}
        {accessToken && (
          <>
            <View>
              <Text style={styles.header}> Welcome, {name} </Text>
              <Button onPress={() => logout()} title="Logout" />
              <>
                {accessToken && <EntriesM userId={userId} idToken={idToken} />}
              </>
            </View>
          </>
        )}
      </>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  loggedOut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loggedIn: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    marginTop: 45,
    padding: 15,
    backgroundColor: 'steelblue',
  },
});

export default App;
