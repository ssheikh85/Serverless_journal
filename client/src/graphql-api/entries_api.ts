import gql from 'graphql-tag';
import axios from 'axios';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

//Query
export const GET_ENTRIES_Q = gql`
  query getEntries($userId: String) {
    getEntries(userId: $userId) {
      userId
      entryId
      createdAt
      content
      attachmentUrl
    }
  }
`;

//Mutations
export const ADD_ENTRY_M = gql`
  mutation createEntry($userId: String, $entryInput: EntryInput) {
    createEntry(userId: $userId, entryInput: $entryInput) {
      userId
      entryId
      createdAt
      content
      attachmentUrl
    }
  }
`;

export const UPDATE_ENTRY_M = gql`
  mutation updateEntry(
    $entryInput: EntryInput
    $userId: String
    $entryId: String
  ) {
    updateEntry(entryInput: $entryInput, userId: $userId, entryId: $entryId) {
      userId
      entryId
      createdAt
      content
      attachmentUrl
    }
  }
`;

export const DELETE_ENTRY_M = gql`
  mutation deleteEntry($userId: String, $entryId: String) {
    deleteEntry(userId: $userId, entryId: $entryId) {
      userId
      entryId
      createdAt
      content
      attachmentUrl
    }
  }
`;

export const GENERATE_URL_M = gql`
  mutation generateUploadUrl($userId: String, $entryId: String) {
    generateUploadUrl(userId: $userId, entryId: $entryId)
  }
`;

//Upload File
export async function uploadFileToS3(
  uploadUrl: string,
  file: Buffer,
): Promise<void> {
  await axios.put(uploadUrl, file);
}
