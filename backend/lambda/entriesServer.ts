import "reflect-metadata";
import "source-map-support/register";

import { buildSchemaSync } from "type-graphql";
import { EntriesResolver } from "../dataLayer/entriesResolver";
import { Jwt } from "../auth/Jwt";
import { JwtPayload } from "../auth/JwtPayload";
import { verify, decode } from "jsonwebtoken";
import axios from "axios";
import { createLogger } from "../utils/logger";

const { ApolloServer } = require("apollo-server-lambda");
const logger = createLogger("auth");
const jwksUrl = process.env.JWKS_ENDPOINT;

const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [EntriesResolver]
  }),
  context: async ({ req }) => {
    logger.info("Authorizing a user", req.header.authorization);
    try {
      const user = await getUserFromToken(req.header.authorization);
      logger.info("User was authorized", user);

      return user;
    } catch (e) {
      logger.error("User not authorized", { error: e.message });
    }
  }
});

exports.entriesHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});

async function getUserFromToken(authHeader: string): Promise<String> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  const response = await axios.get(jwksUrl);
  if (response.data.keys[0].kid === jwt.header.kid) {
    let cert = response.data.keys[0].x5c[0];
    cert = cert.match(/.{1,64}/g).join("\n");
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    const verifiedUser = verify(token, cert, {
      algorithms: ["RS256"]
    }) as JwtPayload;
    return verifiedUser.sub;
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}