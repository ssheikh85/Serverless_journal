import {EntryItem} from '../models_requests/EntryItem';

//Helper method for update in useMutation hook for deleteEntry
export const remove = (inArr: EntryItem[], inElem: EntryItem) => {
  for (let i = 0; i < inArr.length; i++) {
    let itemToRemove = inArr[i];
    if (itemToRemove.entryId === inElem.entryId) {
      inArr.splice(i, 1);
    }
  }
};
