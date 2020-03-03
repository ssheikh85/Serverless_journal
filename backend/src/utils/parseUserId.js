import { decode } from "jsonwebtoken";

/**
 * Parse a JWT token and return a user id
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken);
  return decodedJwt.sub;
}
