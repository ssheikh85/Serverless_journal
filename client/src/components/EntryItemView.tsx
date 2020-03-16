import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  updateNewEntry,
  deleteSingleEntry,
  generateUrl,
  uploadFile,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

const EntryItemView = (props: any) => {
  const {entries, entry} = props;
  return();
};

//Map State to Props
const mapState = (state: any) => {
  return {
    entry: state.singleEntry,
  };
};

//Map Dispatch to Props
const mapDispatch = (dispatch: any) => {
  return {
    deleteEntry: (userId: String, entryId: String) =>
      dispatch(deleteSingleEntry(userId, entryId)),
    updateEntry: (userId: String, entryId: String, newEntry: EntryInput) =>
      dispatch(updateNewEntry(userId, entryId, newEntry)),
    generateUrl: (userId: String, entryId: String) =>
      dispatch(generateUrl(userId, entryId)),
  };
};

export default connect(mapState, mapDispatch)(EntryItemView);
