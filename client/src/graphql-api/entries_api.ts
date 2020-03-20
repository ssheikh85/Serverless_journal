import gql from 'graphql-tag';

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

//Upload File
export async function uploadFileToS3(
  uploadUrl: string,
  file: any,
): Promise<void> {
  try {
    await fetch(uploadUrl, {
      method: 'PUT',
      mode: 'cors',
      body: file,
    });
  } catch (error) {
    console.error(error);
  }
}
