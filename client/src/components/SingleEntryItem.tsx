import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import {deleteSingleEntry} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';

const SingleEntryItem = ({entryItem: EntryItem}) => {
  return (
    <View style={styles.entry}>
      <Text style={styles.content}>{entryItem.content}</Text>
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  entry: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    fontSize: 20,
  },
});

//Map Dispatch to Props
const mapDispatch = (dispatch: any) => {
  return {
    deleteEntry: (userId: String, entryId: String) =>
      dispatch(deleteSingleEntry(userId, entryId)),
  };
};

export default connect(null, mapDispatch)(SingleEntryItem);
