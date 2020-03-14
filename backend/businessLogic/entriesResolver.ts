import { EntriesAccess } from "../dataLayer/entriesAccess";

// import { createLogger } from "../utils/logger";

// const logger = createLogger("resolver");

const entriesHandler = new EntriesAccess();

export const resolvers = {
  Query: {
    getEntries: async args => {
      try {
        return await entriesHandler.getEntries(args.id);
      } catch (error) {
        console.error(error);
      }
    }
  },

  Mutation: {
    createEntry: async (args, context) => {
      try {
        return await entriesHandler.createEntry(context.user, args.EntryInput);
      } catch (error) {
        console.error(error);
      }
    },
    updateEntry: async (args, context) => {
      try {
        return await entriesHandler.updateEntry(
          context.user,
          args.entryId,
          args.EntryInput
        );
      } catch (error) {
        console.error(error);
      }
    },
    deleteEntry: async (args, context) => {
      try {
        return await entriesHandler.deleteEntry(context.user, args.entryId);
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
