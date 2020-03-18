import auth0 from 'auth0-js';
import {authConfig} from '../client_config';

// Class developed from this tutorial
//https://auth0.com/blog/develop-modern-apps-with-react-graphql-apollo-and-add-authentication/

class AuthHandlerWeb {
  idToken;
  expiresAt;
  userInfo;

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    audience: authConfig.audience,
    responseType: 'token id_token',
    scope: 'openid profile',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
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
              this.userInfo = user;
            }
          });
        }
      });
    });
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;

    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    console.log('Access token: ', authResult.accessToken);
    console.log('id token: ', authResult.idToken);
  }

  logout() {
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      return_to: window.location.origin,
      clientID: authConfig.clientId,
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.expiresAt;
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
    return this.userInfo;
  }
}

const authHandlerWeb = new AuthHandlerWeb();

export default authHandlerWeb;
