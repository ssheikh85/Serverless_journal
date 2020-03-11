import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import authHandlerMobile from '../auth/authHandlerMobile';

const NavbarMobile = () => {
  const [accessToken, setAccessToken] = useState(null);

  const login = async () => {
    const credentials = await authHandlerMobile.handleLogin();
    setAccessToken(credentials.accessToken);
  };

  const logout = async () => {
    const sucess = await authHandlerMobile.handleLogout();
    console.log(sucess);
    if (sucess) {
      setAccessToken(null);
    } else {
      Alert.alert('An error occurred in logging you out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Login </Text>
      <Text>You are{accessToken ? ' ' : ' not '}logged in . </Text>
      <Button
        onPress={accessToken ? logout : login}
        title={accessToken ? 'Log Out' : 'Log In'}
      />
    </View>
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
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default NavbarMobile;
