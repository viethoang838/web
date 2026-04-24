import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    // Next.js 15 yêu cầu await params
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Truy vấn lấy chi tiết các món hàng trong đơn
    const [items] = await db.execute(`
      SELECT oi.*, p.name, p.image 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Lỗi API chi tiết đơn hàng:", error.message);
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}