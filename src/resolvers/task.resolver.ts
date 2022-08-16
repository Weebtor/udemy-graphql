import {Task, TastTest} from "../schemas/task/task.schema";
import {Arg, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql"
import serverLog from "../utils/serverLog";
import { TaskInputType, TaskType } from "../types";
const { tasks: tasksArr, users: usersArr }  = require("../constants")
import * as uudi from "uuid"
import { CreateTaskInput } from "../schemas/task/task.dto";
import User from "../schemas/user/user.schema";


@Resolver(Task) 
class TaskResolver {
  @Query(() => Task, {nullable:false})
  task(
    @Arg('id') id:string
  ) {
    return tasksArr.find((task: Task) => task.id === id)
  }

  @Query(()=> [Task], {nullable:true})
  tasks() {
    return tasksArr
  }

  @FieldResolver(() => User)
  user(@Root() task:TaskType) {
    console.log(task);
    return usersArr.find((user: User) => user.id === task.userId)
  }
  
  @Mutation(() => Task)
  createTask(
    @Arg('input') input: CreateTaskInput
  ) {
    const newTask: TaskType = {...input, id: uudi.v4()}
    tasksArr.push(newTask)
    return newTask
  }
};

export default TaskResolver;