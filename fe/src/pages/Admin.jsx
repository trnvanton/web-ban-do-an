// ============================================================
// Trang Quản Trị Admin - Fruitables / Organic Menu
// Thiết kế Hiện Đại, Sang Trọng, Tối Ưu UX/UI Chuyên Nghiệp
// ============================================================
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import './Admin.css';

const TABS = [
    { key: 'dashboard', label: 'Tổng Quan', icon: 'fa-chart-pie' },
    { key: 'products', label: 'Quản Lý Sản Phẩm', icon: 'fa-box-open' },
    { key: 'dishes', label: 'Quản Lý Món Ăn', icon: 'fa-utensils' },
    { key: 'orders', label: 'Quản Lý Đơn Hàng', icon: 'fa-shopping-bag' },
    { key: 'users', label: 'Quản Lý Tài Khoản', icon: 'fa-users-cog' },
];

const TAB_TITLES = {
    dashboard: { title: 'Tổng Quan Hệ Thống', desc: 'Báo cáo số liệu kinh doanh và hoạt động của cửa hàng' },
    products: { title: 'Quản Lý Sản Phẩm', desc: 'Danh sách và kiểm soát tồn kho thực phẩm, nông sản hữu cơ' },
    dishes: { title: 'Quản Lý Món Ăn Gợi Ý', desc: 'Bộ sưu tập công thức nấu ăn và thực đơn dinh dưỡng' },
    orders: { title: 'Quản Lý Đơn Hàng', desc: 'Theo dõi tiến trình xử lý đơn đặt hàng và thanh toán' },
    users: { title: 'Quản Lý Tài Khoản', desc: 'Danh sách thành viên và phân quyền quản trị viên' },
};

const CATEGORIES = ['Trái Cây', 'Rau Củ', 'Thực Phẩm', 'Đồ Uống'];
const DISH_TYPES = ['Món mặn', 'Món chay', 'Đồ uống', 'Món khác'];
const ORDER_STATUSES = ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'];

const getAllowedNextStatuses = (currentStatus) => {
    switch (currentStatus) {
        case 'Chờ xử lý':
            return ['Chờ xử lý', 'Đang giao', 'Đã hủy'];
        case 'Đang giao':
            return ['Đang giao', 'Đã giao', 'Đã hủy'];
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

const emptyProductForm = () => ({
    ten_san_pham: '',
    danh_muc: CATEGORIES[0],
    gia: '',
    so_luong_ton: '',
    mo_ta: '',
    file: null,
    preview: ''
});

const emptyDishForm = () => ({
    ten_mon: '',
    loai_mon: DISH_TYPES[0],
    nguyen_lieu_chinh: '',
    cong_thuc: '',
    file: null,
    preview: ''
});

const fmtDate = (s) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—');
const fmtDateTime = (s) => (s ? new Date(s).toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
}) : '—');

// Modal Component tùy biến cao cấp (hỗ trợ cuộn mượt mà không bị tràn màn hình)
function AdminModal({ show, onClose, title, icon, headerTheme = 'primary', size = '', children }) {
    if (!show) return null;
    return (
        <>
            <div
                className="modal fade show d-block admin-modal"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`} role="document">
                    <div className="modal-content shadow-lg">
                        <div className={`admin-modal-header header-${headerTheme}`}>
                            <h5 className="modal-title">
                                {icon && <i className={`fas ${icon}`}></i>}
                                {title}
                            </h5>
                            <button type="button" className="btn-close-custom" onClick={onClose}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" style={{ backdropFilter: 'blur(4px)', background: 'rgba(15, 23, 42, 0.6)' }} onClick={onClose}></div>
        </>
    );
}

export default function Admin() {
    const { user, logout } = useAuth();
    const dialog = useDialog();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Data State
    const [products, setProducts] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Filter & Search State
    const [productSearch, setProductSearch] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
    const [productStockFilter, setProductStockFilter] = useState('ALL');

    const [dishSearch, setDishSearch] = useState('');
    const [dishTypeFilter, setDishTypeFilter] = useState('ALL');

    const [orderSearch, setOrderSearch] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('ALL');

    // Modals
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [addProductForm, setAddProductForm] = useState(emptyProductForm());
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProductForm, setEditProductForm] = useState(emptyProductForm());

    const [showAddDish, setShowAddDish] = useState(false);
    const [addDishForm, setAddDishForm] = useState(emptyDishForm());
    const [showEditDish, setShowEditDish] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [editDishForm, setEditDishForm] = useState(emptyDishForm());

    // Recipe Preview Modal
    const [recipeModalDish, setRecipeModalDish] = useState(null);

    // Order Detail Modal
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderDetailId, setOrderDetailId] = useState(null);
    const [orderDetailData, setOrderDetailData] = useState(null);
    const [orderDetailItems, setOrderDetailItems] = useState([]);
    const [orderDetailLoading, setOrderDetailLoading] = useState(false);

    const anyModalOpen = showAddProduct || showEditProduct || showAddDish || showEditDish || showOrderDetail || !!recipeModalDish;

    useEffect(() => {
        document.body.style.overflow = anyModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [anyModalOpen]);

    // Load Data
    const loadAll = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        else setLoading(true);

        try {
            const [p, d, u, o] = await Promise.allSettled([
                api.get('/api/san-pham'),
                api.get('/api/mon-an'),
                api.get('/api/admin/tai-khoan'),
                api.get('/api/admin/don-hang'),
            ]);

            if (p.status === 'fulfilled') setProducts(p.value || []);
            if (d.status === 'fulfilled') setDishes(d.value || []);
            if (u.status === 'fulfilled') setUsers(u.value || []);
            if (o.status === 'fulfilled') setOrders(o.value || []);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu admin:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    // Statistics Calculations
    const revenue = useMemo(() => {
        return orders
            .filter(o => o.trang_thai === 'Đã hoàn thành')
            .reduce((sum, o) => sum + Number(o.tong_tien || 0), 0);
    }, [orders]);

    const pendingOrdersCount = useMemo(() => {
        return orders.filter(o => o.trang_thai === 'Chờ xử lý').length;
    }, [orders]);

    const lowStockProductsCount = useMemo(() => {
        return products.filter(p => Number(p.so_luong_ton) <= 5).length;
    }, [products]);

    // File Preview Handler
    const onFile = (e, form, setForm) => {
        const f = e.target.files && e.target.files[0];
        setForm({ ...form, file: f || null, preview: f ? URL.createObjectURL(f) : form.preview });
    };

    // ---- SẢN PHẨM HANDLERS ----
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
        if (!addProductForm.file) {
            await dialog.alert('Vui lòng chọn ảnh đại diện cho sản phẩm!', { type: 'warning' });
            return;
        }
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
            await dialog.alert('Thêm sản phẩm mới thành công!', { type: 'success' });
            setShowAddProduct(false);
            setAddProductForm(emptyProductForm());
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi thêm sản phẩm', { type: 'error' });
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
            await dialog.alert('Cập nhật thông tin sản phẩm thành công!', { type: 'success' });
            setShowEditProduct(false);
            setEditProductForm(emptyProductForm());
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi cập nhật sản phẩm', { type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id, name) => {
        const ok = await dialog.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name || '#' + id}" khỏi hệ thống?`, {
            title: 'Xóa Sản Phẩm',
            type: 'error',
            confirmText: 'Xóa vĩnh viễn',
            cancelText: 'Hủy'
        });
        if (!ok) return;
        try {
            await api.del('/api/admin/xoa-san-pham/' + id);
            await dialog.alert('Đã xóa sản phẩm thành công!', { type: 'success' });
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi xóa sản phẩm', { type: 'error' });
        }
    };

    // ---- MÓN ĂN HANDLERS ----
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
        if (!addDishForm.file) {
            await dialog.alert('Vui lòng chọn ảnh món ăn!', { type: 'warning' });
            return;
        }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('ten_mon', addDishForm.ten_mon);
            fd.append('nguyen_lieu_chinh', addDishForm.nguyen_lieu_chinh);
            fd.append('cong_thuc', addDishForm.cong_thuc);
            fd.append('loai_mon', addDishForm.loai_mon);
            fd.append('hinh_anh', addDishForm.file);
            await api.upload('/api/admin/them-mon-an', fd);
            await dialog.alert('Thêm món ăn gợi ý thành công!', { type: 'success' });
            setShowAddDish(false);
            setAddDishForm(emptyDishForm());
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi thêm món ăn', { type: 'error' });
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
            await dialog.alert('Cập nhật món ăn gợi ý thành công!', { type: 'success' });
            setShowEditDish(false);
            setEditDishForm(emptyDishForm());
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi cập nhật món ăn', { type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteDish = async (id, name) => {
        const ok = await dialog.confirm(`Bạn có chắc chắn muốn xóa món ăn "${name || '#' + id}" khỏi hệ thống gợi ý?`, {
            title: 'Xóa Món Ăn',
            type: 'error',
            confirmText: 'Xóa món ăn',
            cancelText: 'Hủy'
        });
        if (!ok) return;
        try {
            await api.del('/api/admin/xoa-mon-an/' + id);
            await dialog.alert('Đã xóa món ăn thành công!', { type: 'success' });
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi xóa món ăn', { type: 'error' });
        }
    };

    // ---- ĐƠN HÀNG HANDLERS ----
    const updateOrderStatus = async (id, trangThai) => {
        try {
            await api.put('/api/admin/don-hang/' + id, { trang_thai: trangThai });
            await dialog.alert(`Đã cập nhật trạng thái đơn hàng #DH${id} thành "${trangThai}"!`, { type: 'success' });
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi cập nhật trạng thái đơn hàng', { type: 'error' });
        }
    };

    const confirmPayment = async (id) => {
        const ok = await dialog.confirm(`Xác nhận Admin đã kiểm tra tài khoản và nhận đủ tiền chuyển khoản cho đơn hàng #DH${id}?`, {
            title: 'Xác Nhận Nhận Tiền QR',
            type: 'confirm',
            confirmText: 'Đã nhận tiền',
            cancelText: 'Hủy'
        });
        if (!ok) return;
        try {
            await api.put('/api/admin/don-hang/' + id + '/xac-nhan-thanh-toan');
            await dialog.alert('Đã xác nhận thanh toán chuyển khoản thành công!', { type: 'success' });
            loadAll();
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi xác nhận thanh toán', { type: 'error' });
        }
    };

    const viewOrderDetails = async (order) => {
        setOrderDetailId(order.id);
        setOrderDetailData(order);
        setOrderDetailItems([]);
        setOrderDetailLoading(true);
        setShowOrderDetail(true);
        try {
            const items = await api.get('/api/don-hang/' + order.id + '/chi-tiet');
            setOrderDetailItems(items || []);
        } catch (err) {
            await dialog.alert(err.message || 'Lỗi khi tải chi tiết đơn hàng', { type: 'error' });
        } finally {
            setOrderDetailLoading(false);
        }
    };

    // ---- ĐĂNG XUẤT ----
    const handleLogout = async (e) => {
        e.preventDefault();
        const ok = await dialog.confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?', {
            title: 'Đăng Xuất Admin',
            type: 'warning',
            confirmText: 'Đăng xuất',
            cancelText: 'Ở lại'
        });
        if (!ok) return;
        await logout();
        navigate('/');
    };

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = !productSearch ||
                p.ten_san_pham.toLowerCase().includes(productSearch.toLowerCase()) ||
                String(p.id).includes(productSearch);
            const matchCategory = productCategoryFilter === 'ALL' || p.danh_muc === productCategoryFilter;
            let matchStock = true;
            if (productStockFilter === 'IN_STOCK') matchStock = Number(p.so_luong_ton) > 5;
            else if (productStockFilter === 'LOW_STOCK') matchStock = Number(p.so_luong_ton) > 0 && Number(p.so_luong_ton) <= 5;
            else if (productStockFilter === 'OUT_OF_STOCK') matchStock = Number(p.so_luong_ton) <= 0;

            return matchSearch && matchCategory && matchStock;
        });
    }, [products, productSearch, productCategoryFilter, productStockFilter]);

    const filteredDishes = useMemo(() => {
        return dishes.filter(d => {
            const matchSearch = !dishSearch ||
                d.ten_mon.toLowerCase().includes(dishSearch.toLowerCase()) ||
                (d.nguyen_lieu_chinh && d.nguyen_lieu_chinh.toLowerCase().includes(dishSearch.toLowerCase())) ||
                String(d.id).includes(dishSearch);
            const matchType = dishTypeFilter === 'ALL' || d.loai_mon === dishTypeFilter;
            return matchSearch && matchType;
        });
    }, [dishes, dishSearch, dishTypeFilter]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const searchLower = orderSearch.toLowerCase();
            const matchSearch = !orderSearch ||
                String(o.id).includes(orderSearch) ||
                (o.ten_khach_hang && o.ten_khach_hang.toLowerCase().includes(searchLower)) ||
                (o.so_dien_thoai && o.so_dien_thoai.includes(orderSearch)) ||
                (o.dia_chi && o.dia_chi.toLowerCase().includes(searchLower));
            const matchStatus = orderStatusFilter === 'ALL' || o.trang_thai === orderStatusFilter;
            return matchSearch && matchStatus;
        });
    }, [orders, orderSearch, orderStatusFilter]);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const searchLower = userSearch.toLowerCase();
            const matchSearch = !userSearch ||
                (u.ho_ten && u.ho_ten.toLowerCase().includes(searchLower)) ||
                (u.email && u.email.toLowerCase().includes(searchLower)) ||
                String(u.id).includes(userSearch);
            const matchRole = userRoleFilter === 'ALL' || u.vai_tro === userRoleFilter;
            return matchSearch && matchRole;
        });
    }, [users, userSearch, userRoleFilter]);

    // Helpers for rendering badge colors
    const renderOrderStatusBadge = (status) => {
        switch (status) {
            case 'Chờ xử lý':
                return <span className="badge-pill-custom badge-warning-soft"><i className="fas fa-clock"></i> Chờ xử lý</span>;
            case 'Đang giao':
                return <span className="badge-pill-custom badge-info-soft"><i className="fas fa-truck"></i> Đang giao</span>;
            case 'Đã giao':
                return <span className="badge-pill-custom badge-purple-soft"><i className="fas fa-box-check"></i> Đã giao</span>;
            case 'Đã hoàn thành':
                return <span className="badge-pill-custom badge-success-soft"><i className="fas fa-check-circle"></i> Đã hoàn thành</span>;
            case 'Đã hủy':
                return <span className="badge-pill-custom badge-danger-soft"><i className="fas fa-times-circle"></i> Đã hủy</span>;
            default:
                return <span className="badge-pill-custom badge-slate-soft">{status}</span>;
        }
    };

    const renderDishTypeBadge = (type) => {
        switch (type) {
            case 'Món mặn': return <span className="badge-pill-custom badge-info-soft">{type}</span>;
            case 'Món chay': return <span className="badge-pill-custom badge-success-soft">{type}</span>;
            case 'Đồ uống': return <span className="badge-pill-custom badge-purple-soft">{type}</span>;
            default: return <span className="badge-pill-custom badge-warning-soft">{type || 'Món khác'}</span>;
        }
    };

    const renderCategoryBadge = (cat) => {
        switch (cat) {
            case 'Trái Cây': return <span className="badge-pill-custom badge-success-soft">🍎 {cat}</span>;
            case 'Rau Củ': return <span className="badge-pill-custom badge-info-soft">🥦 {cat}</span>;
            case 'Thực Phẩm': return <span className="badge-pill-custom badge-warning-soft">🌾 {cat}</span>;
            case 'Đồ Uống': return <span className="badge-pill-custom badge-purple-soft">🍹 {cat}</span>;
            default: return <span className="badge-pill-custom badge-slate-soft">{cat}</span>;
        }
    };

    const productCategories = CATEGORIES.some(c => c === editProductForm.danh_muc)
        ? CATEGORIES
        : [editProductForm.danh_muc, ...CATEGORIES];

    const dishTypes = DISH_TYPES.some(t => t === editDishForm.loai_mon)
        ? DISH_TYPES
        : [editDishForm.loai_mon, ...DISH_TYPES];

    return (
        <div className="admin-wrapper">
            {/* Overlay cho Mobile Sidebar */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* ===== SIDEBAR NAVIGATION ===== */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo-icon">
                        <i className="fas fa-leaf"></i>
                    </div>
                    <div className="brand-text">
                        <h4 className="brand-title">FRUITABLES</h4>
                        <span className="brand-subtitle">Admin Control Panel</span>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <span className="menu-category-label">Menu Quản Trị</span>
                    {TABS.map(t => {
                        let count = null;
                        if (t.key === 'orders' && pendingOrdersCount > 0) count = pendingOrdersCount;
                        if (t.key === 'products' && lowStockProductsCount > 0) count = '!';

                        return (
                            <button
                                key={t.key}
                                className={`nav-item-btn ${activeTab === t.key ? 'active' : ''}`}
                                onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}
                            >
                                <span className="nav-left">
                                    <i className={`fas ${t.icon}`}></i>
                                    <span>{t.label}</span>
                                </span>
                                {count && <span className="badge-count">{count}</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="sidebar-footer">
                    <div className="admin-user-card">
                        <div className="user-avatar">
                            {(user && user.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : 'A')}
                        </div>
                        <div className="user-info">
                            <h6 className="user-name">{esc(user && user.ho_ten ? user.ho_ten : 'Quản trị viên')}</h6>
                            <span className="user-role">
                                <i className="fas fa-shield-alt"></i> Super Admin
                            </span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Đăng Xuất
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="admin-main-content">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="d-flex align-items-center">
                        <button
                            className="mobile-sidebar-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="page-heading">
                            <h2>{TAB_TITLES[activeTab].title}</h2>
                            <p>{TAB_TITLES[activeTab].desc}</p>
                        </div>
                    </div>

                    <div className="topbar-actions">
                        <button
                            className="topbar-btn"
                            onClick={() => loadAll(true)}
                            title="Làm mới dữ liệu"
                            disabled={refreshing || loading}
                        >
                            <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin text-success' : ''}`}></i>
                            <span className="d-none d-md-inline">{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
                        </button>
                        <Link to="/" target="_blank" rel="noreferrer" className="topbar-btn topbar-btn-primary">
                            <i className="fas fa-external-link-alt"></i>
                            <span className="d-none d-md-inline">Xem Cửa Hàng</span>
                        </Link>
                    </div>
                </header>

                {/* Body Content */}
                <div className="admin-body-container">
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '50vh' }}>
                            <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                <span className="visually-hidden">Đang tải dữ liệu...</span>
                            </div>
                            <span className="text-muted fw-semibold">Đang tải dữ liệu hệ thống...</span>
                        </div>
                    ) : (
                        <>
                            {/* ============================================================
                               TAB 1: TỔNG QUAN DASHBOARD
                               ============================================================ */}
                            {activeTab === 'dashboard' && (
                                <div className="tab-dashboard-view">
                                    {/* 5 Stats Cards Equal Height */}
                                    <div className="row g-3 mb-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5 align-items-stretch">
                                        <div className="col d-flex">
                                            <div className="stat-card-modern stat-green w-100">
                                                <div className="stat-card-top">
                                                    <span className="stat-label">Doanh Thu</span>
                                                    <div className="stat-icon-wrap icon-green">
                                                        <i className="fas fa-coins"></i>
                                                    </div>
                                                </div>
                                                <div className="stat-value text-success">{fmtVND(revenue)}</div>
                                                <div className="stat-desc text-muted">Từ {orders.filter(o => o.trang_thai === 'Đã hoàn thành').length} đơn đã giao</div>
                                            </div>
                                        </div>

                                        <div className="col d-flex">
                                            <div className="stat-card-modern stat-blue w-100">
                                                <div className="stat-card-top">
                                                    <span className="stat-label">Đơn Hàng</span>
                                                    <div className="stat-icon-wrap icon-blue">
                                                        <i className="fas fa-shopping-bag"></i>
                                                    </div>
                                                </div>
                                                <div className="stat-value">{orders.length}</div>
                                                <div className="stat-desc">
                                                    {pendingOrdersCount > 0 ? (
                                                        <span className="text-warning fw-bold"><i className="fas fa-bell me-1"></i>{pendingOrdersCount} đơn chờ duyệt</span>
                                                    ) : (
                                                        <span className="text-muted">Đang hoạt động tốt</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col d-flex">
                                            <div className="stat-card-modern stat-amber w-100">
                                                <div className="stat-card-top">
                                                    <span className="stat-label">Sản Phẩm</span>
                                                    <div className="stat-icon-wrap icon-amber">
                                                        <i className="fas fa-apple-alt"></i>
                                                    </div>
                                                </div>
                                                <div className="stat-value">{products.length}</div>
                                                <div className="stat-desc">
                                                    {lowStockProductsCount > 0 ? (
                                                        <span className="text-danger fw-bold"><i className="fas fa-exclamation-triangle me-1"></i>{lowStockProductsCount} món sắp hết</span>
                                                    ) : (
                                                        <span className="text-success fw-bold">Tồn kho ổn định</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col d-flex">
                                            <div className="stat-card-modern stat-purple w-100">
                                                <div className="stat-card-top">
                                                    <span className="stat-label">Món Ăn</span>
                                                    <div className="stat-icon-wrap icon-purple">
                                                        <i className="fas fa-utensils"></i>
                                                    </div>
                                                </div>
                                                <div className="stat-value">{dishes.length}</div>
                                                <div className="stat-desc text-muted">Công thức ẩm thực</div>
                                            </div>
                                        </div>

                                        <div className="col d-flex">
                                            <div className="stat-card-modern stat-rose w-100">
                                                <div className="stat-card-top">
                                                    <span className="stat-label">Tài Khoản</span>
                                                    <div className="stat-icon-wrap icon-rose">
                                                        <i className="fas fa-users"></i>
                                                    </div>
                                                </div>
                                                <div className="stat-value">{users.length}</div>
                                                <div className="stat-desc text-muted">{users.filter(u => u.vai_tro === 'admin').length} Quản trị viên</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dashboard Quick Actions & Recent Orders */}
                                    <div className="row g-4">
                                        {/* Cột trái: Đơn hàng mới nhất */}
                                        <div className="col-12 col-lg-8">
                                            <div className="admin-card mb-4">
                                                <div className="admin-card-header">
                                                    <h5 className="admin-card-title">
                                                        <i className="fas fa-receipt text-primary"></i> Đơn Hàng Mới Nhất
                                                    </h5>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary fw-semibold"
                                                        onClick={() => setActiveTab('orders')}
                                                    >
                                                        Xem tất cả ({orders.length})
                                                    </button>
                                                </div>
                                                <div className="admin-card-body-flush">
                                                    <div className="table-responsive">
                                                        <table className="table-modern">
                                                            <thead>
                                                                <tr>
                                                                    <th>Mã Đơn</th>
                                                                    <th>Khách Hàng</th>
                                                                    <th>Tổng Tiền</th>
                                                                    <th>Thanh Toán</th>
                                                                    <th>Trạng Thái</th>
                                                                    <th>Hành Động</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orders.slice(0, 5).map(o => (
                                                                    <tr key={o.id}>
                                                                        <td className="fw-bold text-dark">#DH{o.id}</td>
                                                                        <td>
                                                                            <div className="fw-semibold">{esc(o.ten_khach_hang || 'Khách vãng lai')}</div>
                                                                            <small className="text-muted">{esc(o.so_dien_thoai || '—')}</small>
                                                                        </td>
                                                                        <td className="fw-bold text-success">{fmtVND(o.tong_tien)}</td>
                                                                        <td>
                                                                            {o.phuong_thuc_thanh_toan === 'BANK_QR' ? (
                                                                                <span className="badge-pill-custom badge-info-soft"><i className="fas fa-qrcode"></i> QR</span>
                                                                            ) : (
                                                                                <span className="badge-pill-custom badge-slate-soft">COD</span>
                                                                            )}
                                                                        </td>
                                                                        <td>{renderOrderStatusBadge(o.trang_thai)}</td>
                                                                        <td>
                                                                            <button
                                                                                className="btn-action-icon btn-view"
                                                                                title="Xem chi tiết"
                                                                                onClick={() => viewOrderDetails(o)}
                                                                            >
                                                                                <i className="fas fa-eye"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {orders.length === 0 && (
                                                                    <tr>
                                                                        <td colSpan={6} className="text-center py-4 text-muted">Chưa có đơn hàng nào trong hệ thống</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cột phải: Phím tắt & Cảnh báo tồn kho */}
                                        <div className="col-12 col-lg-4">
                                            {/* Phím tắt thao tác nhanh */}
                                            <div className="admin-card mb-4">
                                                <div className="admin-card-header">
                                                    <h5 className="admin-card-title">
                                                        <i className="fas fa-bolt text-warning"></i> Thao Tác Nhanh
                                                    </h5>
                                                </div>
                                                <div className="admin-card-body d-flex flex-column gap-2">
                                                    <button
                                                        className="btn btn-outline-success text-start fw-semibold py-2 px-3 d-flex align-items-center justify-content-between"
                                                        onClick={() => { setAddProductForm(emptyProductForm()); setShowAddProduct(true); }}
                                                    >
                                                        <span><i className="fas fa-plus-circle me-2"></i> Thêm Sản Phẩm Mới</span>
                                                        <i className="fas fa-chevron-right text-muted small"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-primary text-start fw-semibold py-2 px-3 d-flex align-items-center justify-content-between"
                                                        onClick={() => { setAddDishForm(emptyDishForm()); setShowAddDish(true); }}
                                                    >
                                                        <span><i className="fas fa-utensils me-2"></i> Thêm Món Ăn Mới</span>
                                                        <i className="fas fa-chevron-right text-muted small"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary text-start fw-semibold py-2 px-3 d-flex align-items-center justify-content-between"
                                                        onClick={() => setActiveTab('orders')}
                                                    >
                                                        <span><i className="fas fa-truck me-2"></i> Kiểm Tra Đơn Hàng</span>
                                                        <i className="fas fa-chevron-right text-muted small"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Danh sách cảnh báo hàng tồn */}
                                            <div className="admin-card">
                                                <div className="admin-card-header">
                                                    <h5 className="admin-card-title">
                                                        <i className="fas fa-boxes text-danger"></i> Cảnh Báo Tồn Kho
                                                    </h5>
                                                </div>
                                                <div className="admin-card-body p-0">
                                                    <div className="list-group list-group-flush">
                                                        {products.filter(p => Number(p.so_luong_ton) <= 5).slice(0, 4).map(p => (
                                                            <div key={p.id} className="list-group-item d-flex align-items-center justify-content-between py-3">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img
                                                                        src={imgUrl(p.hinh_anh)}
                                                                        alt={esc(p.ten_san_pham)}
                                                                        className="rounded"
                                                                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                                    />
                                                                    <div>
                                                                        <div className="fw-bold small">{esc(p.ten_san_pham)}</div>
                                                                        <small className="text-muted">{fmtVND(p.gia)}</small>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    {Number(p.so_luong_ton) === 0 ? (
                                                                        <span className="badge-pill-custom badge-danger-soft">Hết hàng</span>
                                                                    ) : (
                                                                        <span className="badge-pill-custom badge-warning-soft">Còn {p.so_luong_ton}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {products.filter(p => Number(p.so_luong_ton) <= 5).length === 0 && (
                                                            <div className="p-4 text-center text-muted small">
                                                                <i className="fas fa-check-circle text-success fs-4 mb-2 d-block"></i>
                                                                Mọi sản phẩm đều còn số lượng dồi dào!
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ============================================================
                               TAB 2: QUẢN LÝ SẢN PHẨM
                               ============================================================ */}
                            {activeTab === 'products' && (
                                <div className="tab-products-view">
                                    {/* Header Filter Toolbar */}
                                    <div className="filter-bar">
                                        <div className="search-input-wrap">
                                            <i className="fas fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Tìm theo tên sản phẩm hoặc mã ID..."
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                            />
                                        </div>

                                        <div className="filter-controls">
                                            <select
                                                className="filter-select"
                                                value={productCategoryFilter}
                                                onChange={(e) => setProductCategoryFilter(e.target.value)}
                                            >
                                                <option value="ALL">Tất cả danh mục</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>

                                            <select
                                                className="filter-select"
                                                value={productStockFilter}
                                                onChange={(e) => setProductStockFilter(e.target.value)}
                                            >
                                                <option value="ALL">Tất cả tồn kho</option>
                                                <option value="IN_STOCK">Còn hàng dồi dào (&gt; 5)</option>
                                                <option value="LOW_STOCK">Sắp hết hàng (&le; 5)</option>
                                                <option value="OUT_OF_STOCK">Đã hết hàng (0)</option>
                                            </select>

                                            <button
                                                className="btn btn-success fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                                                onClick={() => { setAddProductForm(emptyProductForm()); setShowAddProduct(true); }}
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                                <span>Thêm Sản Phẩm Mới</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table Container */}
                                    <div className="admin-card">
                                        <div className="admin-card-header">
                                            <h5 className="admin-card-title">
                                                <i className="fas fa-boxes text-success"></i> Danh Sách Nông Sản &amp; Thực Phẩm
                                            </h5>
                                            <span className="text-muted small">
                                                Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
                                            </span>
                                        </div>
                                        <div className="admin-card-body-flush">
                                            <div className="table-responsive">
                                                <table className="table-modern">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '60px' }}>Mã</th>
                                                            <th style={{ width: '80px' }}>Hình Ảnh</th>
                                                            <th>Tên Sản Phẩm</th>
                                                            <th>Danh Mục</th>
                                                            <th>Giá Bán</th>
                                                            <th>Tồn Kho</th>
                                                            <th>Mô Tả Ngắn</th>
                                                            <th style={{ width: '110px' }} className="text-end">Hành Động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredProducts.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={8} className="text-center py-5 text-muted">
                                                                    <i className="fas fa-box-open fs-2 mb-2 d-block text-secondary opacity-50"></i>
                                                                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                                                                </td>
                                                            </tr>
                                                        ) : filteredProducts.map(p => (
                                                            <tr key={p.id}>
                                                                <td className="fw-bold text-secondary">#{p.id}</td>
                                                                <td>
                                                                    <img
                                                                        src={imgUrl(p.hinh_anh)}
                                                                        alt={esc(p.ten_san_pham)}
                                                                        className="table-img-thumb"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <div className="fw-bold text-dark">{esc(p.ten_san_pham)}</div>
                                                                </td>
                                                                <td>{renderCategoryBadge(p.danh_muc || 'Nông sản')}</td>
                                                                <td className="fw-bold text-success fs-6">{fmtVND(p.gia)}</td>
                                                                <td>
                                                                    {Number(p.so_luong_ton) <= 0 ? (
                                                                        <span className="badge-pill-custom badge-danger-soft">Hết hàng</span>
                                                                    ) : Number(p.so_luong_ton) <= 5 ? (
                                                                        <span className="badge-pill-custom badge-warning-soft">Sắp hết ({p.so_luong_ton})</span>
                                                                    ) : (
                                                                        <span className="badge-pill-custom badge-success-soft">Còn {p.so_luong_ton}</span>
                                                                    )}
                                                                </td>
                                                                <td style={{ maxWidth: 220 }}>
                                                                    <span className="text-muted small text-truncate d-block" title={esc(p.mo_ta)}>
                                                                        {esc(p.mo_ta || '—')}
                                                                    </span>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="action-btn-group">
                                                                        <button
                                                                            className="btn-action-icon btn-edit"
                                                                            title="Chỉnh sửa sản phẩm"
                                                                            onClick={() => openEditProduct(p)}
                                                                        >
                                                                            <i className="fas fa-pen"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn-action-icon btn-delete"
                                                                            title="Xóa sản phẩm"
                                                                            onClick={() => deleteProduct(p.id, p.ten_san_pham)}
                                                                        >
                                                                            <i className="fas fa-trash-alt"></i>
                                                                        </button>
                                                                    </div>
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

                            {/* ============================================================
                               TAB 3: QUẢN LÝ MÓN ĂN GỢI Ý
                               ============================================================ */}
                            {activeTab === 'dishes' && (
                                <div className="tab-dishes-view">
                                    {/* Toolbar */}
                                    <div className="filter-bar">
                                        <div className="search-input-wrap">
                                            <i className="fas fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Tìm theo tên món hoặc nguyên liệu..."
                                                value={dishSearch}
                                                onChange={(e) => setDishSearch(e.target.value)}
                                            />
                                        </div>

                                        <div className="filter-controls">
                                            <select
                                                className="filter-select"
                                                value={dishTypeFilter}
                                                onChange={(e) => setDishTypeFilter(e.target.value)}
                                            >
                                                <option value="ALL">Tất cả phân loại món</option>
                                                {DISH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>

                                            <button
                                                className="btn btn-warning text-dark fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                                                onClick={() => { setAddDishForm(emptyDishForm()); setShowAddDish(true); }}
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                                <span>Thêm Món Ăn Mới</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="admin-card">
                                        <div className="admin-card-header">
                                            <h5 className="admin-card-title">
                                                <i className="fas fa-utensils text-warning"></i> Danh Sách Món Ăn Gợi Ý
                                            </h5>
                                            <span className="text-muted small">
                                                Hiển thị <strong>{filteredDishes.length}</strong> / {dishes.length} món
                                            </span>
                                        </div>
                                        <div className="admin-card-body-flush">
                                            <div className="table-responsive">
                                                <table className="table-modern">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '60px' }}>Mã</th>
                                                            <th style={{ width: '80px' }}>Hình Ảnh</th>
                                                            <th>Tên Món Ăn</th>
                                                            <th>Phân Loại</th>
                                                            <th>Nguyên Liệu Chính</th>
                                                            <th>Công Thức Chế Biến</th>
                                                            <th style={{ width: '110px' }} className="text-end">Hành Động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredDishes.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={7} className="text-center py-5 text-muted">
                                                                    <i className="fas fa-utensils fs-2 mb-2 d-block text-secondary opacity-50"></i>
                                                                    Không tìm thấy món ăn nào phù hợp.
                                                                </td>
                                                            </tr>
                                                        ) : filteredDishes.map(d => (
                                                            <tr key={d.id}>
                                                                <td className="fw-bold text-secondary">#{d.id}</td>
                                                                <td>
                                                                    <img
                                                                        src={imgUrl(d.hinh_anh)}
                                                                        alt={esc(d.ten_mon)}
                                                                        className="table-img-thumb"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <div className="fw-bold text-dark">{esc(d.ten_mon)}</div>
                                                                </td>
                                                                <td>{renderDishTypeBadge(d.loai_mon)}</td>
                                                                <td style={{ maxWidth: 260 }}>
                                                                    <div className="d-flex flex-wrap">
                                                                        {(d.nguyen_lieu_chinh || '').split(',').map((item, idx) => {
                                                                            const trimmed = item.trim();
                                                                            if (!trimmed) return null;
                                                                            return <span key={idx} className="ingredient-tag">{trimmed}</span>;
                                                                        })}
                                                                    </div>
                                                                </td>
                                                                <td style={{ maxWidth: 250 }}>
                                                                    <button
                                                                        className="btn btn-sm btn-light border text-start d-flex align-items-center justify-content-between w-100 py-1 px-2"
                                                                        onClick={() => setRecipeModalDish(d)}
                                                                    >
                                                                        <span className="text-truncate me-2 small text-muted">
                                                                            {esc(d.cong_thuc || 'Chưa có công thức')}
                                                                        </span>
                                                                        <i className="fas fa-expand-alt text-primary small"></i>
                                                                    </button>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="action-btn-group">
                                                                        <button
                                                                            className="btn-action-icon btn-edit"
                                                                            title="Chỉnh sửa món ăn"
                                                                            onClick={() => openEditDish(d)}
                                                                        >
                                                                            <i className="fas fa-pen"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn-action-icon btn-delete"
                                                                            title="Xóa món ăn"
                                                                            onClick={() => deleteDish(d.id, d.ten_mon)}
                                                                        >
                                                                            <i className="fas fa-trash-alt"></i>
                                                                        </button>
                                                                    </div>
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

                            {/* ============================================================
                               TAB 4: QUẢN LÝ ĐƠN HÀNG
                               ============================================================ */}
                            {activeTab === 'orders' && (
                                <div className="tab-orders-view">
                                    {/* Status Filter Tabs */}
                                    <div className="status-pill-tabs">
                                        <button
                                            className={`status-pill-tab ${orderStatusFilter === 'ALL' ? 'active' : ''}`}
                                            onClick={() => setOrderStatusFilter('ALL')}
                                        >
                                            Tất cả ({orders.length})
                                        </button>
                                        {ORDER_STATUSES.map(st => {
                                            const count = orders.filter(o => o.trang_thai === st).length;
                                            return (
                                                <button
                                                    key={st}
                                                    className={`status-pill-tab ${orderStatusFilter === st ? 'active' : ''}`}
                                                    onClick={() => setOrderStatusFilter(st)}
                                                >
                                                    {st} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Search Bar */}
                                    <div className="filter-bar">
                                        <div className="search-input-wrap">
                                            <i className="fas fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Tìm theo mã đơn (#DH...), tên khách, SĐT, địa chỉ..."
                                                value={orderSearch}
                                                onChange={(e) => setOrderSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Orders Table */}
                                    <div className="admin-card">
                                        <div className="admin-card-header">
                                            <h5 className="admin-card-title">
                                                <i className="fas fa-shopping-cart text-primary"></i> Danh Sách Đơn Hàng
                                            </h5>
                                            <span className="text-muted small">
                                                Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn
                                            </span>
                                        </div>
                                        <div className="admin-card-body-flush">
                                            <div className="table-responsive">
                                                <table className="table-modern">
                                                    <thead>
                                                        <tr>
                                                            <th>Mã Đơn</th>
                                                            <th>Khách Hàng</th>
                                                            <th>Địa Chỉ Giao</th>
                                                            <th>Tổng Tiền</th>
                                                            <th>Phương Thức TT</th>
                                                            <th>Ngày Đặt</th>
                                                            <th>Trạng Thái Đơn</th>
                                                            <th style={{ width: '80px' }} className="text-center">Chi Tiết</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredOrders.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={8} className="text-center py-5 text-muted">
                                                                    <i className="fas fa-box fs-2 mb-2 d-block text-secondary opacity-50"></i>
                                                                    Không tìm thấy đơn hàng nào.
                                                                </td>
                                                            </tr>
                                                        ) : filteredOrders.map(o => (
                                                            <tr key={o.id}>
                                                                <td>
                                                                    <span className="badge-pill-custom badge-slate-soft fw-bold">#DH{o.id}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="fw-bold text-dark">{esc(o.ten_khach_hang || 'Khách vãng lai')}</div>
                                                                    <div className="text-muted small"><i className="fas fa-phone-alt me-1"></i>{esc(o.so_dien_thoai || 'Chưa có')}</div>
                                                                </td>
                                                                <td style={{ maxWidth: 190 }}>
                                                                    <span className="text-muted small text-truncate d-block" title={esc(o.dia_chi)}>
                                                                        <i className="fas fa-map-marker-alt me-1 text-danger"></i>{esc(o.dia_chi || 'Chưa có')}
                                                                    </span>
                                                                </td>
                                                                <td className="fw-bold text-success fs-6">{fmtVND(o.tong_tien)}</td>
                                                                <td>
                                                                    {o.phuong_thuc_thanh_toan === 'BANK_QR' ? (
                                                                        <div>
                                                                            {(o.trang_thai_thanh_toan || '').includes('Đã thanh toán') ? (
                                                                                <span className="badge-pill-custom badge-success-soft">
                                                                                    <i className="fas fa-check-circle"></i> Đã CK QR
                                                                                </span>
                                                                            ) : (
                                                                                <div>
                                                                                    <span className="badge-pill-custom badge-warning-soft mb-1 d-inline-block">
                                                                                        <i className="fas fa-hourglass-half"></i> Chờ CK
                                                                                    </span>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-success py-0 px-2 small shadow-sm d-block mt-1"
                                                                                        style={{ fontSize: '11px', borderRadius: '6px' }}
                                                                                        onClick={() => confirmPayment(o.id)}
                                                                                    >
                                                                                        <i className="fas fa-check me-1"></i>Xác nhận tiền
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="badge-pill-custom badge-slate-soft">💵 COD</span>
                                                                    )}
                                                                </td>
                                                                <td className="small text-muted">{fmtDateTime(o.ngay_dat)}</td>
                                                                <td>
                                                                    <select
                                                                        key={o.id + '-' + o.trang_thai}
                                                                        className="form-select form-select-sm fw-bold border-1"
                                                                        style={{ width: '150px', borderRadius: '8px', fontSize: '0.85rem' }}
                                                                        defaultValue={o.trang_thai}
                                                                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                                    >
                                                                        {getAllowedNextStatuses(o.trang_thai).map(st => (
                                                                            <option key={st} value={st}>{esc(st)}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="text-center">
                                                                    <button
                                                                        className="btn-action-icon btn-view"
                                                                        title="Xem chi tiết đơn hàng"
                                                                        onClick={() => viewOrderDetails(o)}
                                                                    >
                                                                        <i className="fas fa-eye"></i>
                                                                    </button>
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

                            {/* ============================================================
                               TAB 5: QUẢN LÝ TÀI KHOẢN
                               ============================================================ */}
                            {activeTab === 'users' && (
                                <div className="tab-users-view">
                                    {/* Search toolbar */}
                                    <div className="filter-bar">
                                        <div className="search-input-wrap">
                                            <i className="fas fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Tìm theo họ tên hoặc email..."
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                            />
                                        </div>

                                        <div className="filter-controls">
                                            <select
                                                className="filter-select"
                                                value={userRoleFilter}
                                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                            >
                                                <option value="ALL">Tất cả vai trò</option>
                                                <option value="admin">Quản trị viên (Admin)</option>
                                                <option value="khach_hang">Khách hàng</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Users Table */}
                                    <div className="admin-card">
                                        <div className="admin-card-header">
                                            <h5 className="admin-card-title">
                                                <i className="fas fa-users-cog text-primary"></i> Tài Khoản Người Dùng &amp; Quản Trị
                                            </h5>
                                            <span className="text-muted small">
                                                Hiển thị <strong>{filteredUsers.length}</strong> / {users.length} tài khoản
                                            </span>
                                        </div>
                                        <div className="admin-card-body-flush">
                                            <div className="table-responsive">
                                                <table className="table-modern">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '60px' }}>ID</th>
                                                            <th>Thành Viên</th>
                                                            <th>Email Liên Hệ</th>
                                                            <th>Phân Quyền</th>
                                                            <th>Ngày Đăng Ký</th>
                                                            <th>Trạng Thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredUsers.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-5 text-muted">
                                                                    <i className="fas fa-user-slash fs-2 mb-2 d-block text-secondary opacity-50"></i>
                                                                    Không tìm thấy tài khoản nào.
                                                                </td>
                                                            </tr>
                                                        ) : filteredUsers.map(u => (
                                                            <tr key={u.id}>
                                                                <td className="fw-bold text-secondary">#{u.id}</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div
                                                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                                                            style={{
                                                                                width: 36, height: 36,
                                                                                background: u.vai_tro === 'admin' ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'linear-gradient(135deg, #10b981, #3b82f6)'
                                                                            }}
                                                                        >
                                                                            {(u.ho_ten || 'U').charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="fw-bold text-dark">{esc(u.ho_ten || 'Người dùng')}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-muted">{esc(u.email)}</td>
                                                                <td>
                                                                    {u.vai_tro === 'admin' ? (
                                                                        <span className="badge-pill-custom badge-danger-soft">
                                                                            <i className="fas fa-shield-alt"></i> Quản trị viên
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge-pill-custom badge-success-soft">
                                                                            <i className="fas fa-user"></i> Khách hàng
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="text-muted small">{fmtDate(u.ngay_tao)}</td>
                                                                <td>
                                                                    <span className="badge-pill-custom badge-success-soft">
                                                                        <i className="fas fa-check"></i> Hoạt động
                                                                    </span>
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
                        </>
                    )}
                </div>
            </main>

            {/* ============================================================
               MODAL THÊM SẢN PHẨM MỚI
               ============================================================ */}
            <AdminModal
                show={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                title="Thêm Sản Phẩm Nông Sản Mới"
                icon="fa-plus-circle"
                headerTheme="primary"
                size="modal-lg"
            >
                <form onSubmit={submitAddProduct} className="admin-modal-form">
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-8">
                                <div className="form-group-custom">
                                    <label>Tên sản phẩm <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ví dụ: Táo Xanh Ninh Thuận Chuẩn VietGAP"
                                        required
                                        value={addProductForm.ten_san_pham}
                                        onChange={(e) => setAddProductForm({ ...addProductForm, ten_san_pham: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group-custom">
                                    <label>Danh mục phân loại <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={addProductForm.danh_muc}
                                        onChange={(e) => setAddProductForm({ ...addProductForm, danh_muc: e.target.value })}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{esc(c)}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Giá bán (VNĐ / kg hoặc combo) <span className="text-danger">*</span></label>
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
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Số lượng tồn kho ban đầu <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="50"
                                        min="0"
                                        required
                                        value={addProductForm.so_luong_ton}
                                        onChange={(e) => setAddProductForm({ ...addProductForm, so_luong_ton: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Hình ảnh sản phẩm <span className="text-danger">*</span></label>
                                    <div className="file-upload-zone" onClick={() => document.getElementById('addProductFileInput').click()}>
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <div className="fw-bold text-dark">Nhấp để chọn ảnh từ máy tính</div>
                                        <small className="text-muted">Hỗ trợ JPG, PNG, WEBP...</small>
                                        <input
                                            id="addProductFileInput"
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) => onFile(e, addProductForm, setAddProductForm)}
                                        />
                                    </div>
                                    {addProductForm.preview && (
                                        <div className="upload-preview-container mt-2">
                                            <img src={addProductForm.preview} alt="Xem trước" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Mô tả chi tiết &amp; Nguồn gốc</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Mô tả nguồn gốc xuất xứ, độ ngọt, tiêu chuẩn trồng..."
                                        value={addProductForm.mo_ta}
                                        onChange={(e) => setAddProductForm({ ...addProductForm, mo_ta: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light fw-semibold" onClick={() => setShowAddProduct(false)}>Hủy</button>
                        <button type="submit" className="btn btn-success fw-bold px-4 shadow-sm" disabled={submitting}>
                            {submitting ? <><i className="fas fa-spinner fa-spin me-1"></i> Đang lưu...</> : <><i className="fas fa-save me-1"></i> Lưu Sản Phẩm</>}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* ============================================================
               MODAL CHỈNH SỬA SẢN PHẨM
               ============================================================ */}
            <AdminModal
                show={showEditProduct}
                onClose={() => setShowEditProduct(false)}
                title="Chỉnh Sửa Thông Tin Sản Phẩm"
                icon="fa-edit"
                headerTheme="warning"
                size="modal-lg"
            >
                <form onSubmit={submitEditProduct} className="admin-modal-form">
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-8">
                                <div className="form-group-custom">
                                    <label>Tên sản phẩm <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={editProductForm.ten_san_pham}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, ten_san_pham: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group-custom">
                                    <label>Danh mục phân loại <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={editProductForm.danh_muc}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, danh_muc: e.target.value })}
                                    >
                                        {productCategories.map(c => <option key={c} value={c}>{esc(c)}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Giá bán (VNĐ) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        required
                                        value={editProductForm.gia}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, gia: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="form-group-custom">
                                    <label>Số lượng tồn kho <span className="text-danger">*</span></label>
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

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Ảnh sản phẩm (giữ nguyên nếu không đổi)</label>
                                    <div className="file-upload-zone" onClick={() => document.getElementById('editProductFileInput').click()}>
                                        <i className="fas fa-image"></i>
                                        <div className="fw-bold text-dark">Nhấp để thay đổi ảnh mới</div>
                                        <input
                                            id="editProductFileInput"
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) => onFile(e, editProductForm, setEditProductForm)}
                                        />
                                    </div>
                                    {editProductForm.preview && (
                                        <div className="upload-preview-container mt-2">
                                            <img src={editProductForm.preview} alt="Xem trước" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Mô tả chi tiết</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={editProductForm.mo_ta}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, mo_ta: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light fw-semibold" onClick={() => setShowEditProduct(false)}>Hủy</button>
                        <button type="submit" className="btn btn-warning text-dark fw-bold px-4 shadow-sm" disabled={submitting}>
                            {submitting ? <><i className="fas fa-spinner fa-spin me-1"></i> Đang lưu...</> : <><i className="fas fa-check me-1"></i> Cập Nhật Sản Phẩm</>}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* ============================================================
               MODAL THÊM MÓN ĂN GỢI Ý
               ============================================================ */}
            <AdminModal
                show={showAddDish}
                onClose={() => setShowAddDish(false)}
                title="Thêm Món Ăn Gợi Ý Mới"
                icon="fa-utensils"
                headerTheme="warning"
                size="modal-lg"
            >
                <form onSubmit={submitAddDish} className="admin-modal-form">
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-8">
                                <div className="form-group-custom">
                                    <label>Tên món ăn <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ví dụ: Salad Ức Gà Sốt Bơ Đậu Phộng"
                                        required
                                        value={addDishForm.ten_mon}
                                        onChange={(e) => setAddDishForm({ ...addDishForm, ten_mon: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group-custom">
                                    <label>Phân loại món <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={addDishForm.loai_mon}
                                        onChange={(e) => setAddDishForm({ ...addDishForm, loai_mon: e.target.value })}
                                    >
                                        {DISH_TYPES.map(t => <option key={t} value={t}>{esc(t)}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Nguyên liệu chính (phân cách bằng dấu phẩy) <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ức gà (200g), Rau xà lách (100g), Sốt mè rang (2 thìa)"
                                        required
                                        value={addDishForm.nguyen_lieu_chinh}
                                        onChange={(e) => setAddDishForm({ ...addDishForm, nguyen_lieu_chinh: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Công thức / Hướng dẫn chế biến chi tiết</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="[Bước 1: Sơ chế...] [Bước 2: Luộc chín...] [Bước 3: Trộn đều...]"
                                        value={addDishForm.cong_thuc}
                                        onChange={(e) => setAddDishForm({ ...addDishForm, cong_thuc: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Hình ảnh món ăn <span className="text-danger">*</span></label>
                                    <div className="file-upload-zone" onClick={() => document.getElementById('addDishFileInput').click()}>
                                        <i className="fas fa-camera"></i>
                                        <div className="fw-bold text-dark">Nhấp để chọn ảnh món ăn</div>
                                        <input
                                            id="addDishFileInput"
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) => onFile(e, addDishForm, setAddDishForm)}
                                        />
                                    </div>
                                    {addDishForm.preview && (
                                        <div className="upload-preview-container mt-2">
                                            <img src={addDishForm.preview} alt="Xem trước" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light fw-semibold" onClick={() => setShowAddDish(false)}>Hủy</button>
                        <button type="submit" className="btn btn-warning text-dark fw-bold px-4 shadow-sm" disabled={submitting}>
                            {submitting ? <><i className="fas fa-spinner fa-spin me-1"></i> Đang lưu...</> : <><i className="fas fa-save me-1"></i> Lưu Món Ăn</>}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* ============================================================
               MODAL SỬA MÓN ĂN GỢI Ý
               ============================================================ */}
            <AdminModal
                show={showEditDish}
                onClose={() => setShowEditDish(false)}
                title="Chỉnh Sửa Món Ăn Gợi Ý"
                icon="fa-edit"
                headerTheme="warning"
                size="modal-lg"
            >
                <form onSubmit={submitEditDish} className="admin-modal-form">
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-8">
                                <div className="form-group-custom">
                                    <label>Tên món ăn <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={editDishForm.ten_mon}
                                        onChange={(e) => setEditDishForm({ ...editDishForm, ten_mon: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group-custom">
                                    <label>Phân loại món <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={editDishForm.loai_mon}
                                        onChange={(e) => setEditDishForm({ ...editDishForm, loai_mon: e.target.value })}
                                    >
                                        {dishTypes.map(t => <option key={t} value={t}>{esc(t)}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Nguyên liệu chính (phân cách bằng dấu phẩy) <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={editDishForm.nguyen_lieu_chinh}
                                        onChange={(e) => setEditDishForm({ ...editDishForm, nguyen_lieu_chinh: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Công thức / Hướng dẫn chế biến chi tiết</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={editDishForm.cong_thuc}
                                        onChange={(e) => setEditDishForm({ ...editDishForm, cong_thuc: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group-custom">
                                    <label>Ảnh món ăn (giữ nguyên nếu không đổi)</label>
                                    <div className="file-upload-zone" onClick={() => document.getElementById('editDishFileInput').click()}>
                                        <i className="fas fa-camera"></i>
                                        <div className="fw-bold text-dark">Nhấp để thay đổi ảnh mới</div>
                                        <input
                                            id="editDishFileInput"
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) => onFile(e, editDishForm, setEditDishForm)}
                                        />
                                    </div>
                                    {editDishForm.preview && (
                                        <div className="upload-preview-container mt-2">
                                            <img src={editDishForm.preview} alt="Xem trước" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light fw-semibold" onClick={() => setShowEditDish(false)}>Hủy</button>
                        <button type="submit" className="btn btn-warning text-dark fw-bold px-4 shadow-sm" disabled={submitting}>
                            {submitting ? <><i className="fas fa-spinner fa-spin me-1"></i> Đang lưu...</> : <><i className="fas fa-check me-1"></i> Cập Nhật Món Ăn</>}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* ============================================================
               MODAL XEM CHI TIẾT CÔNG THỨC MÓN ĂN
               ============================================================ */}
            <AdminModal
                show={!!recipeModalDish}
                onClose={() => setRecipeModalDish(null)}
                title={recipeModalDish ? recipeModalDish.ten_mon : 'Công Thức Chế Biến'}
                icon="fa-book-open"
                headerTheme="warning"
                size="modal-lg"
            >
                {recipeModalDish && (
                    <div className="modal-body">
                        <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
                            <img
                                src={imgUrl(recipeModalDish.hinh_anh)}
                                alt={esc(recipeModalDish.ten_mon)}
                                className="rounded-3 shadow-sm"
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                            <div>
                                <h4 className="fw-bold m-0 text-dark">{esc(recipeModalDish.ten_mon)}</h4>
                                <div className="mt-2">{renderDishTypeBadge(recipeModalDish.loai_mon)}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="fw-bold text-secondary mb-2"><i className="fas fa-carrot me-1 text-warning"></i> Nguyên Liệu Cần Chuẩn Bị:</h6>
                            <div className="d-flex flex-wrap gap-1">
                                {(recipeModalDish.nguyen_lieu_chinh || '').split(',').map((item, idx) => {
                                    const trimmed = item.trim();
                                    if (!trimmed) return null;
                                    return <span key={idx} className="ingredient-tag fs-6 px-3 py-1">{trimmed}</span>;
                                })}
                            </div>
                        </div>

                        <div>
                            <h6 className="fw-bold text-secondary mb-2"><i className="fas fa-fire me-1 text-danger"></i> Các Bước Chế Biến:</h6>
                            <div className="p-3 bg-light rounded-3 text-dark" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                                {recipeModalDish.cong_thuc || 'Chưa cập nhật chi tiết hướng dẫn nấu.'}
                            </div>
                        </div>
                    </div>
                )}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setRecipeModalDish(null)}>Đóng</button>
                </div>
            </AdminModal>

            {/* ============================================================
               MODAL XEM CHI TIẾT ĐƠN HÀNG (INVOICE STYLE)
               ============================================================ */}
            <AdminModal
                show={showOrderDetail}
                onClose={() => setShowOrderDetail(false)}
                title={`Chi Tiết Đơn Hàng #DH${orderDetailId}`}
                icon="fa-file-invoice-dollar"
                headerTheme="blue"
                size="modal-lg"
            >
                <div className="modal-body">
                    {orderDetailLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-2" role="status"></div>
                            <div className="text-muted small">Đang lấy dữ liệu chi tiết đơn...</div>
                        </div>
                    ) : (
                        <>
                            {orderDetailData && (
                                <div className="card border-0 bg-light rounded-3 p-3 mb-4">
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <div className="text-muted small">Người nhận hàng:</div>
                                            <div className="fw-bold text-dark fs-6">{esc(orderDetailData.ten_khach_hang || 'Khách vãng lai')}</div>
                                            <div className="small text-muted"><i className="fas fa-phone-alt me-1"></i>{esc(orderDetailData.so_dien_thoai || '—')}</div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="text-muted small">Địa chỉ nhận hàng:</div>
                                            <div className="fw-semibold text-dark">{esc(orderDetailData.dia_chi || '—')}</div>
                                            <div className="small text-muted mt-1">
                                                <i className="fas fa-clock me-1"></i> {fmtDateTime(orderDetailData.ngay_dat)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h6 className="fw-bold text-dark mb-3"><i className="fas fa-boxes me-1 text-primary"></i> Danh Sách Món Đặt Mua:</h6>
                            <div className="table-responsive border rounded-3 overflow-hidden">
                                <table className="table align-middle m-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Sản Phẩm</th>
                                            <th className="text-center">Số Lượng</th>
                                            <th className="text-end">Đơn Giá</th>
                                            <th className="text-end">Thành Tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetailItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">Không có sản phẩm trong đơn hàng này.</td>
                                            </tr>
                                        ) : orderDetailItems.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={imgUrl(item.hinh_anh)}
                                                            alt={esc(item.ten_san_pham)}
                                                            className="rounded-2"
                                                            style={{ width: 44, height: 44, objectFit: 'cover' }}
                                                        />
                                                        <span className="fw-bold text-dark">{esc(item.ten_san_pham)}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center fw-bold">{esc(item.so_luong)}</td>
                                                <td className="text-end text-muted">{fmtVND(item.gia)}</td>
                                                <td className="text-end fw-bold text-success">
                                                    {fmtVND(Number(item.gia) * Number(item.so_luong))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {orderDetailData && (
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan={3} className="text-end fw-bold fs-6">Tổng Tiền Thanh Toán:</td>
                                                <td className="text-end fw-bold text-danger fs-5">
                                                    {fmtVND(orderDetailData.tong_tien)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowOrderDetail(false)}>Đóng</button>
                </div>
            </AdminModal>
        </div>
    );
}
