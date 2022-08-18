import {ObjectType, Field, ID} from "type-graphql"


@ObjectType({ description: "User model" })
export class Token {
  @Field(() => String)
  token: string
}
