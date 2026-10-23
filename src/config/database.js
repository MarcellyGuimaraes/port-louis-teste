const mysql = require('mysql2/promise');

const ssl = process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;