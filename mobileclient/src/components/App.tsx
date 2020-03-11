import React, {Component} from 'react';
import {Platform} from 'react-native';
import NavbarWeb from '../components/NavbarWeb';

export default class App extends Component {
  render() {
    if (Platform.OS === 'web') {
      return (
        <>
          <NavbarWeb />
        </>
      );
    } else {
    }
  }
}
