import {ObjectType, Field, ID} from "type-graphql"
import {prop, Ref} from '@typegoose/typegoose'

import {Task} from "../task/task.schema";

@ObjectType({ description: "User model" })
export class User {
  @Field(() => ID)
  id: string

  @Field(() => String)
  @prop({type: () => String, required: true})
  name: string

  @Field(() => String)
  @prop({type: () => String, required: true, unique: true})
  email: string;

  // @Field(() => String)

  @Field(() => [Task], {nullable: false})
  @prop({ ref: () => Task, required: false})
  tasks?:Ref<Task>[]

  @Field()
  @prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Field()
  @prop({ required: true, default: Date.now() })
  updatedAt: Date;

}
export class UserDb extends User{

  @prop({type: () => String, required: true})
  password: string;

}


