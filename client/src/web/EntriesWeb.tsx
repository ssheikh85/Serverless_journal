import React, {useState} from 'react';
import {Card} from 'react-bootstrap';
import {useQuery} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, ADD_ENTRY_M} from '../graphql-api/entries_api';
import {SingleEntryItem} from './SingleEntryItemWeb';
import {EntryItem} from '../models_requests/EntryItem';
import {AddEntryWeb} from './AddEntryWeb';

//List of entries
export const EntriesWeb = (props: any) => {
  const [userId, setUserId] = useState('');
  const {user} = props;

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

  return (
    <>
      <div>{/* <AddEntryWeb userId={userId} /> */}</div>
      <div>
        <h2>Your Entries</h2>
        {!loading &&
          data.map((entry: EntryItem) => (
            <>
              key={entry.entryId}>
              <SingleEntryItem entryItem={entry} />
            </>
          ))}
      </div>
    </>
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
