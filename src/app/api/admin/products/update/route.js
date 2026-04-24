import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const data = await req.json();
    
    // 1. Kiểm tra xem Frontend gửi về là categoryId hay category_id
    // Mình dùng cách này để đảm bảo lấy được giá trị dù bạn đặt tên kiểu gì ở Frontend
    const { id, name, price, image, description, stock } = data;
    const category_id = data.category_id || data.categoryId || 1;

    // 2. Sửa lại tên cột trong SQL cho đúng với Database (thường là category_id)
    const sql = `
      UPDATE products 
      SET name = ?, price = ?, image = ?, description = ?, stock = ?, category_id = ? 
      WHERE id = ?
    `;
    
    const values = [name, price, image, description, stock, category_id, id];

    await db.execute(sql, values);

    return NextResponse.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
  } catch (error) {
    console.error("LỖI UPDATE SP:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}