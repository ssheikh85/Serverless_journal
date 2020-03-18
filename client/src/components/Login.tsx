import React from 'react';
import {Platform} from 'react-native';
import LoginWeb from './LoginWeb';
import LoginMobile from './LoginMobile';

export const Login = () => {
  return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
};
