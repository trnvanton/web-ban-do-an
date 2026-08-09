import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';

function statusBadge(trang_thai) {
    const s = trang_thai || 'Chờ xử lý';
    let color = 'bg-warning text-dark';
    if (s === 'Đang giao') color = 'bg-info text-dark';
    if (s === 'Đã giao' || s === 'Đã hoàn thành') color = 'bg-success';
    if (s === 'Đã hủy') color = 'bg-danger';
    return <span className={`badge ${color}`}>{esc(s)}</span>;
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null);   // { id, items, loading }
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        api.get('/api/user/don-hang')
            .then(list => setOrders(list || []))
            .catch(e => alert('❌ Lỗi tải lịch sử đơn hàng: ' + e.message))
            .finally(() => setLoading(false));
    }, []);

    const viewOrderDetails = async (orderId) => {
        setDetail({ id: orderId, items: [] });
        setDetailLoading(true);
        try {
            const items = await api.get('/api/don-hang/' + orderId + '/chi-tiet');
            setDetail({ id: orderId, items: items || [] });
        } catch (e) {
            alert('❌ Không thể kết nối để lấy chi tiết sản phẩm!');
            setDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Lịch Sử Đơn Hàng</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="bg-white p-4 rounded shadow-sm border">
                        <h3 className="fw-bold text-primary mb-4">
                            <i className="fas fa-history me-2"></i>Lịch Sử Đơn Hàng Của Bạn
                        </h3>

                        {!loading && orders.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-box-open fa-3x mb-3 text-secondary"></i>
                                <h5 className="text-muted mb-3">Bạn chưa có đơn hàng nào</h5>
                                <Link to="/shop" className="btn btn-primary text-white rounded-pill px-4 fw-bold">
                                    <i className="fas fa-shopping-bag me-1"></i> Mua sắm ngay
                                </Link>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Mã Đơn</th>
                                            <th>Người Nhận</th>
                                            <th>Số Điện Thoại</th>
                                            <th>Địa Chỉ Giao</th>
                                            <th>Tổng Tiền</th>
                                            <th>Ngày Đặt</th>
                                            <th>Trạng Thái</th>
                                            <th>Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4 text-muted">
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Đang tải lịch sử đơn hàng...
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map(o => {
                                                const formattedDate = o.ngay_dat
                                                    ? new Date(o.ngay_dat).toLocaleString('vi-VN')
                                                    : 'Vừa xong';
                                                return (
                                                    <tr key={o.id}>
                                                        <td className="fw-bold">#DH{esc(o.id)}</td>
                                                        <td>{esc(o.ten_khach_hang)}</td>
                                                        <td>{esc(o.so_dien_thoai)}</td>
                                                        <td>{esc(o.dia_chi)}</td>
                                                        <td className="text-success fw-bold">{fmtVND(o.tong_tien)}</td>
                                                        <td>{esc(formattedDate)}</td>
                                                        <td>{statusBadge(o.trang_thai)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-info"
                                                                onClick={() => viewOrderDetails(o.id)}
                                                            >
                                                                <i className="fas fa-eye"></i> Chi tiết
                                                            </button>
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
                </div>
            </div>

            {/* MODAL HIỂN THỊ CHI TIẾT ĐƠN HÀNG */}
            {detail && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">
                                    <i className="fas fa-box-open me-2"></i>Chi Tiết Đơn Hàng #DH{esc(detail.id)}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setDetail(null)}></button>
                            </div>
                            <div className="modal-body">
                                {detailLoading ? (
                                    <p className="text-center text-muted py-4">
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Đang tải chi tiết...
                                    </p>
                                ) : detail.items.length === 0 ? (
                                    <p className="text-center text-muted py-4">Không có thông tin sản phẩm trong đơn hàng này.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Hình ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Đơn giá</th>
                                                    <th>Số lượng</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detail.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <img
                                                                src={imgUrl(item.hinh_anh)}
                                                                className="rounded"
                                                                style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                                alt={esc(item.ten_san_pham)}
                                                            />
                                                        </td>
                                                        <td className="fw-bold">{esc(item.ten_san_pham)}</td>
                                                        <td>{fmtVND(item.gia)}</td>
                                                        <td className="text-center">{esc(item.so_luong)}</td>
                                                        <td className="fw-bold text-success">{fmtVND(item.gia * item.so_luong)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
