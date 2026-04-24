import db from '@/lib/db'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Query kiểm tra tài khoản (Đảm bảo bảng users có cột email và password)
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      // Thành công: Trả về dữ liệu user
      return NextResponse.json({ success: true, user: rows[0] });
    } else {
      // Thất bại: Sai thông tin
      return NextResponse.json({ success: false, message: 'SAI EMAIL HOẶC MẬT KHẨU!' }, { status: 401 });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'LỖI KẾT NỐI DATABASE (PORT 3307)!' 
    }, { status: 500 });
  }
}