import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {
  updateNewEntry,
  generateUrl,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
import Dropzone from 'react-dropzone';
import ImagePicker from 'react-native-image-picker';

const EntryUpdater = (props: any) => {
  const {userId, entryId, entryItem, modalVisibleProp} = props;

  const [modalVisible, setModalVisible] = useState(modalVisibleProp);
  const [file, setFile] = useState();
  const [inputContent, setInputContent] = useState({
    content: entryItem.content,
  });

  //Handle Update
  const handleContentUpdate = async (inputContent: EntryInput) => {
    try {
      const {updateEntry} = props;
      const updateTheEntry = await updateEntry(userId, entryId, inputContent);

      if (!updateTheEntry) {
        alert('An issue occurred updating the entry');
      } else {
        await updateTheEntry({
          variables: {userId, entryId, inputContent},
        });
      }
    } catch (error) {
      alert('An issue occurred in updating the entry: ' + error.message);
    }
  };

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleFileUpload = async (files: any) => {
    if (Platform.OS === 'web') {
      //web upload
      if (!files) return;

      const file = files[0];
      setFile(file);
    } else {
      //mobile upload
      const options = {
        title: 'Select your content',
      };

      ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const file = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          } as any;
          setFile(file);
        }
      });
    }

    //Upload to presignedURL
    try {
      if (!file) {
        alert('Please select a file');
        return;
      }
      const {generateUrl} = props;

      const uploadUrl = await generateUrl(userId, entryId);

      if (!uploadUrl) {
        alert('Upload Url is undefined');
      } else {
        const presignedUrl = (await uploadUrl({
          variables: {userId, entryId},
        })) as string;
        const fileType = file as unknown;
        const fileToUpload = fileType as Buffer;
        await uploadFileToS3(presignedUrl, fileToUpload);
        alert('File was uploaded!');
      }
    } catch (e) {
      alert('Could not upload a file: ' + e.message);
    }
  };

  return (
    <View style={{marginTop: 22}}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={{marginTop: 22}}>
          <View>
            <TextInput
              style={{height: 40}}
              placeholder="Type here to edit"
              onChangeText={text => setInputContent({content: text})}
              value={inputContent.content}
            />

            <Button
              title="Update"
              onPress={() => {
                handleContentUpdate(inputContent);
              }}></Button>

            <Text>Upload some content</Text>

            {Platform.OS === 'web' ? (
              <Dropzone onDrop={handleFileUpload}>
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                )}
              </Dropzone>
            ) : (
              <Button
                title="Upload"
                onPress={() => {
                  handleFileUpload;
                }}></Button>
            )}

            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//Map Dispatch to Props
const mapDispatch = (dispatch: any) => {
  return {
    generateUrl: (userId: String, entryId: String) =>
      dispatch(generateUrl(userId, entryId)),
    updateEntry: (userId: String, entryId: String, newEntry: EntryInput) =>
      dispatch(updateNewEntry(userId, entryId, newEntry)),
  };
};

export default connect(null, mapDispatch)(EntryUpdater);
