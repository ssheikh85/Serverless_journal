import React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {useAuth0} from '../auth/authHandlerWeb';
import {Entries} from '../components/Entries';

const LoginWeb = () => {
  const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

  let name = '';
  if (isAuthenticated && user) {
    name = user.given_name;
  }

  return (
    <>
      <View style={styles.container}>
        {!isAuthenticated && (
          <>
            <Text>Please log in</Text>
            <Button onPress={() => loginWithRedirect({})} title="Login" />
          </>
        )}
        {isAuthenticated && (
          <>
            <Text style={styles.header}> Welcome, {name} </Text>
            <Button onPress={() => logout()} title="Logout" />
            <>
              <Entries />
            </>
          </>
        )}
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
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
});

export default LoginWeb;

//Code to get a jwt token to test the server
// const getToken = async () => {
//   const token = await getIdTokenClaims();
//   const idToken = token.__raw;
//   console.log(idToken);
// };
// <Button onPress={() => getToken()} title="Token" />
