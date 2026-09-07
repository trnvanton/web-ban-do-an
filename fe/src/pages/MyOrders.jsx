import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { useDialog } from '../contexts/DialogContext';
import { useCart } from '../contexts/CartContext';
import './MyOrders.css';

function renderStatusPill(status) {
    const s = status || 'Chờ xử lý';
    if (s === 'Đang giao') {
        return (
            <span className="order-status-pill status-shipping">
                <span className="pulse-dot"></span>
                <span>Đang giao hàng</span>
            </span>
        );
    }
    if (s === 'Đã giao') {
        return (
            <span className="order-status-pill status-delivered">
                <span className="pulse-dot"></span>
                <span>Đã giao tới nơi</span>
            </span>
        );
    }
    if (s === 'Đã hoàn thành') {
        return (
            <span className="order-status-pill status-completed">
                <i className="fas fa-check-circle me-1"></i>
                <span>Đã hoàn thành</span>
            </span>
        );
    }
    if (s === 'Đã hủy') {
        return (
            <span className="order-status-pill status-cancelled">
                <i className="fas fa-times-circle me-1"></i>
                <span>Đã hủy</span>
            </span>
        );
    }
    return (
        <span className="order-status-pill status-pending">
            <span className="pulse-dot"></span>
            <span>Chờ xử lý</span>
        </span>
    );
}

export default function MyOrders() {
    const dialog = useDialog();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const [detail, setDetail] = useState(null); // { id, items, trang_thai, order }
    const [detailLoading, setDetailLoading] = useState(false);

    // Review modal state
    const [reviewItem, setReviewItem] = useState(null);
    const [reviewStars, setReviewStars] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const list = await api.get('/api/user/don-hang');
            const ordersList = Array.isArray(list) ? list : [];

            // Eagerly fetch items for any order that does not have items yet
            const enriched = await Promise.all(
                ordersList.map(async (o) => {
                    if (Array.isArray(o.items) && o.items.length > 0) return o;
                    try {
                        const items = await api.get(`/api/don-hang/${o.id}/chi-tiet`);
                        return { ...o, items: Array.isArray(items) ? items : [] };
                    } catch (e) {
                        return { ...o, items: [] };
                    }
                })
            );
            setOrders(enriched);
        } catch (e) {
            console.error('Lỗi tải đơn hàng:', e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const confirmReceivedOrder = async (orderId) => {
        const ok = await dialog.confirm('Bạn xác nhận đã nhận đủ hàng và hài lòng với chất lượng món ăn?', {
            title: 'Xác Nhận Nhận Hàng',
            type: 'success',
            confirmText: 'Đã nhận đủ hàng',
            cancelText: 'Chưa nhận'
        });
        if (!ok) return;
        try {
            const res = await api.put(`/api/user/don-hang/${orderId}/xac-nhan-da-nhan`);
            dialog.alert(res.message || '🎉 Đã xác nhận nhận hàng thành công! Đơn đã chuyển sang Hoàn thành.', { title: 'Thành Công', type: 'success' });
            loadOrders();
            if (detail && detail.id === orderId) {
                setDetail(prev => prev ? { ...prev, trang_thai: 'Đã hoàn thành' } : null);
            }
        } catch (e) {
            dialog.alert('Lỗi xác nhận: ' + e.message, { title: 'Lỗi', type: 'error' });
        }
    };

    const viewOrderDetails = async (order) => {
        setDetail({ id: order.id, items: order.items || [], trang_thai: order.trang_thai, order });
        if (!order.items || order.items.length === 0) {
            setDetailLoading(true);
            try {
                const items = await api.get('/api/don-hang/' + order.id + '/chi-tiet');
                setDetail({ id: order.id, items: items || [], trang_thai: order.trang_thai, order });
            } catch (e) {
                dialog.alert('Không thể tải chi tiết sản phẩm!', { title: 'Lỗi', type: 'error' });
            } finally {
                setDetailLoading(false);
            }
        }
    };

    const handleReorder = (order) => {
        const itemsToReorder = order.items || [];
        if (itemsToReorder.length === 0) {
            dialog.warning('Không tìm thấy sản phẩm trong đơn này.');
            return;
        }
        itemsToReorder.forEach(item => {
            addItem({
                id: item.product_id || item.id,
                ten_san_pham: item.ten_san_pham,
                gia: item.gia,
                hinh_anh: item.hinh_anh
            }, item.so_luong || 1);
        });
        dialog.confirm(`Đã thêm ${itemsToReorder.length} món từ đơn #DH${order.id} vào giỏ hàng. Bạn có muốn đến giỏ hàng ngay không?`, {
            title: 'Mua Lại Thành Công',
            type: 'success',
            confirmText: 'Đến giỏ hàng',
            cancelText: 'Tiếp tục xem'
        }).then(goCart => {
            if (goCart) navigate('/gio-hang');
        });
    };

    const openReviewModal = (item, orderId) => {
        setReviewItem({
            product_id: item.product_id || item.id,
            don_hang_id: orderId,
            ten_san_pham: item.ten_san_pham
        });
        setReviewStars(5);
        setReviewContent('');
    };

    const submitReview = async () => {
        if (!reviewItem) return;
        setSubmittingReview(true);
        try {
            const res = await api.post('/api/danh-gia', {
                product_id: reviewItem.product_id,
                don_hang_id: reviewItem.don_hang_id,
                so_sao: reviewStars,
                noi_dung: reviewContent
            });
            dialog.alert(res.message || 'Cảm ơn bạn đã gửi đánh giá sản phẩm!', { title: 'Thành Công', type: 'success' });
            setReviewItem(null);
        } catch (err) {
            dialog.alert('Lỗi khi gửi đánh giá: ' + err.message, { title: 'Lỗi', type: 'error' });
        } finally {
            setSubmittingReview(false);
        }
    };

    const TABS = useMemo(() => [
        { key: 'ALL', label: 'Tất cả đơn', count: orders.length },
        { key: 'Chờ xử lý', label: 'Chờ xử lý', count: orders.filter(o => (o.trang_thai || 'Chờ xử lý') === 'Chờ xử lý').length },
        { key: 'Đang giao', label: 'Đang giao', count: orders.filter(o => o.trang_thai === 'Đang giao').length },
        { key: 'Đã giao', label: 'Đã giao', count: orders.filter(o => o.trang_thai === 'Đã giao').length },
        { key: 'Đã hoàn thành', label: 'Đã hoàn thành', count: orders.filter(o => o.trang_thai === 'Đã hoàn thành').length },
        { key: 'Đã hủy', label: 'Đã hủy', count: orders.filter(o => o.trang_thai === 'Đã hủy').length },
    ], [orders]);

    const filteredOrders = useMemo(() => {
        let list = activeTab === 'ALL'
            ? orders
            : orders.filter(o => (o.trang_thai || 'Chờ xử lý') === activeTab);

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            list = list.filter(o =>
                String(o.id).includes(term) ||
                (o.ten_khach_hang || '').toLowerCase().includes(term) ||
                (o.so_dien_thoai || '').includes(term) ||
                (o.dia_chi || '').toLowerCase().includes(term) ||
                (o.items && o.items.some(it => (it.ten_san_pham || '').toLowerCase().includes(term)))
            );
        }
        return list;
    }, [orders, activeTab, searchTerm]);

    return (
        <div className="orders-page-wrapper pb-5">
            {/* Header Banner */}
            <div className="orders-header-banner mb-4">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h1 className="h2 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                                <i className="fas fa-receipt text-warning"></i> Lịch Sử Đơn Hàng
                            </h1>
                            <p className="text-white-50 mb-0 small">
                                Theo dõi trạng thái giao hàng và chi tiết các món đã đặt
                            </p>
                        </div>
                        <div className="position-relative">
                            <i className="fas fa-search position-absolute text-muted" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem' }}></i>
                            <input
                                type="text"
                                className="orders-search-input"
                                placeholder="Tìm mã #DH, tên món, SĐT..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ minWidth: 260 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Status Filter Tab Pills */}
                <div className="orders-tab-container mb-4">
                    <div className="d-flex flex-nowrap overflow-auto gap-1" style={{ scrollbarWidth: 'none' }}>
                        {TABS.map(t => {
                            const isActive = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    className={`orders-tab-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveTab(t.key)}
                                >
                                    <span>{t.label}</span>
                                    <span className="tab-badge">{t.count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Orders Content */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success mb-3" role="status"></div>
                        <div className="text-muted fw-semibold small">Đang tải lịch sử đơn hàng...</div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="orders-empty-state mx-auto my-3" style={{ maxWidth: 520 }}>
                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                            <i className="fas fa-box-open fa-3x text-muted opacity-50"></i>
                        </div>
                        <h4 className="fw-bold text-dark mb-2">Không tìm thấy đơn hàng nào</h4>
                        <p className="text-muted small mb-4">
                            {searchTerm ? 'Không có đơn hàng nào khớp với từ khóa tìm kiếm.' : 'Bạn chưa có đơn hàng nào trong trạng thái này.'}
                        </p>
                        <Link to="/shop" className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
                            <i className="fas fa-shopping-bag me-1"></i> Khám phá sản phẩm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="row g-3">
                        {filteredOrders.map(order => {
                            const formattedDate = order.ngay_dat
                                ? new Date(order.ngay_dat).toLocaleString('vi-VN')
                                : 'Vừa xong';
                            const hasItems = Array.isArray(order.items) && order.items.length > 0;

                            return (
                                <div key={order.id} className="col-12">
                                    <div className="order-card">
                                        {/* Header */}
                                        <div className="order-card-header">
                                            <div className="d-flex align-items-center gap-2 gap-md-3 flex-wrap">
                                                <span className="order-id-badge">
                                                    <i className="fas fa-bag-shopping text-success me-1"></i>#DH{order.id}
                                                </span>
                                                <span className="text-muted small">
                                                    <i className="far fa-clock me-1"></i>{formattedDate}
                                                </span>
                                                {order.phuong_thuc_thanh_toan === 'BANK_QR' ? (
                                                    <span className="badge bg-info bg-opacity-10 text-dark border border-info border-opacity-25 small px-2 py-1">
                                                        📲 VietQR
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary bg-opacity-10 text-dark border small px-2 py-1">
                                                        💵 Tiền mặt COD
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                {renderStatusPill(order.trang_thai)}
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="order-card-body">
                                            {/* Danh Sách Món Ăn Trong Đơn Hàng */}
                                            <div className="mb-3">
                                                <div className="small text-muted fw-bold text-uppercase mb-2">
                                                    <i className="fas fa-utensils text-success me-1"></i>
                                                    Món đã mua ({hasItems ? order.items.length : 0} món):
                                                </div>

                                                {hasItems ? (
                                                    <div className="d-flex flex-column gap-2">
                                                        {order.items.map((it, idx) => (
                                                            <div key={idx} className="order-product-row">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img
                                                                        src={imgUrl(it.hinh_anh)}
                                                                        alt={esc(it.ten_san_pham)}
                                                                        className="order-product-img"
                                                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                                                    />
                                                                    <div>
                                                                        <div className="order-product-name">{esc(it.ten_san_pham)}</div>
                                                                        <div className="order-product-meta">
                                                                            <span className="order-product-qty">x{it.so_luong}</span>
                                                                            <span>Đơn giá: {fmtVND(it.gia)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-end ps-2">
                                                                    <span className="fw-bold text-success fs-6">{fmtVND(it.gia * it.so_luong)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-light rounded-3 text-muted small">
                                                        <i className="fas fa-info-circle me-1 text-primary"></i> Đang tải thông tin chi tiết các món...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Địa chỉ & Người nhận */}
                                            <div className="p-3 bg-light bg-opacity-75 rounded-3 border">
                                                <div className="row g-2 small">
                                                    <div className="col-md-5">
                                                        <div className="text-muted">Người nhận:</div>
                                                        <strong className="text-dark">{esc(order.ten_khach_hang)}</strong> • <span className="text-muted">{esc(order.so_dien_thoai)}</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="text-muted">Địa chỉ nhận hàng:</div>
                                                        <span className="text-dark">{esc(order.dia_chi)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="order-card-footer">
                                            <div className="d-flex align-items-baseline gap-2">
                                                <span className="text-muted small">Tổng thanh toán:</span>
                                                <span className="order-total-price">{fmtVND(order.tong_tien)}</span>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                {order.trang_thai === 'Đã giao' && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
                                                        onClick={() => confirmReceivedOrder(order.id)}
                                                    >
                                                        <i className="fas fa-check-circle"></i> Đã nhận hàng
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                                                    onClick={() => handleReorder(order)}
                                                    title="Đặt lại các món trong đơn này"
                                                >
                                                    <i className="fas fa-rotate-right"></i> Mua lại
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                                                    onClick={() => viewOrderDetails(order)}
                                                >
                                                    <i className="fas fa-eye"></i> Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ORDER DETAIL MODAL */}
            {detail && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-success text-white py-3 px-4">
                                <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center gap-2">
                                    <i className="fas fa-box-open"></i> Chi Tiết Đơn Hàng #DH{esc(detail.id)}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setDetail(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {detail.order && (
                                    <div className="bg-light rounded-3 p-3 mb-3 border">
                                        <div className="row g-2 small">
                                            <div className="col-md-6">
                                                <strong>Người nhận:</strong> {esc(detail.order.ten_khach_hang)} ({esc(detail.order.so_dien_thoai)})
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Trạng thái:</strong> {esc(detail.order.trang_thai || 'Chờ xử lý')}
                                            </div>
                                            <div className="col-12">
                                                <strong>Địa chỉ giao:</strong> {esc(detail.order.dia_chi)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {detailLoading ? (
                                    <p className="text-center text-muted py-4">
                                        <span className="spinner-border spinner-border-sm me-2 text-success" role="status"></span>
                                        Đang tải chi tiết các món ăn...
                                    </p>
                                ) : detail.items.length === 0 ? (
                                    <p className="text-center text-muted py-4">Không tìm thấy sản phẩm nào trong đơn hàng này.</p>
                                ) : (
                                    <div className="table-responsive rounded-3 border">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light text-muted small text-uppercase">
                                                <tr>
                                                    <th className="py-2 ps-3">Hình ảnh</th>
                                                    <th className="py-2">Món ăn / Sản phẩm</th>
                                                    <th className="py-2">Đơn giá</th>
                                                    <th className="py-2 text-center">Số lượng</th>
                                                    <th className="py-2 text-end">Thành tiền</th>
                                                    <th className="py-2 text-end pe-3">Đánh giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detail.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="ps-3 py-2">
                                                            <img
                                                                src={imgUrl(item.hinh_anh)}
                                                                className="rounded border"
                                                                style={{ width: 48, height: 48, objectFit: 'cover' }}
                                                                alt={esc(item.ten_san_pham)}
                                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                                            />
                                                        </td>
                                                        <td className="fw-semibold text-dark">{esc(item.ten_san_pham)}</td>
                                                        <td className="text-muted">{fmtVND(item.gia)}</td>
                                                        <td className="text-center fw-bold">{esc(item.so_luong)}</td>
                                                        <td className="text-end fw-bold text-success">{fmtVND(item.gia * item.so_luong)}</td>
                                                        <td className="text-end pe-3 text-nowrap">
                                                            {detail.trang_thai === 'Đã hoàn thành' ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-warning text-dark fw-semibold rounded-pill px-3"
                                                                    onClick={() => openReviewModal(item, detail.id)}
                                                                >
                                                                    <i className="fa fa-star text-warning me-1"></i> Đánh giá
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted small">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-light py-2 px-4 d-flex justify-content-between">
                                <div className="fw-bold text-dark">
                                    Tổng cộng: <span className="text-success fs-5 ms-1">{detail.order ? fmtVND(detail.order.tong_tien) : ''}</span>
                                </div>
                                <button type="button" className="btn btn-secondary rounded-pill px-4 fw-semibold" onClick={() => setDetail(null)}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REVIEW MODAL */}
            {reviewItem && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-warning text-dark py-3 px-4">
                                <h5 className="modal-title fw-bold mb-0">
                                    <i className="fa fa-star me-2"></i>Đánh Giá Món Ăn
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setReviewItem(null)}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <h6 className="fw-bold fs-5 mb-1">{esc(reviewItem.ten_san_pham)}</h6>
                                <p className="text-muted small mb-3">Mã đơn hàng: #DH{reviewItem.don_hang_id}</p>

                                <div className="mb-3">
                                    <label className="d-block fw-bold mb-2 small text-uppercase text-muted">Mức độ hài lòng của bạn:</label>
                                    <div className="d-flex justify-content-center gap-2 fs-2 text-warning">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i
                                                key={star}
                                                className={`${star <= reviewStars ? 'fas fa-star' : 'far fa-star opacity-40'} cursor-pointer`}
                                                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                                onClick={() => setReviewStars(star)}
                                            ></i>
                                        ))}
                                    </div>
                                    <span className="badge bg-light text-dark border mt-2 px-3 py-1">
                                        {reviewStars === 5 ? '😍 Rất tuyệt vời' : reviewStars === 4 ? '😊 Hài lòng' : reviewStars === 3 ? '😐 Bình thường' : reviewStars === 2 ? '😕 Chưa tốt' : '😞 Rất tệ'}
                                    </span>
                                </div>

                                <div className="text-start mb-3">
                                    <label className="form-label fw-bold small">Cảm nhận chi tiết:</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Hãy chia sẻ cảm nhận thực tế về món ăn (độ tươi ngon, hương vị, giao hàng)..."
                                        value={reviewContent}
                                        onChange={e => setReviewContent(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer bg-light py-2 px-4">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setReviewItem(null)}>
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm"
                                    onClick={submitReview}
                                    disabled={submittingReview}
                                >
                                    {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
