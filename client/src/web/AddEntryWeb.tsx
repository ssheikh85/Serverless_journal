import React, {useState} from 'react';
import {Button, InputGroup, FormControl} from 'react-bootstrap';
import {useMutation} from '@apollo/react-hooks';
import {ADD_ENTRY_M} from '../graphql-api/entries_api';
import {EntryInput} from '../models_requests/EntryInput';

//Add an entry
const AddEntryWeb = (props: any) => {
  const {userId} = props;
  const [inputNewContent, setInputNewContent] = useState('');
  const newContent = {
    content: inputNewContent,
  } as EntryInput;

  const handleNewInput = (event: any) => {
    setInputNewContent(event.target.value);
  };

  const [createEntry] = useMutation(ADD_ENTRY_M);

  const submitNewInput = async (event: any) => {
    event.preventDefault();
    createEntry({
      variables: {userId: userId, entryInput: newContent},
    });
    setInputNewContent('');
  };

  return (
    <div>
      <h4>Add a new entry</h4>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Type here to create a new entry"
          aria-label="Type here to create a new entry"
          aria-describedby="basic-addon2"
          type="text"
          value={inputNewContent}
          onChange={handleNewInput}
        />
        <InputGroup.Append>
          <Button variant="primary" onClick={submitNewInput}>
            >Add a new entry
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default AddEntryWeb;
