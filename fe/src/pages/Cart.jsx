import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useDialog } from '../contexts/DialogContext';
import { imgUrl, esc, fmtVND } from '../utils/img';
import './Cart.css';

export default function Cart() {
    const { items, setQty, removeItem, total, count } = useCart();
    const dialog = useDialog();

    const changeQty = (item, delta) => {
        const next = item.quantity + delta;
        const max = item.stock || 9999;
        if (next > max) {
            dialog.warning(`Trong kho chỉ còn ${item.stock} sản phẩm!`, { title: 'Số Lượng Tối Đa' });
            return;
        }
        if (next < 1) return;
        setQty(item.id, next);
    };

    const onRemove = async (item) => {
        const ok = await dialog.confirm(`Bạn có chắc muốn xóa món "${item.name}" khỏi giỏ hàng?`, {
            title: 'Xóa Khỏi Giỏ Hàng',
            type: 'warning',
            confirmText: 'Xóa món',
            cancelText: 'Giữ lại'
        });
        if (ok) {
            removeItem(item.id);
        }
    };

    return (
        <div className="cart-page-wrapper pb-5">
            {/* Modern Header Banner with Stepper */}
            <div className="cart-header-banner mb-4">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h1 className="h2 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                <i className="fas fa-shopping-cart text-warning"></i> Giỏ Hàng Của Bạn
                            </h1>
                            <p className="text-white-50 mb-0 small">
                                Kiểm tra danh sách món ăn và nông sản tươi sạch trước khi đặt mua
                            </p>
                        </div>

                        {/* 3-Step Checkout Progression */}
                        <div className="cart-stepper-track">
                            <div className="cart-step-item active">
                                <span className="cart-step-circle">1</span>
                                <span>Giỏ hàng</span>
                            </div>
                            <span className="cart-step-arrow"><i className="fas fa-chevron-right"></i></span>
                            <div className="cart-step-item">
                                <span className="cart-step-circle">2</span>
                                <span>Thanh toán</span>
                            </div>
                            <span className="cart-step-arrow"><i className="fas fa-chevron-right"></i></span>
                            <div className="cart-step-item">
                                <span className="cart-step-circle">3</span>
                                <span>Hoàn tất</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Content */}
            <div className="container">
                {items.length === 0 ? (
                    <div className="cart-items-card text-center py-5 px-3 mx-auto my-4" style={{ maxWidth: 520 }}>
                        <div className="p-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 90, height: 90 }}>
                                <i className="fa fa-shopping-basket fa-3x text-muted opacity-75"></i>
                            </div>
                            <h4 className="fw-bold text-dark mb-2">Giỏ hàng đang trống</h4>
                            <p className="text-muted mb-4 small">
                                Bạn chưa có món ăn hoặc thực phẩm nào trong giỏ. Hãy dạo quanh thực đơn để chọn các món tươi ngon nhất nhé!
                            </p>
                            <Link to="/shop" className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
                                <i className="fa fa-utensils me-2"></i> Khám phá thực đơn ngay
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Cột Trái: Danh Sách Món */}
                        <div className="col-lg-8">
                            <div className="cart-items-card mb-4">
                                <div className="p-3 px-4 bg-white border-bottom d-flex align-items-center justify-content-between">
                                    <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                        <i className="fas fa-list-check text-success"></i>
                                        <span>Danh sách món đã chọn</span>
                                        <span className="cart-pill-count">
                                            {count} sản phẩm
                                        </span>
                                    </div>
                                    <Link to="/shop" className="text-decoration-none small text-success fw-semibold hover-primary">
                                        <i className="fas fa-plus-circle me-1"></i> Thêm món khác
                                    </Link>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-borderless align-middle mb-0">
                                        <thead className="cart-table-head">
                                            <tr>
                                                <th className="ps-4" style={{ minWidth: 260 }}>Sản phẩm</th>
                                                <th className="text-center" style={{ minWidth: 110 }}>Đơn giá</th>
                                                <th className="text-center" style={{ minWidth: 130 }}>Số lượng</th>
                                                <th className="text-end" style={{ minWidth: 120 }}>Thành tiền</th>
                                                <th className="text-center pe-4" style={{ width: 60 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id} className="cart-item-row border-bottom">
                                                    <td className="ps-4 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="cart-img-box">
                                                                <img
                                                                    src={imgUrl(item.image)}
                                                                    alt={esc(item.name)}
                                                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Link to={`/san-pham/${item.id}`} className="cart-item-title">
                                                                    {esc(item.name)}
                                                                </Link>
                                                                <div className="d-flex align-items-center gap-2 mt-1">
                                                                    <span className="badge bg-light text-secondary border small" style={{ fontSize: '11px' }}>
                                                                        {esc(item.category || 'Nông sản')}
                                                                    </span>
                                                                    <span className="text-muted small" style={{ fontSize: '11.5px' }}>
                                                                        Kho: {item.stock || 'Còn hàng'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3 text-muted fw-semibold">
                                                        {fmtVND(item.price)}
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <div className="cart-stepper">
                                                            <button
                                                                type="button"
                                                                className="cart-stepper-btn"
                                                                onClick={() => changeQty(item, -1)}
                                                                disabled={item.quantity <= 1}
                                                                title="Giảm 1"
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            <span className="cart-stepper-val">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                className="cart-stepper-btn"
                                                                onClick={() => changeQty(item, 1)}
                                                                disabled={item.stock && item.quantity >= item.stock}
                                                                title="Tăng 1"
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="text-end py-3">
                                                        <span className="fw-bold text-success fs-6">
                                                            {fmtVND(item.price * item.quantity)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center pe-4 py-3">
                                                        <button
                                                            type="button"
                                                            className="cart-delete-btn"
                                                            onClick={() => onRemove(item)}
                                                            title="Xóa món này"
                                                        >
                                                            <i className="fa fa-trash-alt small"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-3 px-4 bg-light d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <Link to="/shop" className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold">
                                        <i className="fa fa-arrow-left me-1"></i> Tiếp tục mua sắm
                                    </Link>
                                    <span className="text-muted small">
                                        <i className="fas fa-sparkles text-warning me-1"></i> Sản phẩm được tuyển chọn tươi mới mỗi ngày
                                    </span>
                                </div>
                            </div>

                            {/* Trust Guarantee Cards */}
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="trust-badge-item">
                                        <i className="fas fa-shield-check"></i>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>100% VietGAP</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>An toàn &amp; Hữu cơ</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="trust-badge-item">
                                        <i className="fas fa-truck-bolt"></i>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Giao Siêu Tốc 2h</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Đóng gói giữ nhiệt</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="trust-badge-item">
                                        <i className="fas fa-rotate-left"></i>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Đổi Trả 24h</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Nếu không tươi ngon</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột Phải: Tóm Tắt & Thanh Toán */}
                        <div className="col-lg-4">
                            <div className="cart-summary-card">
                                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <i className="fas fa-receipt text-success"></i> Tóm Tắt Đơn Hàng
                                </h5>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Tạm tính ({count} món):</span>
                                    <span className="fw-semibold text-dark">{fmtVND(total)}</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="cart-pill-freeship">
                                        <i className="fas fa-truck-fast me-1"></i> Miễn phí
                                    </span>
                                </div>

                                <hr className="my-3" />

                                <div className="d-flex justify-content-between align-items-baseline mb-4">
                                    <div>
                                        <div className="fw-bold text-dark fs-6">Tổng thanh toán:</div>
                                        <small className="text-muted" style={{ fontSize: '11.5px' }}>(Đã gồm VAT &amp; đóng gói)</small>
                                    </div>
                                    <div className="text-end">
                                        <span className="fw-bold text-success fs-4">{fmtVND(total)}</span>
                                    </div>
                                </div>

                                <Link to="/thanh-toan" className="cart-btn-checkout w-100 mb-3">
                                    <span>TIẾN HÀNH ĐẶT HÀNG</span>
                                    <i className="fas fa-arrow-right"></i>
                                </Link>

                                {/* Accepted Payments */}
                                <div className="bg-light rounded-3 p-3 text-center border">
                                    <div className="small text-muted mb-2 fw-semibold">Hỗ trợ thanh toán an toàn:</div>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        <span className="badge bg-white text-dark border px-2 py-1 small">
                                            📲 VietQR Tự Động
                                        </span>
                                        <span className="badge bg-white text-dark border px-2 py-1 small">
                                            💵 Tiền mặt COD
                                        </span>
                                        <span className="badge bg-white text-dark border px-2 py-1 small">
                                            🏦 Chuyển khoản
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
