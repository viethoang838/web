import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Lấy Cookie "user" mà Hoàng vừa tạo ở trang Login
  const userCookie = request.cookies.get('user');

  // 2. Kiểm tra nếu đường dẫn là trang Admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Nếu không có Cookie -> Chưa đăng nhập -> Đá về Login
    if (!userCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(userCookie.value);
      
      // Nếu có Cookie nhưng Role không phải 1 -> Không phải Admin -> Đá về Trang chủ
      if (user.role !== 1) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Nếu Cookie bị lỗi hoặc giả mạo -> Đá về Login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Chỉ chạy Middleware cho các đường dẫn bắt đầu bằng /admin
export const config = {
  matcher: '/admin/:path*',
};