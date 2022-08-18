import { UserDbModel } from "../schemas"
import serverLog from "../utils/serverLog"

export const batchUsers = async(userIds:string[]) => {
  serverLog('users id[]:', userIds)
  const users = await UserDbModel.find({_id: {$in: userIds}})
  return userIds.map((userId) => users.find((user)=> user.id === userId ))
}