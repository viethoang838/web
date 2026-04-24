import db from '@/lib/db';
import { NextResponse } from 'next/server';

// Lấy danh sách thành viên
export async function GET() {
  try {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Cập nhật quyền (Role)
export async function PUT(req) {
  try {
    const { id, role } = await req.json();

    if (id === undefined || role === undefined) {
      return NextResponse.json({ success: false, message: "Thiếu dữ liệu!" }, { status: 400 });
    }

    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    return NextResponse.json({ success: true, message: "Cập nhật quyền thành công!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}