import React, {useState} from 'react';
import {Button, InputGroup, FormControl} from 'react-bootstrap';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, ADD_ENTRY_M} from '../graphql-api/entries_api';
import {SingleEntryItem} from './SingleEntryItemWeb';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

//List of entries
export const EntriesWeb = (props: any) => {
  const [userId, setUserId] = useState('');
  const [inputNewContent, setInputNewContent] = useState('');
  const {user} = props;

  const newContent = {
    content: inputNewContent,
  } as EntryInput;

  setUserId(user.sub);

  const {loading, data, error} = useQuery(GET_ENTRIES_Q, {
    variables: {userId},
  });
  if (loading) {
    return (
      <Card className="text-center">
        <Card.Header>Loading</Card.Header>
        <Card.Body>
          <Card.Title>Loading...</Card.Title>
        </Card.Body>
      </Card>
    );
  }
  if (error) {
    return alert('Error has occurred getting your entries');
  }

  const [createEntry] = useMutation(ADD_ENTRY_M);

  const handleNewInput = (event: any) => {
    setInputNewContent(event.target.value);
  };

  return (
    <div>
      <div>
        <h2>Add a new entry</h2>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Type here to create a new entry"
            aria-label="Type here to create a new entry"
            aria-describedby="basic-addon2"
            type="text"
            onChange={() => handleNewInput}
            value={inputNewContent}
          />
          <InputGroup.Append>
            <Button
              variant="primary"
              onClick={() => {
                createEntry({variables: {userId, newContent}});
              }}>
              >Add a new entry
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        <h2>Your Entries</h2>
        {!loading &&
          data.map((entry: EntryItem) => (
            <div key={entry.entryId}>
              <SingleEntryItem entryItem={entry} />
            </div>
          ))}
      </div>
    </div>
  );
};

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
