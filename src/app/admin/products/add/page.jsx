"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    stock: '',
    category_id: '' // Đây là nơi lưu ID danh mục
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Lỗi load danh mục:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nếu là category_id, ta chuyển sang kiểu số để chắc chắn Backend nhận đúng
    setProduct({ 
      ...product, 
      [name]: name === 'category_id' ? parseInt(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nhanh trước khi gửi
    if (!product.category_id) {
      alert("Vui lòng chọn danh mục thương hiệu!");
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (data.success) {
        alert("Đã thêm sản phẩm thành công.");
        router.push('/admin/products');
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h2 className="fw-bold mb-4 text-primary">THÊM GIÀY MỚI VÀO KHO</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold small mb-2">Tên đôi giày</label>
              <input type="text" name="name" className="form-control rounded-3" 
                     placeholder="Ví dụ: Nike Air Force 1" onChange={handleChange} required />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="fw-bold small mb-2">Giá bán (VNĐ)</label>
              <input type="number" name="price" className="form-control rounded-3" 
                     placeholder="Ví dụ: 2500000" onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold small mb-2">Danh mục thương hiệu</label>
              <select 
                name="category_id" 
                className="form-select rounded-3 border-primary shadow-sm" 
                onChange={handleChange} 
                value={product.category_id}
                required
              >
                <option value="">-- Chọn thương hiệu --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold small mb-2">Số lượng trong kho</label>
              <input type="number" name="stock" className="form-control rounded-3" 
                     placeholder="Số lượng nhập kho" onChange={handleChange} required />
            </div>

            <div className="col-md-12 mb-3">
              <label className="fw-bold small mb-2">Link ảnh sản phẩm</label>
              <input type="text" name="image" className="form-control rounded-3" 
                     placeholder="Dán link ảnh online..." onChange={handleChange} required />
            </div>

            <div className="col-md-12 mb-3">
              <label className="fw-bold small mb-2">Mô tả sản phẩm</label>
              <textarea name="description" className="form-control rounded-3" rows="4" 
                        placeholder="Chất liệu, màu sắc..." onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-5 fw-bold rounded-pill shadow">LƯU SẢN PHẨM</button>
            <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" 
                    onClick={() => router.back()}>HỦY BỎ</button>
          </div>
        </form>
      </div>
    </div>
  );
}