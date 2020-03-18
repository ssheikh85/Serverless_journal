import React from 'react';
import {Button} from 'react-bootstrap';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import {EntryUpdater} from './EntryUpdaterWeb';
import {useMutation} from '@apollo/react-hooks';
import {DELETE_ENTRY_M} from '../graphql-api/entries_api';

export const SingleEntryItem = (props: any) => {
  const {entryItem} = props;
  const modalVisibleProp = true;

  const handleUpdate = (entryItem: EntryInput) => {
    return (
      <EntryUpdater entryItem={entryItem} modalVisible={modalVisibleProp} />
    );
  };

  const [deleteEntry] = useMutation(DELETE_ENTRY_M);

  const {userId, entryId} = entryItem as EntryItem;

  return (
    <div>
      <h3>{entryItem.content}</h3>
      <img src={entryItem.attachmentUrl} width="400" height="300" />
      <Button
        variant="primary"
        onClick={() => {
          handleUpdate(entryItem);
        }}>
        Update
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          deleteEntry({variables: {userId, entryId}});
        }}>
        Delete
      </Button>
    </div>
  );
};
