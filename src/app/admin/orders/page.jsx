"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const primaryColor = "#1e293b";

  // 1. Lấy danh sách đơn hàng
  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // 2. Hàm cập nhật trạng thái (Giao hàng / Hủy)
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      alert("Không thể kết nối API!");
    }
  };

  const getStatusBadge = (status) => {
    const base = "badge px-3 py-2 rounded-pill shadow-sm ";
    if (status === 'Chờ xử lý' || status === 'Đang xử lý') return base + 'bg-warning-subtle text-warning';
    if (status === 'Đã giao') return base + 'bg-success-subtle text-success';
    return base + 'bg-danger-subtle text-danger';
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold mb-4 text-uppercase" style={{ color: primaryColor }}>Quản lý đơn hàng thực tế</h2>
      
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.customer_name}</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>{order.address}</small>
                    </td>
                    <td className="fw-bold text-dark">
                      {Number(order.total_price).toLocaleString()}đ
                    </td>
                    <td className="small text-muted">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status || 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {/* NÚT XEM CHI TIẾT MỚI THÊM */}
                        <Link 
                          href={`/admin/orders/${order.id}`} 
                          className="btn btn-sm btn-outline-info rounded-pill px-3 shadow-sm"
                        >
                          <i className="bi bi-eye-fill"></i> Chi tiết
                        </Link>

                        <div className="btn-group shadow-sm rounded-pill overflow-hidden border">
                          <button 
                            className="btn btn-sm btn-light border-end"
                            title="Xác nhận đã giao"
                            onClick={() => updateStatus(order.id, 'Đã giao')}
                            disabled={order.status === 'Đã giao' || order.status === 'Đã hủy'}
                          >
                            <i className="bi bi-check-circle-fill text-success me-1"></i> Giao
                          </button>
                          
                          <button 
                            className="btn btn-sm btn-light"
                            title="Hủy đơn hàng"
                            onClick={() => {
                              if(confirm("Bạn có chắc muốn hủy đơn #" + order.id + "?")) 
                              updateStatus(order.id, 'Đã hủy')
                            }}
                            disabled={order.status === 'Đã giao' || order.status === 'Đã hủy'}
                          >
                            <i className="bi bi-x-circle-fill text-danger me-1"></i> Hủy
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Chưa có đơn hàng nào để hiển thị.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}