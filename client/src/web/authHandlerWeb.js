import auth0 from 'auth0-js';
import {authConfig} from '../client_config';

class AuthHandlerWeb {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: authConfig.domain,
      clientID: authConfig.clientId,
      redirectUri: authConfig.callbackUrl,
      audience: `https://${authConfig.domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid email profile',
    });

    this.accessToken = '';
    this.idToken = '';
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  getIdToken() {
    return this.idToken;
  }

  getAccesstoken() {
    return this.accessToken;
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    });
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.accessToken = authResult.accessToken;
    console.log('Access token is:', this.accessToken);
    console.log('Id token is:', this.idToken);
    localStorage.setItem('isLoggedIn', true);
    // set the time that the id token will expire at
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
  }

  getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, (err, user) => {
        if (err) {
          return reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  logout() {
    this.auth0.logout({
      returnTo: window.location.origin,
      clientID: authConfig.clientId,
    });
    localStorage.setItem('isLoggedIn', false);
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the token's expiry time
    return new Date().getTime() < this.expiresAt;
  }
}

const authHandlerWeb = new AuthHandlerWeb();

export default authHandlerWeb;
