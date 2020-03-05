import React from "react";
import { AppRegistry } from "react-native";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";

// Create the client
const client = new ApolloClient();

const App = () => <ApolloProvider client={client}></ApolloProvider>;

AppRegistry.registerComponent("MyApplication", () => App);
