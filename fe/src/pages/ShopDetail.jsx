import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

export default function ShopDetail() {
    const { id } = useParams();
    const { items, addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);

    const [reviewData, setReviewData] = useState({ total_reviews: 0, rating_average: 0, reviews: [] });

    useEffect(() => {
        window.scrollTo(0, 0);
        let mounted = true;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelated([]);
        setQty(1);

        (async () => {
            try {
                const p = await api.get('/api/san-pham/' + id);
                if (!mounted) return;
                setProduct(p);

                // Lấy đánh giá của sản phẩm
                api.get('/api/danh-gia/san-pham/' + id)
                    .then(data => {
                        if (mounted && data) {
                            setReviewData({
                                total_reviews: Number(data.total_reviews) || 0,
                                rating_average: Number(data.rating_average) || 0,
                                reviews: Array.isArray(data.reviews) ? data.reviews : []
                            });
                        }
                    })
                    .catch(() => {});

                try {
                    const all = await api.get('/api/san-pham');
                    if (!mounted) return;
                    const arr = Array.isArray(all) ? all : [];
                    setRelated(arr.filter(x => x.danh_muc === p.danh_muc && x.id !== p.id).slice(0, 4));
                } catch (e) {
                    // Lỗi tải sản phẩm liên quan không làm hỏng trang
                }
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    const stock = Number(product && product.so_luong_ton) || 0;
    const isOutOfStock = stock <= 0;
    const inCartQty = items.find(i => i.id === (product && product.id))?.quantity || 0;

    const minus = () => setQty(q => Math.max(1, q - 1));

    const plus = () => {
        if (qty + 1 > stock) {
            alert(`⚠️ Trong kho chỉ còn ${stock} sản phẩm!`);
            return;
        }
        setQty(q => Math.min(q + 1, stock));
    };

    const handleAddToCart = () => {
        if (inCartQty + qty > stock) {
            alert(`⚠️ Trong kho chỉ còn ${stock} sản phẩm!`);
            return;
        }
        addItem(product, qty);
        alert(`✅ Đã thêm ${qty} "${product.ten_san_pham}" vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <>
                <div className="container-fluid page-header py-5">
                    <h1 className="text-center text-white display-6">Chi Tiết Sản Phẩm</h1>
                </div>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5 text-center">
                    <h3 className="text-danger mb-3">Không tải được sản phẩm</h3>
                    <p className="text-muted mb-4">{esc(error)}</p>
                    <Link to="/shop" className="btn btn-primary rounded-pill px-4 py-2">
                        <i className="fa fa-arrow-left me-2"></i>Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Single Page Header start */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">{esc(product.ten_san_pham)}</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active text-white">{esc(product.ten_san_pham)}</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Single Product Start */}
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        {/* Hình ảnh sản phẩm */}
                        <div className="col-lg-6">
                            <div className="border rounded p-2 text-center bg-white">
                                <img
                                    src={imgUrl(product.hinh_anh)}
                                    className="img-fluid rounded"
                                    alt={product.ten_san_pham}
                                    style={{ maxHeight: 380, objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="col-lg-6">
                            <h4 className="fw-bold mb-3">{esc(product.ten_san_pham)}</h4>
                            <p className="mb-3 text-muted">
                                Danh mục: <span className="badge bg-warning text-dark ms-1">{esc(product.danh_muc || 'Nông sản')}</span>
                            </p>
                            <h4 className="fw-bold mb-3 text-success">{fmtVND(product.gia)}</h4>

                            <div className="d-flex align-items-center mb-3">
                                <div className="text-warning me-2 fs-5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <i key={s} className={`fa ${s <= Math.round(reviewData.rating_average || 0) ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                    ))}
                                </div>
                                <span className="fw-bold text-dark me-2">
                                    {reviewData.total_reviews > 0 ? `${reviewData.rating_average} / 5` : 'Chưa có đánh giá'}
                                </span>
                                <span className="text-muted small">({reviewData.total_reviews} nhận xét từ người mua)</span>
                            </div>

                            <p className="mb-3 text-secondary">
                                Tình trạng kho:&nbsp;
                                <strong className={isOutOfStock ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                    {isOutOfStock ? 'Hết hàng' : `Còn ${stock} sản phẩm trong kho`}
                                </strong>
                            </p>
                            <p className="mb-4 text-muted">{esc(product.mo_ta || 'Sản phẩm hữu cơ đạt chuẩn tươi sạch.')}</p>

                            {/* Bộ chọn số lượng mua */}
                            <div className="input-group quantity mb-4" style={{ width: 130 }}>
                                <div className="input-group-btn">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-minus rounded-circle bg-light border"
                                        id="qty-minus"
                                        onClick={minus}
                                        disabled={isOutOfStock}
                                    >
                                        <i className="fa fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" className="form-control form-control-sm text-center border-0 fw-bold" value={qty} readOnly />
                                <div className="input-group-btn">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-plus rounded-circle bg-light border"
                                        id="qty-plus"
                                        onClick={plus}
                                        disabled={isOutOfStock}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            {isOutOfStock ? (
                                <button className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-muted" disabled>
                                    <i className="fa fa-ban me-2 text-danger"></i> Hết hàng
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary fw-bold"
                                    onClick={handleAddToCart}
                                >
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                                </button>
                            )}
                        </div>
                    </div>

                    {/* KHỐI ĐÁNH GIÁ TỪ KHÁCH HÀNG */}
                    <div className="bg-light p-4 rounded-4 mb-5 border">
                        <h4 className="fw-bold mb-4">
                            <i className="fa fa-comments text-primary me-2"></i>Đánh Giá Từ Khách Hàng ({reviewData.total_reviews})
                        </h4>

                        {reviewData.reviews.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="fa fa-comment-dots fa-2x mb-2 d-block text-secondary"></i>
                                Chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên mua và đánh giá nhé!
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {reviewData.reviews.map(r => (
                                    <div key={r.id} className="bg-white p-3 rounded-3 border shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>
                                                    {(r.ten_user || 'K').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark">{esc(r.ten_user)}</h6>
                                                    <span className="text-muted small">
                                                        {r.ngay_danh_gia ? new Date(r.ngay_danh_gia).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-warning">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <i key={s} className={`fa ${s <= r.so_sao ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mb-0 text-secondary ps-5">{esc(r.noi_dung || 'Sản phẩm tươi ngon, đóng gói rất cẩn thận!')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sản phẩm liên quan */}
                    {related.length > 0 && (
                        <>
                            <h2 className="fw-bold mb-4">Sản Phẩm Tương Tự</h2>
                            <div className="row g-4">
                                {related.map(p => (
                                    <ProductCard key={p.id} p={p} compact />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Single Product End */}
        </>
    );
}
