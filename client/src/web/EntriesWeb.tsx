import React from 'react';
import {Card} from 'react-bootstrap';
import {useQuery} from '@apollo/react-hooks';
import {GET_ENTRIES_Q} from '../graphql-api/entries_api';
import {SingleEntryItem} from './SingleEntryItemWeb';
import {EntryItem} from '../models_requests/EntryItem';
import AddEntryWeb from './AddEntryWeb';

//List of entries
const EntriesWeb = (userId: string) => {
  console.log(userId);
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
    console.log(error);
    return alert('Error has occurred getting your entries');
  }

  return (
    <div>
      <div>
        <AddEntryWeb userId={userId} />
      </div>
      <div>
        <h2>Your Entries</h2>
        {!loading &&
          data.map((entry: EntryItem) => {
            return (
              <div key={entry.entryId}>
                <SingleEntryItem entryItem={entry} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default EntriesWeb;

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
