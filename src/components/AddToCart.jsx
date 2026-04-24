"use client";
import { useState } from 'react';

export default function AddToCart({ product }) {
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
    window.dispatchEvent(new Event('storage')); // Cập nhật số lượng trên Header nếu có
  };

  return (
    <div className="detail-action-group">
      {/* Bộ tăng giảm số lượng */}
      <div className="detail-qty-control">
        <button 
          className="detail-qty-btn" 
          onClick={() => setQty(Math.max(1, qty - 1))}
        >
          -
        </button>
        <input 
          type="number" 
          className="detail-qty-input" 
          value={qty} 
          readOnly 
        />
        <button 
          className="detail-qty-btn" 
          onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
        >
          +
        </button>
      </div>

      {/* Nút Thêm vào giỏ */}
      <button 
        className="btn-add-to-cart"
        onClick={handleAddToCart}
        disabled={product.countInStock <= 0}
      >
        {product.countInStock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
      </button>
    </div>
  );
}