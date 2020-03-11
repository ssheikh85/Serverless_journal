import createAuth0Client from '@auth0/auth0-spa-js';
import {authConfig} from '../../clients_config'

class AuthWeb{
    constructor(){
        this.auth0 = await createAuth0Client({
            domain: authConfig.domain,
            client_id: authConfig.clientId,
            redirect_uri: authConfig.callbackUrl
          });
    }

    async handleLogin(){
        await this.auth0.loginWithRedirect();
    }

    async getUserFromRedirect(){
        await this.auth0.handleRedirectCallback();
        //logged in. you can get the user profile like this:
        return await this.auth0.getUser();
        
    }

    async isAuthenticated(){
        return await this.auth0.isAuthenticated();
    }

    async getAccessToken(){
        return await this.auth0.getTokenSilently();
    }

    logOut(){
        this.auth0.logout();
    }
}

const authHandlerWeb = new AuthWeb();

export default authHandlerWeb;
