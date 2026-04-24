// Đảm bảo bạn đã import/require mysql2 hoặc mysql
const mysql = require('mysql2'); // hoặc mysql

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// Nhớ xuất connection ra nếu file khác cần dùng
module.exports = connection;