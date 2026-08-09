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
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Sổ Địa Chỉ</li>
                </ol>
            </nav>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="bg-white p-4 rounded shadow-sm border">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <h4 className="fw-bold mb-0 text-primary">
                                <i className="fas fa-map-marker-alt me-2"></i>Sổ Địa Chỉ Giao Hàng Của Tôi
                            </h4>
                            <button
                                type="button"
                                className="btn btn-success text-white rounded-pill btn-sm fw-bold px-3"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fas fa-plus me-1"></i> Thêm Địa Chỉ Mới
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-center text-muted py-4">Đang tải danh sách địa chỉ...</p>
                        ) : addresses.length === 0 ? (
                            <p className="text-muted text-center py-4">Bạn chưa lưu địa chỉ giao hàng nào.</p>
                        ) : (
                            addresses.map(a => (
                                <div key={a.id} className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center bg-light">
                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            {esc(a.ho_ten)} - {esc(a.sdt)}
                                            {a.mac_dinh ? <span className="badge bg-success ms-2">Mặc định</span> : null}
                                        </h6>
                                        <p className="mb-0 text-secondary small">{esc(a.dia_chi)}</p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        <i className="fas fa-trash"></i> Xóa
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL THÊM ĐỊA CHỈ MỚI */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">Thêm Địa Chỉ Giao Hàng</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Tên người nhận *</label>
                                        <input
                                            type="text"
                                            name="ho_ten"
                                            className="form-control"
                                            required
                                            placeholder="Ví dụ: Nguyễn Văn A"
                                            value={form.ho_ten}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Số điện thoại nhận hàng *</label>
                                        <input
                                            type="tel"
                                            name="sdt"
                                            className="form-control"
                                            required
                                            placeholder="Nhập số điện thoại..."
                                            value={form.sdt}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Địa chỉ chi tiết *</label>
                                        <textarea
                                            name="dia_chi"
                                            className="form-control"
                                            rows="3"
                                            required
                                            placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                                            value={form.dia_chi}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="addr-default"
                                            name="mac_dinh"
                                            checked={form.mac_dinh}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="addr-default">Đặt làm địa chỉ mặc định</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary text-white fw-bold" disabled={saving}>
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
