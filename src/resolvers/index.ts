import TaskResolver from "./task.resolver";
import UserResolver from "./user.resolver";


export const resolvers = [
  UserResolver,
  TaskResolver
] as const;