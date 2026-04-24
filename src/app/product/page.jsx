"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import ProductItem from "@/components/ProductItem"; // Hoàng kiểm tra đường dẫn component này nhé

function ProductListContent() {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // Lấy số trang từ URL (ví dụ: ?page=2)
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = 8; // Hoàng muốn 8 sản phẩm mỗi trang

    useEffect(() => {
        async function fetchData() {
            try {
                // Gọi API lấy toàn bộ sản phẩm
                let res = await fetch(`/api/products`); // Đảm bảo API này trả về mảng sản phẩm
                let data = await res.json();
                if (Array.isArray(data)) {
                    setProductList(data);
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="container py-5 text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Đang tải danh sách giày...</p>
        </div>
    );

    // --- LOGIC PHÂN TRANG ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(productList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        router.push(`/product?page=${pageNumber}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container py-5" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-uppercase m-0">Tất cả sản phẩm</h2>
                <span className="badge bg-light text-dark border p-2">Tổng: {productList.length} đôi</span>
            </div>

            {/* Grid hiển thị sản phẩm */}
            <div className="row g-4">
                {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                        <div key={product.id} className="col-6 col-md-4 col-lg-3">
                            <ProductItem product={product} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">Không có sản phẩm nào để hiển thị.</p>
                    </div>
                )}
            </div>

            {/* Bộ nút phân trang */}
            {totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center">
                    <ul className="pagination shadow-sm">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link px-3" onClick={() => handlePageChange(currentPage - 1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link px-3" onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link px-3" onClick={() => handlePageChange(currentPage + 1)}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

// Bọc trong Suspense để dùng được useSearchParams trong Next.js App Router
export default function ProductPage() {
    return (
        <Suspense fallback={<div className="text-center py-5">Đang tải dữ liệu...</div>}>
            <ProductListContent />
        </Suspense>
    );
}