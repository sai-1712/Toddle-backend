import { UserLogin, Users, TeacherFeed, StudentFeed } from "../database/QueryOperations.js";
import * as dotenv from "dotenv";
dotenv.config();

export const queryResolvers = {
  Query: {
    userLogin: async (_, args) => {
       return await UserLogin(args);
    },
    users: async () => {
    return await Users();
    },

    TeacherFeed: async (_, args, context) => {
     return await TeacherFeed(_, args, context);
    },

    StudentFeed: async (_, args, context) => {
      return await StudentFeed(_, args, context);
    },
  },
};
