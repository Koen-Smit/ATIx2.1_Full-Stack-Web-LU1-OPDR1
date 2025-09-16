const mysql = require('mysql2');
const logger = require('../utils/logger');

// Connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    logger.error({ label: "DB", message: `Connection failed: ${err.message}` });
  } else {
    logger.info({ label: "DB", message: "Connection established" });
    connection.release();
  }
});

module.exports = pool;
