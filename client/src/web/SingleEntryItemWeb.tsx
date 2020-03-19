import React, {useState} from 'react';
import {Button, Container, Row, Col} from 'react-bootstrap';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryUpdater} from './EntryUpdaterWeb';
import {useMutation} from '@apollo/react-hooks';
import {GET_ENTRIES_Q, DELETE_ENTRY_M} from '../graphql-api/entries_api';

export const SingleEntryItem = (props: any) => {
  const {entryItem} = props;
  const {userId, entryId} = entryItem as EntryItem;
  const modalVisibleProp = true;
  const [clicked, setClicked] = useState(false);

  const [deleteEntry] = useMutation(DELETE_ENTRY_M, {
    update(client, {data: {deleteEntry}}) {
      try {
        const newData = client.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: userId,
          },
        }) as any;
        newData.getEntries.pop(deleteEntry);
        client.writeQuery({
          query: GET_ENTRIES_Q,
          data: newData,
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleDelete = async (event: any) => {
    event.preventDefault();
    deleteEntry({variables: {userId: userId, entryId: entryId}});
  };

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="auto">
            {entryItem.content}
          </Col>
          <Col xs lg="2">
            <Button
              variant="primary"
              onClick={() => {
                setClicked(true);
              }}>
              Update
            </Button>
          </Col>
          <Col xs lg="2">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Col>
          <>
            {clicked && (
              <EntryUpdater
                entryItem={entryItem}
                modalVisibleProp={modalVisibleProp}
              />
            )}
          </>
        </Row>
        <Row>
          <Col>
            {entryItem.attachmentUrl && (
              <img
                src={entryItem.attachmentUrl}
                width="400"
                height="300"
                alt=""
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
