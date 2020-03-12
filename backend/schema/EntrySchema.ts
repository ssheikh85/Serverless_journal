const { gql } = require("apollo-server-lambda");

export const typeDefs = gql`
  type EntryIitem {
    userId: String!
    entryId: String
    createdAt: String!
    content: String
    attachmentUrl: String
  }

  type EntryUpdate {
    content: String;
  }

  type UploadUrl {
    UploadUrl: String;
  }
  
  input ReviewInput {
    content: String!
  
  type Query {
    getEntries(userId: String): [EntryItem]!
  }

  type Mutation {
    createEntry(entryInput: EntryInput, userId:String): EntryItem!
    updateEntry((entryInput: EntryInput, userId:String, entryId:String): EntryUpdate
    deleteEntry( userId:String, entryId:String): EntryIitem
  }
}
`;
