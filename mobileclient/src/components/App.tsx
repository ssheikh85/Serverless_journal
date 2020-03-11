import React from 'react';
import {View, Platform} from 'react-native';
import NavbarWeb from '../components/NavbarWeb';

const App = () => {
  if (Platform.OS === 'web') {
    return (
      <div>
        <NavbarWeb />
      </div>
    );
  } else {
  }
};

export default App;
