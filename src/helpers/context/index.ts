import jwt from 'jsonwebtoken';

export const verifyUser = (req: any) => {
  // console.log(req.headers)
  try {
    const bearerHeader:string = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      console.log(token)
      const secret = process.env.JWT_SECRET_KEY || 'mysecretkey' 
      const payload:any = jwt.verify(token, secret)
      req.email = payload.email;
    }
  } catch (error) {
    throw error
  }
  
}