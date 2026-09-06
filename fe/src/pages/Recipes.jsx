import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import { useDialog } from '../contexts/DialogContext';
import RecipeDetailModal from '../components/RecipeDetailModal';

function RecipeCard({ dish, onSelectDish }) {
    const totalTime = (dish.thoi_gian_chuan_bi || 10) + (dish.thoi_gian_nau || 15);
    const difficultyColors = {
        'Dễ': 'bg-success',
        'Trung bình': 'bg-warning text-dark',
        'Khó': 'bg-danger'
    };
    const diffBadge = difficultyColors[dish.do_kho] || 'bg-success';

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white transition-hover" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                {/* Image Banner */}
                <div className="position-relative" style={{ height: 210, overflow: 'hidden' }}>
                    <img
                        src={imgUrl(dish.hinh_anh)}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        alt={esc(dish.ten_mon)}
                    />
                    <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
                        <span className="badge rounded-pill badge-soft-dark text-white px-3 py-1.5 shadow-sm">
                            <i className="fas fa-utensils me-1"></i> {dish.loai_mon || 'Món mặn'}
                        </span>
                    </div>
                    {dish.do_kho && (
                        <div className="position-absolute top-0 end-0 m-3">
                            <span className={`badge rounded-pill px-3 py-1.5 shadow-sm ${diffBadge}`}>
                                {dish.do_kho}
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Body */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold text-dark mb-2 text-truncate" title={dish.ten_mon}>
                        {esc(dish.ten_mon)}
                    </h5>

                    {/* Quick Metric Chips */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-pill small">
                            <i className="fas fa-clock text-primary me-1"></i> {totalTime} phút
                        </span>
                        <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-pill small">
                            <i className="fas fa-user-friends text-success me-1"></i> {dish.khau_phan || '2 - 3 người'}
                        </span>
                    </div>

                    {/* Description or Main Ingredients */}
                    {dish.mo_ta ? (
                        <p
                            className="text-muted small mb-3 flex-grow-1"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minHeight: '38px'
                            }}
                        >
                            {dish.mo_ta}
                        </p>
                    ) : dish.nguyen_lieu_chinh ? (
                        <p className="text-muted small mb-3 flex-grow-1 text-truncate">
                            <strong className="text-success">Nguyên liệu:</strong> {dish.nguyen_lieu_chinh}
                        </p>
                    ) : (
                        <div className="flex-grow-1"></div>
                    )}

                    {/* Tags preview */}
                    {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                        <div className="d-flex gap-1 mb-3 overflow-hidden" style={{ maxHeight: '24px' }}>
                            {dish.tags.slice(0, 3).map((t, idx) => (
                                <span key={idx} className="badge bg-light text-muted border small" style={{ fontSize: '0.72rem' }}>
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="button"
                        className="btn btn-outline-success w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mt-auto"
                        onClick={() => onSelectDish(dish)}
                    >
                        <i className="fas fa-book-open"></i> Xem Chi Tiết Công Thức
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Recipes() {
    const dialog = useDialog();
    const [activeTab, setActiveTab] = useState('search'); // 'search' hoặc 'menu'
    
    // State cho tìm kiếm & lọc theo nguyên liệu (Tab 1)
    const [keyword, setKeyword] = useState('');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchIngredients, setSearchIngredients] = useState([]);

    // State chung cho danh sách nguyên liệu từ CSDL
    const [ingredientGroups, setIngredientGroups] = useState({});

    // State cho lập menu thông minh (Tab 2)
    const [days, setDays] = useState(3);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [menuResult, setMenuResult] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);

    // State cho Recipe Detail Modal
    const [selectedDish, setSelectedDish] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenDetail = (dish) => {
        if (!dish) return;
        setSelectedDish(dish);
        setIsModalOpen(true);
    };

    // 1. Tải danh sách món ăn khi tra cứu
    const loadDishes = async (kw = '', ingIds = []) => {
        setLoading(true);
        try {
            let url = '/api/mon-an';
            const queryParts = [];
            if (kw) queryParts.push('keyword=' + encodeURIComponent(kw));
            if (ingIds && ingIds.length > 0) queryParts.push('ingredients=' + encodeURIComponent(ingIds.join(',')));
            
            if (queryParts.length > 0) {
                url = '/api/goi-y-mon-an?' + queryParts.join('&');
            }

            const list = await api.get(url);
            setDishes(list || []);
        } catch (e) {
            dialog.error('Lỗi tải danh sách món ăn: ' + e.message);
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    // 2. Tải danh sách nguyên liệu từ CSDL
    const loadIngredients = async () => {
        try {
            const res = await api.get('/api/nguyen-lieu');
            if (res) {
                setIngredientGroups(res);
            }
        } catch (e) {
            console.error("Lỗi tải nguyên liệu:", e);
        }
    };

    useEffect(() => {
        loadDishes('');
        loadIngredients();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadDishes(keyword.trim(), searchIngredients);
    };

    // Checkbox lọc ở tab tra cứu
    const handleSearchCheckbox = (id) => {
        setSearchIngredients(prev => {
            const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            loadDishes(keyword.trim(), updated);
            return updated;
        });
    };

    // Checkbox chọn ở tab lập menu
    const handleMenuCheckbox = (id) => {
        setSelectedIngredients(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Gửi yêu cầu tạo thực đơn xuống Backend
    const handleGenerateMenu = async (e) => {
        e.preventDefault();
        if (selectedIngredients.length === 0) {
            dialog.warning('Vui lòng chọn ít nhất một nguyên liệu từ tủ lạnh của bạn!');
            return;
        }

        setMenuLoading(true);
        try {
            const res = await api.post('/api/menu/generate', {
                ingredients: selectedIngredients,
                days: Number(days)
            });
            
            if (res) {
                if (res.success === false) {
                    dialog.warning(res.message || 'Không thể tạo thực đơn phù hợp.');
                    setMenuResult([]);
                } else if (Array.isArray(res)) {
                    setMenuResult(res);
                } else if (res.data && Array.isArray(res.data)) {
                    setMenuResult(res.data);
                } else {
                    setMenuResult([]);
                }
            }
        } catch (err) {
            dialog.error('Lỗi hệ thống khi lập menu: ' + err.message);
        } finally {
            setMenuLoading(false);
        }
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gợi Ý Món Ăn & Lập Thực Đơn</li>
                </ol>
            </nav>

            <div className="text-center mx-auto mb-4" style={{ maxWidth: 700 }}>
                <h1 className="fw-bold text-primary">Gợi Ý Món Ngon & Lập Thực Đơn Thông Minh</h1>
                <p className="text-muted">
                    Tra cứu công thức chuẩn đầu bếp với định lượng chi tiết, mẹo nấu ăn và thông tin dinh dưỡng hoặc lập mâm cơm tự động không trùng lặp theo ngày.
                </p>
            </div>

            {/* Thanh chuyển đổi tính năng (Tabs) */}
            <div className="d-flex justify-content-center mb-4">
                <div className="btn-group shadow-sm rounded-pill p-1 bg-light border" role="group">
                    <button
                        type="button"
                        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${activeTab === 'search' ? 'btn-success text-white shadow-sm' : 'text-secondary btn-light'}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <i className="fas fa-search me-2"></i> Tra Cứu & Lọc Món Ăn
                    </button>
                    <button
                        type="button"
                        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${activeTab === 'menu' ? 'btn-success text-white shadow-sm' : 'text-secondary btn-light'}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        <i className="fas fa-magic me-2"></i> Lập Thực Đơn Tự Động
                    </button>
                </div>
            </div>

            {/* TAB 1: TRA CỨU MÓN ĂN & CHỌN NGUYÊN LIỆU KẾT HỢP */}
            {activeTab === 'search' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                        <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                            <div className="col-md-8">
                                <label className="form-label fw-bold text-secondary small mb-1">
                                    <i className="fas fa-search me-1"></i> Tìm nhanh tên món hoặc nguyên liệu:
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill py-2.5 px-3 border-2"
                                    placeholder="Ví dụ: Thịt bò, canh chua, dưa hấu, xào..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-success w-100 rounded-pill py-2.5 text-white fw-bold shadow-sm">
                                    <i className="fas fa-search me-1"></i> Tìm Kiếm Món Ngon
                                </button>
                            </div>
                        </form>

                        {/* Lọc theo nguyên liệu */}
                        <div className="mt-4 pt-3 border-top">
                            <label className="form-label fw-bold text-secondary small mb-2">
                                <i className="fas fa-filter me-1 text-success"></i> Hoặc chọn nhanh nguyên liệu bạn đang có để lọc món:
                            </label>
                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted small">Đang tải danh sách nguyên liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2 pe-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div className="form-check border p-2 rounded-3 bg-light hover-shadow">
                                                        <input
                                                            className="form-check-input ms-1"
                                                            type="checkbox"
                                                            id={`search-ing-${item.id}`}
                                                            checked={searchIngredients.includes(item.id)}
                                                            onChange={() => handleSearchCheckbox(item.id)}
                                                        />
                                                        <label className="form-check-label ms-2 fw-semibold text-dark cursor-pointer text-truncate" style={{ maxWidth: '85%' }} htmlFor={`search-ing-${item.id}`} title={item.ten_nguyen_lieu}>
                                                            {esc(item.ten_nguyen_lieu)}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center text-muted py-5">
                            <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p className="mb-0 fw-semibold">Đang nạp thực đơn thơm ngon...</p>
                        </div>
                    ) : dishes.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5">
                            <i className="fas fa-utensils fa-3x mb-3 text-secondary"></i>
                            <h5>Không tìm thấy món ăn nào phù hợp</h5>
                            <p className="small">Hãy thử tìm với từ khóa khác hoặc bỏ chọn một số nguyên liệu.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold text-secondary mb-0">
                                    <i className="fas fa-check-circle text-success me-1"></i> Tìm thấy <span className="text-success">{dishes.length}</span> món ăn chuẩn vị:
                                </h6>
                            </div>
                            <div className="row g-4">
                                {dishes.map(d => (
                                    <RecipeCard
                                        key={d.id || d.ten_mon}
                                        dish={d}
                                        onSelectDish={handleOpenDetail}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: LẬP THỰC ĐƠN THÔNG MINH */}
            {activeTab === 'menu' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                        <form onSubmit={handleGenerateMenu}>
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fas fa-refrigerator me-2 text-success"></i> 1. Chọn nguyên liệu có sẵn trong tủ lạnh của bạn:
                            </h5>
                            
                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted italic">Đang tải danh sách nguyên liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2 pe-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div className="form-check border p-2 rounded-3 bg-light hover-shadow">
                                                        <input
                                                            className="form-check-input ms-1"
                                                            type="checkbox"
                                                            id={`ing-${item.id}`}
                                                            checked={selectedIngredients.includes(item.id)}
                                                            onChange={() => handleMenuCheckbox(item.id)}
                                                        />
                                                        <label className="form-check-label ms-2 fw-semibold text-dark cursor-pointer text-truncate" style={{ maxWidth: '85%' }} htmlFor={`ing-${item.id}`} title={item.ten_nguyen_lieu}>
                                                            {esc(item.ten_nguyen_lieu)}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}

                            <div className="row align-items-center mt-4">
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="fw-bold text-dark mb-1">
                                        <i className="fas fa-calendar-alt me-1 text-primary"></i> 2. Số ngày muốn lập thực đơn:
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control rounded-pill py-2 px-3 border-2"
                                        min="1"
                                        max="7"
                                        value={days}
                                        onChange={e => setDays(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold py-2.5 mt-md-4 text-white shadow-sm">
                                        <i className="fas fa-magic me-2"></i> Lập Mâm Cơm Chuẩn Vị Ngay
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Hiển thị kết quả lập thực đơn */}
                    {menuLoading ? (
                        <div className="text-center text-muted py-5">
                            <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p className="mb-0 fw-semibold">Thuật toán đang tính toán thực đơn cân bằng dinh dưỡng...</p>
                        </div>
                    ) : menuResult.length > 0 && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold text-success mb-0">
                                    ✨ Thực Đơn Gợi Ý Tối Ưu ({days} Ngày - 2 Bữa / Ngày):
                                </h4>
                                <span className="badge bg-light text-muted border px-3 py-2 rounded-pill small">
                                    <i className="fas fa-info-circle me-1"></i> Bấm vào từng món để xem công thức chi tiết
                                </span>
                            </div>
                            <div className="row g-4">
                                {menuResult.map((item, index) => (
                                    <div className="col-md-6 col-lg-4" key={index}>
                                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                                            <div className="card-header bg-success text-white fw-bold text-center py-3 fs-5">
                                                <i className="fas fa-calendar-check me-2"></i> {item.ngay}
                                            </div>
                                            <div className="card-body p-3 d-flex flex-column gap-3">
                                                {/* BỮA TRƯA */}
                                                {item.bua_trua && (
                                                    <div className="p-3 border rounded-3 bg-light">
                                                        <h6 className="fw-bold text-primary mb-2 border-bottom pb-1">
                                                            ☀️ Bữa Trưa
                                                        </h6>
                                                        <div className="d-flex flex-column gap-2 small">
                                                            {item.bua_trua.mon_canh && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_trua.mon_canh)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍲 <strong>Canh:</strong> {esc(item.bua_trua.mon_canh.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_trua.mon_man && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_trua.mon_man)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍖 <strong>Mặn:</strong> {esc(item.bua_trua.mon_man.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_trua.mon_xao_ran && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_trua.mon_xao_ran)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍳 <strong>Xào:</strong> {esc(item.bua_trua.mon_xao_ran.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_trua.trang_mieng && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_trua.trang_mieng)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍉 <strong>Tráng miệng:</strong> {esc(item.bua_trua.trang_mieng.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* BỮA TỐI */}
                                                {item.bua_toi && (
                                                    <div className="p-3 border rounded-3 bg-light">
                                                        <h6 className="fw-bold text-danger mb-2 border-bottom pb-1">
                                                            🌙 Bữa Tối
                                                        </h6>
                                                        <div className="d-flex flex-column gap-2 small">
                                                            {item.bua_toi.mon_canh && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_toi.mon_canh)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍲 <strong>Canh:</strong> {esc(item.bua_toi.mon_canh.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_toi.mon_man && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_toi.mon_man)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍖 <strong>Mặn:</strong> {esc(item.bua_toi.mon_man.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_toi.mon_xao_ran && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_toi.mon_xao_ran)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍳 <strong>Xào:</strong> {esc(item.bua_toi.mon_xao_ran.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                            {item.bua_toi.trang_mieng && (
                                                                <div
                                                                    className="d-flex align-items-center justify-content-between p-1.5 rounded hover-bg cursor-pointer"
                                                                    onClick={() => handleOpenDetail(item.bua_toi.trang_mieng)}
                                                                    title="Bấm để xem công thức"
                                                                >
                                                                    <span>🍉 <strong>Tráng miệng:</strong> {esc(item.bua_toi.trang_mieng.ten_mon)}</span>
                                                                    <i className="fas fa-chevron-right text-muted small"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL CHI TIẾT CÔNG THỨC */}
            <RecipeDetailModal
                dish={selectedDish}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}