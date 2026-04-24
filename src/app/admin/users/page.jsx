"use client";
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // 1. Lấy danh sách người dùng
  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      })
      .catch(err => console.error("Lỗi:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hàm đổi quyền (Role)
  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: parseInt(newRole) })
      });
      const data = await res.json();
      if (data.success) {
        // Cập nhật lại state tại chỗ để giao diện thay đổi
        setUsers(users.map(u => u.id === userId ? { ...u, role: parseInt(newRole) } : u));
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      alert("Không thể kết nối API!");
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold mb-4 text-uppercase">Quản lý người dùng & Phân quyền</h2>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th style={{ width: '200px' }}>Vai trò</th>
                <th>Ngày đăng ký</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-4 text-muted">#{u.id}</td>
                    <td className="fw-bold text-dark">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {/* SELECT ĐỂ ĐỔI QUYỀN TRỰC TIẾP */}
                      <select 
                        className={`form-select form-select-sm rounded-pill px-3 fw-bold ${u.role === 1 ? 'text-danger border-danger' : 'text-primary border-primary'}`}
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="0">Khách hàng</option>
                        <option value="1">Quản trị viên</option>
                      </select>
                    </td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'N/A'}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger rounded-pill px-3">
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Đang tải dữ liệu...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}