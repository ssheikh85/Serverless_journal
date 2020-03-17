import React from 'react';
import {Platform} from 'react-native';
import LoginWeb from './LoginWeb';
import LoginMobile from './LoginMobile';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';
import {Entries} from '../components/Entries';
const {isAuthenticated} = useAuth0();
const authToken = authHandlerMobile.getAccessToken();

const Root = () => {
  if (isAuthenticated || authToken) {
    return <Entries />;
  }
  return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
};

export default Root;
