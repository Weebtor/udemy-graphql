import "reflect-metadata"
import express, {Express, Request, Response} from "express";
import { ApolloServer, AuthenticationError} from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import dotEnv from "dotenv";
import serverLog from "./utils/serverLog";
import { buildSchema } from "type-graphql";
import { connection } from "./database";
import {resolvers} from "./resolvers";
import { verifyUser } from "./helpers/context";
import { AppContext, SessionContext } from "./types";
import { getUserFromToken } from "./utils/getUserFromToken";
import { isAuthenticated } from "./utils/isAuthenticated";

dotEnv.config(); // set process env
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000;
const APOLLO_PATH = process.env.APOLLO_PATH || '/graphql';



const startServer = async() => {
  const app:Express = express();
  app.use(cors()); // cors
  app.use(express.json()); // body parser middleware 
  // db connectivity
  await connection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ 
      resolvers,
      dateScalarMode: "isoDate",
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: async ({req}): Promise<AppContext | null> => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return {context: {authenticated: false}}
      }
      else if (token) {
        const user = await getUserFromToken(token)
        if (user) {
          const sessionContext:SessionContext = {
            authenticated: true,
            session: {
              userId: user._id.toString(),
              email: user.email,
            }
          }
          return {context: sessionContext}
        }
        
      }
      return {context: {authenticated: false}}
    },
      
  })
  await apolloServer.start();
  apolloServer.applyMiddleware({app, path: APOLLO_PATH});

  app.listen(EXPRESS_PORT, () => {
    serverLog(`Server listening on PORT: ${EXPRESS_PORT}`);
    serverLog(`Graphql Endpint: ${apolloServer.graphqlPath}`)
  })
}

startServer();