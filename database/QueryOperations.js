import jwt from "jsonwebtoken";
import {db} from "../database/db.js";
import { CustomError, ErrorTypes } from "../ErrorHandling/customError.js";

const UserLogin = async (args) => {
  var sql = `SELECT * FROM Users where email = ? and password = ?`;
  const params = [args.email, args.password];
  const data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError("Invalid Credentials", ErrorTypes.BAD_USER_INPUT);
  }
  var token = jwt.sign({ email: args.email }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRY_TIME,
  });
  data[0][0].token = token;
  return data[0][0];
};

const Users = async () => {
  var sql = `SELECT * FROM Users`;
  const data = await db.promise().query(sql, []);
  return data[0];
};

const TeacherFeed = async (_, args, context) => {
  var sql = `SELECT user_id FROM Users where email = ? and type = 'TEACHER'`;
  var params = [context.user.email];
  var data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError(
      "User not authorized to view Teacher journal feed",
      ErrorTypes.UNAUTHORIZED
    );
  }

  sql = `SELECT * FROM Journals where teacher_id = ?`;

  params = [data[0][0].user_id];
  data = await db.promise().query(sql, params);
  return data[0];
};

const StudentFeed = async (_, args, context) => {
  var sql = `SELECT user_id FROM Users where email = ? and type = 'STUDENT'`;
  var params = [context.user.email];
  var data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError(
      "User not authorized to view Student journal feed",
      ErrorTypes.UNAUTHORIZED
    );
  }
  sql = `SELECT J.* FROM Journals J
        INNER JOIN JournalTags JT ON J.journal_id = JT.journal_id
        WHERE JT.student_id = 1
        AND DATE(J.published_at) > CURDATE()
        ORDER BY J.published_at DESC;`;
  params = [data[0][0].user_id];
  data = await db.promise().query(sql, params);
  return data[0];
};
export { UserLogin, Users, TeacherFeed, StudentFeed };
