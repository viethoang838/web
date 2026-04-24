"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductItem from "../components/ProductItem";

function HomeContent() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Lỗi load sản phẩm:", err));
  }, []);

  const getSortedData = (dataList) => {
    let list = [...dataList];
    if (sortBy === 'asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'desc') return list.sort((a, b) => b.price - a.price);
    return list; 
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  const searchResults = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5" style={{ marginTop: '70px' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 text-uppercase">
          {searchTerm ? `KẾT QUẢ: ${searchTerm}` : "CỬA HÀNG SNEAKER"}
        </h3>
        <select 
          className="form-select w-auto rounded-pill shadow-sm border-primary" 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Mặc định</option>
          <option value="asc">Giá: Thấp đến Cao ↑</option>
          <option value="desc">Giá: Cao đến Thấp ↓</option>
        </select>
      </div>

      {searchTerm ? (
        <div className="row g-4">
          {getSortedData(searchResults).map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProductItem product={p} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <section 
            className="hero-banner rounded-4 mb-5 text-center py-5 shadow text-white"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
                                url('https://png.pngtree.com/thumb_back/fh260/background/20220929/pngtree-shoes-promotion-banner-background-image_1466238.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '250px'
            }}
          >
            <div className="py-4">
              <h1 className="fw-bold display-4">HOANG SNEAKER 2026</h1>
              <p className="lead opacity-75">Nâng tầm phong cách của bạn</p>
            </div>
          </section>

          {/* 1. SECTION BÁN CHẠY */}
          <h4 className="fw-bold mb-4">🔥 BÁN CHẠY NHẤT</h4>
          <div className="row g-4 mb-5">
            {getSortedData(allProducts.filter(p => p.hot === 1)).slice(0, 8).map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProductItem product={p} />
              </div>
            ))}
          </div>

          {/* 2. SECTION GIẢM GIÁ */}
          <h4 className="fw-bold mb-4">🏷️ ĐANG GIẢM GIÁ</h4>
          <div className="row g-4 mb-5">
            {getSortedData(allProducts.filter(p => p.sale_price > 0)).slice(0, 8).map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProductItem product={p} />
              </div>
            ))}
          </div>

          {/* 3. SECTION HÀNG MỚI VỀ (Sửa logic ở đây) */}
{/* 3. SECTION HÀNG MỚI VỀ */}
<h4 className="fw-bold mb-4">✨ HÀNG MỚI VỀ</h4>
<div className="row g-4 mb-5">
  {allProducts && allProducts.length > 0 ? (
    getSortedData(
      [...allProducts]
        .sort((a, b) => b.id - a.id) // Sắp xếp theo ID giảm dần (mới nhất lên đầu)
        .slice(0, 8)                // Chỉ lấy 8 con mới nhất
    ).map(p => (
      <div key={p.id} className="col-6 col-md-4 col-lg-3">
        <ProductItem product={p} />
      </div>
    ))
  ) : (
    <p className="text-muted ps-3">Đang cập nhật sản phẩm mới...</p>
  )}
</div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Đang tải...</div>}>
      <HomeContent />
    </Suspense>
  );
}