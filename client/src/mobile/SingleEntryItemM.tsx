import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Image} from 'react-native';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import {EntryUpdaterM} from './EntryUpdaterM';
import {useMutation} from '@apollo/react-hooks';
import {DELETE_ENTRY_M, GET_ENTRIES_Q} from '../graphql-api/entries_api';
import {remove} from '../utils';

export const SingleEntryItemM = (props: any) => {
  const {entryItem} = props;
  const modalVisibleProp = true;

  const [clicked, setClicked] = useState(false);

  const [deleteEntry] = useMutation(DELETE_ENTRY_M, {
    update(cache, {data: {deleteEntry}}) {
      try {
        const newData = cache.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: entryItem.userId,
          },
        }) as any;
        cache.writeQuery({
          query: GET_ENTRIES_Q,
          data: {
            getEntries: remove(newData.getEntries, deleteEntry),
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <View style={styles.entry}>
      <Text style={styles.content}>{entryItem.content}</Text>
      <Button
        title="Update"
        onPress={() => {
          setClicked(true);
        }}></Button>
      <Button
        title="Delete"
        onPress={() => {
          deleteEntry({
            variables: {
              userId: entryItem.userId,
              entryId: entryItem.entryId,
            },
          });
        }}></Button>
      {clicked && (
        <EntryUpdaterM
          entryItem={entryItem}
          modalVisibleProp={modalVisibleProp}
        />
      )}
      <Image
        source={{uri: entryItem.attachmentUrl}}
        style={{width: 400, height: 400}}
      />
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
