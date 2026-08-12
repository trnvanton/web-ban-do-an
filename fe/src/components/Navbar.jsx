import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const { count } = useCart();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const navLinkClass = ({ isActive }) => 'nav-item nav-link px-2 px-lg-3 text-nowrap fw-semibold' + (isActive ? ' active text-primary fw-bold' : '');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = search.trim();
        navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
        const modalEl = document.getElementById('searchModal');
        if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    };

    const handleLogout = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) return;
        await logout();
        navigate('/dang-nhap');
    };

    return (
        <>
            {/* Navbar */}
            <div className="container-fluid fixed-top bg-white shadow-sm py-1">
                <div className="container px-0">
                    <nav className="navbar navbar-light bg-white navbar-expand-xl py-2">
                        {/* Logo */}
                        <Link to="/" className="navbar-brand me-4">
                            <h1 className="text-primary display-6 mb-0 fw-bold fs-2">Fruitables</h1>
                        </Link>

                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-primary"></span>
                        </button>

                        <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                            {/* Links Menu chính */}
                            <div className="navbar-nav mx-auto text-nowrap d-flex flex-row flex-wrap flex-xl-nowrap justify-content-center align-items-center">
                                <NavLink to="/" className={navLinkClass} end>Trang chủ</NavLink>
                                <NavLink to="/shop" className={navLinkClass}>Cửa hàng</NavLink>
                                <NavLink to="/gio-hang" className={navLinkClass}>Giỏ hàng</NavLink>
                                <NavLink to="/goi-y-mon-an" className={navLinkClass}>Món Ngon Mỗi Ngày</NavLink>
                                <NavLink to="/lien-he" className={navLinkClass}>Liên hệ</NavLink>
                            </div>

                            {/* Cụm Action Bên Phải */}
                            <div className="d-flex align-items-center">
                                {/* Icon Tìm kiếm */}
                                <button className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-3" data-bs-toggle="modal" data-bs-target="#searchModal">
                                    <i className="fas fa-search text-primary"></i>
                                </button>

                                {/* Icon Giỏ hàng */}
                                <Link to="/gio-hang" className="position-relative me-4 my-auto" title="Giỏ hàng">
                                    <i className="fa fa-shopping-bag fa-2x text-primary"></i>
                                    <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{ top: -5, left: 15, height: 20, minWidth: 20, fontSize: 12 }}>
                                        {count}
                                    </span>
                                </Link>

                                {/* Khu vực Tài Khoản & Profile Dropdown */}
                                <div id="user-header-area">
                                    {!user ? (
                                        <Link to="/dang-nhap" className="btn btn-outline-primary rounded-pill px-3 py-1 fw-bold" title="Đăng nhập">
                                            <i className="fas fa-user me-1"></i> Đăng nhập
                                        </Link>
                                    ) : (
                                        <div className="dropdown">
                                            <button className="btn btn-light border rounded-pill dropdown-toggle d-flex align-items-center py-1 px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fas fa-user-circle fa-lg text-primary me-2"></i>
                                                <span className="fw-bold text-dark me-1" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {user.ho_ten || user.email}
                                                </span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
                                                <li>
                                                    <Link className="dropdown-item py-2" to="/tai-khoan">
                                                        <i className="fas fa-id-card text-primary me-2" style={{ width: 18 }}></i> Hồ sơ cá nhân
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item py-2" to="/dia-chi">
                                                        <i className="fas fa-map-marker-alt text-success me-2" style={{ width: 18 }}></i> Địa chỉ giao hàng
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item py-2" to="/don-hang">
                                                        <i className="fas fa-shopping-bag text-warning me-2" style={{ width: 18 }}></i> Lịch sử đơn hàng
                                                    </Link>
                                                </li>
                                                {isAdmin && (
                                                    <li>
                                                        <Link className="dropdown-item py-2" to="/admin">
                                                            <i className="fas fa-cog text-danger me-2" style={{ width: 18 }}></i> Quản trị
                                                        </Link>
                                                    </li>
                                                )}
                                                <li><hr className="dropdown-divider my-1" /></li>
                                                <li>
                                                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                                                        <i className="fas fa-sign-out-alt me-2" style={{ width: 18 }}></i> Đăng xuất
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            {/* Navbar End */}

            {/* Modal Search */}
            <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content rounded-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Tìm kiếm theo từ khóa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex align-items-center">
                            <form className="input-group w-75 mx-auto d-flex" onSubmit={handleSearch}>
                                <input
                                    type="search"
                                    className="form-control p-3"
                                    placeholder="Nhập tên sản phẩm cần tìm..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    aria-describedby="search-icon-1"
                                />
                                <button type="submit" id="search-icon-1" className="input-group-text p-3 border-0 bg-primary text-white">
                                    <i className="fa fa-search"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Search End */}
        </>
    );
}
