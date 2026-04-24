import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Debug: Dòng này sẽ in dữ liệu form ra cửa sổ Terminal của VS Code để bạn kiểm tra
    console.log("Dữ liệu nhận từ form:", data);

    const { name, price, image, description, stock } = data;
    
    // Lấy ID danh mục: Thử mọi trường hợp tên biến có thể xảy ra
    const rawCategoryId = data.category_id || data.categoryId;
    const categoryId = rawCategoryId ? parseInt(rawCategoryId) : 1;

    // QUAN TRỌNG: Hoàng hãy kiểm tra lại bảng products trong MySQL:
    // Nếu tên cột là 'categoryId' thì giữ nguyên.
    // Nếu tên cột là 'category_id' thì phải sửa chữ 'categoryId' bên dưới thành 'category_id'
    const sql = `
      INSERT INTO products (name, price, image, description, stock, categoryId) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      name, 
      Number(price) || 0, 
      image || '', 
      description || '', 
      Number(stock) || 0,
      categoryId
    ];

    const [result] = await db.execute(sql, values);

    return NextResponse.json({ 
      success: true, 
      message: 'Thêm sản phẩm thành công!',
      insertId: result.insertId 
    });
  } catch (error) {
    console.error("LỖI SQL KHI THÊM SP:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Lỗi Server: " + error.message 
    }, { status: 500 });
  }
}