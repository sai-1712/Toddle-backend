import express from "express";
import { ApolloServer } from "apollo-server-express";
import path from "path";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import * as dotenv from "dotenv";
dotenv.config();
import { context } from "./context/context.js";
import { typeDefs } from "./schema/type_defs.js";
import {resolvers} from "./resolvers/index_resolver.js"


async function startApolloServer() {
  const app = express();
  const __dirname = path.resolve();
  app.use("/", express.static(path.join(__dirname, "uploads")));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: context,
    formatError: (error) => {
      return {
        message: error.message,
        code: error.extensions.code,
      };
    }
  });

  await server.start(); 

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () => {
    console.log("Server Listening");
  });
}

startApolloServer().catch((error) => {
  console.error("Error starting server:", error);
});
