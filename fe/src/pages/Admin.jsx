// ============================================================
// Trang Quản Trị Admin - Organic Menu
// Port từ legacy/admin.html sang React (Bootstrap 5 + Font Awesome)
// ============================================================
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';

const TABS = [
    { key: 'dashboard', label: 'Tổng Quan Dashboard', icon: 'fa-chart-line' },
    { key: 'products', label: 'Quản Lý Sản Phẩm', icon: 'fa-box-open' },
    { key: 'dishes', label: 'Quản Lý Món Ăn', icon: 'fa-utensils' },
    { key: 'orders', label: 'Quản Lý Đơn Hàng', icon: 'fa-shopping-cart' },
    { key: 'users', label: 'Quản Lý Tài Khoản', icon: 'fa-users' },
];

const TAB_TITLES = {
    dashboard: 'Tổng Quan Hệ Thống',
    products: 'Quản Lý Sản Phẩm',
    dishes: 'Quản Lý Món Ăn',
    orders: 'Quản Lý Đơn Hàng',
    users: 'Quản Lý Tài Khoản',
};

const CATEGORIES = ['Trái Cây', 'Rau Củ', 'Thực Phẩm', 'Đồ Uống'];
const DISH_TYPES = ['Món mặn', 'Món chay', 'Đồ uống', 'Món khác'];
const ORDER_STATUSES = ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'];

const getAllowedNextStatuses = (currentStatus) => {
    switch (currentStatus) {
        case 'Chờ xử lý':
            return ['Chờ xử lý', 'Đang giao', 'Đã hủy'];
        case 'Đang giao':
            return ['Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'];
        case 'Đã giao':
            return ['Đã giao', 'Đã hoàn thành'];
        case 'Đã hoàn thành':
            return ['Đã hoàn thành'];
        case 'Đã hủy':
            return ['Đã hủy'];
        default:
            return ORDER_STATUSES;
    }
};

const emptyProductForm = () => ({ ten_san_pham: '', danh_muc: CATEGORIES[0], gia: '', so_luong_ton: '', mo_ta: '', file: null, preview: '' });
const emptyDishForm = () => ({ ten_mon: '', loai_mon: DISH_TYPES[0], nguyen_lieu_chinh: '', cong_thuc: '', file: null, preview: '' });

const fmtDate = (s) => (s ? new Date(s).toLocaleDateString('vi-VN') : 'Mới tạo');
const fmtDateTime = (s) => (s ? new Date(s).toLocaleString('vi-VN') : 'Vừa xong');

// Modal Bootstrap hiển thị bằng class CSS (show + backdrop), không cần bootstrap JS
function Modal({ show, onClose, id, size, children }) {
    if (!show) return null;
    return (
        <>
            <div className="modal fade show d-block" id={id} tabIndex="-1" role="dialog" aria-modal="true">
                <div className={'modal-dialog modal-dialog-centered' + (size ? ' ' + size : '')} role="document">
                    <div className="modal-content">{children}</div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
        </>
    );
}

export default function Admin() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Modal Sản phẩm
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [addProductForm, setAddProductForm] = useState(emptyProductForm());
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProductForm, setEditProductForm] = useState(emptyProductForm());

    // Modal Món ăn
    const [showAddDish, setShowAddDish] = useState(false);
    const [addDishForm, setAddDishForm] = useState(emptyDishForm());
    const [showEditDish, setShowEditDish] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [editDishForm, setEditDishForm] = useState(emptyDishForm());

    // Modal Chi tiết đơn hàng
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderDetailId, setOrderDetailId] = useState(null);
    const [orderDetailItems, setOrderDetailItems] = useState([]);
    const [orderDetailLoading, setOrderDetailLoading] = useState(false);

    const anyModalOpen = showAddProduct || showEditProduct || showAddDish || showEditDish || showOrderDetail;

    // Khóa cuộn nền khi có modal mở
    useEffect(() => {
        document.body.style.overflow = anyModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [anyModalOpen]);

    // Tải toàn bộ dữ liệu: lỗi ở nhóm nào vẫn hiển thị các nhóm còn lại
    const loadAll = () => {
        setLoading(true);
        Promise.allSettled([
            api.get('/api/san-pham'),
            api.get('/api/mon-an'),
            api.get('/api/admin/tai-khoan'),
            api.get('/api/admin/don-hang'),
        ]).then(([p, d, u, o]) => {
            if (p.status === 'fulfilled') setProducts(p.value || []);
            else alert('Không tải được sản phẩm: ' + ((p.reason && p.reason.message) || 'Lỗi máy chủ'));
            if (d.status === 'fulfilled') setDishes(d.value || []);
            else alert('Không tải được món ăn: ' + ((d.reason && d.reason.message) || 'Lỗi máy chủ'));
            if (u.status === 'fulfilled') setUsers(u.value || []);
            else alert('Không tải được tài khoản: ' + ((u.reason && u.reason.message) || 'Lỗi máy chủ'));
            if (o.status === 'fulfilled') setOrders(o.value || []);
            else alert('Không tải được đơn hàng: ' + ((o.reason && o.reason.message) || 'Lỗi máy chủ'));
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const revenue = orders
        .filter(o => o.trang_thai === 'Đã hoàn thành')
        .reduce((sum, o) => sum + Number(o.tong_tien || 0), 0);

    // ---- Xử lý file ảnh (preview) ----
    const onFile = (e, form, setForm) => {
        const f = e.target.files && e.target.files[0];
        setForm({ ...form, file: f || null, preview: f ? URL.createObjectURL(f) : form.preview });
    };

    // ---- SẢN PHẨM ----
    const openEditProduct = (p) => {
        setEditingProduct(p);
        setEditProductForm({
            ten_san_pham: p.ten_san_pham || '',
            danh_muc: p.danh_muc || CATEGORIES[0],
            gia: p.gia != null ? String(p.gia) : '',
            so_luong_ton: p.so_luong_ton != null ? String(p.so_luong_ton) : '',
            mo_ta: p.mo_ta || '',
            file: null,
            preview: imgUrl(p.hinh_anh),
        });
        setShowEditProduct(true);
    };

    const submitAddProduct = async (e) => {
        e.preventDefault();
        if (!addProductForm.file) { alert('Vui lòng chọn ảnh sản phẩm!'); return; }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('ten_san_pham', addProductForm.ten_san_pham);
            fd.append('danh_muc', addProductForm.danh_muc);
            fd.append('gia', addProductForm.gia);
            fd.append('so_luong_ton', addProductForm.so_luong_ton);
            fd.append('mo_ta', addProductForm.mo_ta);
            fd.append('hinh_anh', addProductForm.file);
            await api.upload('/api/admin/them-san-pham', fd);
            alert('Thêm sản phẩm thành công!');
            setShowAddProduct(false);
            setAddProductForm(emptyProductForm());
            loadAll();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const submitEditProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('ten_san_pham', editProductForm.ten_san_pham);
            fd.append('danh_muc', editProductForm.danh_muc);
            fd.append('gia', editProductForm.gia);
            fd.append('so_luong_ton', editProductForm.so_luong_ton);
            fd.append('mo_ta', editProductForm.mo_ta);
            if (editProductForm.file) fd.append('hinh_anh', editProductForm.file);
            await api.put('/api/admin/sua-san-pham/' + editingProduct.id, fd);
            alert('Cập nhật sản phẩm thành công!');
            setShowEditProduct(false);
            setEditProductForm(emptyProductForm());
            loadAll();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi CSDL?')) return;
        try {
            await api.del('/api/admin/xoa-san-pham/' + id);
            alert('Đã xóa sản phẩm thành công!');
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    // ---- MÓN ĂN ----
    const openEditDish = (d) => {
        setEditingDish(d);
        setEditDishForm({
            ten_mon: d.ten_mon || '',
            loai_mon: d.loai_mon || DISH_TYPES[0],
            nguyen_lieu_chinh: d.nguyen_lieu_chinh || '',
            cong_thuc: d.cong_thuc || '',
            file: null,
            preview: imgUrl(d.hinh_anh),
        });
        setShowEditDish(true);
    };

    const submitAddDish = async (e) => {
        e.preventDefault();
        if (!addDishForm.file) { alert('Vui lòng chọn ảnh món ăn!'); return; }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('ten_mon', addDishForm.ten_mon);
            fd.append('nguyen_lieu_chinh', addDishForm.nguyen_lieu_chinh);
            fd.append('cong_thuc', addDishForm.cong_thuc);
            fd.append('loai_mon', addDishForm.loai_mon);
            fd.append('hinh_anh', addDishForm.file);
            await api.upload('/api/admin/them-mon-an', fd);
            alert('Thêm món ăn thành công!');
            setShowAddDish(false);
            setAddDishForm(emptyDishForm());
            loadAll();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const submitEditDish = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('ten_mon', editDishForm.ten_mon);
            fd.append('nguyen_lieu_chinh', editDishForm.nguyen_lieu_chinh);
            fd.append('cong_thuc', editDishForm.cong_thuc);
            fd.append('loai_mon', editDishForm.loai_mon);
            if (editDishForm.file) fd.append('hinh_anh', editDishForm.file);
            await api.put('/api/admin/sua-mon-an/' + editingDish.id, fd);
            alert('Cập nhật món ăn thành công!');
            setShowEditDish(false);
            setEditDishForm(emptyDishForm());
            loadAll();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteDish = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa món ăn này khỏi hệ thống gợi ý?')) return;
        try {
            await api.del('/api/admin/xoa-mon-an/' + id);
            alert('Đã xóa món ăn!');
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    // ---- ĐƠN HÀNG ----
    const updateOrderStatus = async (id, trangThai) => {
        try {
            await api.put('/api/admin/don-hang/' + id, { trang_thai: trangThai });
            alert('Đã chuyển trạng thái đơn hàng #DH' + id + ' thành "' + trangThai + '"!');
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const confirmPayment = async (id) => {
        if (!confirm(`Xác nhận Admin đã kiểm tra tài khoản và nhận đủ tiền chuyển khoản cho đơn hàng #DH${id}?`)) return;
        try {
            await api.put('/api/admin/don-hang/' + id + '/xac-nhan-thanh-toan');
            alert('✅ Đã xác nhận thanh toán tiền chuyển khoản thành công!');
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const viewOrderDetails = async (id) => {
        setOrderDetailId(id);
        setOrderDetailItems([]);
        setOrderDetailLoading(true);
        setShowOrderDetail(true);
        try {
            const items = await api.get('/api/don-hang/' + id + '/chi-tiet');
            setOrderDetailItems(items || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setOrderDetailLoading(false);
        }
    };

    // ---- ĐĂNG XUẤT ----
    const handleLogout = async (e) => {
        e.preventDefault();
        if (!confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?')) return;
        await logout();
        navigate('/');
    };

    const productCategories = CATEGORIES.some(c => c === editProductForm.danh_muc)
        ? CATEGORIES
        : [editProductForm.danh_muc, ...CATEGORIES];
    const dishTypes = DISH_TYPES.some(t => t === editDishForm.loai_mon)
        ? DISH_TYPES
        : [editDishForm.loai_mon, ...DISH_TYPES];

    return (
        <>
            <style>{`
                body { background-color: #f4f6f9; }
                .admin-sidebar {
                    width: 260px;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    background: #2c3e50;
                    color: #fff;
                    transition: all 0.3s;
                    z-index: 1000;
                    overflow-y: auto;
                }
                .admin-sidebar .brand-title {
                    font-family: 'Raleway', sans-serif;
                    font-weight: 800;
                    color: #81c408;
                    padding: 20px;
                    font-size: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .admin-sidebar .nav-link {
                    color: #b8c7ce;
                    padding: 15px 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    border-left: 4px solid transparent;
                    cursor: pointer;
                }
                .admin-sidebar .nav-link:hover, .admin-sidebar .nav-link.active {
                    color: #fff;
                    background: #1a252f;
                    border-left-color: #81c408;
                }
                .admin-sidebar .nav-link i { width: 30px; font-size: 1.2rem; }
                .admin-main { margin-left: 260px; padding: 30px; }
                .card-stat {
                    border: none;
                    border-radius: 12px;
                    color: white;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    height: 100%;
                }
                .stat-icon { font-size: 2.5rem; opacity: 0.8; }
                .bg-organic { background-color: #81c408 !important; }
                .bg-info-custom { background-color: #17a2b8 !important; }
                .bg-warning-custom { background-color: #ffc107 !important; color: #333 !important; }
                .bg-danger-custom { background-color: #dc3545 !important; }
                .table-custom {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .btn-organic { background-color: #81c408; color: white; font-weight: 600; }
                .btn-organic:hover { background-color: #5d8e05; color: white; }
                @media (max-width: 991.98px) {
                    .admin-sidebar { position: static; width: 100%; height: auto; }
                    .admin-main { margin-left: 0; padding: 15px; }
                }
            `}</style>

            {/* ===== Sidebar Menu Bên Trái ===== */}
            <aside className="admin-sidebar">
                <div className="brand-title">
                    <i className="fas fa-leaf me-2"></i>Admin Panel
                </div>
                <div className="nav flex-column mt-3" role="tablist">
                    {TABS.map(t => (
                        <a
                            key={t.key}
                            className={'nav-link' + (activeTab === t.key ? ' active' : '')}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveTab(t.key); }}
                        >
                            <i className={'fas ' + t.icon}></i> {t.label}
                        </a>
                    ))}
                    <a className="nav-link text-danger mt-5" href="#" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Đăng Xuất Admin
                    </a>
                </div>
            </aside>

            {/* ===== Nội Dung Chính Bên Phải ===== */}
            <div className="admin-main">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <h3 className="fw-bold m-0">{TAB_TITLES[activeTab]}</h3>
                        <small className="text-muted">Hệ thống quản lý Organic Menu</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-3 fw-bold text-success">
                            <i className="fas fa-user-shield me-1"></i> {esc(user && user.ho_ten ? user.ho_ten : 'Admin')}
                        </span>
                        <Link to="/" className="btn btn-outline-secondary btn-sm">
                            <i className="fas fa-globe me-1"></i> Xem Web
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                ) : (
                    <div className="tab-content">

                        {/* ===== TAB 1: TỔNG QUAN DASHBOARD ===== */}
                        <div className={'tab-pane fade' + (activeTab === 'dashboard' ? ' show active' : ' d-none')} id="tab-dashboard">
                            <div className="row g-4 mb-4 row-cols-1 row-cols-md-3 row-cols-xl-5">
                                <div className="col">
                                    <div className="card-stat bg-organic d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-uppercase m-0">Doanh Thu</h6>
                                            <h3 className="fw-bold my-2">{fmtVND(revenue)}</h3>
                                            <small>Đơn hàng đã hoàn thành</small>
                                        </div>
                                        <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-stat bg-info-custom d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-uppercase m-0">Tổng Đơn Hàng</h6>
                                            <h3 className="fw-bold my-2">{esc(orders.length)}</h3>
                                            <small>Đơn đặt từ khách hàng</small>
                                        </div>
                                        <div className="stat-icon"><i className="fas fa-shopping-bag"></i></div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-stat bg-warning-custom d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-uppercase m-0">Sản Phẩm</h6>
                                            <h3 className="fw-bold my-2">{esc(products.length)}</h3>
                                            <small>Món ăn đang kinh doanh</small>
                                        </div>
                                        <div className="stat-icon"><i className="fas fa-apple-alt"></i></div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-stat bg-primary d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-uppercase m-0">Món Ăn</h6>
                                            <h3 className="fw-bold my-2">{esc(dishes.length)}</h3>
                                            <small>Món gợi ý chế biến</small>
                                        </div>
                                        <div className="stat-icon"><i className="fas fa-utensils"></i></div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-stat bg-danger-custom d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-uppercase m-0">Tài Khoản</h6>
                                            <h3 className="fw-bold my-2">{esc(users.length)}</h3>
                                            <small>Khách hàng &amp; Admin</small>
                                        </div>
                                        <div className="stat-icon"><i className="fas fa-users"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== TAB 2: QUẢN LÝ SẢN PHẨM ===== */}
                        <div className={'tab-pane fade' + (activeTab === 'products' ? ' show active' : ' d-none')} id="tab-products">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold m-0">Danh Sách Thực Phẩm</h5>
                                <button
                                    className="btn btn-organic"
                                    onClick={() => { setAddProductForm(emptyProductForm()); setShowAddProduct(true); }}
                                >
                                    <i className="fas fa-plus me-1"></i> Thêm sản phẩm Mới
                                </button>
                            </div>
                            <div className="table-custom p-3">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Hình Ảnh</th>
                                                <th>Tên Món Ăn</th>
                                                <th>Danh Mục</th>
                                                <th>Giá Bán</th>
                                                <th>Tồn Kho</th>
                                                <th>Mô Tả</th>
                                                <th>Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length === 0 ? (
                                                <tr><td colSpan={8} className="text-center text-muted py-4">Chưa có sản phẩm nào</td></tr>
                                            ) : products.map(p => (
                                                <tr key={p.id}>
                                                    <td>{esc(p.id)}</td>
                                                    <td>
                                                        <img
                                                            src={imgUrl(p.hinh_anh)}
                                                            width="50" height="50"
                                                            className="rounded"
                                                            style={{ objectFit: 'cover' }}
                                                            alt={esc(p.ten_san_pham)}
                                                        />
                                                    </td>
                                                    <td className="fw-bold">{esc(p.ten_san_pham)}</td>
                                                    <td><span className="badge bg-secondary">{esc(p.danh_muc || 'Nông sản')}</span></td>
                                                    <td className="text-success fw-bold">{fmtVND(p.gia)}</td>
                                                    <td>
                                                        {Number(p.so_luong_ton) <= 0
                                                            ? <span className="badge bg-danger">Hết hàng</span>
                                                            : <span className="badge bg-success">Còn {esc(p.so_luong_ton)}</span>}
                                                    </td>
                                                    <td style={{ maxWidth: 220 }}>
                                                        {esc((p.mo_ta || '').slice(0, 50))}
                                                        {(p.mo_ta || '').length > 50 ? '...' : ''}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-warning me-1" onClick={() => openEditProduct(p)}>
                                                            <i className="fas fa-edit"></i> Sửa
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>
                                                            <i className="fas fa-trash"></i> Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ===== TAB 3: QUẢN LÝ MÓN ĂN ===== */}
                        <div className={'tab-pane fade' + (activeTab === 'dishes' ? ' show active' : ' d-none')} id="tab-dishes">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold m-0">Danh Sách Món Ăn Gợi Ý</h5>
                                <button
                                    className="btn btn-organic"
                                    onClick={() => { setAddDishForm(emptyDishForm()); setShowAddDish(true); }}
                                >
                                    <i className="fas fa-plus me-1"></i> Thêm Món Ăn Mới
                                </button>
                            </div>
                            <div className="table-custom p-3">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Hình Ảnh</th>
                                                <th>Tên Món Ăn</th>
                                                <th>Nguyên Liệu Chính</th>
                                                <th>Loại Món</th>
                                                <th>Công Thức Chế Biến</th>
                                                <th>Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dishes.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-4">Chưa có món ăn gợi ý nào</td></tr>
                                            ) : dishes.map(d => (
                                                <tr key={d.id}>
                                                    <td>#{esc(d.id)}</td>
                                                    <td>
                                                        <img
                                                            src={imgUrl(d.hinh_anh)}
                                                            width="50" height="50"
                                                            className="rounded"
                                                            style={{ objectFit: 'cover' }}
                                                            alt={esc(d.ten_mon)}
                                                        />
                                                    </td>
                                                    <td className="fw-bold">{esc(d.ten_mon)}</td>
                                                    <td><span className="badge bg-info text-dark">{esc(d.nguyen_lieu_chinh)}</span></td>
                                                    <td><span className="badge bg-warning text-dark">{esc(d.loai_mon || 'Món khác')}</span></td>
                                                    <td style={{ maxWidth: 250 }} className="text-truncate">{esc(d.cong_thuc || '')}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditDish(d)}>
                                                            <i className="fas fa-edit"></i> Sửa
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteDish(d.id)}>
                                                            <i className="fas fa-trash"></i> Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ===== TAB 4: QUẢN LÝ ĐƠN HÀNG ===== */}
                        <div className={'tab-pane fade' + (activeTab === 'orders' ? ' show active' : ' d-none')} id="tab-orders">
                            <h5 className="fw-bold mb-3">Danh Sách Đơn Hàng Đặt Mua</h5>
                            <div className="table-custom p-3">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Mã Đơn</th>
                                                <th>Khách Hàng</th>
                                                <th>Số Điện Thoại</th>
                                                <th>Địa Chỉ</th>
                                                <th>Tổng Tiền</th>
                                                <th>Thanh Toán</th>
                                                <th>Ngày Đặt</th>
                                                <th>Trạng Thái</th>
                                                <th>Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length === 0 ? (
                                                <tr><td colSpan={9} className="text-center text-muted py-4">Chưa có đơn hàng nào</td></tr>
                                            ) : orders.map(o => (
                                                <tr key={o.id}>
                                                    <td className="fw-bold">#DH{esc(o.id)}</td>
                                                    <td className="fw-bold">{esc(o.ten_khach_hang || 'Khách vãng lai')}</td>
                                                    <td>{esc(o.so_dien_thoai || 'Chưa có')}</td>
                                                    <td
                                                        style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        title={esc(o.dia_chi)}
                                                    >
                                                        {esc(o.dia_chi || 'Chưa có')}
                                                    </td>
                                                    <td className="text-success fw-bold">{fmtVND(o.tong_tien)}</td>
                                                    <td>
                                                        {o.phuong_thuc_thanh_toan === 'BANK_QR' ? (
                                                            <div>
                                                                {o.trang_thai_thanh_toan === 'Đã thanh toán (QR)' ? (
                                                                    <span className="badge bg-success"><i className="fas fa-check-circle me-1"></i>Đã CK QR</span>
                                                                ) : (
                                                                    <div>
                                                                        <span className="badge bg-warning text-dark mb-1 d-block">📲 Chờ CK</span>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-success py-0 px-2 small shadow-sm"
                                                                            style={{ fontSize: '11px' }}
                                                                            onClick={() => confirmPayment(o.id)}
                                                                        >
                                                                            <i className="fas fa-check me-1"></i>Xác nhận tiền
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="badge bg-secondary">💵 COD</span>
                                                        )}
                                                    </td>
                                                    <td>{fmtDateTime(o.ngay_dat)}</td>
                                                    <td>
                                                        <select
                                                            key={o.id + '-' + o.trang_thai}
                                                            className="form-select form-select-sm fw-bold text-primary"
                                                            defaultValue={o.trang_thai}
                                                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                        >
                                                            {getAllowedNextStatuses(o.trang_thai).map(st => (
                                                                <option key={st} value={st}>{esc(st)}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-info" onClick={() => viewOrderDetails(o.id)}>
                                                            <i className="fas fa-eye"></i> Xem
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ===== TAB 5: QUẢN LÝ TÀI KHOẢN ===== */}
                        <div className={'tab-pane fade' + (activeTab === 'users' ? ' show active' : ' d-none')} id="tab-users">
                            <h5 className="fw-bold mb-3">Tài Khoản Người Dùng</h5>
                            <div className="table-custom p-3">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle m-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Họ Và Tên</th>
                                                <th>Email</th>
                                                <th>Vai Trò</th>
                                                <th>Ngày Tạo</th>
                                                <th>Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center text-muted py-4">Chưa có tài khoản nào</td></tr>
                                            ) : users.map(u => (
                                                <tr key={u.id}>
                                                    <td>{esc(u.id)}</td>
                                                    <td className="fw-bold">{esc(u.ho_ten)}</td>
                                                    <td>{esc(u.email)}</td>
                                                    <td>
                                                        {u.vai_tro === 'admin'
                                                            ? <span className="badge bg-danger">Quản trị viên</span>
                                                            : <span className="badge bg-success">Khách hàng</span>}
                                                    </td>
                                                    <td>{fmtDate(u.ngay_tao)}</td>
                                                    <td>
                                                        <span className="text-muted"><i className="fas fa-user-check"></i> Hoạt động</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* ===== MODAL THÊM SẢN PHẨM ===== */}
            <Modal show={showAddProduct} onClose={() => setShowAddProduct(false)} id="addProductModal">
                <div className="modal-header bg-organic text-white">
                    <h5 className="modal-title fw-bold"><i className="fas fa-plus-circle me-2"></i>Thêm Sản Phẩm Bán Mới</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddProduct(false)}></button>
                </div>
                <form id="addProductForm" onSubmit={submitAddProduct}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên sản phẩm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Táo Hữu Cơ VietGAP"
                                required
                                value={addProductForm.ten_san_pham}
                                onChange={(e) => setAddProductForm({ ...addProductForm, ten_san_pham: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Danh mục</label>
                            <select
                                className="form-select"
                                value={addProductForm.danh_muc}
                                onChange={(e) => setAddProductForm({ ...addProductForm, danh_muc: e.target.value })}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{esc(c)}</option>)}
                            </select>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Giá bán (VNĐ)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="85000"
                                    min="0"
                                    required
                                    value={addProductForm.gia}
                                    onChange={(e) => setAddProductForm({ ...addProductForm, gia: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Số lượng tồn kho</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="50"
                                    min="1"
                                    required
                                    value={addProductForm.so_luong_ton}
                                    onChange={(e) => setAddProductForm({ ...addProductForm, so_luong_ton: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Chọn ảnh từ máy tính</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                required={!addProductForm.file}
                                onChange={(e) => onFile(e, addProductForm, setAddProductForm)}
                            />
                            {addProductForm.preview && (
                                <div className="mt-2 text-center">
                                    <img src={addProductForm.preview} alt="Xem trước" className="img-thumbnail" style={{ maxHeight: 100 }} />
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mô tả sản phẩm</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Mô tả sản phẩm..."
                                value={addProductForm.mo_ta}
                                onChange={(e) => setAddProductForm({ ...addProductForm, mo_ta: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-success w-100 fw-bold" disabled={submitting}>
                            {submitting ? 'Đang lưu...' : 'Lưu Sản Phẩm Bán'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ===== MODAL SỬA SẢN PHẨM ===== */}
            <Modal show={showEditProduct} onClose={() => setShowEditProduct(false)} id="editProductModal">
                <div className="modal-header bg-warning text-dark">
                    <h5 className="modal-title fw-bold"><i className="fas fa-edit me-2"></i>Chỉnh Sửa Sản Phẩm Bán</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditProduct(false)}></button>
                </div>
                <form id="editProductForm" onSubmit={submitEditProduct}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên sản phẩm</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={editProductForm.ten_san_pham}
                                onChange={(e) => setEditProductForm({ ...editProductForm, ten_san_pham: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Danh mục</label>
                            <select
                                className="form-select"
                                value={editProductForm.danh_muc}
                                onChange={(e) => setEditProductForm({ ...editProductForm, danh_muc: e.target.value })}
                            >
                                {productCategories.map(c => <option key={c} value={c}>{esc(c)}</option>)}
                            </select>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Giá bán (VNĐ)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    required
                                    value={editProductForm.gia}
                                    onChange={(e) => setEditProductForm({ ...editProductForm, gia: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Số lượng tồn kho</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    required
                                    value={editProductForm.so_luong_ton}
                                    onChange={(e) => setEditProductForm({ ...editProductForm, so_luong_ton: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Ảnh hiện tại (hoặc chọn ảnh mới từ máy tính)</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => onFile(e, editProductForm, setEditProductForm)}
                            />
                            {editProductForm.preview && (
                                <div className="mt-2 text-center">
                                    <img src={editProductForm.preview} alt="Xem trước" className="img-thumbnail" style={{ maxHeight: 100 }} />
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mô tả sản phẩm</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={editProductForm.mo_ta}
                                onChange={(e) => setEditProductForm({ ...editProductForm, mo_ta: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditProduct(false)}>Hủy</button>
                        <button type="submit" className="btn btn-warning" disabled={submitting}>
                            {submitting ? 'Đang lưu...' : 'Cập Nhật Sản Phẩm'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ===== MODAL THÊM MÓN ĂN ===== */}
            <Modal show={showAddDish} onClose={() => setShowAddDish(false)} id="addDishModal">
                <div className="modal-header bg-warning text-dark">
                    <h5 className="modal-title fw-bold"><i className="fas fa-utensils me-2"></i>Thêm Món Ăn Gợi Ý</h5>
                    <button type="button" className="btn-close" onClick={() => setShowAddDish(false)}></button>
                </div>
                <form id="addDishForm" onSubmit={submitAddDish}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên món ăn</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Súp Bào Ngư Ngô Ngọt"
                                required
                                value={addDishForm.ten_mon}
                                onChange={(e) => setAddDishForm({ ...addDishForm, ten_mon: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Phân loại món</label>
                            <select
                                className="form-select"
                                value={addDishForm.loai_mon}
                                onChange={(e) => setAddDishForm({ ...addDishForm, loai_mon: e.target.value })}
                            >
                                {DISH_TYPES.map(t => <option key={t} value={t}>{esc(t)}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nguyên liệu chính</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Bào ngư, Ngô ngọt, Nấm hương"
                                required
                                value={addDishForm.nguyen_lieu_chinh}
                                onChange={(e) => setAddDishForm({ ...addDishForm, nguyen_lieu_chinh: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Công thức chế biến</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Cách nấu chi tiết..."
                                value={addDishForm.cong_thuc}
                                onChange={(e) => setAddDishForm({ ...addDishForm, cong_thuc: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Chọn ảnh món ăn</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                required={!addDishForm.file}
                                onChange={(e) => onFile(e, addDishForm, setAddDishForm)}
                            />
                            {addDishForm.preview && (
                                <div className="mt-2 text-center">
                                    <img src={addDishForm.preview} alt="Xem trước" className="img-thumbnail" style={{ maxHeight: 100 }} />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={submitting}>
                            {submitting ? 'Đang lưu...' : 'Lưu Món Ăn Gợi Ý'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ===== MODAL SỬA MÓN ĂN ===== */}
            <Modal show={showEditDish} onClose={() => setShowEditDish(false)} id="editDishModal">
                <div className="modal-header bg-warning text-dark">
                    <h5 className="modal-title fw-bold"><i className="fas fa-edit me-2"></i>Chỉnh Sửa Món Ăn</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditDish(false)}></button>
                </div>
                <form id="editDishForm" onSubmit={submitEditDish}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên món ăn</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={editDishForm.ten_mon}
                                onChange={(e) => setEditDishForm({ ...editDishForm, ten_mon: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Phân loại món</label>
                            <select
                                className="form-select"
                                value={editDishForm.loai_mon}
                                onChange={(e) => setEditDishForm({ ...editDishForm, loai_mon: e.target.value })}
                            >
                                {dishTypes.map(t => <option key={t} value={t}>{esc(t)}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nguyên liệu chính</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={editDishForm.nguyen_lieu_chinh}
                                onChange={(e) => setEditDishForm({ ...editDishForm, nguyen_lieu_chinh: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Công thức / Hướng dẫn</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={editDishForm.cong_thuc}
                                onChange={(e) => setEditDishForm({ ...editDishForm, cong_thuc: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Ảnh hiện tại (hoặc chọn ảnh mới từ máy tính)</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => onFile(e, editDishForm, setEditDishForm)}
                            />
                            {editDishForm.preview && (
                                <div className="mt-2 text-center">
                                    <img src={editDishForm.preview} alt="Xem trước" className="img-thumbnail" style={{ maxHeight: 100 }} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditDish(false)}>Hủy</button>
                        <button type="submit" className="btn btn-warning" disabled={submitting}>
                            {submitting ? 'Đang lưu...' : 'Cập Nhật'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ===== MODAL XEM CHI TIẾT ĐƠN HÀNG ===== */}
            <Modal show={showOrderDetail} onClose={() => setShowOrderDetail(false)} id="orderDetailModal" size="modal-lg">
                <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title fw-bold">
                        <i className="fas fa-box-open me-2"></i>Chi Tiết Đơn Hàng #DH{esc(orderDetailId)}
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowOrderDetail(false)}></button>
                </div>
                <div className="modal-body">
                    {orderDetailLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
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
                                    {orderDetailItems.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center text-muted py-4">Không có thông tin sản phẩm.</td></tr>
                                    ) : orderDetailItems.map((item, idx) => (
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
                                            <td className="fw-bold text-success">{fmtVND(Number(item.gia) * Number(item.so_luong))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
