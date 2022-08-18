import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTaskInput{
  @Field(() => String)
  name:string
  
  @Field(() => Boolean)
  completed:boolean

  // @Field(() => String)
  // userId: string
}

@InputType()
export class UpdateTaskInput{
  @Field(() => String, {nullable: true})
  name:string
  
  @Field(() => Boolean, {nullable: true})
  completed:boolean

}

