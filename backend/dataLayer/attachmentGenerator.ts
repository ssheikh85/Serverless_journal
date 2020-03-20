const { createLogger } = require("../utils/logger");
const logger = createLogger("attachmentUrl");

export class AttachmentGenerator {
  awsAssets: any;
  constructor({ awsAssetsIn }) {
    this.awsAssets = awsAssetsIn;
  }
  //Crates a presigned url and updates the entry with the correspondign url
  async generateUploadUrl(userId: string, entryIdIn: string): Promise<string> {
    try {
      const entryIdToUse = entryIdIn.toString();
      const userIdToUse = userId.toString();

      const preSignedUrl = this.awsAssets.s3.getSignedUrl("putObject", {
        Bucket: this.awsAssets.bucketName,
        Key: entryIdToUse,
        Expires: parseInt(this.awsAssets.urlExpiration)
      });

      const results = await this.awsAssets.docClient
        .query({
          TableName: this.awsAssets.entriesTable,
          IndexName: this.awsAssets.entryIdIndex,
          ScanIndexForward: false,
          KeyConditionExpression: "#userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userIdToUse
          },
          ExpressionAttributeNames: {
            "#userId": "userId"
          }
        })
        .promise();

      // logger.info(userIdToUse);
      // logger.info(entryIdToUse);
      // logger.info(results);

      const createdAtEntry = results.Items.find(
        elem => elem.entryId === entryIdToUse
      );

      if (!createdAtEntry)
        throw new Error(
          "Entry could not be found, please check entryId or if entry exists"
        );

      logger.info(createdAtEntry);

      await this.awsAssets.docClient
        .update({
          Key: { userId: userIdToUse, createdAt: createdAtEntry.createdAt },
          TableName: this.awsAssets.entriesTable,
          UpdateExpression: " SET #attach = :attach",
          ExpressionAttributeValues: {
            ":attach": `https://${this.awsAssets.bucketName}.s3.amazonaws.com/${entryIdToUse}`
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
