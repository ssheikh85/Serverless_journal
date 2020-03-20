import "source-map-support/register";

import { Jwt } from "../auth/Jwt";
import { JwtPayload } from "../auth/JwtPayload";
import { verify, decode } from "jsonwebtoken";
import axios from "axios";
const jwksUrl = process.env.JWKS_ENDPOINT;
import { createLogger } from "./logger";
const logger = createLogger("attachmentAuth");

export const returnAuthenticatedUser = async (
  authHeader: string
): Promise<any> => {
  try {
    if (!authHeader) throw new Error("No authentication header");

    if (!authHeader.toLowerCase().startsWith("bearer "))
      throw new Error("Invalid authentication header");

    const split = authHeader.split(" ");
    const token = split[1];
    const jwt: Jwt = decode(token, { complete: true }) as Jwt;

    const response = await axios.get(jwksUrl);
    if (response.data.keys[0].kid === jwt.header.kid) {
      let cert = response.data.keys[0].x5c[0];
      cert = cert.match(/.{1,64}/g).join("\n");
      cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;

      const verifiedUser = verify(token, cert, {
        algorithms: ["RS256"]
      }) as JwtPayload;

      const user = verifiedUser.sub;

      logger.info("User was authorized", user);

      return user;
    }
  } catch (error) {
    logger.info("User is not authorized  ", error);
  }
};
