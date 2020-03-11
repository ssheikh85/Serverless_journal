import Auth0Client from '@auth0/auth0-spa-js';
import {authConfig} from '../client_config';

class AuthWeb {
  constructor() {
    this.auth0 = new Auth0Client({
      domain: authConfig.domain,
      client_id: authConfig.clientId,
      redirect_uri: authConfig.callbackUrl,
    });
    this.authenticated = Boolean;
  }

  async handleLogin() {
    await this.auth0.loginWithRedirect();
    this.authenticated = await this.auth0.isAuthenticated();
  }

  async getUserFromRedirect() {
    await this.auth0.handleRedirectCallback();
    //logged in. you can get the user profile like this:
    return await this.auth0.getUser();
  }

  async isAuthenticated() {
    return this.authenticated;
  }

  async getAccessToken() {
    return await this.auth0.getTokenSilently();
  }

  logOut() {
    if (this.authenticated) {
      this.auth0.logout();
    }
  }
}

const authHandlerWeb = new AuthWeb();

export default authHandlerWeb;
