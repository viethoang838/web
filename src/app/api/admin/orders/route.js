import db from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. LẤY DANH SÁCH (Giữ nguyên của bạn)
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT o.id, o.total_price, o.address, o.status, o.created_at, u.name as customer_name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// 2. THÊM HÀM NÀY ĐỂ SỬA LỖI KẾT NỐI API
export async function PUT(req) {
  try {
    // Lấy ID từ URL (vì bạn gọi /api/admin/orders/ID)
    const id = req.url.split('/').pop(); 
    const { status } = await req.json();

    await db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}