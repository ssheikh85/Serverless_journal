import Auth0 from 'react-native-auth0';
import {authConfig} from '../client_config';

class AuthHandlerMobile {
  constructor() {
    this.authHandlerMobile = new Auth0({
      domain: authConfig.domain,
      clientId: authConfig.clientId,
    });
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
}

const authHandlerMobile = new AuthHandlerMobile();

export default authHandlerMobile;
