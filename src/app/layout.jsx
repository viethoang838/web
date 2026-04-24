"use client"; // Chuyển sang client để dùng usePathname
import { usePathname } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Kiểm tra nếu đang ở các trang quản trị
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="vi">
      <head>
        <title>Hoàng Sneaker - Thế giới giày chính hãng</title>
        <meta name="description" content="Dự án tốt nghiệp Đinh Việt Hoàng - FPT Polytechnic" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      
      <body className="d-flex flex-column min-vh-100">
        
        {/* Chỉ hiện Header nếu KHÔNG PHẢI trang admin */}
        {!isAdminPage && <Header />}
        
        <main className="flex-grow-1">
          {children}
        </main>
        
        {/* Chỉ hiện Footer nếu KHÔNG PHẢI trang admin */}
        {!isAdminPage && <Footer />}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}