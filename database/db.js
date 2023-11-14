import { createPool } from "mysql2";
import * as dotenv from 'dotenv';
dotenv.config();
const initializeDatabase = async()=>{
  const db = createPool({
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // port: 3306,
});
let sql_user = `CREATE TABLE IF NOT EXISTS Users (
  user_id  INTEGER AUTO_INCREMENT  PRIMARY KEY,
  name TEXT,
  email VARCHAR(255) UNIQUE,
  password TEXT,
  type TEXT
);`;
let sql_journal = `CREATE TABLE IF NOT EXISTS Journals (
  journal_id INT AUTO_INCREMENT PRIMARY KEY,
  description TEXT,
  teacher_id INTEGER,
  attachment_type TEXT,
  attachment_value TEXT,
  published_at DATE,
  FOREIGN KEY (teacher_id) REFERENCES Users(user_id) ON DELETE CASCADE
);`;
let sql_journal_tags = `CREATE TABLE if not exists JournalTags (
    journal_id INTEGER,
    student_id INTEGER,
    PRIMARY KEY (journal_id, student_id),
    FOREIGN KEY (journal_id) REFERENCES Journals(journal_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
)`;

const queries = [sql_user, sql_journal, sql_journal_tags];

  for (const query of queries) {
    try {
      await db.promise().query(query);
    } catch (error) {
      console.error(`Error executing query:`,error);
    }
  }
  return db;
}

export const db = await initializeDatabase();