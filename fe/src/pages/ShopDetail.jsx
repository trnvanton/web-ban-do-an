import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';

export default function ShopDetail() {
    const { id } = useParams();
    const { items, addItem } = useCart();
    const { user } = useAuth();
    const dialog = useDialog();
    const navigate = useNavigate();
    const location = useLocation();
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
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm!`, { title: 'Số Lượng Tối Đa' });
            return;
        }
        setQty(q => Math.min(q + 1, stock));
    };

    const handleAddToCart = async () => {
        if (!user) {
            const goLogin = await dialog.confirm('Bạn cần đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng và đặt mua.', {
                title: 'Yêu Cầu Đăng Nhập',
                type: 'warning',
                confirmText: 'Đăng nhập ngay',
                cancelText: 'Để sau'
            });
            if (goLogin) {
                navigate('/dang-nhap', { state: { from: location.pathname + location.search } });
            }
            return;
        }
        if (inCartQty + qty > stock) {
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm (bạn đã có ${inCartQty} trong giỏ hàng).`, {
                title: 'Số Lượng Không Đủ'
            });
            return;
        }
        addItem(product, qty);
        const viewCart = await dialog.confirm(`Đã thêm ${qty} x "${product.ten_san_pham}" vào giỏ hàng thành công! Bạn có muốn đến giỏ hàng ngay không?`, {
            title: 'Thêm Giỏ Hàng Thành Công',
            type: 'success',
            confirmText: 'Đến giỏ hàng',
            cancelText: 'Mua tiếp'
        });
        if (viewCart) {
            navigate('/gio-hang');
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            const goLogin = await dialog.confirm('Bạn cần đăng nhập tài khoản để đặt mua món ăn.', {
                title: 'Yêu Cầu Đăng Nhập',
                type: 'warning',
                confirmText: 'Đăng nhập ngay',
                cancelText: 'Để sau'
            });
            if (goLogin) {
                navigate('/dang-nhap', { state: { from: location.pathname + location.search } });
            }
            return;
        }
        if (inCartQty + qty > stock) {
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm (bạn đã có ${inCartQty} trong giỏ hàng).`, {
                title: 'Số Lượng Không Đủ'
            });
            return;
        }
        addItem(product, qty);
        navigate('/gio-hang');
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

    if (error || !product) {
        return (
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5 text-center">
                    <h3 className="text-danger mb-3">Không tải được món ăn</h3>
                    <p className="text-muted mb-4">{esc(error || 'Món ăn bạn tìm kiếm không tồn tại hoặc đã bị xóa.')}</p>
                    <Link to="/shop" className="btn btn-primary rounded-pill px-4 py-2">
                        <i className="fa fa-arrow-left me-2"></i>Quay lại thực đơn
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
                    <li className="breadcrumb-item"><Link to="/shop">Thực đơn</Link></li>
                    <li className="breadcrumb-item active text-white">{esc(product.ten_san_pham)}</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Single Product Start */}
            <div className="container-fluid py-5 mt-3">
                <div className="container py-4">
                    <div className="row g-5 mb-5 align-items-center">
                        {/* Hình ảnh sản phẩm */}
                        <div className="col-lg-6">
                            <div className="bg-white rounded-4 shadow-sm border p-4 text-center position-relative overflow-hidden" style={{ minHeight: 400 }}>
                                <div className="position-absolute top-0 start-0 m-3 z-index-2">
                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-bold small">
                                        <i className="fas fa-utensils me-1"></i> {product.danh_muc || 'Món ngon'}
                                    </span>
                                </div>
                                <img
                                    src={imgUrl(product.hinh_anh)}
                                    className="img-fluid rounded-4 transition-transform hover-scale"
                                    alt={esc(product.ten_san_pham)}
                                    style={{ maxHeight: 380, objectFit: 'contain', width: '100%' }}
                                />
                                <div className="d-flex justify-content-around mt-4 pt-3 border-top text-muted small">
                                    <span><i className="fas fa-truck-fast text-success me-1"></i> Giao nóng 30p</span>
                                    <span><i className="fas fa-shield-halved text-primary me-1"></i> An toàn 100%</span>
                                    <span><i className="fas fa-rotate-left text-warning me-1"></i> Đổi trả dễ dàng</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="col-lg-6">
                            <h2 className="fw-bold text-dark mb-2">{esc(product.ten_san_pham)}</h2>

                            {/* Đánh giá & Tình trạng kho */}
                            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                                <div className="d-flex align-items-center gap-1">
                                    <div className="text-warning small">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <i key={s} className={`fa ${s <= Math.round(reviewData.rating_average || 0) ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                        ))}
                                    </div>
                                    <span className="fw-bold text-dark small ms-1">
                                        {reviewData.total_reviews > 0 ? `${reviewData.rating_average} / 5` : 'Chưa có đánh giá'}
                                    </span>
                                    <span className="text-muted small">({reviewData.total_reviews} nhận xét)</span>
                                </div>
                                <span className="text-muted">|</span>
                                {isOutOfStock ? (
                                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2.5 py-1 rounded-pill small">
                                        <i className="fas fa-times-circle me-1"></i> Tạm hết hàng
                                    </span>
                                ) : (
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1 rounded-pill small">
                                        <i className="fas fa-check-circle me-1"></i> Còn {stock} suất trong kho
                                    </span>
                                )}
                            </div>

                            {/* Bảng giá hiện đại */}
                            <div className="p-3 bg-light rounded-4 mb-4 border d-flex align-items-baseline gap-2">
                                <span className="display-6 fw-bold text-success mb-0">{fmtVND(product.gia)}</span>
                                <span className="text-muted small">/ suất phần</span>
                            </div>

                            {/* Mô tả món ăn */}
                            <div className="mb-4">
                                <h6 className="fw-bold text-dark text-uppercase small mb-2">
                                    <i className="fas fa-align-left me-1 text-primary"></i> Mô tả chi tiết:
                                </h6>
                                <p className="text-muted lh-base mb-0" style={{ fontSize: '0.95rem' }}>
                                    {esc(product.mo_ta || 'Món ăn chế biến thơm ngon chuẩn vị đầu bếp, đảm bảo vệ sinh an toàn thực phẩm.')}
                                </p>
                            </div>

                            {/* Bộ chọn số lượng mua dạng Capsule Stepper chuyên nghiệp */}
                            <div className="mb-4 p-3 bg-light rounded-4 border">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold text-dark small">
                                        <i className="fas fa-calculator me-1 text-primary"></i> Số lượng đặt món:
                                    </span>
                                    <span className="text-muted small">
                                        Tạm tính: <strong className="text-success fs-6">{fmtVND((Number(product.gia) || 0) * qty)}</strong>
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-inline-flex align-items-center bg-white border border-2 rounded-pill p-1 shadow-sm">
                                        <button
                                            type="button"
                                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-dark hover-bg-light transition-all"
                                            style={{ width: 38, height: 38, border: 'none' }}
                                            id="qty-minus"
                                            onClick={minus}
                                            disabled={isOutOfStock || qty <= 1}
                                            title="Giảm số lượng"
                                        >
                                            <i className="fas fa-minus small"></i>
                                        </button>
                                        <span className="px-3 fw-bold fs-5 text-dark select-none" style={{ minWidth: 45, textAlign: 'center' }}>
                                            {qty}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-success hover-bg-light transition-all"
                                            style={{ width: 38, height: 38, border: 'none' }}
                                            id="qty-plus"
                                            onClick={plus}
                                            disabled={isOutOfStock || qty >= stock}
                                            title="Tăng số lượng"
                                        >
                                            <i className="fas fa-plus small"></i>
                                        </button>
                                    </div>
                                    <span className="text-muted small">
                                        (Kho còn {stock} suất)
                                    </span>
                                </div>
                            </div>

                            {/* Cụm nút hành động Đặt hàng (Thêm giỏ hàng + Mua ngay) */}
                            {isOutOfStock ? (
                                <button className="btn btn-secondary rounded-pill px-5 py-3 w-100 fw-bold shadow-sm" disabled>
                                    <i className="fas fa-ban me-2"></i> Món ăn này hiện đang tạm hết hàng
                                </button>
                            ) : (
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success rounded-pill px-4 py-3 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fas fa-cart-plus fs-5"></i>
                                        <span>Thêm Vào Giỏ Hàng</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary text-white rounded-pill px-4 py-3 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                                        onClick={handleBuyNow}
                                    >
                                        <i className="fas fa-bolt fs-5"></i>
                                        <span>Đặt Món Ngay</span>
                                    </button>
                                </div>
                            )}

                            {/* Dịch vụ cam kết */}
                            <div className="row g-2 pt-3 border-top">
                                <div className="col-6">
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <i className="fas fa-truck-fast text-success fs-5"></i>
                                        <span>Giao nhanh 30-45 phút</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <i className="fas fa-shield-halved text-primary fs-5"></i>
                                        <span>Đảm bảo vệ sinh 100%</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <i className="fas fa-rotate-left text-warning fs-5"></i>
                                        <span>Đổi trả nếu món có lỗi</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <i className="fas fa-credit-card text-info fs-5"></i>
                                        <span>VietQR &amp; COD tiện lợi</span>
                                    </div>
                                </div>
                            </div>
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
