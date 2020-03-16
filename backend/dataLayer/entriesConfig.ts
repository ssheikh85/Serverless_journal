const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);
import { DocumentClient } from "aws-sdk/clients/dynamodb";

module.exports.createAWSAssets = () => {
  const entriesTable = process.env.ENTRIES_TABLE;
  const entryIdIndex = process.env.ENTRIES_INDEX;
  const bucketName = process.env.FILES_S3_BUCKET;
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

  let docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

  const s3 = new XAWS.S3({
    signatureVersion: "v4"
  });

  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    docClient = new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return {
    docClient,
    s3,
    entriesTable,
    entryIdIndex,
    bucketName,
    urlExpiration
  };
};
