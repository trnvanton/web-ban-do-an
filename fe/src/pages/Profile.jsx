import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { user, loading } = useAuth();
    const [hoTen, setHoTen] = useState(user ? user.ho_ten : '');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [saving, setSaving] = useState(false);

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-grow text-primary" role="status"></div>
            </div>
        );
    }

    // Route đã chặn ở App.jsx (RequireLogin), user luôn tồn tại
    if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            await api.put('/api/user/cap-nhat', { ho_ten: hoTen.trim(), mat_khau_moi: matKhauMoi });
            alert('Cập nhật thông tin thành công!');
            window.location.reload();
        } catch (err) {
            alert('❌ ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const ngayTao = user.ngay_tao ? new Date(user.ngay_tao).toLocaleDateString('vi-VN') : '';
    const laAdmin = user.vai_tro === 'admin';

    return (
        <>
            {/* Single Page Header */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Tài Khoản &amp; Bảo Mật</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-white">Tài khoản</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Layout Chính */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Sidebar Trái: Thông tin nhanh */}
                    <div className="col-lg-4">
                        <div className="bg-white p-4 rounded shadow-sm text-center border">
                            <div className="d-inline-block rounded-circle overflow-hidden border border-2 border-primary mb-3" style={{ width: 100, height: 100 }}>
                                <img src={imgUrl('avatar.jpg')} alt="Avatar" className="img-fluid w-100 h-100 object-fit-cover" />
                            </div>
                            <h4 className="fw-bold mb-1">{esc(user.ho_ten || user.email)}</h4>
                            <p className="text-muted small mb-2">{esc(user.email)}</p>
                            <div className="mb-4">
                                {laAdmin ? (
                                    <span className="badge bg-success rounded-pill px-3 py-2"><i className="fas fa-shield-alt me-1"></i>Quản trị viên</span>
                                ) : (
                                    <span className="badge bg-secondary rounded-pill px-3 py-2"><i className="fas fa-user me-1"></i>Khách hàng</span>
                                )}
                                <span className="badge bg-light text-dark rounded-pill px-3 py-2 ms-2 border">
                                    <i className="fas fa-calendar-alt me-1 text-primary"></i>{esc(ngayTao)}
                                </span>
                            </div>

                            <div className="nav flex-column nav-pills text-start">
                                <button type="button" className="nav-link active py-3 fw-bold mb-2 rounded-pill">
                                    <i className="fas fa-shield-alt me-2" style={{ width: 20 }}></i> Tài Khoản &amp; Bảo Mật
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Nội dung Bên Phải */}
                    <div className="col-lg-8">
                        <div className="tab-content bg-white p-4 rounded shadow-sm border">
                            <h4 className="fw-bold mb-3 text-primary"><i className="fas fa-user-cog me-2"></i>Hồ Sơ &amp; Bảo Mật Tài Khoản</h4>
                            <p className="text-muted small mb-4">Quản lý thông tin định danh và bảo mật tài khoản của bạn để bảo vệ quyền riêng tư.</p>

                            {/* Form Cập nhật thông tin */}
                            <form onSubmit={handleSubmit}>
                                <h5 className="fw-bold text-dark mb-3">Thông Tin Cơ Bản</h5>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Họ và tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={hoTen}
                                        onChange={e => setHoTen(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email đăng nhập (Cố định)</label>
                                    <input type="email" className="form-control bg-light" value={esc(user.email)} readOnly />
                                    <small className="text-muted">Email dùng để đăng nhập hệ thống và không thể thay đổi.</small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Để trống nếu không đổi"
                                        minLength={6}
                                        value={matKhauMoi}
                                        onChange={e => setMatKhauMoi(e.target.value)}
                                    />
                                    <small className="text-muted">Tối thiểu 6 ký tự. Để trống nếu không muốn đổi mật khẩu.</small>
                                </div>
                                <button type="submit" className="btn btn-primary text-white rounded-pill px-4 fw-bold" disabled={saving}>
                                    {saving ? <i className="fas fa-spinner fa-spin me-1"></i> : <i className="fas fa-save me-1"></i>} Lưu Thay Đổi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
