"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function OrderDetail({ params }) {
  const { id } = use(params); // Lấy ID đơn hàng từ URL
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/detail/${id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container py-5 text-center">Đang tải...</div>;

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <Link href="/orders" className="btn btn-sm btn-outline-secondary mb-4">
        ← Quay lại lịch sử
      </Link>
      <h3 className="fw-bold mb-4 text-uppercase">Chi tiết đơn hàng #{id}</h3>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <img src={item.image} width="50" className="rounded me-3" alt="" />
                    <span className="fw-bold">{item.name}</span>
                  </div>
                </td>
                <td>{Number(item.price).toLocaleString()}đ</td>
                <td>x{item.quantity}</td>
                <td className="fw-bold">{Number(item.price * item.quantity).toLocaleString()}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}