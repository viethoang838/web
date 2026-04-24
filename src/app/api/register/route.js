import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password, address } = await req.json();
    
    // Kiểm tra xem email đã tồn tại chưa
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Email này đã được sử dụng!' }, { status: 400 });
    }

    // Chèn dữ liệu mới vào MySQL
    await db.execute(
      'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
      [name, email, password, address]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}