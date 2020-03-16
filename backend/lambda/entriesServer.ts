import "source-map-support/register";

import { Jwt } from "../auth/Jwt";
import { JwtPayload } from "../auth/JwtPayload";
import { verify, decode } from "jsonwebtoken";
import axios from "axios";
const jwksUrl = process.env.JWKS_ENDPOINT;

import { typeDefs } from "../schema/EntrySchema";
import { resolvers } from "../businessLogic/entriesResolver";
const { ApolloServer } = require("apollo-server-lambda");
import { EntriesAccess } from "../dataLayer/entriesAccess";
const { createAWSAssets } = require("../dataLayer/entriesConfig");

const awsAssets = createAWSAssets();

import { createLogger } from "../utils/logger";
const logger = createLogger("auth");

//Dynamodb docClient datasource
const dataSources = () => ({
  entriesAccess: new EntriesAccess({ awsAssets })
});

const context = async ({ event }): Promise<any> => {
  try {
    const authHeader = event.headers.Authorization;

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

      return { user };
    }
  } catch (error) {
    logger.info("User is not authorized  ", error);
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: false,
  playground: true
});

exports.entriesHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
