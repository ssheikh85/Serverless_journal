import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { parseUserId } from "../utils/parseUserId";

const XAWS = AWSXRay.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient();
const s3 = new XAWS.S3({
  signatureVersion: "v4"
});

const entriesTable = process.env.ENTRIES_TABLE;
const entryIdIndex = process.env.ENTRIES_INDEX;
const bucketName = process.env.FILES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler = async event => {
  const todoId = event.pathParameters.todoId;
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrl = getUploadUrl(todoId);

  const newItem = await createAttachment(userId, todoId);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl,
      newItem: newItem
    })
  };
};

//Create a presigned URL for file uploads
function getUploadUrl(entryId) {
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: entryId,
    Expires: urlExpiration
  });
}

async function createAttachment(userId, entryId) {
  const result = await docClient
    .query({
      TableName: entriesTable,
      IndexName: entryIdIndex,
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "entryId = :entryId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":entryId": entryId
      },
      ScanIndexForward: false
    })
    .promise();

  await docClient
    .update({
      Key: { userId, createdAt: result.Items[0].createdAt },
      TableName: entriesTable,
      UpdateExpression: " SET #attach = :attach",
      ExpressionAttributeValues: {
        ":attach": `https://${bucketName}.s3.amazonaws.com/${entryId}`
      },
      ExpressionAttributeNames: {
        "#attach": "attachmentUrl"
      }
    })
    .promise();
  return;
}
