import React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {useAuth0} from '../auth/authHandlerWeb';

const LoginWeb = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    // user,
    getIdTokenClaims,
  } = useAuth0();

  const getToken = async () => {
    const token = await getIdTokenClaims();
    const idToken = token.__raw;
    console.log(idToken);
  };

  // const userFirstName = user.givenName;
  return (
    <>
      <View style={styles.container}>
        {/* <Text style={styles.header}> Welcome, {userFirstName}</Text> */}
        <Text>You are{isAuthenticated ? ' ' : ' not '}logged in . </Text>
        <Button
          onPress={!isAuthenticated ? loginWithRedirect({}) : logout()}
          title={!isAuthenticated ? 'Log In' : 'Log Out'}
        />
        <Button title="GetToken" onPress={() => getToken()} />;
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
