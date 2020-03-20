import React, {useState} from 'react';
import {
  Card,
  Button,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  GET_ENTRIES_Q,
  ADD_ENTRY_M,
  DELETE_ENTRY_M,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import EntryUpdaterWeb from './EntryUpdaterWeb';
import {remove} from '../utils';

//List of entries, Adds and Deletes Entries as well
const EntriesWeb = (props: any) => {
  const [inputNewContent, setInputNewContent] = useState('');
  const [clicked, setClicked] = useState(false);

  const {userId} = props;
  const modalVisibleProp = true;
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

  const [deleteEntry] = useMutation(DELETE_ENTRY_M, {
    update(cache, {data: {deleteEntry}}) {
      try {
        const newData = cache.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: userId,
          },
        }) as any;
        cache.writeQuery({
          query: GET_ENTRIES_Q,
          data: {
            getEntries: remove(newData.getEntries, deleteEntry),
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
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
                <Container>
                  <Row className="justify-content-md-center">
                    <Col xs lg="auto">
                      {entry.content}
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
                      <Button
                        variant="danger"
                        onClick={(e: any) => {
                          e.preventDefault();
                          deleteEntry({
                            variables: {userId: userId, entryId: entry.entryId},
                          });
                        }}>
                        Delete
                      </Button>
                    </Col>
                    <>
                      {clicked && (
                        <EntryUpdaterWeb
                          entryItem={entry}
                          modalVisibleProp={modalVisibleProp}
                        />
                      )}
                    </>
                  </Row>
                  <Row>
                    <Col>
                      {entry.attachmentUrl && (
                        <img
                          src={entry.attachmentUrl}
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
          })}
      </div>
    </div>
  );
};

export default withRouter(EntriesWeb);
