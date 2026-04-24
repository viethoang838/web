import db from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. Lấy toàn bộ danh mục
export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 2. Thêm danh mục mới
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: "Tên không được để trống" }, { status: 400 });

    await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    return NextResponse.json({ success: true, message: "Thêm thành công!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. Xóa danh mục (Lưu ý: Nếu có sản phẩm thuộc danh mục này sẽ bị lỗi khóa ngoại)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: "Đã xóa danh mục!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Không thể xóa vì đã có sản phẩm thuộc danh mục này!" }, { status: 500 });
  }
}