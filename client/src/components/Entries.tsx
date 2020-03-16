import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, StyleSheet, Text, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {
  getEntries,
  createNewEntry,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

//List of entries
const Entries = (props: any) => {
  const {entries, entry} = props;

  return (
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
  entry: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    fontSize: 20,
  },
});

//Map State to Props
const mapState = (state: any) => {
  return {
    entries: state.allEntries,
    entry: state.singleEntry,
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
