const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);
import { DocumentClient } from "aws-sdk/clients/dynamodb";

module.exports.createDynamoDBClient = () => {
  const entriesTable = process.env.ENTRIES_TABLE;
  const entryIdIndex = process.env.ENTRIES_INDEX;

  let docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    docClient = new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return { docClient, entriesTable, entryIdIndex };
};
