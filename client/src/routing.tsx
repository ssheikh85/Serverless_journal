import React from 'react';
import Auth from './Auth/Auth';
import {Router, Route} from 'react-router-dom';
import App from './components/App';
import Loading from './components/Loading';
const createHistory = require('history').createBrowserHistory;
const history = createHistory();

const authHandler = new Auth(history);

const handleAuthentication = (props: any) => {
  const location = props.location;
  if (/access_token|id_token|error/.test(location.hash)) {
    authHandler.handleAuthentication();
  }
};

export const AuthRouting = () => {
  return (
    <Router history={history}>
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Loading />;
        }}
      />
      <Route
        render={props => {
          return <App auth={authHandler} {...props} />;
        }}
      />
    </Router>
  );
};
