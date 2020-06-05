import * as AWS from "aws-sdk";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const bucketName = process.env.TODO_ITEMS_BUCKET;
const urlExpiration = process.env.URL_EXPIRATION_TIME;

const s3 = new AWS.S3({
  signatureVersion: "v4",
});

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const url = s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration,
    });

    return { statusCode: 200, body: JSON.stringify({ uploadUrl: url }) };
  },
);

handler.use(cors({ credentials: true }));
