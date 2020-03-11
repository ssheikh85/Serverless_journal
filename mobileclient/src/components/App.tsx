import React from 'react';
import {Platform} from 'react-native';
import NavbarWeb from '../components/NavbarWeb';

const App: React.FC<{}> = () => {
  if (Platform.OS === 'web') {
    return (
      <>
        <NavbarWeb />
      </>
    );
  } else {
  }
};

export default App;
