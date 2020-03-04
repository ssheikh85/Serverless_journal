const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { EntryItem } from "../models/entryItem";
import { EntryUpdate } from "../models/entryUpdate";
import { createLogger } from "../utils/logger";

const logger = createLogger("entryAccess");

export class EntriesAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly entriesTable = process.env.ENTRIES_TABLE,
    private readonly entryIdIndex = process.env.ENTRIES_INDEX
  ) {}

  async getentries(userId: string): Promise<EntryItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.entriesTable,
        IndexName: this.entryIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        },
        ScanIndexForward: false
      })
      .promise();

    const items = result.Items;
    return items as EntryItem[];
  }

  async createEntry(entry: EntryItem): Promise<EntryItem> {
    await this.docClient
      .put({
        TableName: this.entriesTable,
        Item: entry
      })
      .promise();

    return entry;
  }

  async updateEntry(
    userId: string,
    entryId: string,
    entryUpdate: EntryUpdate
  ): Promise<EntryUpdate> {
    const result = await this.docClient
      .query({
        TableName: this.entriesTable,
        IndexName: this.entryIdIndex,
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "entryId = :entryId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":entryId": entryId
        },
        ScanIndexForward: false
      })
      .promise();

    logger.info("results of query for update", result, entryId);

    await this.docClient
      .update({
        Key: { userId, createdAt: result.Items[0].createdAt },
        TableName: this.entriesTable,
        UpdateExpression: " SET #cnt = :cnt",
        ExpressionAttributeValues: {
          ":cnt": entryUpdate.content
        },
        ExpressionAttributeNames: {
          "#cnt": "content"
        }
      })
      .promise();
    return;
  }

  async deleteentry(userId: string, entryId: string): Promise<EntryItem> {
    const result = await this.docClient
      .query({
        TableName: this.entriesTable,
        IndexName: this.entryIdIndex,
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "entryId = :entryId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":entryId": entryId
        },
        ScanIndexForward: false
      })
      .promise();

    logger.info("results of query for delete", result, entryId);

    await this.docClient
      .delete({
        Key: { userId, createdAt: result.Items[0].createdAt },
        ConditionExpression: "entryId = :entryId",
        ExpressionAttributeValues: {
          ":entryId": entryId
        },
        TableName: this.entriesTable
      })
      .promise();
    return;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
