import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {
  GET_ENTRIES_Q,
  UPDATE_ENTRY_M,
  uploadFileToS3,
} from '../graphql-api/entries_api';
import {EntryInput} from '../models_requests/EntryInput';
import {apiEndpoint} from '../client_config';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export const EntryUpdaterM = (props: any) => {
  const {entryItem, modalVisibleProp, idToken} = props;
  const userId = entryItem.userId as string;
  const entryId = entryItem.entryId as string;

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

  const handleUpdateInput = (text: string) => {
    setInputContent(text);
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

  //File Uploader function that handles files from web upload or mobile upload and
  //sends file to S3 presigned URL
  const handleUpload = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async () => {
    //Upload to presignedURL
    await handleUpload();
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

  const handleClose = () => setModalVisible(false);

  return (
    <View style={styles.modal}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => handleClose}>
        <View>
          <View>
            <Text style={styles.modalHeader}>
              Edit your entry or Upload some content
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type here to edit"
              value={inputContent}
              onChangeText={text => handleUpdateInput(text)}
            />
            <View style={styles.buttonGroup}>
              <Button title="Update" onPress={submitUpdatedInput}></Button>

              <Button title="Upload" onPress={handleFileUpload}></Button>

              <Button title="Close" onPress={handleClose}></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  modal: {
    marginTop: 200,
  },
  modalHeader: {
    color: 'white',
    backgroundColor: 'skyblue',
    fontSize: 24,
    marginTop: 100,
    height: 30,
  },
  textInput: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
    height: 40,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
});
