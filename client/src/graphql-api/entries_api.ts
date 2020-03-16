import gql from 'graphql-tag';
import {useQuery, useMutation} from '@apollo/react-hooks';
import axios from 'axios';
import {EntryItem} from '../models_requests/EntryItem';
import {EntryInput} from '../models_requests/EntryInput';

//Application state variable
const initialState = {
  allEntries: [],
  singleEntry: {},
};

//Action Creators
const GET_ENTRIES = 'GET_ENTRIES';
const ADD_ENTRY = 'ADD_ENTRY';
const UPDATE_ENTRY = 'UPDATE_ENTRY';
const DELETE_ENTRY = 'DELETE_ENTRY';

const setEntries = (entries: EntryItem[]) => ({
  type: GET_ENTRIES,
  entries,
});
const addNewEntry = (newEntry: EntryInput) => ({
  type: ADD_ENTRY,
});
const updateEntry = (entryId: String, newEntry: EntryInput) => ({
  type: UPDATE_ENTRY,
  entryId,
  newEntry,
});

const deleteEntry = (entryId: String, newEntry: EntryInput) => ({
  type: DELETE_ENTRY,
  entryId,
  newEntry,
});

//Query
const GET_ENTRIES_Q = gql`
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
const ADD_ENTRY_M = gql`
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

const UPDATE_ENTRY_M = gql`
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

const DELETE_ENTRY_M = gql`
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

const GENERATE_URL_M = gql`
  mutation generateUploadUrl($userId: String, $entryId: String) {
    generateUploadUrl(userId: $userId, entryId: $entryId)
  }
`;

//thunks
export const getEntries = (userId: String) => {
  return async (dispatch: any) => {
    try {
      const {data, error} = useQuery(GET_ENTRIES_Q, {
        variables: {userId},
      });
      if (error) {
        alert(`An error has occurred ${error.message}`);
      }
      dispatch(setEntries(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const createNewEntry = (userId: String, newEntry: EntryInput) => {
  return async (dispatch: any) => {
    try {
      const [createEntry, {data, error}] = useMutation(ADD_ENTRY_M, {
        variables: {userId, newEntry},
      });
      if (error) {
        alert(`An error has occurred ${error.message}`);
      } else {
        return createEntry;
      }
      dispatch(addNewEntry(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateNewEntry = (
  userId: String,
  entryId: String,
  newEntry: EntryInput,
) => {
  return async (dispatch: any) => {
    try {
      const [updateEntry, {data, error}] = useMutation(UPDATE_ENTRY_M, {
        variables: {userId, entryId, newEntry},
      });
      if (error) {
        alert(`An error has occurred ${error.message}`);
      } else {
        return updateEntry;
      }
      dispatch(updateEntry(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteSingleEntry = (userId: String, entryId: String) => {
  return async (dispatch: any) => {
    try {
      const [deleteEntry, {data, error}] = useMutation(DELETE_ENTRY_M, {
        variables: {userId, entryId},
      });
      if (error) {
        alert(`An error has occurred ${error.message}`);
      } else {
        return deleteEntry;
      }
    } catch (error) {
      console.error(error);
    }
  };
};

//Upload File
export const generateUrl = (userId: String, entryId: String) => {
  try {
    const [generateUploadUrl, {data, error}] = useMutation(GENERATE_URL_M, {
      variables: {userId, entryId},
    });
    if (error) {
      alert(`An error has occurred ${error.message}`);
    } else {
      return generateUploadUrl;
    }
  } catch (error) {
    console.error(error);
  }
};

export async function uploadFile(
  uploadUrl: string,
  file: Buffer,
): Promise<void> {
  await axios.put(uploadUrl, file);
}

//Reducer
export default function(state = initialState, action: any) {
  switch (action.type) {
    case GET_ENTRIES:
      return {...state, allEntries: action.entries};
    case ADD_ENTRY:
      return {...state, allEntries: [...state.allEntries, action.newEntry]};
    case DELETE_ENTRY:
      let entriesStateArr = state.allEntries as EntryItem[];
      const removedSingleEntry = entriesStateArr.filter(
        entry => entry.entryId === action.entryId,
      );
      return {...state, allTodos: removedSingleEntry};
    case UPDATE_ENTRY:
      let entryItemState = state.singleEntry as EntryItem;
      let updatedEntry = {...entryItemState};
      if (entryItemState.entryId === action.entryId) {
        updatedEntry = action.newEntry;
      }
      return {...state, singleTodo: updatedEntry};
    default:
      return state;
  }
}
