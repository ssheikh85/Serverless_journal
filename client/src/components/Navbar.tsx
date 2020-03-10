import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
} from 'react-native';
import axios from 'axios';
import {authConfig} from '../clientConfig';

export interface AppState {
  userFirstName: string;
  loggedIn: boolean;
}

export default class Navbar extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {userFirstName: '', loggedIn: false};

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  async handleLogin() {
    const endPoint = `https://${authConfig.domain}/authorize`;
    const token = '?response_type=token&';
    const client_Id = `client_id=${authConfig.clientId}&`;
    const connection = 'connection=CONNECTION&';
    const redirectUrlWeb = `redirect_uri=${authConfig.callbackUrlWeb}&`;
    const redirectUrliOS = `redirect_uri=${authConfig.callbackUrliOS}&`;
    const redirectUrlAndroid = `redirect_uri=${authConfig.callbackAndroid}&`;
    const state = 'state=STATE';

    let firstName = '';
    if (Platform.OS === 'web') {
      try {
        const queryStringWeb =
          endPoint + token + client_Id + connection + redirectUrlWeb + state;
        const {data} = await axios.get(queryStringWeb);
        firstName = data.given_name;
      } catch (err) {
        console.error(err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const queryStringIOS =
          endPoint + token + client_Id + connection + redirectUrliOS + state;
        const {data} = await axios.get(queryStringIOS);
        firstName = data.given_name;
      } catch (err) {
        console.error(err);
      }
    } else if (Platform.OS === 'android') {
      try {
        const queryStringAndroid =
          endPoint +
          token +
          client_Id +
          connection +
          redirectUrlAndroid +
          state;
        const {data} = await axios.get(queryStringAndroid);
        firstName = data.given_name;
      } catch (err) {
        console.error(err);
      }
    }
    this.setState({userFirstName: firstName, loggedIn: true});
  }

  async handleLogOut() {
    if (Platform.OS === 'web') {
      try {
        const returnURL = 'http://localhost:3000/';
        const queryStringLogout =
          `https://${authConfig.domain}/v2/logout?client_id=${authConfig.clientId}&` +
          returnURL;
        const {data} = await axios.get(queryStringLogout);
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    const {userFirstName, loggedIn} = this.state;
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
                  }}></Button>
                <Text>Hi {userFirstName}!</Text>){' '}
              </>
            ) : (
              <Button
                title="Login"
                onPress={() => {
                  this.handleLogin();
                }}></Button>
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}
