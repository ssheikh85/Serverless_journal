import React, {useState} from 'react';
import {
  Modal,
  View,
  // StyleSheet,
  Button,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {
  UPDATE_ENTRY_M,
  GENERATE_URL_M,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export const EntryUpdaterM = (props: any) => {
  const {entryItem, modalVisibleProp} = props;
  const userId = entryItem.userId as string;
  const entryId = entryItem.entryId as string;

  const [modalVisible, setModalVisible] = useState(modalVisibleProp);
  const [file, setFile] = useState();
  const [inputContent, setInputContent] = useState({
    content: entryItem.content,
  });

  const [updateEntry] = useMutation(UPDATE_ENTRY_M);
  const [generateUploadUrl, {error}] = useMutation(GENERATE_URL_M);

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    if (Platform.OS === 'ios') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
          let file = result.uri as any;
          setFile(file);
        }
      }
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
                updateEntry({variables: {userId, entryId, inputContent}});
              }}></Button>

            <Text>Upload some content</Text>

            <Button title="Upload" onPress={() => handleFileUpload}></Button>

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
