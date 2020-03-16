const { DataSource } = require("apollo-datasource");
const uuid = require("uuid");

import { EntryItem } from "../models_requests/EntryItem";
import { EntryInput } from "../models_requests/EntryInput";

const { createLogger } = require("../utils/logger");
const logger = createLogger("entryAccess");

// Class to Access DynamoDB table for entries create, read, update and delete options
export class EntriesAccess extends DataSource {
  constructor({ dynamoClient }) {
    super();
    this.dynamoClient = dynamoClient;
  }

  //Gets entries for a specific authorized user
  async getEntries(userId: String): Promise<EntryItem[]> {
    try {
      const result = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          ScanIndexForward: false,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
        .promise();

      // logger.info(result);
      const items = result.Items;
      return items as EntryItem[];
    } catch (error) {
      console.error(error);
    }
  }

  //Adds an entry for a specific authorized user
  async createEntry(
    userIdIn: String,
    entryInput: EntryInput
  ): Promise<EntryItem> {
    try {
      const newEntryId = uuid.v4();
      await this.dynamoClient.docClient
        .put({
          TableName: this.dynamoClient.entriesTable,
          Item: {
            userId: userIdIn,
            entryId: newEntryId,
            createdAt: new Date().toISOString(),
            content: entryInput.content
          }
        })
        .promise();

      const newEntry = {
        userId: userIdIn,
        entryId: newEntryId,
        createdAt: new Date().toISOString(),
        content: entryInput.content
      };

      return newEntry as EntryItem;
    } catch (error) {
      console.error(error);
    }
  }

  //Updates an entry for a specific authorized user
  async updateEntry(
    userId: String,
    entryIdIn: String,
    entryInput: EntryInput
  ): Promise<EntryItem> {
    try {
      const results = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          ScanIndexForward: false,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
        .promise();

      const createdAtEntry = results.Items.find(
        elem => elem.entryId === entryIdIn
      );

      logger.info(entryIdIn, createdAtEntry);

      await this.dynamoClient.docClient
        .update({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          TableName: this.dynamoClient.entriesTable,
          UpdateExpression: " SET #cnt = :cnt",
          ExpressionAttributeValues: {
            ":cnt": entryInput.content
          },
          ExpressionAttributeNames: {
            "#cnt": "content"
          }
        })
        .promise();
      return;
    } catch (error) {
      console.error(error);
    }
  }

  //Deletes an entry for a specific authorized user
  async deleteEntry(userId: String, entryIdIn: String): Promise<EntryItem> {
    try {
      const results = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          ScanIndexForward: false,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
        .promise();

      const createdAtEntry = results.Items.find(
        elem => elem.entryId === entryIdIn
      );

      // logger.info(entryIdIn, createdAtEntry);

      await this.dynamoClient.docClient
        .delete({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          ConditionExpression: "entryId = :entryId",
          ExpressionAttributeValues: {
            ":entryId": entryIdIn
          },
          TableName: this.dynamoClient.entriesTable
        })
        .promise();
      return;
    } catch (error) {
      console.error(error);
    }
  }
}
