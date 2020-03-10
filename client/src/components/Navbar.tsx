import React, {Component} from 'react';
import {
  SafeAreaView,
  //   StyleSheet,
  Text,
  View,
  Button,
  Platform,
  // Platform,
} from 'react-native';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0 from 'react-native-auth0';
import {authConfig} from '../clientConfig';

const authHandler = new Auth0({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
});

export interface AppState {
  loggedIn: boolean;
}

export default class Navbar extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {loggedIn: false};

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.createAuthWeb = this.createAuthWeb.bind(this);
  }

  async createAuthWeb() {
    return await createAuth0Client({
      domain: authConfig.domain,
      client_id: authConfig.clientId,
      redirect_uri: authConfig.callbackUrlWeb,
    });
  }
  async handleLogin() {
    const authWeb = await this.createAuthWeb();
    if (Platform.OS === 'web') {
      await authWeb.loginWithRedirect();
      await authWeb.handleRedirectCallback();
      // const data = await authWeb.getUser();
    } else {
      try {
        const {data} = await authHandler.webAuth.authorize({
          scope: 'openid profile email',
        });
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    this.setState({loggedIn: true});
  }

  async handleLogOut() {
    const authWeb = await this.createAuthWeb();
    if (Platform.OS === 'web') {
      authWeb.logout();
    } else {
      try {
        await authHandler.webAuth.clearSession();
      } catch (error) {
        console.error(error);
      }
    }

    this.setState({loggedIn: false});
  }

  render() {
    const {loggedIn} = this.state;
    return (
      <>
        <SafeAreaView>
          <View>
            {loggedIn ? (
              <>
                <Button
                  title="Logout"
                  onPress={() => {
                    this.handleLogOut();
                  }}
                />
                <Text>Hi!</Text>
              </>
            ) : (
              <Button
                title="Login"
                onPress={() => {
                  this.handleLogin();
                }}
              />
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}
