import Auth0 from 'react-native-auth0';
import {authConfig} from '../client_config';

class AuthHandlerMobile {
  constructor() {
    this.authHandlerMobile = new Auth0({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
    });
    this.credentials;
  }

  async handleLogin() {
    try {
      return await this.authHandlerMobile.webAuth.authorize({
        scope: 'openid profile email',
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleLogout() {
    try {
      return await this.authHandlerMobile.webAuth.clearSession({});
    } catch (error) {
      console.error(error);
    }
  }

  getAccessToken() {
    return this.credentials.accessToken;
  }

  getIdToken() {
    return this.credentials.IdToken;
  }

  async getUserInfo(accessToken) {
    return await this.authHandlerMobile.auth.userInfo({
      token: accessToken,
    });
  }
}

const authHandlerMobile = new AuthHandlerMobile();

export default authHandlerMobile;
