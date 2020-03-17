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
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {
  updateNewEntry,
  generateUrl,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';
const dataUriToBuffer = require('data-uri-to-buffer');

const EntryItemView = (props: any) => {
  const {entry} = props;
  const entryItem = entry as EntryItem;
  const userId = entryItem.userId as String;
  const entryId = entryItem.entryId as String;

  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(undefined);
  const [inputContent, setInputContent] = useState({
    content: entryItem.content,
  });

  const handleFileChangeWeb = (event: any) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    setFile(file);
  };

  const handleFileChangeMobile = () => {
    const options = {
      title: 'Select Image',
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
        setFile(dataUriToBuffer(response.uri));
      }
    });
  };

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

  const handleFileUpload = async (event: React.SyntheticEvent) => {
    event.preventDefault();

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

            <Text>Upload an Image</Text>
            {Platform.OS === 'web' ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Image to upload"
                  onChange={handleFileChangeWeb}
                />
              </>
            ) : (
              <Button
                title="Upload"
                onPress={() => {
                  handleFileChangeMobile;
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

      <Button
        title="Edit Item"
        onPress={() => {
          setModalVisible(!modalVisible);
        }}></Button>
    </View>
  );
};

//Map State to Props
const mapState = (state: any) => {
  return {
    entry: state.singleEntry as EntryItem,
  };
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

export default connect(mapState, mapDispatch)(EntryItemView);
