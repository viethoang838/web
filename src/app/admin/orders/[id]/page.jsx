"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminOrderDetail({ params }) {
  const { id } = use(params);
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy chi tiết các sản phẩm trong đơn hàng
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/orders/detail/${id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrderItems(data);
        }
        
        // 2. Lấy thông tin chung của đơn hàng (người mua, địa chỉ...) 
        // Bạn có thể lấy từ API danh sách đơn hàng hoặc tạo API riêng
        const resOrder = await fetch('/api/admin/orders');
        const allOrders = await resOrder.json();
        const currentOrder = allOrders.find(o => o.id == id);
        setOrderInfo(currentOrder);

      } catch (err) {
        console.error("Lỗi load chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <div className="text-center py-5">Đang tải chi tiết đơn hàng...</div>;
  if (!orderItems.length && !orderInfo) return <div className="text-center py-5">Không tìm thấy dữ liệu đơn hàng.</div>;

  return (
    <div className="container py-4">
      {/* Nút quay lại */}
      <button onClick={() => router.back()} className="btn btn-outline-secondary mb-4 rounded-pill px-4">
        <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
      </button>

      <div className="row g-4">
        {/* Thông tin khách hàng & Trạng thái */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-primary text-white py-3 rounded-top-4">
              <h5 className="mb-0 fw-bold">THÔNG TIN ĐƠN HÀNG</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-muted small d-block">Mã đơn hàng</label>
                <span className="fw-bold text-primary">#{id}</span>
              </div>
              <div className="mb-3">
                <label className="text-muted small d-block">Khách hàng</label>
                <span className="fw-bold">{orderInfo?.customer_name || "N/A"}</span>
              </div>
              <div className="mb-3">
                <label className="text-muted small d-block">Địa chỉ giao hàng</label>
                <span className="fw-bold">{orderInfo?.address || "N/A"}</span>
              </div>
              <div className="mb-3">
                <label className="text-muted small d-block">Ngày đặt hàng</label>
                <span className="fw-bold">
                  {orderInfo ? new Date(orderInfo.created_at).toLocaleString('vi-VN') : "N/A"}
                </span>
              </div>
              <div className="mb-0">
                <label className="text-muted small d-block">Trạng thái hiện tại</label>
                <span className={`badge rounded-pill ${
                  orderInfo?.status === 'Đã giao' ? 'bg-success' : 
                  orderInfo?.status === 'Đã hủy' ? 'bg-danger' : 'bg-warning'
                }`}>
                  {orderInfo?.status || "Chờ xử lý"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm đã đặt */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="ps-4">Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end pe-4">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt="" 
                            width="55" 
                            height="55" 
                            className="rounded-3 shadow-sm me-3 object-fit-cover" 
                          />
                          <div>
                            <div className="fw-bold">{item.name}</div>
                            <small className="text-muted">Mã SP: #{item.product_id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center fw-bold">x{item.quantity}</td>
                      <td className="text-end">{Number(item.price).toLocaleString()}đ</td>
                      <td className="text-end pe-4 fw-bold text-danger">
                        {Number(item.price * item.quantity).toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="3" className="text-end fw-bold py-3">TỔNG THANH TOÁN:</td>
                    <td className="text-end pe-4 fw-bold text-danger fs-5 py-3">
                      {Number(orderInfo?.total_price || 0).toLocaleString()}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-warning-subtle rounded-4 border border-warning-subtle">
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>Lưu ý:</strong> Admin vui lòng kiểm tra kỹ số lượng sản phẩm trong kho trước khi chuyển sang trạng thái "Đã giao".
          </div>
        </div>
      </div>
    </div>
  );
}