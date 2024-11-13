import MySQL from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const isBuild = process.argv[2] === "build";

const Pool = MySQL.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namedPlaceholders: true,
}).promise();

export default Pool;
