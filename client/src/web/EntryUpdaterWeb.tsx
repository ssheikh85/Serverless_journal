import React, {useState, useEffect} from 'react';
import {Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import {
  GET_ENTRIES_Q,
  UPDATE_ENTRY_M,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import {EntryInput} from '../models_requests/EntryInput';
import authHandlerWeb from './AuthHandlerWeb';
import {apiEndpoint} from '../client_config';

const EntryUpdaterWeb = (props: any) => {
  const {entryItem, modalVisibleProp} = props;
  const userId = entryItem.userId as string;
  const entryId = entryItem.entryId as string;

  const idToken = authHandlerWeb.getIdToken();

  const [modalVisible, setModalVisible] = useState(modalVisibleProp);
  const [file, setFile] = useState();
  const [inputContent, setInputContent] = useState(entryItem.content);
  const [uploadUrl, setUploadUrl] = useState('');

  const updatedContent = {
    content: inputContent,
  } as EntryInput;

  const [updateEntry] = useMutation(UPDATE_ENTRY_M, {
    update(client, {data: {updateEntry}}) {
      try {
        const newData = client.readQuery({
          query: GET_ENTRIES_Q,
          variables: {
            userId: userId,
          },
        }) as any;
        const newEntries = newData.getEntries.map((item: any) => {
          if (item.entryId === updateEntry.entryId) {
            item.content = updateEntry.content;
          }
          return item;
        });
        client.writeQuery({
          query: GET_ENTRIES_Q,
          data: {getEntries: newEntries},
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    const getUploadUrl = async () => {
      try {
        const response = (await fetch(
          `${apiEndpoint}/entries/${entryId}/attachment`,
          {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          },
        )) as any;
        const returnedData = await response.json();
        setUploadUrl(returnedData.uploadUrl);
      } catch (error) {
        console.error(error);
      }
    };
    getUploadUrl();
  }, [entryId, idToken]);

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleFileUpload = async (event: any) => {
    //Upload to presignedURL
    event.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    try {
      await uploadFileToS3(uploadUrl, file);
      alert('File was uploaded!');
    } catch (e) {
      alert('Could not upload a file: ' + e.message);
    }
  };

  const handleUpdateInput = (event: any) => {
    setInputContent(event.target.value);
  };

  const submitUpdatedInput = async (event: any) => {
    event.preventDefault();
    updateEntry({
      variables: {
        userId: userId,
        entryId: entryId,
        entryInput: updatedContent,
      },
    });
    setInputContent('');
  };

  const handleUpload = (event: any) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files) return;

    setFile(files[0]);
  };

  const handleClose = () => setModalVisible(false);

  return (
    <div>
      <Modal show={modalVisible} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit your entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Type here to create a new entry"
              aria-label="Type here to create a new entry"
              aria-describedby="basic-addon2"
              type="text"
              value={inputContent}
              onChange={handleUpdateInput}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Type here to create a new entry"
              aria-label="Type here to create a new entry"
              aria-describedby="basic-addon2"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitUpdatedInput}>
            Update
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default withRouter(EntryUpdaterWeb);
