import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  GET_ENTRIES_Q,
  ADD_ENTRY_M,
  DELETE_ENTRY_M,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import {EntryUpdaterM} from './EntryUpdaterM';
import {remove} from '../utils';

//List of entries
export const EntriesM = (props: any) => {
  const {userId, idToken} = props;
  const modalVisibleProp = true;
  const [inputNewContent, setInputNewContent] = useState('');
  const [clicked, setClicked] = useState(false);

  const newContent = {
    content: inputNewContent,
  } as EntryInput;

  const {loading, data, error} = useQuery(GET_ENTRIES_Q, {
    variables: {userId},
  });

  const [createEntry] = useMutation(ADD_ENTRY_M, {
    update(cache, {data: {createEntry}}) {
      try {
        const newData = cache.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: userId,
          },
        }) as any;
        newData.getEntries.push(createEntry);
        cache.writeQuery({
          query: GET_ENTRIES_Q,
          data: {getEntries: newData},
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const submitNewInput = async (event: any) => {
    event.preventDefault();
    createEntry({
      variables: {userId: userId, entryInput: newContent},
    });
    setInputNewContent('');
  };

  const [deleteEntry] = useMutation(DELETE_ENTRY_M, {
    update(cache, {data: {deleteEntry}}) {
      try {
        const newData = cache.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: userId,
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

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else if (error) {
    console.log(error);
  }
  return (
    <>
      <View>
        <Text>Add a new Entry</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to create a new entry"
          onChangeText={text => setInputNewContent(text)}
          value={inputNewContent}
        />
        <Button title="Add a new entry" onPress={submitNewInput}></Button>
      </View>
      <Text style={styles.header}>Your Entries</Text>
      <View style={styles.container}>
        {!loading &&
          data.getEntries.map((entryItem: EntryItem) => {
            return (
              <View style={styles.entry}>
                <Text style={styles.content}>{entryItem.content}</Text>
                <View style={styles.updateButton}>
                  <Button
                    title="Update"
                    onPress={() => {
                      setClicked(true);
                    }}></Button>
                </View>
                <View style={styles.deleteButton}>
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
                      idToken={idToken}
                      modalVisibleProp={modalVisibleProp}
                    />
                  )}
                </View>
                <View style={styles.image}>
                  {entryItem.attachmentUrl && (
                    <Image
                      source={{uri: entryItem.attachmentUrl}}
                      style={{width: 400, height: 400}}
                    />
                  )}
                </View>
              </View>
            );
          })}
      </View>
    </>
  );
};

//Styles
const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'left',
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontSize: 14,
    padding: 10,
    height: 100,
    width: 600,
  },
  content: {
    flex: 1,
    fontSize: 14,
    width: 300,
    marginRight: 50,
    padding: 10,
  },
  updateButton: {
    flex: 2,
    fontSize: 14,
  },
  deleteButton: {
    flex: 3,
    fontSize: 14,
    padding: 10,
  },
  image: {
    flex: 4,
  },
});
