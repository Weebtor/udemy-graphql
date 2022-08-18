import {Task, TaskFeed} from "../schemas/task/task.schema";
import {Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql"
import serverLog from "../utils/serverLog";
import { AppContext, TaskInputType, TaskType } from "../types";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task/task.dto";
import {User} from "../schemas/user/user.schema";
import TaskService from "../services/task.service";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isTaskOwner } from "../utils/isTaskOwner";

@Resolver(Task) 
class TaskResolver {
  constructor(private taskService: TaskService){
    this.taskService = new TaskService()
  }


  @Query(() => Task, {nullable:false})
  @UseMiddleware(isAuthenticated)
  @UseMiddleware(isTaskOwner)
  async task(
    @Arg('id') id:string,
  ) {
    return this.taskService.getTaskById(id)
  }

  @Query(()=> TaskFeed)
  @UseMiddleware(isAuthenticated)
  async tasks(
    @Arg('cursor', {nullable: true}) cursor: string,
    @Arg('limit', {defaultValue: 10}) limit: number,
    @Ctx() ctx: AppContext,
  ) {
    const { session } = ctx.context
    return await this.taskService.getUserTasks({
      userId: session!.userId,
      cursor: cursor,
      limit: limit
    })
  }

  @FieldResolver(() => User)
  async user(
    @Root() task:Task,
    @Ctx() ctx: AppContext,
  ) {
    const {loaders} = ctx.context;
    return await this.taskService.getUserById(task.user.toString(), loaders)
  }
  
  @Mutation(() => Task)
  @UseMiddleware(isAuthenticated)
  async createTask(
    @Arg('input') input: CreateTaskInput,
    @Ctx() ctx: AppContext,
  ) {
    const { session } = ctx.context
    return await this.taskService.createTask(input, session!.userId);
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuthenticated)
  @UseMiddleware(isTaskOwner)
  async updateTask(
    @Arg('input') input: UpdateTaskInput,
    @Arg('id') id: string,
  ){
    return await this.taskService.updateTask(input, id)
  }

  @Mutation(() => Task)
  @UseMiddleware(isAuthenticated)
  @UseMiddleware(isTaskOwner)
  async deleteTask(
    @Arg('id') id: string,
    @Ctx() ctx: AppContext,
  ){
    const { session } = ctx.context
    return await this.taskService.deleteTaskById(id,  session!.userId)
  }


};

export default TaskResolver;