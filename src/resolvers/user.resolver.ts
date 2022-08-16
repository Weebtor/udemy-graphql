import User from "../schemas/user/user.schema";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { TaskType, UserType } from "../types";
import serverLog from "../utils/serverLog";
const { users: usersArr, tasks: tasksArr }  = require("../constants")


@Resolver(User)
class UserResolver {
  @Query(() => [User], {nullable:true}) 
  users() {
    return usersArr
  } 

  @Query(() => User) 
  user(
    @Arg('id') id: string 
  ) {
    return usersArr.find((user:UserType) => user.id === id);
  }

  @FieldResolver()
  tasks(@Root() user:UserType){
    serverLog(user);
    return tasksArr.filter((task:TaskType) => user.id === task.userId)
  }
}


export default UserResolver