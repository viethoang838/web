"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const primaryColor = "#1e293b";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Kiểm tra cấu trúc data trả về từ API của bạn
          if (data.success) {
            setOrders(data.orders);
          } else if (Array.isArray(data)) {
            setOrders(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusClass = (status) => {
    const base = "badge rounded-pill px-3 py-2 fw-bold ";
    if (status === 'Chờ xử lý' || status === 'Đang xử lý') return base + 'bg-warning-subtle text-warning';
    if (status === 'Đã giao') return base + 'bg-success-subtle text-success';
    return base + 'bg-danger-subtle text-danger';
  };

  if (loading) return (
    <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2 text-muted">Đang tải lịch sử mua hàng...</p>
    </div>
  );

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary p-2 rounded-3 me-3">
          <i className="bi bi-clock-history text-white fs-4"></i>
        </div>
        <h2 className="fw-bold mb-0 text-uppercase" style={{ color: primaryColor }}>
          Lịch sử mua hàng
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr className="text-muted small">
                  <th className="ps-4 py-3">MÃ ĐƠN</th>
                  <th>NGÀY ĐẶT</th>
                  <th>ĐỊA CHỈ GIAO HÀNG</th>
                  <th>TỔNG TIỀN</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-center">CHI TIẾT</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-dark">#ORD-{order.id}</td>
                    <td className="text-muted">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '250px' }}>
                      {order.address}
                    </td>
                    <td className="fw-bold" style={{ color: primaryColor }}>
                      {Number(order.total_price).toLocaleString()}đ
                    </td>
                    <td>
                      <span className={getStatusClass(order.status)}>
                        {order.status || 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="text-center">
<Link 
  href={`/orders/${order.id}`} 
  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
>
  Xem đơn
</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div className="mb-4">
            <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
          </div>
          <h4 className="text-muted fw-bold">BẠN CHƯA CÓ ĐƠN HÀNG NÀO</h4>
          <p className="text-muted mb-4">Hãy lướt xem các mẫu giày mới nhất tại cửa hàng nhé!</p>
          <Link href="/product" className="btn btn-lg px-5 text-white rounded-pill fw-bold shadow-sm" style={{ backgroundColor: primaryColor }}>
            MUA SẮM NGAY
          </Link>
        </div>
      )}
    </div>
  );
}