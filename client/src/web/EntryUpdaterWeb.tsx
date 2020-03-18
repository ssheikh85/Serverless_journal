import React, {useState} from 'react';
import {Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import {useMutation} from '@apollo/react-hooks';
import {
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

  const [updateEntry] = useMutation(UPDATE_ENTRY_M);
  const [generateUploadUrl, {error}] = useMutation(GENERATE_URL_M);

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleFileUpload = async (event: any) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files) return;

    setFile(files[0]);
    if (!file) {
      alert('Please select a file');
      return;
    }

    //Upload to presignedURL
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
      await uploadFileToS3(presignedUrl, fileToUpload);
      alert('File was uploaded!');
    } catch (e) {
      alert('Could not upload a file: ' + e.message);
    }
  };

  const handleUpdateInput = (event: any) => {
    setInputContent(event.target.value);
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
              onChange={() => handleUpdateInput}
              value={inputContent}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Type here to create a new entry"
              aria-label="Type here to create a new entry"
              aria-describedby="basic-addon2"
              type="image"
              value={file}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              updateEntry({variables: {userId, entryId, updatedContent}});
            }}>
            Update
          </Button>
          <Button variant="primary" onClick={() => handleFileUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
