import React, {Component} from 'react';
import {Platform} from 'react-native';
import NavbarWeb from '../components/NavbarWeb';
import NavbarMobile from '../components/NavbarMobile';

export default class App extends Component {
  render() {
    if (Platform.OS === 'web') {
      return (
        <>
          <NavbarWeb />
        </>
      );
    } else {
      return (
        <>
          <NavbarMobile />
        </>
      );
    }
  }
}
