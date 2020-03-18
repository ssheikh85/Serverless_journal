import React from 'react';
import {Platform} from 'react-native';
import LoginWeb from '../web/LoginWeb';
import LoginMobile from '../mobile/LoginMobile';

const Root = () => {
  return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
};

export default Root;
