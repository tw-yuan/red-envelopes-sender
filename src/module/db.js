import mysql from 'mysql2/promise';
const config = require('../../config.json');

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });
  
export default pool;