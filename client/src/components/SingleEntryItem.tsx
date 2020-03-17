import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import {EntryUpdater} from '../components/EntryUpdater';
import {useMutation} from '@apollo/react-hooks';
import {DELETE_ENTRY_M} from '../graphql-api/entries_api';

export const SingleEntryItem = (props: any) => {
  const {entryItem} = props;
  const modalVisibleProp = true;

  const handleUpdate = (entryItem: EntryInput) => {
    return (
      <EntryUpdater entryItem={entryItem} modalVisible={modalVisibleProp} />
    );
  };
  const handleDelete = async (userId: string, entryId: string) => {
    const [deleteEntry, {data, error}] = useMutation(DELETE_ENTRY_M, {
      variables: {userId, entryId},
    });
    if (error) {
      alert(`An error has occurred ${error.message}`);
    } else {
      await deleteEntry({variables: {userId, entryId}});
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
