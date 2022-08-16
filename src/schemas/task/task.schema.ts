import {ObjectType, Field, ID} from "type-graphql"
import User from "../user/user.schema";

@ObjectType({ description: "The task model" })
export class Task {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => User)
  user: User;

}

@ObjectType({ description: "The task model" })
export class TastTest extends Task{
  @Field(() => String)
  date: string
}
