"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Thêm state quản lý số lượng giỏ hàng
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Lấy thông tin user
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // 2. Hàm cập nhật số lượng giỏ hàng thực tế
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      // Tính tổng số lượng (qty) của tất cả sản phẩm
      const total = cart.reduce((sum, item) => sum + (Number(item.qty || item.quantity) || 1), 0);
      setCartCount(total);
    };

    // Chạy lần đầu khi load trang
    updateCartCount();

    // Lắng nghe sự kiện thay đổi giỏ hàng từ các trang khác
    window.addEventListener('storage', updateCartCount);
    
    // Tạo một Event custom để cập nhật ngay trong cùng 1 tab
    window.addEventListener('cartUpdated', updateCartCount);

    // 3. Hiệu ứng cuộn trang
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return (
    <header className={`fixed-top ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-white py-3 border-bottom'}`} 
            style={{ transition: 'all 0.3s ease', zIndex: 1030 }}>
      <nav className="container navbar navbar-expand-lg">
        <div className="container-fluid px-0">
          
          <Link href="/" className="navbar-brand fw-bold fs-3 text-primary">
            HOANG <span className="text-dark">SNEAKER</span>
          </Link>

          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <form className="mx-auto d-none d-lg-flex position-relative" style={{ width: '35%' }} onSubmit={handleSearch}>
              <input 
                className="form-control ps-4 pe-5 rounded-pill bg-light border-0 py-2 shadow-none" 
                type="search" 
                placeholder="Tìm mẫu giày bạn thích..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted border-0" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            <ul className="navbar-nav mb-2 mb-lg-0 fw-bold small">
              <li className="nav-item">
                <Link href="/" className={`nav-link px-3 ${pathname === '/' ? 'text-primary' : ''}`}>TRANG CHỦ</Link>
              </li>
              <li className="nav-item">
                <Link href="/product" className={`nav-link px-3 ${pathname === '/product' ? 'text-primary' : ''}`}>CỬA HÀNG</Link>
              </li>
              <li className="nav-item">
                <Link href="/orders" className={`nav-link px-3 ${pathname === '/orders' ? 'text-primary' : ''}`}>LỊCH SỬ</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center ms-lg-3 gap-3">
              <Link href="/cart" className="position-relative text-dark text-decoration-none">
                <i className="bi bi-bag fs-4"></i>
                {/* HIỂN THỊ SỐ LƯỢNG THỰC TẾ Ở ĐÂY */}
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="dropdown">
                  <button className="btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 shadow-none" data-bs-toggle="dropdown">
                    <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                      <i className="bi bi-person text-primary fs-5"></i>
                    </div>
                    <span className="small fw-bold d-none d-md-inline">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 p-2 rounded-3" style={{ minWidth: '200px' }}>
                    <li className="px-3 py-1 small text-muted border-bottom mb-2">Chào, {user.name}</li>
                    
                    {user.role === 1 && (
                      <li><Link className="dropdown-item rounded-2 py-2 mb-1" href="/admin"><i className="bi bi-speedometer2 me-2"></i>Quản trị</Link></li>
                    )}
                    
                    <li><Link className="dropdown-item rounded-2 py-2 mb-1" href="/profile"><i className="bi bi-person-gear me-2"></i>Sửa thông tin</Link></li>
                    <li><Link className="dropdown-item rounded-2 py-2 mb-1" href="/orders"><i className="bi bi-clock-history me-2"></i>Lịch sử mua hàng</Link></li>
                    
                    <li><hr className="dropdown-divider opacity-50" /></li>
                    <li><button onClick={handleLogout} className="dropdown-item text-danger rounded-2 py-2"><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
                  </ul>
                </div>
              ) : (
                <Link href="/login" className="btn btn-dark rounded-pill px-4 fw-bold small">ĐĂNG NHẬP</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}