import React, {useState} from 'react';
import {Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import {useMutation} from '@apollo/react-hooks';
import {
  GET_ENTRIES_Q,
  UPDATE_ENTRY_M,
  GENERATE_URL_M,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import {EntryInput} from '../models_requests/EntryInput';

export const EntryUpdater = (props: any) => {
  const {entryItem, modalVisibleProp} = props;
  const userId = entryItem.userId as string;
  const entryId = entryItem.entryId as string;

  const [modalVisible, setModalVisible] = useState(modalVisibleProp);
  const [file, setFile] = useState();
  const [inputContent, setInputContent] = useState(entryItem.content);

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
          data: newEntries,
        });
      } catch (error) {
        console.error(error);
      }
    },
  });
  const [generateUploadUrl, {error}] = useMutation(GENERATE_URL_M);

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleFileUpload = async (event: any) => {
    //Upload to presignedURL
    event.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    console.log(file);

    try {
      let presignedUrl = '';
      if (error) {
        alert(`An error has occurred ${error.message}`);
      } else {
        presignedUrl = (await generateUploadUrl({
          variables: {userId, entryId},
        })) as string;
      }
      const fileToUpload = file as any;
      let body = new FormData();
      body.append('file', fileToUpload);
      await uploadFileToS3(presignedUrl, fileToUpload);
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
