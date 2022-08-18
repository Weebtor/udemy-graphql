import jwt from 'jsonwebtoken';
import { UserDbModel } from '../schemas';
import { UserDb } from '../schemas/user/user.schema';
import serverLog from './serverLog';


export const getUserFromToken = async(token: string) => {
  const secret = process.env.JWT_SECRET_KEY || 'mysecretkey' 
  const payload: any = jwt.verify(token, secret)
  const result = await UserDbModel .findOne({email: payload.email});
  // serverLog(result);
  return result
}