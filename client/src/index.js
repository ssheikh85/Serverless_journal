import React from 'react';
import ReactDOM from 'react-dom';
import App from './web/App';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from './web/authHandlerWeb';
import {authConfig} from './client_config';
import history from './history';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    client_id={authConfig.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}>
    >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
