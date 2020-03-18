import React from 'react';
import {Platform} from 'react-native';
import LoginWeb from './LoginWeb';
import LoginMobile from './LoginMobile';

const Root = () => {
  return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
};

export default Root;
