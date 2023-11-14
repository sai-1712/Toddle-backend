import jwt from 'jsonwebtoken';
import { CustomError,ErrorTypes } from "../ErrorHandling/customError.js";
const getUser = async (token) => {
    try {
      if (token) {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
 
export const context = async ({ req, res}) => {
    if(req.body.operationName == "IntrospectionQuery"){
        return {};
    }
    if (req.body.query.includes('userLogin')  || req.body.query.includes('createUser') ) {
      return {};
    }
    const token = req.headers.authorization || '';
    const user = await getUser(token);
    if (!user) {
       throw CustomError("User not Authenticated",ErrorTypes.UNAUTHENTICATED);
    }
    return { user };
  };
