"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'TỔNG QUAN', href: '/admin', icon: 'bi-speedometer2' },
    { name: 'QUẢN LÝ SẢN PHẨM', href: '/admin/products', icon: 'bi-box-seam' },
    { name: 'QUẢN LÝ ĐƠN HÀNG', href: '/admin/orders', icon: 'bi-cart-check' },
    { name: 'QUẢN LÝ TÀI KHOẢN', href: '/admin/users', icon: 'bi-people' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* SIDEBAR BÊN TRÁI - Giữ nguyên logic fixed của Hoàng */}
        <div className="col-md-3 col-lg-2 px-0 bg-dark min-vh-100 shadow position-fixed border-end border-secondary border-opacity-25" style={{ zIndex: 1040 }}>
          <div className="p-4 d-flex flex-column h-100">
            <div className="text-center mb-5">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-person-badge-fill text-white fs-3"></i>
              </div>
              <h6 className="text-white fw-bold mb-0 text-uppercase">Admin Panel</h6>
              <small className="text-secondary opacity-75">Hoàng Sneaker v1.0</small>
            </div>

            <div className="nav flex-column nav-pills flex-grow-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`nav-link text-white mb-2 py-3 px-4 rounded-3 d-flex align-items-center transition-all ${
                    pathname === item.href ? 'active bg-primary shadow' : 'opacity-75'
                  }`}
                  style={{ transition: '0.2s' }}
                >
                  <i className={`bi ${item.icon} me-3`}></i>
                  <span className="small fw-bold">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-4 px-3">
              <button onClick={handleLogout} className="btn btn-outline-danger w-100 fw-bold border-2 rounded-3 shadow-sm">
                <i className="bi bi-box-arrow-left me-2"></i> ĐĂNG XUẤT
              </button>
            </div>
          </div>
        </div>

        {/* NỘI DUNG BÊN PHẢI - Đã thêm PaddingTop 100px để không bị Header che */}
        <div className="col-md-9 col-lg-10 offset-md-3 offset-lg-2 bg-light px-4 min-vh-100" 
             style={{ paddingTop: '110px', paddingBottom: '40px' }}>
          <div className="bg-white p-4 rounded-4 shadow-sm min-vh-100">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
}