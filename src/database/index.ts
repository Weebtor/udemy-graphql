import mongoose from 'mongoose';
import serverLog from '../utils/serverLog';
// import User from './models/user'
export const connection = async() => {
  try {
    mongoose.set('debug', true);
    const db = await mongoose.connect(process.env.MONGO_DB_URL || "mongodb://localhost/mydb")
    serverLog('Database connected successfully:', db.connection.db.databaseName);
  }
  catch (error){
    console.log(error)
    throw error
  }
}



// const executeQueryTest = async() => {
//   const user = new User({
//     name: "Joe Doe",
//     email: "example@test.com",
//     password: "123123"
//   })
//   await user.save();
//   console.log(user)

// }

// executeQueryTest();