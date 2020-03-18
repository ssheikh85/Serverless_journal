import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {useAuth0} from '../auth/authHandlerWeb';

const LoginWeb = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    getIdTokenClaims,
  } = useAuth0();

  const getToken = async () => {
    const token = await getIdTokenClaims();
    const idToken = token.__raw;
    console.log(idToken);
  };

  return (
    <>
      <View style={styles.container}>
        {/* <Text style={styles.header}> Welcome, {userFirstName}</Text> */}
        {/* <Text>You are{isAuthenticated ? ' ' : ' not '}logged in . </Text> */}
        <Button onPress={() => loginWithRedirect({})} title="Login" />
        <Button onPress={() => getToken()} title="Token" />
        <Button onPress={() => logout()} title="Logout" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 48,
    textAlign: 'center',
    margin: 10,
  },
});

export default LoginWeb;
