import React from 'react';
import {Platform} from 'react-native';
import NavbarWeb from '../components/NavbarWeb';
import NavbarMobile from '../components/NavbarMobile';

const Root = () => {
  return Platform.OS === 'web' ? <NavbarWeb /> : <NavbarMobile />;
};

export default Root;
