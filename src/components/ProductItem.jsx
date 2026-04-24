import Link from 'next/link';

export default function ProductItem({ product }) {
  // Hàm render sao chuẩn
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} style={{ color: index < rating ? '#facc15' : '#d1d5db', fontSize: '14px' }}>
        ★
      </span>
    ));
  };

  // HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG
  const handleAddToCart = (e) => {
    e.preventDefault(); // Chặn việc chuyển trang khi bấm nút giỏ hàng

    // 1. Lấy giỏ hàng hiện tại từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Tìm xem sản phẩm đã có chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Nếu có rồi thì tăng số lượng
      cart[existingProductIndex].qty = (cart[existingProductIndex].qty || 1) + 1;
    } else {
      // Nếu chưa có thì thêm mới với qty = 1
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }

    // 3. Lưu lại vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // 4. PHÁT SỰ KIỆN ĐỂ HEADER CẬP NHẬT SỐ LƯỢNG NGAY LẬP TỨC
    window.dispatchEvent(new Event('cartUpdated'));

    // 5. Thông báo nhẹ (Có thể thay bằng Toast cho đẹp)
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="product-card">
      <div className="image-box">
        {product.hot === 1 && <div className="badge-hot">🔥 HOT</div>}
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img"
        />
      </div>
      
      <div className="product-details">
        <div className="star-container">
          {renderStars(product.rating || 5)}
        </div>
        
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="price-btn-section">
          <div>
            <span className="old-price">
              {(product.price * 1.2).toLocaleString()}đ
            </span>
            <span className="new-price">
              {Number(product.price).toLocaleString()}đ
            </span>
          </div>
          
          <div className="d-flex gap-2 align-items-center">
            {/* Nút thêm vào giỏ hàng nhanh */}
            <button 
              onClick={handleAddToCart}
              className="btn btn-sm btn-outline-dark rounded-circle"
              title="Thêm vào giỏ"
              style={{ width: '35px', height: '35px', padding: '0' }}
            >
              <i className="bi bi-cart-plus"></i>
            </button>

            <Link href={`/product/${product.id}`} className="btn-detail">
              Chi tiết →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}