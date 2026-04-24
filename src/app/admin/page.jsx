"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, newOrders: 0, totalUsers: 0, totalCategories: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const mainColor = "#1e293b";

  useEffect(() => {
    // 1. Gọi API thống kê
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats(prev => ({
            ...prev,
            totalRevenue: data.totalRevenue || 0,
            newOrders: data.newOrders || 0,
            totalUsers: data.totalUsers || 0,
            totalCategories: data.totalCategories || 0 // Nhận thêm biến này từ API
          }));
        }
      });

    // 2. Lấy nhanh danh sách danh mục để hiện thị bên dưới
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data.slice(0, 5)); // Lấy 5 cái mới nhất
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center mb-4">
        <div className="rounded-3 p-2 me-3 shadow-sm" style={{ backgroundColor: mainColor }}>
          <i className="bi bi-speedometer2 text-white fs-4"></i>
        </div>
        <h3 className="fw-bold m-0" style={{ color: mainColor }}>Tổng quan hệ thống</h3>
      </div>

      <div className="row g-4">
        {/* Card: Doanh thu */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-4 border-start border-primary border-5">
            <p className="text-muted small fw-bold mb-1 text-uppercase">Doanh thu</p>
            <h4 className="fw-bold mb-0">{Number(stats.totalRevenue).toLocaleString()}đ</h4>
          </div>
        </div>

        {/* Card: Đơn hàng */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-4 border-start border-success border-5">
            <p className="text-muted small fw-bold mb-1 text-uppercase">Đơn hàng</p>
            <h4 className="fw-bold mb-0">{stats.newOrders} đơn</h4>
          </div>
        </div>

        {/* Card: Danh mục (MỚI THÊM) */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-4 border-start border-warning border-5">
            <p className="text-muted small fw-bold mb-1 text-uppercase">Thương hiệu</p>
            <h4 className="fw-bold mb-0">{stats.totalCategories} mục</h4>
          </div>
        </div>

        {/* Card: Thành viên */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 rounded-4 border-start border-info border-5">
            <p className="text-muted small fw-bold mb-1 text-uppercase">Thành viên</p>
            <h4 className="fw-bold mb-0">{stats.totalUsers} người</h4>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Hoạt động gần đây</h5>
            <div className="text-center py-5 text-muted">
              <i className="bi bi-clock-history fs-1"></i>
              <p className="mt-2">Hệ thống đang hoạt động ổn định.</p>
            </div>
          </div>
        </div>

        {/* BẢNG DANH MỤC NHANH (MỚI THÊM) */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Danh mục</h5>
              <Link href="/admin/categories" className="btn btn-sm btn-outline-primary rounded-pill">Xem tất cả</Link>
            </div>
            <ul className="list-group list-group-flush">
              {categories.map(cat => (
                <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                  <span><i className="bi bi-tag-fill text-warning me-2"></i>{cat.name}</span>
                  <span className="badge bg-light text-dark rounded-pill border">ID: #{cat.id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}