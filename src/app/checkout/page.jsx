"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    method: 'cod'
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    // Tính tổng tiền trực tiếp từ giỏ hàng cho chắc chắn
    const currentTotal = savedCart.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    
    setCart(savedCart);
    setTotal(currentTotal);

    if (savedUser) {
      setUserId(savedUser.id);
      setFormData(prev => ({
        ...prev,
        fullName: savedUser.name || '',
        address: savedUser.address || ''
      }));
    } else {
      alert("Vui lòng đăng nhập để thanh toán!");
      router.push('/login');
    }
    
    if (savedCart.length === 0) router.push('/cart');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: userId,
        items: cart,
        total: total,
        address: formData.address,
        phone: formData.phone
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`ĐẶT HÀNG THÀNH CÔNG!`);
      localStorage.removeItem('cart');
      localStorage.removeItem('temp_total');
      router.push('/orders'); // Chuyển sang trang Lịch sử đơn hàng luôn
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="page-title text-center mb-5 fw-bold" style={{color: '#1e293b'}}>XÁC NHẬN THANH TOÁN</h1>
      
      <form onSubmit={handleOrder} className="checkout-container d-flex flex-wrap gap-4">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="checkout-card flex-grow-1 p-4 shadow-sm bg-white rounded-4">
          <h3 className="sub-title fw-bold mb-4">Thông tin giao hàng</h3>
          
          <div className="form-group mb-3">
            <label className="fw-bold small">Họ và tên người nhận</label>
            <input name="fullName" type="text" className="form-control" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group mb-3">
            <label className="fw-bold small">Số điện thoại</label>
            <input name="phone" type="tel" className="form-control" onChange={handleChange} required />
          </div>

          <div className="form-group mb-3">
            <label className="fw-bold small">Địa chỉ nhận hàng</label>
            <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange} required></textarea>
          </div>
        </div>

        {/* Cột phải: Đơn hàng */}
        <div className="summary-card p-4 shadow-sm bg-light rounded-4" style={{minWidth: '350px'}}>
          <h3 className="sub-title fw-bold mb-4">Đơn hàng của bạn</h3>
          <div className="checkout-items mb-4">
            {cart.map(item => (
              <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
                <span>{item.name} (x{item.qty || 1})</span>
                <strong className="text-primary">{((item.price) * (item.qty || 1)).toLocaleString()}đ</strong>
              </div>
            ))}
          </div>
          <div className="final-total d-flex justify-content-between align-items-center mb-4">
            <span className="fw-bold">Tổng cộng:</span>
            <span className="fs-4 fw-bold text-danger">{total.toLocaleString()}đ</span>
          </div>
          
          <button type="submit" className="btn btn-dark w-100 py-3 fw-bold rounded-pill text-uppercase">
            Xác nhận đặt hàng
          </button>
        </div>
      </form>
    </div>
  );
}