import db from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. API LẤY CHI TIẾT SẢN PHẨM (GET)
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const [rows] = await db.execute(
      'SELECT id, name, price, image, description, stock, categoryId FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm này trong kho!" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server GET: " + error.message },
      { status: 500 }
    );
  }
}

// 2. API XÓA SẢN PHẨM (DELETE)
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID không hợp lệ" }, { status: 400 });
    }

    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Sản phẩm không tồn tại hoặc đã bị xóa rồi!" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Đã xóa sản phẩm thành công!" 
    });

  } catch (error) {
    console.error("LỖI SQL DELETE:", error.message);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json(
          { success: false, message: "Không thể xóa vì sản phẩm này đã có trong đơn hàng của khách!" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: false, message: "Lỗi Server DELETE: " + error.message }, 
      { status: 500 }
    );
  }
}