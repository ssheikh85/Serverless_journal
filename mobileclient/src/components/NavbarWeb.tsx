import React from 'react';
import {Button, Text, View} from 'react-native';
import authHandlerWeb from '../auth/AuthHandlerWeb';

const NavbarWeb = () => {
  if (authHandlerWeb.isAuthenticated()) {
    return (
      <View>
        <Button title="Logout" onPress={() => authHandlerWeb.logOut()} />
      </View>
    );
  } else {
    return (
      <View>
        <Button title="Login" onPress={() => authHandlerWeb.handleLogin()} />
      </View>
    );
  }
};

export default NavbarWeb;
