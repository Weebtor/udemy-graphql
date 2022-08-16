import "reflect-metadata"
import express, {Express, Request, Response} from "express";
import { ApolloServer, ExpressContext, gql} from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import dotEnv from "dotenv";
import serverLog from "./utils/serverLog";
import { buildSchema } from "type-graphql";
import TaskResolver from "./resolvers/task.resolver";
import UserResolver from "./resolvers/user.resolver";

dotEnv.config(); // set process env
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000;
const APOLLO_PATH = process.env.APOLLO_PATH || '/graphql';



const startServer = async() => {
  const app:Express = express();
  // cors
  app.use(cors()); 
  // body parser middleware
  app.use(express.json()); 

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[TaskResolver, UserResolver]
    }),
    context: ({req, res}) => ({req, res}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
    
  })
  await apolloServer.start();
  apolloServer.applyMiddleware({app, path: APOLLO_PATH});

  app.listen(EXPRESS_PORT, () => {
    serverLog(`Server listening on PORT: ${EXPRESS_PORT}`);
    serverLog(`Graphql Endpint: ${apolloServer.graphqlPath}`)
  })
}

startServer();