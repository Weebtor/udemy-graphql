import {ObjectType, Field, ID} from "type-graphql"
import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {User} from "../user/user.schema";

@ObjectType({ description: "The task model" })
export class Task {
  @Field(() => ID)
  id?: string
  
  @Field(() => String)
  @prop({type: () => String, required: true})
  name: string

  @Field(() => Boolean)
  @prop({type: () => Boolean, required: true})
  completed: boolean;

  @Field(() => User)
  @prop({ref: () => User, required: false})
  user: User;

  @Field()
  @prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Field()
  @prop({ required: true, default: Date.now() })
  updatedAt: Date;

}



export class TaskDb extends Task{
}


@ObjectType({ description: "Page info" })
export class PageInfo {

  @Field(() => String, {nullable: true})
  nextPageCursor?: string

  @Field(() => Boolean)
  hasNextPage: boolean
}

@ObjectType({ description: "The task FEED" })
export class TaskFeed {

  @Field(() => [Task], {nullable: true})
  taskFeed?: Task[]

  @Field(() => PageInfo)
  pageInfo: PageInfo
}


// export interface TaskModelType {
//   id?: string,
//   name: string,
//   completed: boolean,
//   userId?: string,
// }
// @ObjectType({ description: "The task model" })
// export class TastTest extends Task{
//   @Field(() => String)
//   date: string
// }
