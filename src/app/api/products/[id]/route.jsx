import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  // Giải nén params vì trong Next.js mới params là một Promise
  const { id } = await params; 

  try {
    // Truy vấn đúng sản phẩm dựa trên ID từ URL
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
    }
    
    // Trả về duy nhất 1 đối tượng sản phẩm
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}