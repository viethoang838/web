"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); 
  const [categories, setCategories] = useState([]); // Lưu danh sách thương hiệu
  const [product, setProduct] = useState({
    name: '', 
    price: '', 
    image: '', 
    description: '', 
    stock: '', 
    category_id: '' // Đổi thành category_id cho khớp Database
  });

  useEffect(() => {
    // 1. Lấy dữ liệu cũ của sản phẩm
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setProduct(data);
      });

    // 2. Lấy danh sách danh mục để đổ vào Select box
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Lỗi load danh mục:", err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    if (data.success) {
      alert("Cập nhật thành công!");
      router.push('/admin/products');
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h2 className="fw-bold mb-4 text-warning text-uppercase">Chỉnh sửa sản phẩm #{id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-bold small mb-2">Tên sản phẩm</label>
              <input type="text" name="name" className="form-control rounded-3" value={product.name} onChange={handleChange} required />
            </div>
            
            <div className="col-md-6">
              <label className="fw-bold small mb-2">Giá bán (VNĐ)</label>
              <input type="number" name="price" className="form-control rounded-3" value={product.price} onChange={handleChange} required />
            </div>

            {/* MỤC CHỌN DANH MỤC - MỚI THÊM */}
            <div className="col-md-6">
              <label className="fw-bold small mb-2">Danh mục thương hiệu</label>
              <select 
                name="category_id" 
                className="form-select rounded-3" 
                value={product.category_id || ""} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Chọn thương hiệu --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold small mb-2">Số lượng tồn kho</label>
              <input type="number" name="stock" className="form-control rounded-3" value={product.stock} onChange={handleChange} required />
            </div>

            <div className="col-md-12">
              <label className="fw-bold small mb-2">Link ảnh</label>
              <input type="text" name="image" className="form-control rounded-3" value={product.image} onChange={handleChange} required />
            </div>
            
            <div className="col-md-12">
              <label className="fw-bold small mb-2">Mô tả</label>
              <textarea name="description" className="form-control rounded-3" rows="3" value={product.description} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-warning px-5 fw-bold text-white rounded-pill shadow-sm">
              CẬP NHẬT
            </button>
            <button type="button" className="btn btn-light px-4 rounded-pill" onClick={() => router.back()}>
              HỦY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}