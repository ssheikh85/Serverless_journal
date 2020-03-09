import Auth0 from 'react-native-auth0';
import auth0 from 'auth0-js';
import {Platform} from 'react-native';
import {authConfig} from '../clientCofig';

export default class Auth {
  constructor(historyIn) {
    this.history = historyIn;
  }

  //web Auth0
  auth0Web = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrlWeb,
    responseType: 'token id_token',
    scope: 'openid',
  });

  //mobile Auth0
  auth0Mobile = new Auth0({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
  });

  accessToken;
  idToken;
  expiresAt;

  async loginMobile() {
    try {
      const credentials = await this.auth0Mobile.webAuth.authorize({
        scope: 'openid profile email',
      });
      this.setSession(credentials);
    } catch (error) {
      console.log(error);
    }
  }

  login() {
    if (Platform.OS === 'web') {
      this.auth0Web.authorize();
    } else {
      this.loginMobile();
    }
  }

  handleAuthentication() {
    if (Platform.OS === 'web') {
      console.log('Do I get here');
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log('Access token: ', authResult.accessToken);
          console.log('id token: ', authResult.idToken);
          this.setSession(authResult);
        } else if (err) {
          this.history.replace('/');
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
        }
      });
    } else {
      console.log('Access token: ', this.accessToken);
      console.log('id token: ', this.idToken);
    }
  }

  setSession(authResult) {
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.history.replace('/');
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  async logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    if ((Platform.OS = 'web')) {
      this.auth0Web.logout({
        return_to: window.location.origin,
      });
    } else {
      await this.auth0Mobile.webAuth.clearSession();
    }

    // navigate to the home route
    this.history.replace('/');
  }
}
