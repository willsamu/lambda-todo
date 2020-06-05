import { decode } from "jsonwebtoken";

import { JwtPayload } from "./JwtPayload";

const bucketName = process.env.TODO_ITEMS_BUCKET;
const region = process.env.AWS_REGION;

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub;
}

export function getAttachmentUrl(todoId: string): string {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${todoId}`;
}
