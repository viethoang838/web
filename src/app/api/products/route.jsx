import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  try {
    // CẬP NHẬT: Sử dụng LEFT JOIN để lấy tên danh mục từ bảng categories
    // p.* là lấy tất cả cột của products, c.name là lấy tên danh mục
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.name LIKE ?
    `;
    let params = [`%${search}%`];

    // Xử lý sắp xếp (Thêm alias p. để SQL biết là lấy cột của bảng products)
    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else query += ' ORDER BY p.id DESC';

    const [rows] = await db.execute(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Lỗi API Products:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}