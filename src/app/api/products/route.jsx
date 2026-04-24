import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Kết nối thẳng tới TiDB Cloud
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false // Bắt buộc phải có dòng này cho TiDB
      }
    });

    // Lấy dữ liệu giày
    const [rows] = await connection.execute('SELECT * FROM products');
    
    // Đóng kết nối ngay sau khi lấy xong
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Lỗi kết nối database:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}