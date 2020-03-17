import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  Button,
  Platform,
} from 'react-native';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, ADD_ENTRY_M} from '../graphql-api/entries_api';
import {SingleEntryItem} from '../components/SingleEntryItem';
import {EntryItem} from '../models_requests/EntryItem';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';

//List of entries
export const Entries = (props: any) => {
  const [userId, setUserId] = useState('');
  const [inputNewContent, setInputNewContent] = useState({
    content: '',
  });
  const [entries, setEntries] = useState([]);

  const {user} = useAuth0();

  const getUserId = async () => {
    try {
      const accessToken = await authHandlerMobile.getAccessToken();
      const user = await authHandlerMobile.getUserInfo(accessToken);
      setUserId(user.sub);
    } catch (error) {
      console.error(error);
    }
  };

  const userIdWeb = user.sub;

  if (Platform.OS === 'web') {
    setUserId(userIdWeb);
  } else {
    getUserId();
  }

  const setEntrieesFromServer = (userId: string) => {
    const {data, error} = useQuery(GET_ENTRIES_Q, {
      variables: {userId},
    });
    if (error) {
      alert(`An error has occurred ${error.message}`);
    }
    setEntries(data);
  };

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  useEffect(() => {
    const prevValues = usePrevious(entries) as unknown;
    const prevEntries = prevValues as [];

    if (entries.length !== prevEntries.length) {
      setEntrieesFromServer(userId);
    }
    setEntrieesFromServer(userId);
  });

  const [createEntry, {data}] = useMutation(ADD_ENTRY_M);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Your Entries</Text>
        <Text>Add a new Entry</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to create a new entry"
          onChangeText={text => setInputNewContent({content: text})}
          value={inputNewContent.content}
        />

        <Button
          title="Add a new entry"
          onPress={() => {
            createEntry({variables: {userId, inputNewContent}});
          }}></Button>
        <FlatList
          data={entries as EntryItem[]}
          renderItem={({item}) => <SingleEntryItem content={item} />}
          keyExtractor={item => item.entryId}
        />
      </SafeAreaView>
    </>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 32,
    textAlign: 'left',
    margin: 10,
  },
});
