import { TaskDbModel, UserDbModel } from "../schemas";
import { CreateUserInput, GetUserInput, LoginInput, SignupInput } from "../schemas/user/user.dto";
import { User, UserDb } from "../schemas/user/user.schema";
import serverLog from "../utils/serverLog";
import jwt from 'jsonwebtoken'
import { AppContext } from "../types";
import { assertUnionType } from "graphql";
import { isValidObjectId } from "mongoose";
import { Task } from "../schemas/task/task.schema";
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs'

export default class UserService {
  async getUser(email: string): Promise<User> {
    try {
      const user = await UserDbModel.findOne({email}).lean();
      if (!user) throw new Error('User not found')
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
    catch (error) {
      throw error;
    }
  }
  async createUser(input: CreateUserInput) {
    const {name, password, email} = input;
    const newUser = new UserDbModel({
      name,
      password,
      email,
    })
    return await newUser.save();
  }

  async getUserByEmail(email: string){
    return await UserDbModel.findOne({email}).lean();
  }

  async signup (input: SignupInput) {
    try {
      const user = await UserDbModel.findOne({email: input.email});
      if (user) throw new Error('Email already in use')
      const hashedPassword = await bcrypt.hash(input.password, 12);
      const result = await this.createUser({...input, password: hashedPassword});
      return result;
    }
    catch(error) {
      throw error;
    }
  } 
  async login(input: LoginInput) {
    try {
      // validate user
      const user = await UserDbModel.findOne({ email: input.email })
      if (!user) throw new Error("User not found");
      // validate password
      const isPasswordValid = await bcrypt.compare(input.password, user.password)
      if (isPasswordValid === false) throw new Error("Incorrect password");

      

      const secret = process.env.JWT_SECRET_KEY || 'mysecretkey'
      const token = jwt.sign({ email: user.email }, secret, {expiresIn: '1d'})

      return { 
        token: token,
        userId: user.id,
        email: user.email,
      }
    }
    catch (error){
      throw error
    }
    
  }
  async findTasks(id: string):Promise<Task[]> {
    try {
      const tasks = await TaskDbModel.find({user: id}).lean()
      return tasks.map((task) => ({
        id: task._id.toString(),
        name: task.name,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: task.user
      }))
    } 
    catch (error) {
      throw error
    }
  }
  
}

