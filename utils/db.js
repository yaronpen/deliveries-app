import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const connection = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

export const generalQuery = async (sql, doc) => {
  try {
    const response = await connection.query(sql, doc);

    return response;
  } catch(error) {
    console.log(error)
  }
}