import mysql from 'mysql2/promise';

const db = {
  execute: async (query, params) => {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });
    try {
      const [results] = await connection.execute(query, params);
      return [results]; // Trả về mảng để phép gán [rows] không bị lỗi
    } finally {
      await connection.end();
    }
  }
};

export default db;