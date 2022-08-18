import DataLoader from 'dataloader';
import {Request} from 'express'
import { FieldNode } from 'graphql';
import { User } from '../schemas/user/user.schema'
export interface TaskType {
  id: string,
  name: string,
  completed: boolean,
  userId: string,
}

export interface TaskInputType {
  name: string,
  completed: boolean,
  userId: string,
}

export interface UserType {
  id: string,
  name: string,
  email: string,
}

export interface SessionContext {
  authenticated: boolean,
  loaders?: {
    [key: string]: any
  }
  session?: {
    userId: string,
    email: string,
  }
}
export interface AppContext{
  context: SessionContext;
}


export interface GetUserTaskArgTpe {
  userId: string, 
  cursor?: string, 
  limit: number
}

export interface TasksCursorQuery {
  user: string,
  _id?:{
    $lt: string
  }
}