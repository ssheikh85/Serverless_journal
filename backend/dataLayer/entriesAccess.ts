const uuid = require("uuid");
const { DataSource } = require("apollo-datasource");

import { EntryItem } from "../models/EntryItem";
import { EntryUpdate } from "../models/EntryUpdate";
import { EntryInput } from "../request/EntryInput";

const { createLogger } = require("../utils/logger");
const logger = createLogger("entryAccess");

// Class to Access DynamoDB table for entries create, read, update and delete options
export class EntriesAccess extends DataSource {
  // private readonly s3 = new XAWS.S3({ signatureVersion: "v4" });
  // private readonly bucketName = process.env.FILES_S3_BUCKET;
  // private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION;

  constructor({ dynamoClient }) {
    super();
    this.dynamoClient = dynamoClient;
  }

  //Gets entries for a specific authorized user
  async getEntries(userId: String): Promise<EntryItem[]> {
    try {
      logger.info(this.dynamoClient.docClient);
      logger.info(this.dynamoClient.entriesTable);
      logger.info(this.dynamoClient.entryIdIndex);
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

      logger.info(result);
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

      const result = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          KeyConditionExpression: "userId = :userId",
          FilterExpression: "entryId = :entryId",
          ScanIndexForward: false,
          ExpressionAttributeValues: {
            ":userId": userIdIn,
            ":entryId": newEntryId
          }
        })
        .promise();

      return result.Items[0] as EntryItem;
    } catch (error) {
      console.error(error);
    }
  }

  //Updates an entry for a specific authorized user
  async updateEntry(
    userIdIn: String,
    entryIdIn: String,
    entryInput: EntryInput
  ): Promise<EntryUpdate> {
    try {
      const result = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          KeyConditionExpression: "userId = :userId",
          FilterExpression: "entryId = :entryId",
          ScanIndexForward: false,
          ExpressionAttributeValues: {
            ":userId": userIdIn,
            ":entryId": entryIdIn
          }
        })
        .promise();

      logger.info("results of query for update", result, entryIdIn);

      await this.dynamoClient.docClient
        .update({
          Key: { userIdIn, createdAt: result.Items[0].createdAt },
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
  async deleteEntry(userIdIn: String, entryIdIn: String): Promise<EntryItem> {
    try {
      const result = await this.dynamoClient.docClient
        .query({
          TableName: this.dynamoClient.entriesTable,
          IndexName: this.dynamoClient.entryIdIndex,
          KeyConditionExpression: "userId = :userId",
          FilterExpression: "entryId = :entryId",
          ScanIndexForward: false,
          ExpressionAttributeValues: {
            ":userId": userIdIn,
            ":entryId": entryIdIn
          }
        })
        .promise();

      logger.info("results of query for delete", result, entryIdIn);

      await this.dynamoClient.docClient
        .delete({
          Key: { userIdIn, createdAt: result.Items[0].createdAt },
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
  //Creates a pre-assigned url for file uploads
  // async generateUploadUrl(): Promise<UploadUrl> {
  //   //Create a presigned URL for file uploads
  //   return this.s3.getSignedUrl("putObject", {
  //     Bucket: this.bucketName,
  //     Key: entryId,
  //     Expires: this.urlExpiration
  //   });
  // }

  //Creates an attachment URL for uploaded files
  // async createAttachment(): Promise<EntryItem> {
  //   const userId = user.sub;
  //   const result = await this.docClient
  //     .query({
  //       TableName: this.entriesTable,
  //       IndexName: this.entryIdIndex,
  //       KeyConditionExpression: "userId = :userId",
  //       FilterExpression: "entryId = :entryId",
  //       ExpressionAttributeValues: {
  //         ":userId": userId,
  //         ":entryId": entryId
  //       },
  //       ScanIndexForward: false
  //     })
  //     .promise();

  //   await this.docClient
  //     .update({
  //       Key: { userId, createdAt: result.Items[0].createdAt },
  //       TableName: this.entriesTable,
  //       UpdateExpression: " SET #attach = :attach",
  //       ExpressionAttributeValues: {
  //         ":attach": `https://${this.bucketName}.s3.amazonaws.com/${entryId}`
  //       },
  //       ExpressionAttributeNames: {
  //         "#attach": "attachmentUrl"
  //       }
  //     })
  //     .promise();
  //   return;
  // }
}
