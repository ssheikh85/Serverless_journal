// import "source-map-support/register";

// import { Jwt } from "../auth/Jwt";
// import { JwtPayload } from "../auth/JwtPayload";
// import { verify, decode } from "jsonwebtoken";
// import axios from "axios";
// import { createLogger } from "../utils/logger";

import { typeDefs } from "../schema/EntrySchema";
import { resolvers } from "../businessLogic/entriesResolver";
const { ApolloServer } = require("apollo-server-lambda");
// const logger = createLogger("auth");
// const jwksUrl = process.env.JWKS_ENDPOINT;
import { EntriesAccess } from "../dataLayer/entriesAccess";

// const getAuthenticatedUser = async (authHeader: string): Promise<String> => {
//   if (!authHeader) throw new Error("No authentication header");

//   if (!authHeader.toLowerCase().startsWith("bearer "))
//     throw new Error("Invalid authentication header");

//   const split = authHeader.split(" ");
//   const token = split[1];
//   const jwt: Jwt = decode(token, { complete: true }) as Jwt;

//   const response = await axios.get(jwksUrl);
//   if (response.data.keys[0].kid === jwt.header.kid) {
//     let cert = response.data.keys[0].x5c[0];
//     cert = cert.match(/.{1,64}/g).join("\n");
//     cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
//     const verifiedUser = verify(token, cert, {
//       algorithms: ["RS256"]
//     }) as JwtPayload;
//     return verifiedUser.sub;
//   }
// };

const dataSources = () => ({
  entriesAccess: new EntriesAccess()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  }),
  introspection: false,
  playground: true
});

exports.entriesHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});

// try {
//   const user = await getAuthenticatedUser(event.headers.Authorization);
//   logger.info("User was authorized", user);
//   return user;
// } catch (error) {
//   logger.error("User not authorized", { error: error.message });
// }
