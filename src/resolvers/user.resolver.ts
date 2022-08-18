import {User, UserDb} from "../schemas/user/user.schema";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { AppContext, TaskType, UserType } from "../types";
import serverLog from "../utils/serverLog";
import { CreateUserInput, LoginInput, SignupInput } from "../schemas/user/user.dto";
import UserService from "../services/user.service";
import { Token } from "../schemas/token/token.schema";
import { isAuthenticated } from "../utils/isAuthenticated";

interface UserDbInterface {
  id: string
}
@Resolver(User)
class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService()
  }

  // @Query(() => [User], {nullable:true}) 
  // @UseMiddleware(isAuthenticated)
  // users(
  //   @Ctx() ctx:AppContext,
  // ) {
  //   const { session, authenticated } = ctx.context
  //   // if(!authenticated) throw new Error("user not authenticated");
  //   return usersArr
  // } 

  @Query(() => User) 
  @UseMiddleware(isAuthenticated)
  async user(
    @Ctx() ctx:AppContext,
  ) {
    const { session, authenticated } = ctx.context
    // if(!authenticated) throw new Error("user not authenticated");

    const user: User = await this.userService.getUser(session!.email)
    return user;
  }

  // @Query(() => User)
  // getUser(
  //   @Arg('input') input,
  //   @Ctx() ctx:AppContext,
  // ){

  // }

  @FieldResolver()
  tasks(@Root() user: User){
    return this.userService.findTasks(user.id)
  }

  @Mutation(() => User) 
  async signup( 
    @Arg('input') input:SignupInput,    
  ){
    return await this.userService.signup(input)
  }

  @Mutation(() => Token, {nullable: true})
  async login(
    @Arg('input') input: LoginInput,
  ) {
    const result = await this.userService.login(input);
    return result
  }
}


export default UserResolver