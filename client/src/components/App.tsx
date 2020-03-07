/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Platform,
} from 'react-native';
import Auth0 from 'react-native-auth0';
import {authConfig} from '../clientCofig';
declare var global: {HermesInternal: null | {}};

const App = () => {
  let [accessToken, setAccessToken] = useState();
  const auth0 = new Auth0({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
  });

  async function login() {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile',
      });
      console.log(credentials);
      setAccessToken(credentials.accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      const sucess = await auth0.webAuth.clearSession();
      if (sucess) {
        Alert.alert('Logged out!');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic"></ScrollView>
        <Button title="Login" onPress={() => login} />
        <Button title="Logout" onPress={() => logout} />
      </SafeAreaView>
    </>
  );
};

export default App;
