"use client";
import { useState, useEffect } from 'react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCats = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name: newName })
    });
    const data = await res.json();
    if (data.success) {
      setNewName('');
      fetchCats();
    } else alert(data.message);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa danh mục này?")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchCats();
    else alert(data.message);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-uppercase">Quản lý danh mục thương hiệu</h2>
      
      <div className="row g-4">
        {/* FORM THÊM MỚI */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Thêm thương hiệu mới</h5>
            <form onSubmit={handleAdd}>
              <input 
                type="text" 
                className="form-control rounded-pill mb-3" 
                placeholder="Ví dụ: Jordan, New Balance..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <button className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm">
                <i className="bi bi-plus-lg"></i> LƯU DANH MỤC
              </button>
            </form>
          </div>
        </div>

        {/* DANH SÁCH DANH MỤC */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Tên thương hiệu</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="ps-4 text-muted">#{cat.id}</td>
                    <td className="fw-bold">{cat.name}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}