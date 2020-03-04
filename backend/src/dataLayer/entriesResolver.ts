const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as uuid from "uuid";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { EntryItem } from "../schemas/EntryItem";
import { EntryUpdate } from "../schemas/EntryUpdate";
import { EntryInput } from "../requests/EntryInput";
import { createLogger } from "../utils/logger";

const logger = createLogger("entryAccess");

//Creates a resolver for type EntryItem
@Resolver()
export class EntriesResolver {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly entriesTable = process.env.ENTRIES_TABLE,
    private readonly entryIdIndex = process.env.ENTRIES_INDEX
  ) {}

  @Query({
    description: "Get all the entries for a single user"
  })
  async getentries(@Arg("userID") userId: string): Promise<EntryItem[]> {
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

  @Mutation({
    description: "Add a single Entry"
  })
  async createEntry(
    @Arg("entry") userIdIn: string,
    entry: EntryInput
  ): Promise<EntryItem> {
    const newEntryId = uuid.v4();
    await this.docClient
      .put({
        TableName: this.entriesTable,
        Item: {
          userId: userIdIn,
          entryId: newEntryId,
          createdAt: new Date().toISOString(),
          content: entry.content
        }
      })
      .promise();

    const result = await this.docClient
      .query({
        TableName: this.entriesTable,
        IndexName: this.entryIdIndex,
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "entryId = :entryId",
        ExpressionAttributeValues: {
          ":userId": userIdIn,
          ":entryId": newEntryId
        },
        ScanIndexForward: false
      })
      .promise();

    return result.Items[0] as EntryItem;
  }

  @Mutation({
    description: "Update a single Entry"
  })
  async updateEntry(
    @Arg("entryIn")
    userId: string,
    entryId: string,
    entryIn: EntryInput
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
          ":cnt": entryIn.content
        },
        ExpressionAttributeNames: {
          "#cnt": "content"
        }
      })
      .promise();
    return;
  }

  @Mutation({
    description: "Delete a single Entry"
  })
  async deleteEntry(
    @Arg("entryId") userId: string,
    entryId: string
  ): Promise<EntryItem> {
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
