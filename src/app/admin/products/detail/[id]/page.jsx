"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function AdminProductDetail({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div className="text-center py-5">Đang tải...</div>;

  return (
    <div className="container py-4">
      <Link href="/admin/products" className="btn btn-outline-secondary mb-4 rounded-pill">
        <i className="bi bi-arrow-left"></i> Quay lại danh sách
      </Link>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-5">
            <img src={product.image} className="img-fluid h-100 object-fit-cover" alt={product.name} style={{ minHeight: '400px' }} />
          </div>
          <div className="col-md-7 p-5">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="badge bg-primary">ID: #{product.id}</span>
              {/* HIỂN THỊ TÊN DANH MỤC Ở ĐÂY */}
              <span className="badge bg-info-subtle text-info border border-info">
                <i className="bi bi-tag-fill me-1"></i>
                {product.category_name || "Chưa phân loại"}
              </span>
            </div>
            
            <h2 className="fw-bold mb-3">{product.name}</h2>
            
            <div className="mb-4">
              <h5 className="text-danger fw-bold fs-3 mb-0">
                {Number(product.price).toLocaleString('vi-VN')}đ
              </h5>
              {product.sale_price > 0 && (
                <small className="text-muted text-decoration-line-through">
                  Giá gốc: {Number(product.sale_price).toLocaleString('vi-VN')}đ
                </small>
              )}
            </div>

            <div className="row mb-4 g-3">
              <div className="col-6">
                <div className="p-3 bg-light rounded-3">
                  <p className="mb-1 text-muted small">Tồn kho</p>
                  <p className="fw-bold mb-0">{product.stock} đôi</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded-3">
                  <p className="mb-1 text-muted small">Trạng thái</p>
                  <p className={`fw-bold mb-0 ${product.hot ? 'text-warning' : 'text-success'}`}>
                    {product.hot ? '🔥 Sản phẩm Hot' : '✅ Bình thường'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-top pt-4">
              <h6 className="fw-bold mb-2">Mô tả sản phẩm:</h6>
              <p className="text-muted" style={{ lineHeight: '1.6' }}>
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
            
            <div className="mt-4 d-flex gap-2">
               <Link href={`/admin/products/edit/${product.id}`} className="btn btn-warning px-4 rounded-pill text-white fw-bold shadow-sm">
                 <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa sản phẩm
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}