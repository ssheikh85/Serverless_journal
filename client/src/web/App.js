import React, {useEffect} from 'react';
import {Route, withRouter} from 'react-router-dom';
import RootWeb from './RootWeb';
import Callback from './Callback';
import authHandlerWeb from './AuthHandlerWeb';

// Class developed from this tutorial
//https://auth0.com/blog/develop-modern-apps-with-react-graphql-apollo-and-add-authentication/
const App = props => {
  useEffect(() => {
    const authenticate = async () => {
      if (props.location.pathname === '/callback') return;
      try {
        await authHandlerWeb.silentAuth();
        this.forceUpdate();
      } catch (err) {
        if (err.error === 'login_required') return;
        console.log(err.error);
      }
    };
    authenticate();
  }, [props.location.pathname]);

  return (
    <>
      <Route exact path="/" component={RootWeb} />
      <Route exact path="/callback" component={Callback} />
    </>
  );
};

export default withRouter(App);
