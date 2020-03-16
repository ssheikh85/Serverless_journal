const { gql } = require("apollo-server-lambda");

export const typeDefs = gql`
  type EntryItem {
    userId: String
    entryId: String
    createdAt: String
    content: String
    attachmentUrl: String
  }

  input EntryInput {
    content: String
  }

  type Query {
    getEntries(userId: String): [EntryItem]
  }

  type Mutation {
    createEntry(userId: String, entryInput: EntryInput): EntryItem
    updateEntry(
      entryInput: EntryInput
      userId: String
      entryId: String
    ): EntryItem
    deleteEntry(userId: String, entryId: String): EntryItem
    generateUploadUrl(userId: String, entryId: String): String
  }
`;
