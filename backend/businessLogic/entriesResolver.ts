import { EntriesAccess } from "../dataLayer/entriesAccess";

const entriesHandler = new EntriesAccess();

module.exports = {
  Query: {
    getEntries: async context => {
      try {
        return await entriesHandler.getEntries(context.user);
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
