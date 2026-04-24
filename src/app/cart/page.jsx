"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Màu sắc chủ đạo của Hoàng
const primaryColor = "#1e293b";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm hỗ trợ ép kiểu số an toàn (Tránh lỗi NaN)
  const parseNumber = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    // Xóa tất cả ký tự không phải số (như dấu chấm, dấu phẩy trong chuỗi giá tiền)
    return Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    setLoading(false);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Phát sự kiện để Header cập nhật số lượng badge ngay lập tức
    window.dispatchEvent(new Event('storage'));
  };

  const updateQty = (id, change) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        // Kiểm tra cả qty hoặc quantity (phòng trường hợp lưu sai tên biến)
        const currentQty = parseNumber(item.qty || item.quantity || 1);
        const newQty = currentQty + change;
        return { ...item, qty: newQty > 0 ? newQty : 1, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id) => saveCart(cart.filter(item => item.id !== id));

  // Tính tổng tiền an toàn
  const total = cart.reduce((sum, item) => {
    const price = parseNumber(item.price);
    const qty = parseNumber(item.qty || item.quantity || 1);
    return sum + (price * qty);
  }, 0);

  if (loading) return <div className="container py-5 mt-5 text-center">Đang tải giỏ hàng...</div>;

  if (cart.length === 0) return (
    <div className="container text-center" style={{ py: '100px', marginTop: '150px' }}>
      <i className="bi bi-bag-x text-muted" style={{ fontSize: '5rem' }}></i>
      <h3 className="fw-bold mt-4">GIỎ HÀNG ĐANG TRỐNG</h3>
      <p className="text-muted">Có vẻ như bạn chưa chọn được đôi giày nào ưng ý.</p>
      <Link href="/product" className="btn btn-lg px-5 text-white rounded-pill mt-3 shadow-sm" style={{backgroundColor: primaryColor}}>
        QUAY LẠI MUA SẮM
      </Link>
    </div>
  );

  return (
    <div className="container py-5" style={{ marginTop: '100px' }}>
      <h2 className="fw-bold mb-5" style={{ color: primaryColor }}>GIỎ HÀNG CỦA BẠN</h2>
      
      <div className="row g-4">
        {/* BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr className="small text-muted text-uppercase">
                    <th className="ps-4 py-3">Sản phẩm</th>
                    <th>Giá</th>
                    <th className="text-center">Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const price = parseNumber(item.price);
                    const qty = parseNumber(item.qty || item.quantity || 1);
                    return (
                      <tr key={item.id}>
                        <td className="ps-4 py-4">
                          <div className="d-flex align-items-center">
                            <img src={item.image} width="70" height="70" className="rounded-3 me-3 object-fit-cover shadow-sm" alt={item.name} />
                            <div>
                              <div className="fw-bold text-dark">{item.name}</div>
                              <div className="text-muted small">Size: 42 (Mặc định)</div>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold">{price.toLocaleString()}đ</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="input-group input-group-sm" style={{ width: '110px' }}>
                              <button className="btn btn-outline-secondary rounded-start-pill" onClick={() => updateQty(item.id, -1)}>-</button>
                              <span className="input-group-text bg-white border-start-0 border-end-0 fw-bold justify-content-center" style={{width: '40px'}}>{qty}</span>
                              <button className="btn btn-outline-secondary rounded-end-pill" onClick={() => updateQty(item.id, 1)}>+</button>
                            </div>
                          </div>
                        </td>
                        <td className="fw-bold" style={{color: primaryColor}}>{(price * qty).toLocaleString()}đ</td>
                        <td className="pe-4 text-end">
                          <button onClick={() => removeItem(item.id)} className="btn btn-sm btn-outline-danger border-0 rounded-circle">
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/product" className="text-decoration-none fw-bold" style={{color: primaryColor}}>
              <i className="bi bi-arrow-left me-2"></i> TIẾP TỤC MUA SẮM
            </Link>
          </div>
        </div>

        {/* BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '120px' }}>
            <h5 className="fw-bold mb-4">TỔNG ĐƠN HÀNG</h5>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Tạm tính:</span>
              <span className="fw-semibold">{total.toLocaleString()}đ</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Vận chuyển:</span>
              <span className="text-success fw-bold small">MIỄN PHÍ</span>
            </div>
            <hr className="my-4 opacity-50" />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5">Thành tiền:</span>
              <span className="fw-bold fs-3" style={{color: primaryColor}}>{total.toLocaleString()}đ</span>
            </div>
            
            <Link 
              href="/checkout" 
              className="btn btn-lg w-100 py-3 rounded-pill fw-bold text-white shadow"
              style={{backgroundColor: primaryColor, border: 'none'}}
            >
              THANH TOÁN NGAY
            </Link>

            <div className="mt-4 p-3 bg-light rounded-3">
              <div className="d-flex gap-2 small text-muted">
                <i className="bi bi-shield-check text-success"></i>
                <span>Cam kết hàng chính hãng 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}