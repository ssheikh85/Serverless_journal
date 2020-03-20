import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, ADD_ENTRY_M} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import {SingleEntryItemM} from '../mobile/SingleEntryItemM';

//List of entries
export const EntriesM = (props: any) => {
  const [inputNewContent, setInputNewContent] = useState('');
  const {userId} = props;
  const modalVisibleProp = true;

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
      {/* <View>
          <Text>Add a new Entry</Text>
          <TextInput
            style={{height: 40}}
            placeholder="Type here to create a new entry"
            value={inputNewContent}
            onChangeText={text => setInputNewContent(text)}
          />
          <Button title="Add a new entry" onPress={submitNewInput}></Button>
        </View> */}
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollView}>
          <Text style={styles.header}>Your Entries</Text>
          <FlatList
            data={data.getEntries}
            renderItem={({item}) => (
              <SingleEntryItemM
                entryItem={item}
                modalVisibleProp={modalVisibleProp}
              />
            )}
            keyExtractor={(entryItem: EntryItem) => entryItem.entryId}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 3,
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  header: {
    fontSize: 32,
    textAlign: 'left',
    margin: 10,
  },
});
