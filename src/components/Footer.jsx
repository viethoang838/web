"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4">
          
          {/* CỘT 1: GIỚI THIỆU */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ letterSpacing: '1px' }}>
              HOÀNG SNEAKER
            </h4>
            <p className="text-secondary small lh-lg">
              Tự hào là đơn vị cung cấp các dòng giày Sneaker chính hãng hàng đầu tại Đắk Lắk. 
              Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất cùng dịch vụ chăm sóc khách hàng tận tâm.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-tiktok"></i></a>
              <a href="#" className="text-white fs-5"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Cửa hàng</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/" className="text-secondary text-decoration-none transition-all" 
                      onMouseOver={(e) => e.target.style.color = 'white'} 
                      onMouseOut={(e) => e.target.style.color = '#adb5bd'}>Trang chủ</Link>
              </li>
              <li className="mb-2">
                <Link href="/products" className="text-secondary text-decoration-none transition-all"
                      onMouseOver={(e) => e.target.style.color = 'white'} 
                      onMouseOut={(e) => e.target.style.color = '#adb5bd'}>Tất cả giày</Link>
              </li>
              <li className="mb-2">
                <Link href="/cart" className="text-secondary text-decoration-none transition-all"
                      onMouseOver={(e) => e.target.style.color = 'white'} 
                      onMouseOut={(e) => e.target.style.color = '#adb5bd'}>Giỏ hàng</Link>
              </li>
              <li className="mb-2">
                <Link href="/orders" className="text-secondary text-decoration-none transition-all"
                      onMouseOver={(e) => e.target.style.color = 'white'} 
                      onMouseOut={(e) => e.target.style.color = '#adb5bd'}>Tra cứu đơn hàng</Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: CHÍNH SÁCH */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2">Chính sách bảo mật</li>
              <li className="mb-2">Chính sách đổi trả (7 ngày)</li>
              <li className="mb-2">Hình thức thanh toán</li>
              <li className="mb-2">Vận chuyển & Giao hàng</li>
            </ul>
          </div>

          {/* CỘT 4: THÔNG TIN LIÊN HỆ */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-4 text-uppercase small">Liên hệ trực tiếp</h6>
            <ul className="list-unstyled small">
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                <span className="text-secondary">Thành phố Buôn Ma Thuột, Tỉnh Đắk Lắk</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>
                <span className="text-secondary">09xx xxx xxx</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-envelope-at-fill me-2 text-primary"></i>
                <span className="text-secondary">hoangdv@fpt.edu.vn</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-5 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0 small text-secondary text-center text-md-start">
            © 2026 <strong>Đinh Việt Hoàng</strong> - Academy Shop. Tất cả quyền được bảo lưu.
          </p>
          <div className="d-flex gap-3 text-secondary fs-4">
            <i className="bi bi-credit-card"></i>
            <i className="bi bi-qr-code"></i>
            <i className="bi bi-bank"></i>
            <i className="bi bi-wallet2"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}