import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { esc } from '../utils/img';

export default function Address() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ho_ten: '', sdt: '', dia_chi: '', mac_dinh: false });

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const list = await api.get('/api/user/dia-chi');
            setAddresses(list || []);
        } catch (e) {
            alert('❌ Lỗi tải danh sách địa chỉ: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/api/user/dia-chi', {
                ho_ten: form.ho_ten.trim(),
                sdt: form.sdt.trim(),
                dia_chi: form.dia_chi.trim(),
                mac_dinh: form.mac_dinh ? 1 : 0
            });
            alert('✅ Thêm địa chỉ mới thành công!');
            setShowModal(false);
            setForm({ ho_ten: '', sdt: '', dia_chi: '', mac_dinh: false });
            loadAddresses();
        } catch (e) {
            alert('❌ Lỗi: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await api.del('/api/user/dia-chi/' + id);
            loadAddresses();
        } catch (e) {
            alert('❌ Lỗi xóa địa chỉ: ' + e.message);
        }
    };

    return (
        <div className="container py-4">
            {/* Header Banner & Breadcrumb */}
            <div className="bg-light p-4 rounded-4 mb-4 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 shadow-sm">
                <div>
                    <h3 className="fw-bold text-primary mb-1 d-flex align-items-center">
                        <i className="fas fa-map-marked-alt me-2 text-success"></i>Sổ Địa Chỉ Giao Hàng Của Tôi
                    </h3>
                    <p className="text-muted mb-0 small">Quản lý các địa chỉ nhận hàng để thanh toán thuận tiện và nhanh chóng hơn</p>
                </div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 bg-white px-3 py-2 rounded-pill border">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Sổ Địa Chỉ</li>
                    </ol>
                </nav>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="bg-white p-4 rounded-4 shadow-sm border">
                        {/* Title Bar */}
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 mb-4 border-bottom gap-2">
                            <div>
                                <h5 className="fw-bold text-dark mb-0">Danh Sách Địa Chỉ Nhận Hàng</h5>
                                <span className="text-muted small">Tối đa lưu được các địa chỉ thường dùng (Nhà riêng, Cơ quan)</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-success text-white rounded-pill fw-bold px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fas fa-plus-circle"></i> Thêm Địa Chỉ Mới
                            </button>
                        </div>

                        {/* Address Cards */}
                        {loading ? (
                            <div className="text-center py-5 text-muted">
                                <span className="spinner-border spinner-border-sm me-2 text-primary" role="status"></span>
                                Đang tải sổ địa chỉ...
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                                <h6 className="text-muted mb-2">Bạn chưa thêm địa chỉ nhận hàng nào</h6>
                                <p className="text-muted small mb-3">Bấm nút "Thêm Địa Chỉ Mới" để lưu thông tin giao hàng ngay nhé!</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {addresses.map(a => (
                                    <div key={a.id} className="border rounded-3 p-3 p-md-4 bg-white shadow-sm transition-all hover-shadow d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="rounded-circle bg-success-subtle p-3 text-success d-none d-sm-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                                <i className="fas fa-home fs-5"></i>
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                                                    <h6 className="fw-bold text-dark mb-0 fs-6">{esc(a.ho_ten)}</h6>
                                                    <span className="text-muted">•</span>
                                                    <span className="fw-semibold text-primary">{esc(a.sdt)}</span>
                                                    {a.mac_dinh ? (
                                                        <span className="badge bg-success text-white px-2 py-1 rounded-pill small ms-1">
                                                            <i className="fas fa-check-circle me-1"></i> Mặc định
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <p className="mb-0 text-dark small leading-relaxed">
                                                    <i className="fas fa-map-marker-alt text-danger me-1 d-sm-none"></i>
                                                    {esc(a.dia_chi)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end align-items-center gap-2 pt-2 pt-md-0 border-top border-md-0">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1"
                                                onClick={() => handleDelete(a.id)}
                                            >
                                                <i className="fas fa-trash-alt"></i> Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL THÊM ĐỊA CHỈ MỚI */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold text-white mb-0 d-flex align-items-center">
                                    <i className="fas fa-map-marker-alt me-2"></i>Thêm Địa Chỉ Giao Hàng Mới
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    {/* Họ Tên Người Nhận */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Họ và tên người nhận <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><i className="fas fa-user text-muted"></i></span>
                                            <input
                                                type="text"
                                                name="ho_ten"
                                                className="form-control border-start-0"
                                                required
                                                placeholder="Ví dụ: Nguyễn Văn A"
                                                value={form.ho_ten}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Số Điện Thoại */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Số điện thoại nhận hàng <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><i className="fas fa-phone text-muted"></i></span>
                                            <input
                                                type="tel"
                                                name="sdt"
                                                className="form-control border-start-0"
                                                required
                                                placeholder="Ví dụ: 0987 654 321"
                                                value={form.sdt}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Địa Chỉ Chi Tiết */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Địa chỉ nhận hàng chi tiết <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><i className="fas fa-map-marked-alt text-muted"></i></span>
                                            <textarea
                                                name="dia_chi"
                                                className="form-control border-start-0"
                                                rows="3"
                                                required
                                                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                                                value={form.dia_chi}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Checkbox Đặt làm mặc định */}
                                    <div className="form-check form-switch mt-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="addr-default"
                                            name="mac_dinh"
                                            checked={form.mac_dinh}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold text-dark small" htmlFor="addr-default">
                                            Đặt địa chỉ này làm mặc định cho các đơn hàng tiếp theo
                                        </label>
                                    </div>
                                </div>

                                <div className="modal-footer bg-light py-3">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success text-white fw-bold rounded-pill px-4 shadow-sm" disabled={saving}>
                                        {saving ? 'Đang lưu...' : 'Lưu Địa Chỉ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
