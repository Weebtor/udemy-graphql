import { Field, ID, InputType } from "type-graphql";



@InputType()
export class CreateUserInput{
  @Field(() => String)
  name:string
  
  @Field(() => String)
  email:string

  @Field(() => String)
  password: string
}

@InputType()
export class SignupInput{
  @Field(() => String)
  name:string
  
  @Field(() => String)
  email:string

  @Field(() => String)
  password: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email:string

  @Field(() => String)
  password: string

}

@InputType()
export class GetUserInput {
  @Field(() => String)
  email:string
}