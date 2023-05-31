import * as dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  keepAlive: true,
  // for local development
  // ssl: {
  //   rejectUnauthorized: false // This option allows self-signed certificates, modify as needed
  // }
});

export default pool;
