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
  View,
  Text,
} from 'react-native';
import {Router} from 'react-router-dom';
import Auth from '../Auth/Auth';

export interface AppProps {}

export interface AppProps {
  auth: Auth;
  history: any;
}
export interface AppState {}

declare var global: {HermesInternal: null | {}};

const App: React.FC<AppProps> = props => {
  const {auth, history} = props;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text>This is my app!</Text>
          </View>
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
