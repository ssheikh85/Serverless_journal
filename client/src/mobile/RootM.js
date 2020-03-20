import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import authHandlerMobile from '../mobile/AuthHandlerMobile';
import {EntriesM} from './EntriesM';

const RootM = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState(' ');

  const login = async () => {
    try {
      const credentials = await authHandlerMobile.handleLogin();
      const user = await authHandlerMobile.getUserInfo(credentials.accessToken);
      setAccessToken(credentials.accessToken);
      setName(user.givenName);
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

  return (
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
            <>{accessToken && <EntriesM userId={userId} />}</>
          </View>
        </>
      )}
    </>
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
    textAlign: 'center',
    margin: 10,
  },
});

export default RootM;
