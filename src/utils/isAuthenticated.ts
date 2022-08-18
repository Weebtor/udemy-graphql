import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { SessionContext } from "../types";

export const isAuthenticated:MiddlewareFn = async( 
  {context: ctx}: {context: any, info: any}, 
  next 
  ) => {
  const {authenticated}:SessionContext = ctx.context;

  if(!authenticated) {
    console.log("[Auth]: User not authenticated");
    throw new Error("user not authenticated");
  }
  await next();
}

 