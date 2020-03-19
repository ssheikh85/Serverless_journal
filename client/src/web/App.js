import React, {useEffect} from 'react';
import {Route, withRouter} from 'react-router-dom';
import RootWeb from './RootWeb';
import Callback from './Callback';
import authHandlerWeb from './AuthHandlerWeb';

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
    <div>
      <Route exact path="/" component={RootWeb}></Route>
      <Route exact path="/callback" component={Callback}></Route>
    </div>
  );
};

export default withRouter(App);
