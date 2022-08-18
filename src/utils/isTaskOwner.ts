import { isValidObjectId } from "mongoose";
import { ResolverData } from "type-graphql";
import { MiddlewareFn, NextFn } from "type-graphql/dist/interfaces/Middleware";
import { TaskDbModel } from "../schemas";
import { Task } from "../schemas/task/task.schema";
import { AppContext, SessionContext } from "../types";
import serverLog from "./serverLog";


export const isTaskOwner:MiddlewareFn = async(actions: ResolverData, next:NextFn ) => {
  const ctx:any = actions.context;
  const {id} = actions.args;
  if (!isValidObjectId(id)) throw new Error('Invalid ID');

  const task = await TaskDbModel.findById({_id:id})
  if(!task) {
    throw new Error('Task not found');
  }
  else if (ctx.context.session.userId !== task.user.toString()) {
    throw new Error('User not owner of the task');
  }
  
  await next();

// context.context
}