import { Field, InputType } from "type-graphql";



@InputType()
export class CreateTaskInput{
  @Field(() => String)
  name:string
  
  @Field(() => Boolean)
  completed:boolean

  @Field(() => String)
  userId: string
}
