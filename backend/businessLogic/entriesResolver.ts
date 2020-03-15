import { EntriesAccess } from "../dataLayer/entriesAccess";

// import { createLogger } from "../utils/logger";
// const logger = createLogger("resolver");

const entriesHandler = new EntriesAccess();

export const resolvers = {
  Query: {
    getEntries: async (_, args) => {
      try {
        return await entriesHandler.getEntries(args.userId);
      } catch (error) {
        console.error(error);
      }
    }
  },

  Mutation: {
    createEntry: async (_, args) => {
      try {
        return await entriesHandler.createEntry(args.userId, args.entryInput);
      } catch (error) {
        console.error(error);
      }
    },
    updateEntry: async (_, args) => {
      try {
        return await entriesHandler.updateEntry(
          args.userId,
          args.entryId,
          args.entryInput
        );
      } catch (error) {
        console.error(error);
      }
    },
    deleteEntry: async (_, args) => {
      try {
        return await entriesHandler.deleteEntry(args.userId, args.entryId);
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
