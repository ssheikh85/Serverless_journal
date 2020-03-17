import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {ADD_ENTRY_M} from '../graphql-api/entries_api';

//Component to add an entry
export const AddEntry = (props: any) => {
  const [inputNewContent, setInputNewContent] = useState({
    content: '',
  });
  const {userId} = props;

  const [createEntry] = useMutation(ADD_ENTRY_M);
  return (
    <View>
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
    </View>
  );
};
