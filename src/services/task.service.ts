import { isValidObjectId, ObjectId } from "mongoose"
import { Query } from "type-graphql"
import { TaskDbModel, UserDbModel } from "../schemas"
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task/task.dto"
import { Task, TaskFeed } from "../schemas/task/task.schema"
import { User } from "../schemas/user/user.schema"
import { GetUserTaskArgTpe as GetUserTaskArgType, TasksCursorQuery } from "../types"
import serverLog from "../utils/serverLog"

export default class TaskService  {
  // async findTasks(id: string) {
  //   try {
  //     const tasks = await TaskDbModel.find({user: id})
  //     console.log(tasks)
  //     return tasks
  //   } catch (error) {
  //     throw error
  //   }
  // }
  async createTask (input: CreateTaskInput, userId: string): Promise<Task> {
    try {   
      const task = new TaskDbModel({...input, user: userId}) // new task
      const user = await UserDbModel.findOne({_id:userId}); // user to update
      const result = await task.save();
      user?.tasks?.push(result.id); // update user task list
      user?.save();
      return {
        id: task._id.toString(),
        name: task.name,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: task.user
      };

    } catch(error){
      throw error
    }
  }
  async getTaskById(taskId: string): Promise<Task>{
    const task = await TaskDbModel.findOne({_id: taskId})
    if(!task) {
      throw new Error('Task not found');
    }
    return {
      id: task._id.toString(),
      name: task.name,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      user: task.user
    }
  }
  async getUserTasks(args:GetUserTaskArgType): Promise<TaskFeed>{
    let query: TasksCursorQuery = {user: args.userId}
    console.log(args)
    if(args.cursor){ 
      query._id = { '$lt': args.cursor }
    }
    console.log(query)
    let tasks = await TaskDbModel.find(query).sort({ _id:-1}).limit(args.limit + 1);
    const hasNextPage:boolean = tasks.length > args.limit;
    tasks = hasNextPage? tasks.slice(0,-1): tasks;
    const taskFeed:Task[] = tasks.map((task) => ({
      id: task._id.toString(),
      name: task.name,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      user: task.user
    }))
    return {
      taskFeed: taskFeed,
      pageInfo: {
        hasNextPage,
        nextPageCursor: hasNextPage? taskFeed[tasks.length -1].id: undefined
        
      }
    }
  }
  async getUserById(userId: string, loaders: any): Promise<User> {
    // if(!isValidObjectId(userId)) throw new Error('invalid id');
    // const user = await UserDbModel.findOne({_id: userId})
    const user = await loaders.user.load(userId)
    if (!user) throw new Error("no user for the task")
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

  }
  async updateTask(input: UpdateTaskInput, taskId: string): Promise<Task> {
    try{
      const task = await TaskDbModel.findByIdAndUpdate(taskId, {...input}, {new: true})
      if(!task) {
        throw new Error('Task not found');
      }
      task.save();
      return {
        id: task._id.toString(),
        name: task.name,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: task.user
      }
    }
    catch (error){
      throw error
    }
  }


  async deleteTaskById(taskId: string, userId: string){
    try {
      const task = await TaskDbModel.findByIdAndDelete(taskId);
      serverLog("deleted task -",taskId)
      if(!task) 
        throw new Error('Task not found');
      
      await UserDbModel.updateOne({_id: userId}, {$pull: {tasks: task.id}})
      serverLog("updated user -",userId)

      return {
        id: task._id.toString(),
        name: task.name,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: task.user
      }

    } catch (error) {
      throw error
    }
  }
}