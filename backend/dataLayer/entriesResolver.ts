const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as uuid from "uuid";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { EntryItem } from "../schemas/EntryItem";
import { EntryUpdate } from "../schemas/EntryUpdate";
import { EntryInput } from "../requests/EntryInput";
import { JwtPayload } from "../auth/JwtPayload";
import { UploadUrl } from "../schemas/UploadUrl";
import { createLogger } from "../utils/logger";

const logger = createLogger("entryAccess");

//Creates a resolver for type EntryItem
@Resolver()
export class EntriesResolver {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
    private readonly entriesTable = process.env.ENTRIES_TABLE,
    private readonly entryIdIndex = process.env.ENTRIES_INDEX,
    private readonly bucketName = process.env.FILES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  //Gets entries for a specific authorized user
  @Query({
    description: "Get all the entries for a single user"
  })
  async getEntries(
    @Arg("userId") @Ctx() user: JwtPayload
  ): Promise<EntryItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.entriesTable,
        IndexName: this.entryIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": user.sub
        },
        ScanIndexForward: false
      })
      .promise();

    const items = result.Items;
    return items as EntryItem[];
  }

  //Adds an entry for a specific authorized user
  @Mutation({
    description: "Add a single Entry"
  })
  async createEntry(
    @Arg("entryInput") @Ctx() user: JwtPayload,
    entryInput: EntryInput
  ): Promise<EntryItem> {
    const userId = user.sub;
    const newEntryId = uuid.v4();
    await this.docClient
      .put({
        TableName: this.entriesTable,
        Item: {
          userId: userId,
          entryId: newEntryId,
          createdAt: new Date().toISOString(),
          content: entryInput.content
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
          ":userId": user.sub,
          ":entryId": newEntryId
        },
        ScanIndexForward: false
      })
      .promise();

    return result.Items[0] as EntryItem;
  }

  //Updates an entry for a specific authorized user
  @Mutation({
    description: "Update a single Entry"
  })
  async updateEntry(
    @Arg("entryInput")
    @Arg("entryId")
    @Ctx()
    user: JwtPayload,
    entryId: String,
    entryInput: EntryInput
  ): Promise<EntryUpdate> {
    const userId = user.sub;
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
          ":cnt": entryInput.content
        },
        ExpressionAttributeNames: {
          "#cnt": "content"
        }
      })
      .promise();
    return;
  }

  //Deletes an entry for a specific authorized user
  @Mutation({
    description: "Delete a single Entry"
  })
  async deleteEntry(
    @Arg("entryId")
    @Ctx()
    user: JwtPayload,
    entryId: string
  ): Promise<EntryItem> {
    const userId = user.sub;
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
  //Creates a pre-assigned url for file uploads
  @Mutation({ description: "Creates a pre-assigned url for file uploads" })
  async generateUploadUrl(
    @Arg("entryId")
    entryId: string
  ): Promise<UploadUrl> {
    //Create a presigned URL for file uploads
    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: entryId,
      Expires: this.urlExpiration
    });
  }

  //Creates an attachment URL for uploaded files
  @Mutation({ description: "Creates a pre-assigned url for file uploads" })
  async createAttachment(
    @Arg("entryId")
    @Ctx()
    user: JwtPayload,
    entryId: string
  ): Promise<EntryItem> {
    const userId = user.sub;
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

    await this.docClient
      .update({
        Key: { userId, createdAt: result.Items[0].createdAt },
        TableName: this.entriesTable,
        UpdateExpression: " SET #attach = :attach",
        ExpressionAttributeValues: {
          ":attach": `https://${this.bucketName}.s3.amazonaws.com/${entryId}`
        },
        ExpressionAttributeNames: {
          "#attach": "attachmentUrl"
        }
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
