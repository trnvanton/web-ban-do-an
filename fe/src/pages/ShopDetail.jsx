import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import './ShopDetail.css';

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
    const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'nutrition', 'reviews'

    const [reviewData, setReviewData] = useState({ total_reviews: 0, rating_average: 0, reviews: [] });

    useEffect(() => {
        window.scrollTo(0, 0);
        let mounted = true;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelated([]);
        setQty(1);
        setActiveTab('desc');

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
                    // Không chặn nếu lỗi tải món liên quan
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
            const goLogin = await dialog.confirm('Bạn cần đăng nhập tài khoản để thêm món vào giỏ hàng.', {
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
            <div className="shop-detail-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <div className="text-muted fw-semibold">Đang tải thông tin món ăn...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="shop-detail-wrapper py-5">
                <div className="container py-5 text-center">
                    <div className="card shadow-sm border-0 rounded-4 p-5 mx-auto" style={{ maxWidth: 500 }}>
                        <i className="fas fa-utensils-slash text-danger display-4 mb-3"></i>
                        <h4 className="fw-bold text-dark mb-2">Không tìm thấy món ăn</h4>
                        <p className="text-muted mb-4">{esc(error || 'Món ăn bạn tìm kiếm không tồn tại hoặc đã tạm dừng phục vụ.')}</p>
                        <Link to="/shop" className="btn btn-success rounded-pill px-4 py-2 fw-bold">
                            <i className="fas fa-arrow-left me-2"></i> Quay lại thực đơn
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const price = Number(product.gia) || 0;
    const subtotal = price * qty;
    const isReadyDish = (product.danh_muc || '').toLowerCase().includes('chế biến') || (product.danh_muc || '').toLowerCase().includes('món');

    return (
        <div className="shop-detail-wrapper">
            {/* Breadcrumb Bar */}
            <div className="detail-breadcrumb-bar">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <ul className="detail-breadcrumb">
                            <li><Link to="/"><i className="fas fa-house me-1"></i> Trang chủ</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li><Link to="/shop">Thực đơn</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li><Link to={`/shop?category=${encodeURIComponent(product.danh_muc || 'Tất cả')}`}>{esc(product.danh_muc || 'Món ngon')}</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li className="active-item">{esc(product.ten_san_pham)}</li>
                        </ul>
                        <Link to="/shop" className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold">
                            <i className="fas fa-arrow-left me-1"></i> Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Hero Product Card */}
                <div className="detail-hero-card">
                    <div className="row g-5 align-items-start">
                        {/* Cột trái: Hình ảnh & Cam kết dịch vụ */}
                        <div className="col-lg-5">
                            <div className="detail-image-box shadow-sm">
                                {/* Badges */}
                                <div className="detail-badge-top-left">
                                    <span className="badge bg-success bg-gradient px-3 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1">
                                        <i className="fas fa-utensils"></i> {esc(product.danh_muc || 'Món ngon')}
                                    </span>
                                </div>
                                <div className="detail-badge-top-right">
                                    {isOutOfStock ? (
                                        <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold shadow-sm">
                                            <i className="fas fa-ban me-1"></i> Hết hàng
                                        </span>
                                    ) : (
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold shadow-sm">
                                            <i className="fas fa-cubes text-success me-1"></i> Còn {stock} suất
                                        </span>
                                    )}
                                </div>

                                {/* Main Image */}
                                <img
                                    src={imgUrl(product.hinh_anh)}
                                    className="detail-main-img"
                                    alt={esc(product.ten_san_pham)}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                />
                            </div>

                            {/* Guarantee Grid */}
                            <div className="detail-guarantee-grid">
                                <div className="guarantee-pill">
                                    <div className="guarantee-icon green">
                                        <i className="fas fa-truck-fast"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Giao Nóng Hỏa Tốc</strong>
                                        <span>Chỉ 30 - 45 phút</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon blue">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Chuẩn VietGAP</strong>
                                        <span>100% Tươi sạch</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon orange">
                                        <i className="fas fa-rotate-left"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Đổi Trả Dễ Dàng</strong>
                                        <span>Bảo hành nếu lỗi</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon purple">
                                        <i className="fas fa-qrcode"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Thanh Toán Tiện Lợi</strong>
                                        <span>VietQR & COD</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin món ăn & Đặt hàng */}
                        <div className="col-lg-7">
                            <div className="ps-lg-2">
                                {/* Title */}
                                <h1 className="detail-title">{esc(product.ten_san_pham)}</h1>

                                {/* Rating & Stats */}
                                <div className="detail-meta-row">
                                    <div className="meta-rating">
                                        <div className="text-warning">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <i key={s} className={`fa ${s <= Math.round(reviewData.rating_average || 5) ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                            ))}
                                        </div>
                                        <span className="ms-1">{reviewData.rating_average > 0 ? reviewData.rating_average : '5.0'}</span>
                                    </div>
                                    <span className="text-muted">•</span>
                                    <span className="text-muted">{reviewData.total_reviews} nhận xét</span>
                                    <span className="text-muted">•</span>
                                    <span className="meta-sold"><i className="fas fa-fire text-danger me-1"></i>Đã bán 120+ suất</span>
                                </div>

                                {/* Price Box */}
                                <div className="detail-price-box">
                                    <div>
                                        <div className="detail-price-val">{fmtVND(price)}</div>
                                        <div className="detail-price-unit">Đơn vị: 1 suất phần đầy đủ</div>
                                    </div>
                                    <span className="badge bg-white text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                                        <i className="fas fa-tags me-1"></i> Tươi ngon mỗi ngày
                                    </span>
                                </div>

                                {/* Quick Specs */}
                                <div className="detail-specs-grid">
                                    <div className="spec-item">
                                        <i className="fas fa-clock"></i>
                                        <div><strong>Chuẩn bị:</strong> 15-20 phút</div>
                                    </div>
                                    <div className="spec-item">
                                        <i className="fas fa-utensils"></i>
                                        <div><strong>Khẩu phần:</strong> 1 người ăn</div>
                                    </div>
                                    <div className="spec-item">
                                        <i className="fas fa-bowl-food"></i>
                                        <div><strong>Hình thức:</strong> {isReadyDish ? 'Chế biến nóng hổi' : 'Tươi sống sơ chế'}</div>
                                    </div>
                                    <div className="spec-item">
                                        <i className="fas fa-box"></i>
                                        <div><strong>Đóng gói:</strong> Hộp giữ nhiệt an toàn</div>
                                    </div>
                                </div>

                                {/* Description excerpt */}
                                <div className="mb-4">
                                    <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.96rem' }}>
                                        {esc(product.mo_ta || 'Món ăn đậm đà chuẩn vị truyền thống, được chế biến từ các nguyên liệu tươi mới đạt chuẩn vệ sinh an toàn thực phẩm, đảm bảo cung cấp đầy đủ dinh dưỡng cho bữa cơm gia đình bạn.')}
                                    </p>
                                </div>

                                {/* Quantity & Subtotal */}
                                <div className="detail-action-card">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                                        <div>
                                            <label className="fw-bold text-dark d-block mb-1 small text-uppercase">
                                                <i className="fas fa-calculator text-success me-1"></i> Chọn số lượng:
                                            </label>
                                            <div className="stepper-capsule">
                                                <button
                                                    type="button"
                                                    className="stepper-btn"
                                                    onClick={minus}
                                                    disabled={isOutOfStock || qty <= 1}
                                                    title="Giảm"
                                                >
                                                    <i className="fas fa-minus small"></i>
                                                </button>
                                                <span className="stepper-val">{qty}</span>
                                                <button
                                                    type="button"
                                                    className="stepper-btn"
                                                    onClick={plus}
                                                    disabled={isOutOfStock || qty >= stock}
                                                    title="Tăng"
                                                >
                                                    <i className="fas fa-plus small"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <div className="text-muted small">Tạm tính thanh toán:</div>
                                            <div className="fs-4 fw-extrabold text-success">{fmtVND(subtotal)}</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {isOutOfStock ? (
                                        <button className="btn btn-secondary w-100 py-3 rounded-pill fw-bold" disabled>
                                            <i className="fas fa-ban me-2"></i> Món ăn này hiện đang tạm hết hàng
                                        </button>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                className="btn-add-cart-modern flex-grow-1"
                                                onClick={handleAddToCart}
                                            >
                                                <i className="fas fa-cart-plus fs-5"></i>
                                                <span>Thêm Vào Giỏ Hàng</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-buy-now-modern flex-grow-1"
                                                onClick={handleBuyNow}
                                            >
                                                <i className="fas fa-bolt fs-5"></i>
                                                <span>Đặt Món Ngay</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Hotline */}
                                <div className="p-3 bg-light rounded-4 border text-muted small d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div>
                                        <i className="fas fa-headset text-success me-2 fs-5 align-middle"></i>
                                        <span>Cần hỗ trợ tư vấn & đặt tiệc số lượng lớn?</span>
                                    </div>
                                    <a href="tel:0987654321" className="fw-bold text-success text-decoration-none">
                                        <i className="fas fa-phone-volume me-1"></i> 0987 654 321
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Information Section */}
                <div className="detail-tabs-wrapper">
                    <div className="custom-nav-tabs">
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                            onClick={() => setActiveTab('desc')}
                        >
                            <i className="fas fa-file-lines me-2"></i> Mô Tả Chi Tiết & Thưởng Thức
                        </button>
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
                            onClick={() => setActiveTab('nutrition')}
                        >
                            <i className="fas fa-heart-pulse me-2"></i> Nguyên Liệu & Dinh Dưỡng
                        </button>
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <i className="fas fa-comments me-2"></i> Đánh Giá Từ Khách Hàng ({reviewData.total_reviews})
                        </button>
                    </div>

                    {/* Tab 1: Mô tả chi tiết */}
                    {activeTab === 'desc' && (
                        <div className="tab-content-panel">
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fas fa-utensils text-success me-2"></i> Giới thiệu về {esc(product.ten_san_pham)}
                            </h5>
                            <p className="text-secondary lh-lg mb-4" style={{ fontSize: '1rem' }}>
                                {esc(product.mo_ta || 'Món ăn thơm ngon, hấp dẫn, được các đầu bếp giàu kinh nghiệm chăm chút từ khâu lựa chọn nguyên liệu tươi sạch đến từng bước chế biến. Món ăn giữ trọn vẹn hương vị tự nhiên và giá trị dinh dưỡng cao.')}
                            </p>

                            <div className="row g-4 mt-2">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">
                                            <i className="fas fa-lightbulb text-warning me-2"></i> Gợi ý thưởng thức ngon nhất:
                                        </h6>
                                        <ul className="text-secondary small mb-0 ps-3 lh-lg">
                                            <li>Dùng ngay khi món ăn còn nóng hổi sau khi nhận từ shipper.</li>
                                            <li>Kết hợp tuyệt vời cùng cơm trắng dẻo thơm, thêm một phần canh thanh mát và rau củ quả.</li>
                                            <li>Bảo quản trong ngăn mát tủ lạnh nếu chưa dùng hết trong vòng 24 giờ.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">
                                            <i className="fas fa-shield-heart text-success me-2"></i> Tiêu chuẩn chất lượng Fruitables:
                                        </h6>
                                        <ul className="text-secondary small mb-0 ps-3 lh-lg">
                                            <li>Thịt, hải sản và rau củ nhập tươi mỗi ngày từ các đối tác VietGAP uy tín.</li>
                                            <li>Không sử dụng phẩm màu công nghiệp hoặc chất bảo quản có hại.</li>
                                            <li>Quy trình bếp sạch 1 chiều đạt chứng nhận An Toàn Thực Phẩm.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Nguyên liệu & Dinh dưỡng */}
                    {activeTab === 'nutrition' && (
                        <div className="tab-content-panel">
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fas fa-seedling text-success me-2"></i> Thành Phần Nguyên Liệu Dự Kiến
                            </h5>
                            <p className="text-secondary mb-4 small">
                                Các nguyên liệu đều được định lượng cân đối theo tỉ lệ dinh dưỡng vàng cho một bữa ăn hoàn chỉnh:
                            </p>

                            <div className="row g-3 mb-4">
                                <div className="col-sm-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center border">
                                        <div className="text-muted small mb-1">Năng lượng ước tính</div>
                                        <div className="fs-5 fw-bold text-success">~ 450 - 580 kcal</div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center border">
                                        <div className="text-muted small mb-1">Protein (Đạm)</div>
                                        <div className="fs-5 fw-bold text-primary">~ 28 - 35g</div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center border">
                                        <div className="text-muted small mb-1">Chất xơ & Rau củ</div>
                                        <div className="fs-5 fw-bold text-warning">~ 120g</div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center border">
                                        <div className="text-muted small mb-1">Gia vị & Tinh bột</div>
                                        <div className="fs-5 fw-bold text-dark">Chuẩn định lượng</div>
                                    </div>
                                </div>
                            </div>

                            <div className="alert alert-success bg-opacity-10 border-success border-opacity-25 rounded-3 d-flex align-items-center gap-3">
                                <i className="fas fa-circle-check text-success fs-4"></i>
                                <div className="small">
                                    <strong>Ghi chú dị ứng:</strong> Nếu bạn có tiền sử dị ứng với hải sản, đậu phộng, hành tỏi hoặc bột ngọt, vui lòng ghi chú khi tạo đơn hàng để đầu bếp điều chỉnh phù hợp.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Đánh giá nhận xét */}
                    {activeTab === 'reviews' && (
                        <div className="tab-content-panel">
                            <div className="row g-4 align-items-center mb-4">
                                <div className="col-md-4">
                                    <div className="rating-summary-card">
                                        <div className="text-muted small mb-2">Đánh Giá Trung Bình</div>
                                        <div className="rating-score-huge text-warning">
                                            {reviewData.rating_average > 0 ? reviewData.rating_average : '5.0'}
                                        </div>
                                        <div className="text-warning my-2 fs-5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <i key={s} className={`fa ${s <= Math.round(reviewData.rating_average || 5) ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                            ))}
                                        </div>
                                        <div className="text-muted small">Dựa trên {reviewData.total_reviews} lượt đánh giá thực tế</div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">Chính sách đánh giá minh bạch</h6>
                                        <p className="text-muted small mb-0">
                                            Tất cả đánh giá đều được gửi từ các khách hàng đã hoàn thành đơn hàng tại Fruitables nhằm đảm bảo tính khách quan và chân thực nhất.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {reviewData.reviews.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-light rounded-4 border">
                                    <i className="far fa-comment-dots fa-3x mb-3 text-secondary opacity-50"></i>
                                    <h6 className="fw-bold text-dark">Chưa có đánh giá nào</h6>
                                    <p className="text-muted small mb-0">Hãy đặt món và trở thành người đầu tiên để lại nhận xét cho món ăn này nhé!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {reviewData.reviews.map(r => (
                                        <div key={r.id} className="review-item-card">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="review-avatar">
                                                        {(r.ten_user || 'K').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold mb-0 text-dark">{esc(r.ten_user || 'Khách hàng')}</h6>
                                                        <div className="text-muted small">
                                                            <i className="far fa-calendar-alt me-1"></i>
                                                            {r.ngay_danh_gia ? new Date(r.ngay_danh_gia).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                                            <span className="badge bg-success bg-opacity-10 text-success ms-2 fw-semibold">
                                                                <i className="fas fa-check-circle me-1"></i> Đã mua hàng
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-warning">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <i key={s} className={`fa ${s <= r.so_sao ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'}`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-0 text-secondary ps-md-5 pt-2" style={{ fontSize: '0.95rem' }}>
                                                {esc(r.noi_dung || 'Món ăn đóng gói rất cẩn thận, hương vị thơm ngon và giao nhanh!')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sản phẩm liên quan */}
                {related.length > 0 && (
                    <div className="mt-5 pt-3">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h3 className="fw-bold text-dark mb-1">
                                    <i className="fas fa-fire-flame-curved text-danger me-2"></i> Gợi Ý Món Ăn Cùng Danh Mục
                                </h3>
                                <p className="text-muted small mb-0">Các món ăn hấp dẫn khác bạn có thể thích trong thực đơn hôm nay</p>
                            </div>
                            <Link to={`/shop?category=${encodeURIComponent(product.danh_muc || 'Tất cả')}`} className="btn btn-outline-success rounded-pill btn-sm px-3 fw-bold">
                                Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {related.map(p => (
                                <ProductCard key={p.id} p={p} compact />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
