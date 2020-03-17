import React from 'react';
import {Platform} from 'react-native';
import LoginWeb from './LoginWeb';
import LoginMobile from './LoginMobile';
// import authHandlerMobile from '../auth/authHandlerMobile';
// import {useAuth0} from '../auth/authHandlerWeb';
import {Entries} from '../components/Entries';

const Root = () => {
  // const {isAuthenticated} = useAuth0();
  // const authToken = authHandlerMobile.getAccessToken();
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Entries />;
  }
  return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
};

export default Root;
