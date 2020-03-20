import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { AttachmentGenerator } from "../dataLayer/attachmentGenerator";
import { returnAuthenticatedUser } from "../utils/authenticate";
const { createAWSAssets } = require("../dataLayer/entriesConfig");

const awsAssetsIn = createAWSAssets();
const attachmentGenerator = new AttachmentGenerator({ awsAssetsIn });

import { createLogger } from "../utils/logger";
const logger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const entryId = event.pathParameters.entryId;
  const authHeader = event.headers.Authorization;
  //Authorization through the context generated for Apolloserver
  const user = await returnAuthenticatedUser(authHeader);

  try {
    if (user) {
      const signedUrl = await attachmentGenerator.generateUploadUrl(
        user,
        entryId
      );

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          uploadUrl: signedUrl
        })
      };
    }
  } catch (error) {
    logger.info(error);
  }
};
