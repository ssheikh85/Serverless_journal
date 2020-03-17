import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {getEntries, createNewEntry} from '../graphql-api/entries_api';
import SingleEntryItem from '../components/SingleEntryItem';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';

//List of entries
const Entries = (props: any) => {
  const {entries, entry} = props;
  const [userId, setUserId] = useState(null);

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

  const handleNewEntry = (newEntry: EntryInput) => {};
  return (
    <></>
    // <>
    //   <SafeAreaView style={styles.container}>
    //     <Text style={styles.header}></Text>
    //     <FlatList
    //       data={entries as EntryItem[]}
    //       renderItem={({item}) => <Entry content={item.content} />}
    //       keyExtractor={item => item.entryId}
    //     />
    //   </SafeAreaView>
    // </>
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
