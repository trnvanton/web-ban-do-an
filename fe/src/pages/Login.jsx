import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { esc } from '../utils/img';

// Chuyển redirectUrl legacy (.html) sang route React
function redirectTo(url) {
    if (!url) return '/';
    return url.replace('/admin.html', '/admin').replace('/index.html', '/');
}

// Style port từ legacy/login.html (auth-card / auth-header / btn-organic)
const styles = {
    card: {
        border: 'none',
        borderRadius: 15,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        background: '#ffffff',
        overflow: 'hidden'
    },
    header: {
        background: 'linear-gradient(135deg, #81c408 0%, #5d8e05 100%)',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center'
    },
    brandTitle: {
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 800
    },
    tabLink: {
        color: '#6c757d',
        fontWeight: 600,
        borderRadius: 30,
        padding: '10px 25px'
    },
    tabLinkActive: {
        backgroundColor: '#81c408',
        color: '#ffffff'
    },
    btnOrganic: {
        backgroundColor: '#81c408',
        color: 'white',
        fontWeight: 600,
        borderRadius: 30,
        padding: 12,
        transition: 'all 0.3s ease'
    }
};

export default function Login() {
    const { user, loading, login, register } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-grow text-primary" role="status"></div>
            </div>
        );
    }

    // Đã đăng nhập -> về trang chủ
    if (user) return <Navigate to="/" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(loginEmail, loginPassword);
            alert('✅ Đăng nhập thành công!');
            navigate(redirectTo(data.redirectUrl));
        } catch (err) {
            alert('❌ ' + err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(regName, regEmail, regPassword);
            alert('✅ Đăng ký thành công!');
            navigate('/');
        } catch (err) {
            alert('❌ ' + err.message);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="auth-card" style={styles.card}>

                        {/* Header xanh chủ đạo */}
                        <div className="auth-header" style={styles.header}>
                            <Link to="/" className="text-decoration-none">
                                <h1 className="text-white brand-title m-0" style={styles.brandTitle}>Fruitables</h1>
                            </Link>
                            <p className="text-white-50 m-0 mt-1">Thực phẩm hữu cơ &amp; Thực đơn thông minh</p>
                        </div>

                        <div className="p-4 p-sm-5">
                            {/* Navigation Tabs: Đăng Nhập / Đăng Ký */}
                            <ul className="nav nav-pills nav-justified mb-4" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        type="button"
                                        role="tab"
                                        className={'nav-link' + (tab === 'login' ? ' active' : '')}
                                        style={tab === 'login' ? { ...styles.tabLink, ...styles.tabLinkActive } : styles.tabLink}
                                        onClick={() => setTab('login')}
                                    >
                                        Đăng Nhập
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        type="button"
                                        role="tab"
                                        className={'nav-link' + (tab === 'register' ? ' active' : '')}
                                        style={tab === 'register' ? { ...styles.tabLink, ...styles.tabLinkActive } : styles.tabLink}
                                        onClick={() => setTab('register')}
                                    >
                                        Đăng Ký
                                    </button>
                                </li>
                            </ul>

                            {/* TAB 1: FORM ĐĂNG NHẬP */}
                            {tab === 'login' && (
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold">Địa chỉ Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-primary"><i className="fas fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="admin@gmail.com hoặc khach@gmail.com"
                                                value={loginEmail}
                                                onChange={e => setLoginEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-dark fw-semibold">Mật khẩu</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-primary"><i className="fas fa-lock"></i></span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={e => setLoginPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-organic w-100 mb-3" style={styles.btnOrganic}>
                                        <i className="fas fa-sign-in-alt me-2"></i>ĐĂNG NHẬP
                                    </button>
                                </form>
                            )}

                            {/* TAB 2: FORM ĐĂNG KÝ */}
                            {tab === 'register' && (
                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold">Họ và Tên</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-primary"><i className="fas fa-user"></i></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nguyễn Văn A"
                                                value={regName}
                                                onChange={e => setRegName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-primary"><i className="fas fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="example@gmail.com"
                                                value={regEmail}
                                                onChange={e => setRegEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-dark fw-semibold">Mật khẩu</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-primary"><i className="fas fa-lock"></i></span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Tối thiểu 6 ký tự"
                                                minLength={6}
                                                value={regPassword}
                                                onChange={e => setRegPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-organic w-100 mb-3" style={styles.btnOrganic}>
                                        <i className="fas fa-user-plus me-2"></i>TẠO TÀI KHOẢN
                                    </button>
                                </form>
                            )}

                            {/* Quay lại trang chủ */}
                            <div className="text-center mt-4 pt-3 border-top">
                                <Link to="/" className="text-decoration-none text-muted fw-semibold">
                                    <i className="fas fa-arrow-left me-1 text-primary"></i> Quay lại trang chủ
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
