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
  async getEntries(userId: String): Promise<EntryItem[]> {
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
    userIdIn: String,
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
    userId: String,
    entryIdIn: String,
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

      const updatedEntry = await this.awsAssets.docClient
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
      return updatedEntry as EntryItem;
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

      const deletedEntry = await this.awsAssets.docClient
        .delete({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          ConditionExpression: "entryId = :entryId",
          ExpressionAttributeValues: {
            ":entryId": entryIdIn
          },
          TableName: this.awsAssets.entriesTable
        })
        .promise();
      return deletedEntry as EntryItem;
    } catch (error) {
      console.error(error);
    }
  }

  //Crates a presigned url and updates the entry with the correspondign url
  async generateUploadUrl(userId: String, entryIdIn: String): Promise<String> {
    try {
      const preSignedUrl = this.awsAssets.s3.getSignedUrl("putObject", {
        Bucket: this.awsAssets.bucketName,
        Key: entryIdIn,
        Expires: parseInt(this.awsAssets.urlExpiration)
      });

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

      // logger.info(results);

      await this.awsAssets.docClient
        .update({
          Key: { userId, createdAt: createdAtEntry.createdAt },
          TableName: this.awsAssets.entriesTable,
          UpdateExpression: " SET #attach = :attach",
          ExpressionAttributeValues: {
            ":attach": `https://${this.awsAssets.bucketName}.s3.amazonaws.com/${entryIdIn}`
          },
          ExpressionAttributeNames: {
            "#attach": "attachmentUrl"
          }
        })
        .promise();

      return preSignedUrl;
    } catch (error) {
      console.error(error);
    }
  }
}
