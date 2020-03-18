import React, { useEffect } from 'react';
import {Route, withRouter} from 'react-router-dom';
import RootWeb from './RootWeb';
import Callback from './Callback';
import authHandlerWeb from './AuthHandlerWeb'

const App = () => {
  useEffect(()=>{
    if (this.props.location.pathname === '/callback') return;
    try {
      await authHandlerWeb.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
  },[])
  
  return (
    <>
      <Route exact path="/" component={RootWeb} />
      <Route exact path="/callback" component={Callback} />
    </>
  );
};

export default withRouter(App);
