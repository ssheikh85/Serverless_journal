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
import {connect} from 'react-redux';
import {getEntries, createNewEntry} from '../graphql-api/entries_api';
import SingleEntryItem from '../components/SingleEntryItem';
import {EntryItem} from '../models_requests/EntryItem';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';
import {EntryInput} from 'src/models_requests/EntryInput';

//List of entries
const Entries = (props: any) => {
  const {entries} = props;
  const [userId, setUserId] = useState('');
  const [inputNewContent, setInputNewContent] = useState({
    content: '',
  });

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
      props.getEntries(userId);
    }
    props.getEntries(userId);
  });

  const handleNewEntry = async (userId: string, newEntry: EntryInput) => {
    const {addEntry} = props;
    const addTheEntry = await addEntry(userId, newEntry);
    try {
      if (!addTheEntry) {
        alert('An issue occurred adding the entry');
      } else {
        await addTheEntry({
          variables: {userId, newEntry},
        });
      }
    } catch (error) {
      alert('An issue occurred in adding the entry: ' + error.message);
    }
  };
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
            handleNewEntry(userId, inputNewContent);
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

//Map State to Props
const mapState = (state: any) => {
  return {
    entries: state.allEntries,
  };
};

//Map Dispatch to Props
const mapDispatch = (dispatch: any) => {
  return {
    getAllEntries: (userId: String) => dispatch(getEntries(userId)),
    addEntry: (userId: String, newEntry: EntryInput) =>
      dispatch(createNewEntry(userId, newEntry)),
  };
};

export default connect(mapState, mapDispatch)(Entries);
