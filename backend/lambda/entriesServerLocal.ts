import "reflect-metadata";
import "source-map-support/register";

// const graphiql = require("graphql-playground-middleware-express");
const { ApolloServer } = require("apollo-server-express");

const express = require("express");
const app = express();

import { typeDefs } from "../schema/EntrySchema";

const serverLocal = new ApolloServer({ typeDefs });

serverLocal.applyMiddleware({ app });

serverLocal.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
