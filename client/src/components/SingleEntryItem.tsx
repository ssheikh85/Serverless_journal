import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import {deleteSingleEntry} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import EntryUpdater from '../components/EntryUpdater';

const SingleEntryItem = (props: any) => {
  const {entryItem} = props;
  const modalVisibleProp = true;

  const handleUpdate = (entryItem: EntryInput) => {
    return (
      <EntryUpdater entryItem={entryItem} modalVisible={modalVisibleProp} />
    );
  };
  const handleDelete = async (userId: string, entryId: string) => {
    const {deleteEntry} = props;
    const deleteTheEntry = await deleteEntry(userId, entryId);
    try {
      if (!deleteTheEntry) {
        alert('An issue occurred deleting the entry');
      } else {
        await deleteTheEntry({
          variables: {userId, entryId},
        });
      }
    } catch (error) {
      alert('An issue occurred in deleting the entry: ' + error.message);
    }
  };

  return (
    <View style={styles.entry}>
      <Text style={styles.content}>{entryItem.content}</Text>
      <Button
        title="Delete"
        onPress={() => {
          handleDelete(entryItem.userId, entryItem.entryId);
        }}></Button>
      <Button
        title="Update"
        onPress={() => {
          handleUpdate(entryItem);
        }}></Button>
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
