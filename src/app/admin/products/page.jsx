"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (confirm("Chắc chắn muốn xóa đôi giày này không?")) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setProducts(products.filter(p => p.id !== id));
          alert("Đã xóa sản phẩm thành công!");
        } else {
          alert("Không thể xóa: " + data.message);
        }
      } catch (error) {
        alert("Lỗi kết nối Server!");
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-uppercase mb-0">Quản lý kho giày</h2>
          <p className="text-muted small mb-0">Danh sách các sản phẩm đang hiển thị trên cửa hàng</p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/categories" className="btn btn-outline-dark fw-bold rounded-pill px-4 shadow-sm">
            QUẢN LÝ DANH MỤC
          </Link>
          <Link href="/admin/products/add" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm">
            <i className="bi bi-plus-lg me-2"></i> THÊM GIÀY MỚI
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá niêm yết</th>
                <th>Tồn kho</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-4">
                      <img 
                        src={p.image || '/placeholder.jpg'} 
                        width="60" 
                        height="60" 
                        className="rounded-3 shadow-sm object-fit-cover" 
                        alt={p.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=No+Image"; }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{p.name}</div>
                      <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>ID: #{p.id}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary border">
                        {p.category_name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td>
                      <span className="text-danger fw-bold">
                        {Number(p.price).toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.stock > 10 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {p.stock || 0} đôi
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <Link href={`/admin/products/detail/${p.id}`} className="btn btn-sm btn-outline-info shadow-sm rounded-pill px-3">
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link href={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline-warning shadow-sm rounded-pill px-3">
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button className="btn btn-sm btn-outline-danger shadow-sm rounded-pill px-3" onClick={() => deleteProduct(p.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy sản phẩm nào trong kho.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}