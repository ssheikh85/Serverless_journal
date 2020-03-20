const { DataSource } = require("apollo-datasource");
const uuid = require("uuid");

import { EntryItem } from "../models_requests/EntryItem";
import { EntryInput } from "../models_requests/EntryInput";

const { createLogger } = require("../utils/logger");
const logger = createLogger("entryAccess");

// Class to Access DynamoDB table for entries create, read, update and delete options
export class EntriesAccess extends DataSource {
  constructor({ awsAssets }) {
    super();
    this.awsAssets = awsAssets;
  }

  //Gets entries for a specific authorized user
  async getEntries(userId: string): Promise<EntryItem[]> {
    try {
      const result = await this.awsAssets.docClient
        .query({
          TableName: this.awsAssets.entriesTable,
          IndexName: this.awsAssets.entryIdIndex,
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
    userIdIn: string,
    entryInput: EntryInput
  ): Promise<EntryItem> {
    try {
      const newEntryId = uuid.v4();
      await this.awsAssets.docClient
        .put({
          TableName: this.awsAssets.entriesTable,
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
    userId: string,
    entryIdIn: string,
    entryInput: EntryInput
  ): Promise<EntryItem> {
    try {
      const results = await this.awsAssets.docClient
        .query({
          TableName: this.awsAssets.entriesTable,
          IndexName: this.awsAssets.entryIdIndex,
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

      if (!createdAtEntry)
        throw new Error(
          "Entry could not be found, please check entryId or if entry exists"
        );

      logger.info(entryIdIn, createdAtEntry);

      await this.awsAssets.docClient
        .update({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          TableName: this.awsAssets.entriesTable,
          UpdateExpression: " SET #cnt = :cnt",
          ExpressionAttributeValues: {
            ":cnt": entryInput.content
          },
          ExpressionAttributeNames: {
            "#cnt": "content"
          }
        })
        .promise();

      const updatedItem = {
        userId: userId,
        entryId: entryIdIn,
        createdAt: createdAtEntry.createdAt,
        content: entryInput.content,
        attachmentUrl: createdAtEntry.attachmentUrl
      } as EntryItem;
      return updatedItem;
    } catch (error) {
      console.error(error);
    }
  }

  //Deletes an entry for a specific authorized user
  async deleteEntry(userId: String, entryIdIn: String): Promise<EntryItem> {
    try {
      const results = await this.awsAssets.docClient
        .query({
          TableName: this.awsAssets.entriesTable,
          IndexName: this.awsAssets.entryIdIndex,
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

      if (!createdAtEntry)
        throw new Error(
          "Entry could not be found, please check entryId or if entry exists"
        );

      // logger.info(entryIdIn, createdAtEntry);

      await this.awsAssets.docClient
        .delete({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          ConditionExpression: "entryId = :entryId",
          ExpressionAttributeValues: {
            ":entryId": entryIdIn
          },
          TableName: this.awsAssets.entriesTable
        })
        .promise();

      const deletedItem = {
        userId: userId,
        entryId: entryIdIn,
        createdAt: createdAtEntry.createdAt,
        content: createdAtEntry.content,
        attachmentUrl: createdAtEntry.attachmentUrl
      };
      return deletedItem as EntryItem;
    } catch (error) {
      console.error(error);
    }
  }
}
