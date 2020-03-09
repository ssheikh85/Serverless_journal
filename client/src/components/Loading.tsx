import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.container}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
});
export default Loading;
