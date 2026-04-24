"use client";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  // Thêm role vào state mặc định
  const [user, setUser] = useState({ id: '', name: '', email: '', phone: '', address: '', role: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const mainColor = "#1e293b";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role || 0 // Cực kỳ quan trọng: Lấy role để hiện nút Admin
      });
    }
    setLoading(false);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id;

    if (!userId) {
      setMessage({ type: 'danger', text: 'Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!' });
      return;
    }

    // Đảm bảo gửi kèm cả role để tránh mất dữ liệu quyền hạn trong localStorage
    const dataToSend = { ...user, id: userId };

    try {
      // Nhớ kiểm tra tên thư mục là 'user' hay 'users' nhé, mình để 'users' theo chuẩn
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(dataToSend));
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      } else {
        setMessage({ type: 'danger', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Lỗi kết nối server!' });
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) return <div className="text-center py-5 mt-5" style={{ color: mainColor }}>Đang tải...</div>;

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row g-4">
        
        {/* BÊN TRÁI: THẺ THÀNH VIÊN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div style={{ backgroundColor: mainColor, height: '100px' }}></div>
            <div className="card-body p-4 text-center" style={{ marginTop: '-60px' }}>
              <div className="position-relative d-inline-block mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-lg border border-4 border-white" 
                     style={{ width: '110px', height: '110px', backgroundColor: '#f8fafc' }}>
                  <i className="bi bi-person-fill" style={{ fontSize: '3.5rem', color: mainColor }}></i>
                </div>
              </div>
              
              <h4 className="fw-bold mb-1" style={{ color: mainColor }}>{user.name}</h4>
              <p className="text-muted small mb-3">{user.email}</p>
              
              <div className="list-group list-group-flush text-start rounded-3 overflow-hidden border">
                <button className="list-group-item list-group-item-action py-3 border-0 active" style={{ backgroundColor: mainColor }}>
                  <i className="bi bi-person-vcard me-3"></i> Hồ sơ cá nhân
                </button>

                <button onClick={() => window.location.href='/orders'} className="list-group-item list-group-item-action py-3 border-0">
                  <i className="bi bi-bag-check me-3"></i> Đơn hàng của tôi
                </button>

                {/* Kiểm tra role chuẩn xác */}
                {user.role === 1 && (
                  <button onClick={() => window.location.href='/admin'} className="list-group-item list-group-item-action py-3 border-0 text-primary fw-bold">
                    <i className="bi bi-speedometer2 me-3"></i> Trang quản trị
                  </button>
                )}

                <button onClick={handleLogout} className="list-group-item list-group-item-action py-3 border-0 text-danger">
                  <i className="bi bi-box-arrow-right me-3"></i> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: FORM CHỈNH SỬA */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center mb-4">
                <div className="rounded-3 p-2 me-3 shadow-sm" style={{ backgroundColor: mainColor }}>
                    <i className="bi bi-gear-fill text-white fs-4"></i>
                </div>
                <h3 className="fw-bold m-0" style={{ color: mainColor }}>Cài đặt tài khoản</h3>
            </div>
            
            {message.text && (
              <div className={`alert border-0 text-white shadow-sm rounded-3 mb-4 ${message.type === 'success' ? 'bg-success' : 'bg-danger'}`} 
                   style={{ backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444' }} role="alert">
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i> 
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: mainColor }}>Họ và tên</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light border-0 fs-6 rounded-3 py-3" 
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: mainColor }}>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light border-0 fs-6 rounded-3 py-3" 
                    value={user.phone}
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Địa chỉ Email (Cố định)</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg bg-light border-0 fs-6 rounded-3 py-3 text-muted" 
                    value={user.email} 
                    disabled 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold" style={{ color: mainColor }}>Địa chỉ nhận hàng</label>
                  <textarea 
                    className="form-control bg-light border-0 fs-6 rounded-3 py-3" 
                    rows="3"
                    value={user.address}
                    onChange={(e) => setUser({...user, address: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="mt-5 d-flex gap-3">
                <button type="submit" className="btn btn-lg px-5 rounded-pill fw-bold shadow-lg border-0 text-white"
                        style={{ backgroundColor: mainColor }}>
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}