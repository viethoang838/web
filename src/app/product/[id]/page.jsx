"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const primaryColor = "#1e293b";

export default function ProductDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id; // Lấy ID từ URL
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setQuantity(1); // Reset số lượng về 1 khi đổi sản phẩm
      
      // 1. Lấy chi tiết sản phẩm hiện tại
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          
          // 2. Lấy danh sách sản phẩm liên quan (cùng category)
          fetch(`/api/products`)
            .then(res => res.json())
            .then(all => {
              const filtered = all.filter(p => p.categoryId === data.categoryId && p.id != id).slice(0, 4);
              setRelated(filtered);
            });
          setLoading(false);
          window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi sản phẩm
        })
        .catch(() => setLoading(false));
    }
  }, [id]); // CỰC KỲ QUAN TRỌNG: useEffect sẽ chạy lại mỗi khi ID thay đổi

  const handleAction = (isBuyNow = false) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item.id === product.id);
    if (index > -1) { cart[index].qty += quantity; } 
    else { cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: quantity }); }
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (isBuyNow) {
      localStorage.setItem('temp_checkout', JSON.stringify([{...product, qty: quantity}]));
      localStorage.setItem('temp_total', product.price * quantity);
      router.push('/checkout');
    } else {
      alert("ĐÃ THÊM VÀO GIỎ HÀNG THÀNH CÔNG!");
    }
  };

  if (loading) return <div className="container py-5 text-center fw-bold">ĐANG TẢI DỮ LIỆU...</div>;
  if (!product) return <div className="container py-5 text-center text-danger fw-bold">SẢN PHẨM KHÔNG TỒN TẠI!</div>;

  return (
    <div className="container my-5">
      {/* KHỐI CHI TIẾT SẢN PHẨM */}
      <div className="row g-4 p-4 bg-white rounded shadow-sm border mb-5">
        <div className="col-md-6 text-center">
          <img src={product.image} alt={product.name} className="img-fluid rounded border shadow-sm" style={{maxHeight: '450px'}} />
        </div>
        <div className="col-md-6">
          <h1 className="fw-bold text-uppercase">{product.name}</h1>
          <h3 className="my-3 fw-bold" style={{color: primaryColor}}>{Number(product.price).toLocaleString()}đ</h3>
          <p className="mb-2 fw-bold text-uppercase small text-secondary">TÌNH TRẠNG: {product.stock > 0 ? `CÒN HÀNG (${product.stock})` : "HẾT HÀNG"}</p>
          
          <div className="py-3 border-top">
            <h5 className="fw-bold text-uppercase small">Mô tả sản phẩm:</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="d-flex align-items-center mb-4">
            <span className="me-3 fw-bold text-uppercase small">Số lượng:</span>
            <div className="input-group" style={{ width: '130px' }}>
              <button className="btn btn-outline-dark" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="text" className="form-control text-center fw-bold" value={quantity} readOnly />
              <button className="btn btn-outline-dark" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button onClick={() => handleAction(true)} className="btn btn-lg flex-fill fw-bold text-white text-uppercase" style={{backgroundColor: primaryColor}} disabled={product.stock <= 0}>MUA NGAY</button>
            <button onClick={() => handleAction(false)} className="btn btn-outline-dark btn-lg flex-fill fw-bold text-uppercase" disabled={product.stock <= 0}>THÊM VÀO GIỎ</button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM LIÊN QUAN */}
      {related.length > 0 && (
        <div className="mt-5 pt-3">
          <h4 className="fw-bold mb-4 text-uppercase" style={{borderLeft: `5px solid ${primaryColor}`, paddingLeft: '15px'}}>Sản phẩm liên quan</h4>
          <div className="row g-4">
            {related.map(p => (
              <div key={p.id} className="col-md-3 col-6">
                <div className="card h-100 shadow-sm border-0 product-card-hover">
                  <Link href={`/products/${p.id}`}>
                    <img src={p.image} className="card-img-top p-2" alt={p.name} />
                  </Link>
                  <div className="card-body text-center p-2">
                    <h6 className="fw-bold text-truncate small text-uppercase mb-1">{p.name}</h6>
                    <p className="fw-bold mb-2" style={{color: primaryColor}}>{Number(p.price).toLocaleString()}đ</p>
                    <Link href={`/products/${p.id}`} className="btn btn-sm text-white w-100 fw-bold" style={{backgroundColor: primaryColor, fontSize: '0.8rem'}}>XEM CHI TIẾT</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}