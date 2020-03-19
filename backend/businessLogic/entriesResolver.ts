// const { createLogger } = require("../utils/logger");
// const logger = createLogger("resolver");

export const resolvers = {
  Query: {
    getEntries: async (_, args, { dataSources, user }) => {
      try {
        // logger.info(user);
        // logger.info(args.userId);
        if (user === args.userId) {
          return await dataSources.entriesAccess.getEntries(args.userId);
        } else {
          console.log("User is not authorized to perform this action");
        }
      } catch (error) {
        console.error(error);
      }
    }
  },

  Mutation: {
    createEntry: async (_, args, { dataSources, user }) => {
      try {
        if (user === args.userId) {
          return await dataSources.entriesAccess.createEntry(
            args.userId,
            args.entryInput
          );
        } else {
          console.log("User is not authorized to perform this action");
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateEntry: async (_, args, { dataSources, user }) => {
      try {
        if (user === args.userId) {
          return await dataSources.entriesAccess.updateEntry(
            args.userId,
            args.entryId,
            args.entryInput
          );
        } else {
          console.log("User is not authorized to perform this action");
        }
      } catch (error) {
        console.error(error);
      }
    },
    deleteEntry: async (_, args, { dataSources, user }) => {
      try {
        if (user === args.userId) {
          return await dataSources.entriesAccess.deleteEntry(
            args.userId,
            args.entryId
          );
        } else {
          console.log("User is not authorized to perform this action");
        }
      } catch (error) {
        console.error(error);
      }
    },
    generateUploadUrl: async (_, args, { dataSources, user }) => {
      try {
        if (user === args.userId) {
          return await dataSources.entriesAccess.generateUploadUrl(
            args.userId,
            args.entryId
          );
        } else {
          console.log("User is not authorized to perform this action");
        }
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
