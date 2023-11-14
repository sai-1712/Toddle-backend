import * as dotenv from "dotenv";
import { CreateUser,UpdateJournal,CreateJournal,DeleteJournal } from "../database/MutationOperations.js";
dotenv.config();

export const mutationResolvers = {
  Mutation: {
    createUser: async (_, args) => {
      try {
        return await CreateUser(args);
      } catch (err) {
        throw err;
      }
    },
    createJournal: async (_, { input, file }, context) => {
      try {
        return await CreateJournal(input, file, context);
      } catch (err) {
        throw err;
      }
    },

    deleteJournal: async (_, args, context) => {
      try {
        return await DeleteJournal(args, context);
      } catch (err) {
        throw err;
      }
    },

    updateJournal: async (_, args, context) => {
      try {
        return await UpdateJournal(args, context);
      } catch (err) {
        throw err;
      }
    },
  },
};
