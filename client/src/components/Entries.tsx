import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Platform,
} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {GET_ENTRIES_Q} from '../graphql-api/entries_api';
import {SingleEntryItem} from '../components/SingleEntryItem';
import {AddEntry} from '../components/AddEntry';
import {EntryItem} from '../models_requests/EntryItem';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';

//List of entries
export const Entries = (props: any) => {
  const [userId, setUserId] = useState('');
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

  const {data, error} = useQuery(GET_ENTRIES_Q, {
    variables: {userId},
  });

  if (error) {
    alert(`An error has occurred ${error.message}`);
  } else {
    setEntries(data);
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <AddEntry userID={userId} />
          <Text style={styles.header}>Your Entries</Text>
          <FlatList
            data={entries as EntryItem[]}
            renderItem={({item}) => <SingleEntryItem content={item} />}
            keyExtractor={item => item.entryId}
          />
        </ScrollView>
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
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  header: {
    fontSize: 32,
    textAlign: 'left',
    margin: 10,
  },
});

// const usePrevious = (value: any) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };

// const prevValues = usePrevious(entries) as unknown;
// const prevEntries = prevValues as [];

// useEffect(() => {
//   if (entries.length !== prevEntries.length) {
//   }
// });
