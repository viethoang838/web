import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Chỉ tính tổng doanh thu từ các đơn hàng CÓ TRẠNG THÁI "đã giao"
    const [revenueRows] = await db.execute(
      "SELECT SUM(total_price) as total FROM orders WHERE status = 'đã giao'"
    );
    
    // 2. Đếm tổng số đơn hàng
    const [orderRows] = await db.execute('SELECT COUNT(id) as count FROM orders');
    
    // 3. Đếm tổng số người dùng
    const [userRows] = await db.execute('SELECT COUNT(id) as count FROM users');

    // 4. Đếm tổng số danh mục thương hiệu (MỚI THÊM)
    const [catRows] = await db.execute('SELECT COUNT(id) as count FROM categories');

    return NextResponse.json({
      totalRevenue: revenueRows[0]?.total || 0,
      newOrders: orderRows[0]?.count || 0,
      totalUsers: userRows[0]?.count || 0,
      totalCategories: catRows[0]?.count || 0 // Trả về con số này cho Dashboard
    });

  } catch (error) {
    console.error("LỖI THỐNG KÊ:", error.message);
    return NextResponse.json(
      { error: "Lỗi SQL: " + error.message }, 
      { status: 500 }
    );
  }
}