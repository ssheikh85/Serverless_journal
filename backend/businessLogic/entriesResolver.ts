import { EntriesAccess } from "../dataLayer/entriesAccess";
import { EntryInput } from "../request/EntryInput";

// import { createLogger } from "../utils/logger";

// const logger = createLogger("resolver");

const entriesHandler = new EntriesAccess();

export const resolvers = {
  Query: {
    getEntries: async (userId: string) => {
      try {
        return await entriesHandler.getEntries(userId);
      } catch (error) {
        console.error(error);
      }
    }
  },

  Mutation: {
    createEntry: async (userId: string, EntryInput: EntryInput) => {
      try {
        return await entriesHandler.createEntry(userId, EntryInput);
      } catch (error) {
        console.error(error);
      }
    },
    updateEntry: async (
      userId: string,
      entryId: string,
      EntryInput: EntryInput
    ) => {
      try {
        return await entriesHandler.updateEntry(userId, entryId, EntryInput);
      } catch (error) {
        console.error(error);
      }
    },
    deleteEntry: async (userId: string, entryId: string) => {
      try {
        return await entriesHandler.deleteEntry(userId, entryId);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

//Dummy test data
// const entries = [
//   {
//     userId: "123",
//     entryId: uuid.v4(),
//     createdAt: new Date().toISOString(),
//     content: "A post for all times",
//     attachmentUrl: ""
//   },
//   {
//     userId: "123",
//     entryId: uuid.v4(),
//     createdAt: new Date().toISOString(),
//     content: "Another post",
//     attachmentUrl: ""
//   }
// ];
