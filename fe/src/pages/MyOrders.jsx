import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';

function statusBadge(trang_thai) {
    const s = trang_thai || 'Chờ xử lý';
    let color = 'bg-warning text-dark';
    let icon = 'fa-clock';
    if (s === 'Đang giao') { color = 'bg-info text-dark'; icon = 'fa-shipping-fast'; }
    if (s === 'Đã giao') { color = 'bg-primary text-white'; icon = 'fa-box'; }
    if (s === 'Đã hoàn thành') { color = 'bg-success text-white'; icon = 'fa-check-circle'; }
    if (s === 'Đã hủy') { color = 'bg-danger text-white'; icon = 'fa-times-circle'; }

    return (
        <span className={`badge ${color} px-3 py-2 rounded-pill fw-bold`}>
            <i className={`fas ${icon} me-1`}></i>{esc(s)}
        </span>
    );
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, Chờ xử lý, Đang giao, Đã giao, Đã hoàn thành, Đã hủy
    const [detail, setDetail] = useState(null);   // { id, items, trang_thai }
    const [detailLoading, setDetailLoading] = useState(false);

    // Trạng thái cho modal đánh giá
    const [reviewItem, setReviewItem] = useState(null); // { product_id, don_hang_id, ten_san_pham }
    const [reviewStars, setReviewStars] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const loadOrders = () => {
        setLoading(true);
        api.get('/api/user/don-hang')
            .then(list => setOrders(list || []))
            .catch(e => alert('❌ Lỗi tải lịch sử đơn hàng: ' + e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const confirmReceivedOrder = async (orderId) => {
        if (!confirm('Bạn xác nhận đã nhận đủ hàng và sản phẩm tươi ngon?')) return;
        try {
            const res = await api.put(`/api/user/don-hang/${orderId}/xac-nhan-da-nhan`);
            alert(res.message || '🎉 Đã xác nhận nhận hàng thành công!');
            loadOrders();
            if (detail && detail.id === orderId) {
                setDetail(prev => prev ? { ...prev, trang_thai: 'Đã hoàn thành' } : null);
            }
        } catch (e) {
            alert('❌ Lỗi xác nhận nhận hàng: ' + e.message);
        }
    };

    const viewOrderDetails = async (orderId, trangThai) => {
        setDetail({ id: orderId, items: [], trang_thai: trangThai });
        setDetailLoading(true);
        try {
            const items = await api.get('/api/don-hang/' + orderId + '/chi-tiet');
            setDetail({ id: orderId, items: items || [], trang_thai: trangThai });
        } catch (e) {
            alert('❌ Không thể kết nối để lấy chi tiết sản phẩm!');
            setDetail(null);
        } finally {
            setDetailLoading(false);
        }
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
            alert('🎉 ' + (res.message || 'Cảm ơn bạn đã gửi đánh giá!'));
            setReviewItem(null);
        } catch (err) {
            alert('❌ Lỗi khi gửi đánh giá: ' + err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    // Lọc danh sách đơn hàng theo Tab
    const filteredOrders = activeTab === 'ALL' 
        ? orders 
        : orders.filter(o => (o.trang_thai || 'Chờ xử lý') === activeTab);

    const TABS = [
        { key: 'ALL', label: 'Tất cả đơn', count: orders.length },
        { key: 'Chờ xử lý', label: 'Chờ xử lý', count: orders.filter(o => (o.trang_thai || 'Chờ xử lý') === 'Chờ xử lý').length },
        { key: 'Đang giao', label: 'Đang giao', count: orders.filter(o => o.trang_thai === 'Đang giao').length },
        { key: 'Đã giao', label: 'Đã giao', count: orders.filter(o => o.trang_thai === 'Đã giao').length },
        { key: 'Đã hoàn thành', label: 'Đã hoàn thành', count: orders.filter(o => o.trang_thai === 'Đã hoàn thành').length },
        { key: 'Đã hủy', label: 'Đã hủy', count: orders.filter(o => o.trang_thai === 'Đã hủy').length },
    ];

    return (
        <div className="container py-4">
            {/* Header Banner & Breadcrumb */}
            <div className="bg-light p-4 rounded-4 mb-4 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 shadow-sm">
                <div>
                    <h3 className="fw-bold text-primary mb-1 d-flex align-items-center">
                        <i className="fas fa-history me-2 text-success"></i>Lịch Sử Đơn Hàng Của Bạn
                    </h3>
                    <p className="text-muted mb-0 small">Theo dõi trạng thái giao hàng và quản lý tất cả đơn hàng đã mua</p>
                </div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 bg-white px-3 py-2 rounded-pill border">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Lịch sử đơn hàng</li>
                    </ol>
                </nav>
            </div>

            {/* Thanh Tab Lọc Trạng Thái (Shopee Style) */}
            <div className="bg-white p-2 rounded-4 shadow-sm border mb-4">
                <div className="d-flex flex-nowrap overflow-auto gap-2 py-1 px-2" style={{ scrollbarWidth: 'thin' }}>
                    {TABS.map(t => {
                        const isActive = activeTab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                className={`btn rounded-pill text-nowrap px-3 py-2 flex-shrink-0 fw-semibold transition-all ${
                                    isActive
                                        ? 'btn-primary text-white shadow-sm fw-bold'
                                        : 'btn-light text-dark border-0 hover-shadow'
                                }`}
                                onClick={() => setActiveTab(t.key)}
                            >
                                {t.label} {t.count > 0 && <span className={`badge ms-1 ${isActive ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>{t.count}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Khối Bảng Danh Sách Đơn Hàng */}
            <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
                {!loading && filteredOrders.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
                        <h5 className="text-muted mb-2">Không có đơn hàng nào trong mục này</h5>
                        <p className="text-muted small mb-4">Hãy mua sắm các sản phẩm tươi sạch VietGAP ngay nhé!</p>
                        <Link to="/shop" className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
                            <i className="fas fa-shopping-bag me-1"></i> Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark text-nowrap">
                                <tr className="py-3">
                                    <th className="py-3 ps-4">Mã Đơn</th>
                                    <th className="py-3">Người Nhận</th>
                                    <th className="py-3">Số Điện Thoại</th>
                                    <th className="py-3">Địa Chỉ Giao</th>
                                    <th className="py-3">Thanh Toán</th>
                                    <th className="py-3">Tổng Tiền</th>
                                    <th className="py-3">Ngày Đặt</th>
                                    <th className="py-3 text-center">Trạng Thái</th>
                                    <th className="py-3 text-end pe-4">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-5 text-muted">
                                            <span className="spinner-border spinner-border-sm me-2 text-primary" role="status"></span>
                                            Đang tải dữ liệu đơn hàng...
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(o => {
                                        const formattedDate = o.ngay_dat
                                            ? new Date(o.ngay_dat).toLocaleString('vi-VN')
                                            : 'Vừa xong';
                                        return (
                                            <tr key={o.id}>
                                                <td className="ps-4 fw-bold text-primary">#DH{esc(o.id)}</td>
                                                <td className="fw-bold">{esc(o.ten_khach_hang)}</td>
                                                <td>{esc(o.so_dien_thoai)}</td>
                                                <td 
                                                    style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                                                    title={esc(o.dia_chi)}
                                                >
                                                    {esc(o.dia_chi)}
                                                </td>
                                                <td>
                                                    {o.phuong_thuc_thanh_toan === 'BANK_QR' ? (
                                                        <span className="badge bg-info text-dark" title="Chuyển khoản QR">📲 VietQR</span>
                                                    ) : (
                                                        <span className="badge bg-secondary" title="Thanh toán COD">💵 COD</span>
                                                    )}
                                                </td>
                                                <td className="text-success fw-bold fs-6">{fmtVND(o.tong_tien)}</td>
                                                <td className="text-muted small text-nowrap">{esc(formattedDate)}</td>
                                                <td className="text-center">{statusBadge(o.trang_thai)}</td>
                                                <td className="pe-4 text-end text-nowrap">
                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                        {o.trang_thai === 'Đã giao' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
                                                                onClick={() => confirmReceivedOrder(o.id)}
                                                            >
                                                                <i className="fas fa-check-circle"></i> Đã Nhận Hàng
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                                                            onClick={() => viewOrderDetails(o.id, o.trang_thai)}
                                                        >
                                                            <i className="fas fa-eye"></i> Chi tiết
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL HIỂN THỊ CHI TIẾT ĐƠN HÀNG */}
            {detail && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center">
                                    <i className="fas fa-box-open me-2"></i>Chi Tiết Sản Phẩm Đơn Hàng #DH{esc(detail.id)}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setDetail(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {detailLoading ? (
                                    <p className="text-center text-muted py-5">
                                        <span className="spinner-border spinner-border-sm me-2 text-primary" role="status"></span>
                                        Đang tải chi tiết sản phẩm...
                                    </p>
                                ) : detail.items.length === 0 ? (
                                    <p className="text-center text-muted py-5">Không tìm thấy sản phẩm nào trong đơn hàng này.</p>
                                ) : (
                                    <div className="table-responsive rounded-3 border">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light text-nowrap">
                                                <tr>
                                                    <th>Hình ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Đơn giá</th>
                                                    <th className="text-center">Số lượng</th>
                                                    <th>Thành tiền</th>
                                                    <th className="text-end pe-3">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detail.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <img
                                                                src={imgUrl(item.hinh_anh)}
                                                                className="rounded border"
                                                                style={{ width: 55, height: 55, objectFit: 'cover' }}
                                                                alt={esc(item.ten_san_pham)}
                                                            />
                                                        </td>
                                                        <td className="fw-bold">{esc(item.ten_san_pham)}</td>
                                                        <td>{fmtVND(item.gia)}</td>
                                                        <td className="text-center fw-bold">{esc(item.so_luong)}</td>
                                                        <td className="fw-bold text-success">{fmtVND(item.gia * item.so_luong)}</td>
                                                        <td className="text-end pe-3 text-nowrap">
                                                            {detail.trang_thai === 'Đã hoàn thành' ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-warning fw-bold text-dark rounded-pill px-3"
                                                                    onClick={() => openReviewModal(item, detail.id)}
                                                                >
                                                                    <i className="fa fa-star me-1 text-warning"></i> Đánh giá 1-5⭐
                                                                </button>
                                                            ) : detail.trang_thai === 'Đã giao' ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm"
                                                                    onClick={() => confirmReceivedOrder(detail.id)}
                                                                >
                                                                    <i className="fa fa-check me-1"></i> Đã nhận hàng
                                                                </button>
                                                            ) : null}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-light py-3">
                                <button type="button" className="btn btn-secondary rounded-pill px-4 fw-bold" onClick={() => setDetail(null)}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GỬI ĐÁNH GIÁ SẢN PHẨM */}
            {reviewItem && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-warning text-dark py-3">
                                <h5 className="modal-title fw-bold mb-0">
                                    <i className="fa fa-star me-2"></i>Đánh Giá Sản Phẩm
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setReviewItem(null)}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <h6 className="fw-bold fs-5 mb-2">{esc(reviewItem.ten_san_pham)}</h6>
                                <p className="text-muted small mb-3">Mã đơn hàng: #DH{reviewItem.don_hang_id}</p>

                                {/* Chọn số sao */}
                                <div className="mb-3">
                                    <label className="d-block fw-bold mb-2">Chọn mức độ hài lòng của bạn:</label>
                                    <div className="d-flex justify-content-center gap-2 fs-3">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i
                                                key={star}
                                                className={`fa ${star <= reviewStars ? 'fa-star text-warning' : 'fa-star-o text-muted opacity-50'} cursor-pointer transition-transform`}
                                                style={{ cursor: 'pointer', transform: star === reviewStars ? 'scale(1.2)' : 'none' }}
                                                onClick={() => setReviewStars(star)}
                                            ></i>
                                        ))}
                                    </div>
                                    <span className="badge bg-light text-dark border mt-2 px-3 py-1 fw-normal">
                                        {reviewStars === 5 ? '😍 Rất tuyệt vời' : reviewStars === 4 ? '😊 Rất tốt' : reviewStars === 3 ? '😐 Bình thường' : reviewStars === 2 ? '😕 Chưa hài lòng' : '😞 Tệ'}
                                    </span>
                                </div>

                                {/* Nội dung nhận xét */}
                                <div className="text-start mb-3">
                                    <label className="form-label fw-bold small">Viết nhận xét của bạn:</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé (ví dụ: tươi ngon, giao nhanh)..."
                                        value={reviewContent}
                                        onChange={e => setReviewContent(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer bg-light py-3">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setReviewItem(null)}>
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
