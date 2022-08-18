import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import { UserDb } from './user/user.schema'
import { TaskDb } from './task/task.schema'

export const UserDbModel = getModelForClass<typeof UserDb>(UserDb, {schemaOptions: {timestamps: true}});
export const TaskDbModel = getModelForClass<typeof TaskDb>(TaskDb, {schemaOptions: {timestamps: true}});
