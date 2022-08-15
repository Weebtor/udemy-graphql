import express, {Express, Request, Response} from "express";
import { ApolloServer, ExpressContext, gql} from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import dotEnv from "dotenv";
import serverLog from "./utils/serverLog";
import { DocumentNode } from "graphql";
const {
  tasks, 
  users
}  = require("./constants")

dotEnv.config(); // set process env
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000;
const APOLLO_PATH = process.env.APOLLO_PATH || '/graphql';


const app:Express = express();


// cors
app.use(cors()); 
// body parser middleware
app.use(express.json()); 

const typeDefs:DocumentNode = gql`
  type Query{
    greetings: String!
    tasks: [Task!]
    users: [User!]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
`;

// comment
const resolvers = {
  Query: {
    greetings: () => "Hello",
    tasks: () => tasks,
    users: () => users
  },
  Task: {
    user: ({userId}:{userId:string}) => users.find((user:any) => user.id === userId)
  },
  User: {
    tasks: (parent:any) => tasks.filter((task:any) => parent.id === task.userId)
  }
  
};


const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
})



app.get('/', (_req: Request, res: Response) => {
  res.send({message: 'Hello TS xD new'});
})

apolloServer.start().then(() => {
  
  apolloServer.applyMiddleware({app, path: APOLLO_PATH});
  
  app.listen(EXPRESS_PORT, () => {
    serverLog(`Server listening on PORT: ${EXPRESS_PORT}`);
    serverLog(`Graphql Endpint: ${apolloServer.graphqlPath}`)
  })
});

