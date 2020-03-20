import React, {useState} from 'react';
import {Card, Button, InputGroup, FormControl} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, ADD_ENTRY_M} from '../graphql-api/entries_api';
import SingleEntryItemWeb from './SingleEntryItemWeb';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

//List of entries
const EntriesWeb = (props: any) => {
  const {userId} = props;
  const [inputNewContent, setInputNewContent] = useState('');
  const [entries, setEntries] = useState([]);
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

  const handleNewInput = (event: any) => {
    setInputNewContent(event.target.value);
  };

  const submitNewInput = async (event: any) => {
    event.preventDefault();
    createEntry({
      variables: {userId: userId, entryInput: newContent},
    });
    setInputNewContent('');
  };

  if (loading) {
    return (
      <Card className="text-center">
        <Card.Header>Loading</Card.Header>
        <Card.Body>
          <Card.Title>Loading...</Card.Title>
        </Card.Body>
      </Card>
    );
  } else if (error) {
    console.log(error);
  } else {
  }

  return (
    <div>
      <div>
        <h6>Add a new entry</h6>
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
              Add a new entry
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        <h6>Your Entries</h6>
        {!loading &&
          data.getEntries.map((entry: EntryItem) => {
            return (
              <div key={entry.entryId}>
                <SingleEntryItemWeb entryItem={entry} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default withRouter(EntriesWeb);
