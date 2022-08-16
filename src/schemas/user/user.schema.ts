import {ObjectType, Field, ID} from "type-graphql"
import {Task} from "../task/task.schema";

@ObjectType({ description: "The task model" })
class User {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string;

  @Field(() => [Task], {nullable: false})
  tasks:Task[]

}

export default User;