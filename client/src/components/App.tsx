/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  // StyleSheet,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';
import {Router} from 'react-router-dom';
import Auth from '../Auth/Auth';

export interface AppProps {}

export interface AppProps {
  auth: Auth;
  history: any;
}

declare var global: {HermesInternal: null | {}};

const App: React.SFC<AppProps> = props => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Router history={props.history}>
            {props.auth.isAuthenticated ? (
              <Button title="Logout" onPress={() => props.auth.login}>
                Log Out
              </Button>
            ) : (
              <Button title="Login" onPress={() => props.auth.logout}>
                Log In
              </Button>
            )}
          </Router>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 10,
//     marginHorizontal: 16,
//   },
//   title: {
//     textAlign: 'center',
//     marginVertical: 8,
//   },
//   fixToText: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   separator: {
//     marginVertical: 8,
//     borderBottomColor: '#737373',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
// });

export default App;
