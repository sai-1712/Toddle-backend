import * as dotenv from "dotenv";
import { CustomError, ErrorTypes } from "../ErrorHandling/customError.js";
import { sendEmail, fileUpload } from "../utils/helperFunctions.js";
import { db } from "./db.js";
dotenv.config();
const CreateUser = async (args) => {
  var sql = "INSERT INTO Users(name,email,password,type) VALUES(?,?,?,?)";
  var params = [
    args.input.name,
    args.input.email,
    args.input.password,
    args.input.type,
  ];
  try {
    const data = await db.promise().query(sql, params);
    args.input.user_id = data[0].insertId;
  } catch (err) {
    throw CustomError("User already exists", ErrorTypes.ALREADY_EXISTS);
  }
  return args.input;
};

const CreateJournal = async (input, file, context) => {
  var filename = null;
  var subtype = null;
  if (file) {
    var { filename, mimetype } = await fileUpload(file);
    var [type, subtype] = mimetype.split("/");
    filename = filename;
    subtype = subtype;
  }
  var teacherEmail = context.user.email;
  var sql = `SELECT user_id FROM Users where email = ? and type = 'TEACHER'`;
  var params = [teacherEmail];
  var data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError(
      "User not authorized to create Journal",
      ErrorTypes.UNAUTHORIZED
    );
  }
  sql =
    "INSERT INTO Journals(description,attachment_type,attachment_value,teacher_id,published_at) VALUES(?,?,?,?,?)";
  var teacherId = data[0][0].user_id;
  input.teacher_id = teacherId;

  params = [
    input.description,
    subtype,
    filename,
    teacherId,
    input.published_at,
  ];
  data = await db.promise().query(sql, params);
  input.journal_id = data[0].insertId;
  input.teacher_id = teacherId;
  const journalId = data[0].insertId;
  const userList = input.userId;

  var insert_sql = "INSERT INTO JournalTags(journal_id,student_id) VALUES(?,?)";
  userList.forEach(async (id) => {
    const userId = parseInt(id);
    const params1 = [journalId, userId];
    sql = `SELECT * FROM Users where user_id= ? and type = 'STUDENT'`;
    const data1 = await db.promise().query(sql, [userId]);
    if (data1[0].length != 0) {
      await sendEmail(
        data1[0][0].email,
        "Tagged",
        "You have been tagged in a journal"
      );
      const d = await db.promise().query(insert_sql, params1);
    }
  });
  return input;
};

const DeleteJournal = async (args, context) => {
  var teacherEmail = context.user.email;
  var sql = `SELECT user_id FROM Users where email = ? and type = 'TEACHER'`;
  var params = [teacherEmail];
  var data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError(
      "User not authorized to create Journal",
      ErrorTypes.UNAUTHORIZED
    );
  }
  sql = `DELETE FROM Journals WHERE journal_id = ?`;
  params = [args.journal_id];
  data = await db.promise().query(sql, params);
  return args.journal_id;
};

const UpdateJournal = async (args, context) => {
  var teacherEmail = context.user.email;
  var sql = `SELECT user_id FROM Users where email = ? and type = 'TEACHER'`;
  var params = [teacherEmail];
  var data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError(
      "User not authorized to create Journal",
      ErrorTypes.UNAUTHORIZED
    );
  }

  sql = "SELECT * FROM Journals WHERE journal_id = ?";
  params = [args.journal_id];
  data = await db.promise().query(sql, params);
  if (data[0].length == 0) {
    throw CustomError("Journal not found", ErrorTypes.NOT_FOUND);
  }
  sql = `UPDATE Journals
          SET
          description = COALESCE(?, description),
          published_at = COALESCE(?, published_at),
          attachment_value = COALESCE(?, attachment_value),
          attachment_type = COALESCE(?, attachment_type)
          WHERE journal_id = ?;
          `;
  params = [
    args.input.description,
    args.input.published_at,
    args.input.attachment_value,
    args.input.attachment_type,
    args.journal_id,
  ];

  data = await db.promise().query(sql, params);

  if (args.input.userId) {
    sql = `DELETE FROM JournalTags WHERE journal_id = ?`;
    params = [args.journal_id];
    data = await db.promise().query(sql, params);
    const journalId = args.journal_id;
    const userList = args.input.userId;
    sql = "INSERT INTO JournalTags(journal_id,student_id) VALUES(?,?)";
    userList.forEach(async (id) => {
      let userId = parseInt(id);
      params = [journalId, userId];
      const sql_user = `SELECT user_id FROM Users where user_id= ? and type = 'STUDENT'`;
      const data = await db.promise().query(sql_user, [userId]);
      if (data[0].length != 0) {
        data = await db.promise().query(sql, params);
      }
    });
  }
  args.input.journal_id = args.journal_id;
  return args.input;
};
export { CreateUser, CreateJournal, DeleteJournal, UpdateJournal };
