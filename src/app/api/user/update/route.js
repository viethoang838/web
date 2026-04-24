import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, email, phone, address } = body;

    // Kiểm tra cực kỳ nghiêm ngặt ID
    if (!id) {
      console.error("LỖI: Frontend không gửi ID lên!");
      return NextResponse.json({ success: false, message: "Server không nhận được ID!" }, { status: 400 });
    }

    // Thực hiện Update
    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone || null, address || null, id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    // Dòng này sẽ hiện lỗi chi tiết trong Terminal của VS Code để bạn đọc
    console.error("LỖI SQL CHI TIẾT:", error.message);
    return NextResponse.json({ success: false, message: "Lỗi Database: " + error.message }, { status: 500 });
  }
}