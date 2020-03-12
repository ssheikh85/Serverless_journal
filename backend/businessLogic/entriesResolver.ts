import { EntriesAccess } from "../dataLayer/entriesAccess";

const entriesHandler = new EntriesAccess();

module.exports = {
  Query: {
    getEntries: async context => {
      return await entriesHandler.getEntries(context.user);
    }
  },

  Mutation: {
    createEntry: async (args, context) => {
      return await entriesHandler.createEntry(context.user, args.EntryInput);
    },
    updateEntry: async (args, context) => {
      return await entriesHandler.updateEntry(
        context.user,
        args.entryId,
        args.EntryInput
      );
    },
    deleteEntry: async (args, context) => {
      return await entriesHandler.deleteEntry(context.user, args.entryId);
    }
  }
};
