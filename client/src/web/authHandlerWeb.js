import auth0 from 'auth0-js';
import {authConfig} from '../client_config';

class AuthHandlerWeb {
  static isAuthenticated() {
    throw new Error('Method not implemented.');
  }
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.silentAuth = this.silentAuth.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err || !authResult || !authResult.idToken) {
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
          return reject(err);
        } else {
          console.log('Access token: ', authResult.accessToken);
          console.log('id token: ', authResult.idToken);
          this.setSession(authResult);
          resolve();
          this.auth0.client.userInfo(authResult.accessToken, function(
            err,
            user,
          ) {
            if (err) {
              console.log(err);
              alert(
                `Could not get user info (${err.error}: ${err.error_description}).`,
              );
            } else {
              this.user = user;
            }
          });
        }
      });
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    this.history.replace('/');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`,
        );
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      return_to: window.location.origin,
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

  silentAuth() {
    if (this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if (err) {
            localStorage.removeItem('isLoggedIn');
            return reject(err);
          }
          this.setSession(authResult);
          resolve();
        });
      });
    }
  }

  getUserInfo() {
    return this.user;
  }
}

const authHandlerWeb = new AuthHandlerWeb();

export default authHandlerWeb;
