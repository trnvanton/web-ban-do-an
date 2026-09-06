import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import { useDialog } from '../contexts/DialogContext';
import RecipeDetailModal from '../components/RecipeDetailModal';

function RecipeCard({ dish, onSelectDish, userIngredientsCount = 0 }) {
    const totalTime = (dish.thoi_gian_chuan_bi || 10) + (dish.thoi_gian_nau || 15);
    const difficultyColors = {
        'Dễ': 'bg-success',
        'Trung bình': 'bg-warning text-dark',
        'Khó': 'bg-danger'
    };
    const diffBadge = difficultyColors[dish.do_kho] || 'bg-success';

    const analysis = dish.analysis;
    const hasMatch = analysis && analysis.matchScore > 0;

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
                    <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
                        <span className="badge rounded-pill bg-dark bg-opacity-75 text-white px-3 py-1.5 shadow-sm">
                            <i className="fas fa-utensils me-1"></i> {dish.loai_mon || 'Món mặn'}
                        </span>
                        {hasMatch && (
                            <span className="badge rounded-pill bg-success px-3 py-1.5 shadow-sm fw-bold">
                                {analysis.matchPercentage >= 90 ? '🥇' : analysis.matchPercentage >= 70 ? '🥈' : '🥉'} Khớp {analysis.matchPercentage}%
                            </span>
                        )}
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

                    {/* Phân tích nguyên liệu (Chế độ 1 & 2) */}
                    {hasMatch && userIngredientsCount > 0 ? (
                        <div className="p-2.5 rounded-3 bg-light border mb-3 small flex-grow-1">
                            {analysis.matchedIngredients?.length > 0 && (
                                <div className="text-success fw-semibold mb-1 text-truncate">
                                    <i className="fas fa-check-circle me-1"></i>
                                    <strong>Đã có:</strong> {analysis.matchedIngredients.join(', ')}
                                </div>
                            )}
                            {analysis.missingIngredients?.length > 0 && (
                                <div className="text-warning text-truncate" style={{ color: '#d97706' }}>
                                    <i className="fas fa-shopping-basket me-1"></i>
                                    <strong>Cần thêm ({analysis.missingCount}):</strong> {analysis.missingIngredients.filter(m => !m.isBasicPantry).slice(0, 3).map(m => m.ten).join(', ') || 'Gia vị cơ bản'}
                                </div>
                            )}
                        </div>
                    ) : dish.mo_ta ? (
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
    
    // State cho tra cứu & lọc theo nguyên liệu (Tab 1)
    const [keyword, setKeyword] = useState('');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchIngredients, setSearchIngredients] = useState([]);

    // State chung cho danh sách nguyên liệu từ CSDL
    const [ingredientGroups, setIngredientGroups] = useState({});

    // State cho 3 Chế Độ Lập Menu (Tab 2)
    const [menuMode, setMenuMode] = useState('mode1'); // 'mode1' (Có nguyên liệu), 'mode2' (Ít nguyên liệu), 'mode3' (Sở thích)
    const [days, setDays] = useState(3);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    
    // State tiêu chí Chế độ 3 (Sở thích)
    const [preferences, setPreferences] = useState({
        categories: ['Món mặn', 'Món xào', 'Canh', 'Tráng miệng'],
        difficulty: 'all', // 'all', 'Dễ', 'Trung bình', 'Khó'
        maxTime: 'all', // 'all', 15, 30, 60
        taste: [] // 'Thanh đạm', 'Đậm đà', 'Món chay', 'Giàu đạm', 'Dễ tiêu hoá'
    });

    const [menuResult, setMenuResult] = useState([]);
    const [menuSummary, setMenuSummary] = useState(null);
    const [menuModeLabel, setMenuModeLabel] = useState('');
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
            if (ingIds && ingIds.length > 0) {
                queryParts.push('ingredients=' + encodeURIComponent(ingIds.join(',')));
                queryParts.push('mode=' + (ingIds.length === 1 ? 'few_ingredients' : 'ingredients'));
            }
            
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

    // Checkbox chọn ở tab lập menu (Chế độ 1 & 2)
    const handleMenuCheckbox = (id) => {
        setSelectedIngredients(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Xử lý thay đổi tiêu chí sở thích (Chế độ 3)
    const handleTasteToggle = (t) => {
        setPreferences(prev => ({
            ...prev,
            taste: prev.taste.includes(t) ? prev.taste.filter(item => item !== t) : [...prev.taste, t]
        }));
    };

    // Gửi yêu cầu tạo thực đơn xuống Backend theo 3 Chế Độ
    const handleGenerateMenu = async (e) => {
        e.preventDefault();

        // Kiểm tra hợp lệ theo từng chế độ
        if (menuMode === 'mode1') {
            if (selectedIngredients.length < 2) {
                dialog.warning('🟢 Chế độ 1 (Có nguyên liệu): Vui lòng chọn từ 2 nguyên liệu trở lên từ tủ lạnh của bạn! (Nếu chỉ có 1 nguyên liệu, hãy chọn Chế độ 2)');
                return;
            }
        } else if (menuMode === 'mode2') {
            if (selectedIngredients.length === 0) {
                dialog.warning('🟡 Chế độ 2 (Ít nguyên liệu): Vui lòng chọn 1 hoặc 2 nguyên liệu bạn đang có sẵn để hệ thống đề xuất món và danh sách đi chợ bổ sung!');
                return;
            }
        }

        setMenuLoading(true);
        try {
            const payload = {
                mode: menuMode === 'mode1' ? 'ingredients' : menuMode === 'mode2' ? 'few_ingredients' : 'preferences',
                ingredients: (menuMode === 'mode1' || menuMode === 'mode2') ? selectedIngredients : [],
                days: Number(days),
                preferences: menuMode === 'mode3' ? preferences : null
            };

            const res = await api.post('/api/menu/generate', payload);
            
            if (res) {
                if (res.success === false) {
                    dialog.warning(res.message || 'Không thể tạo thực đơn phù hợp.');
                    setMenuResult([]);
                    setMenuSummary(null);
                } else {
                    setMenuResult(res.data || []);
                    setMenuSummary(res.summary || null);
                    setMenuModeLabel(res.modeLabel || '');
                }
            }
        } catch (err) {
            dialog.error('Lỗi hệ thống khi lập menu: ' + err.message);
        } finally {
            setMenuLoading(false);
        }
    };

    // Sao chép danh sách đi chợ
    const handleCopyShoppingList = () => {
        if (!menuSummary?.shoppingList || menuSummary.shoppingList.length === 0) return;
        const text = menuSummary.shoppingList.map((item, idx) => `${idx + 1}. ${item.ten} ${item.so_luong ? `(${item.so_luong} ${item.don_vi})` : ''} - Dùng cho: ${item.dishes.join(', ')}`).join('\n');
        navigator.clipboard.writeText(`🛒 DANH SÁCH ĐI CHỢ CHO THỰC ĐƠN ${days} NGÀY:\n` + text);
        dialog.alert('Đã sao chép danh sách đi chợ vào bộ nhớ tạm!');
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

            <div className="text-center mx-auto mb-4" style={{ maxWidth: 750 }}>
                <h1 className="fw-bold text-primary">Gợi Ý Món Ngon & Lập Thực Đơn Thông Minh</h1>
                <p className="text-muted">
                    Hệ thống gợi ý 3 chế độ thông minh: Dựa trên nguyên liệu có sẵn, Đề xuất khi có ít nguyên liệu kèm danh sách đi chợ, hoặc Lập thực đơn cá nhân hóa theo sở thích & khẩu vị.
                </p>
            </div>

            {/* Thanh chuyển đổi tính năng (Tabs) */}
            <div className="d-flex justify-content-center mb-4">
                <div className="btn-group shadow-sm rounded-pill p-1 bg-light border" role="group">
                    <button
                        type="button"
                        className={`btn px-4 py-2.5 rounded-pill fw-bold transition-all ${activeTab === 'search' ? 'btn-success text-white shadow-sm' : 'text-secondary btn-light'}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <i className="fas fa-search me-2"></i> Tra Cứu & Gợi Ý Món Ăn
                    </button>
                    <button
                        type="button"
                        className={`btn px-4 py-2.5 rounded-pill fw-bold transition-all ${activeTab === 'menu' ? 'btn-success text-white shadow-sm' : 'text-secondary btn-light'}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        <i className="fas fa-magic me-2"></i> Lập Thực Đơn Thông Minh (3 Chế Độ)
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
                                    placeholder="Ví dụ: Thịt bò, canh chua, trứng, xào..."
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
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label fw-bold text-secondary small mb-0">
                                    <i className="fas fa-filter me-1 text-success"></i> Hoặc chọn nguyên liệu bạn đang có để xem độ khớp:
                                </label>
                                {searchIngredients.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                        onClick={() => {
                                            setSearchIngredients([]);
                                            loadDishes(keyword.trim(), []);
                                        }}
                                    >
                                        <i className="fas fa-times me-1"></i> Bỏ chọn ({searchIngredients.length})
                                    </button>
                                )}
                            </div>

                            {/* Thông báo thông minh theo số nguyên liệu đã chọn */}
                            {searchIngredients.length >= 2 ? (
                                <div className="alert alert-success rounded-4 d-flex align-items-center gap-2 py-2 px-3 mb-3 small">
                                    <i className="fas fa-check-circle fs-5 text-success"></i>
                                    <div>
                                        <strong>🟢 Chế độ 1:</strong> Đang phân tích độ khớp với <strong>{searchIngredients.length} nguyên liệu</strong> đã chọn. Các món sử dụng nhiều nguyên liệu có sẵn nhất được xếp lên đầu!
                                    </div>
                                </div>
                            ) : searchIngredients.length === 1 ? (
                                <div className="alert alert-warning rounded-4 d-flex align-items-center gap-2 py-2 px-3 mb-3 small border-0" style={{ background: '#fffbeb', color: '#92400e' }}>
                                    <i className="fas fa-lightbulb fs-5 text-warning"></i>
                                    <div>
                                        <strong>🟡 Chế độ 2 (Có ít nguyên liệu):</strong> Hệ thống gợi ý các món bạn có thể nấu ngay hoặc cần mua bổ sung ít nguyên liệu nhất!
                                    </div>
                                </div>
                            ) : null}

                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted small">Đang tải danh sách nguyên liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2 pe-1" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div className={`form-check border p-2 rounded-3 hover-shadow ${searchIngredients.includes(item.id) ? 'bg-success bg-opacity-10 border-success' : 'bg-light'}`}>
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
                                        userIngredientsCount={searchIngredients.length}
                                        onSelectDish={handleOpenDetail}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: LẬP THỰC ĐƠN THÔNG MINH (3 CHẾ ĐỘ) */}
            {activeTab === 'menu' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                        {/* Thanh chọn 3 Chế Độ */}
                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark mb-2 fs-5">
                                🎯 Chọn Chế Độ Lập Thực Đơn:
                            </label>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div
                                        className={`p-3 rounded-4 border cursor-pointer h-100 transition-all ${menuMode === 'mode1' ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-light'}`}
                                        onClick={() => setMenuMode('mode1')}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge rounded-pill bg-success px-2.5 py-1">🟢 Chế độ 1</span>
                                            <h6 className="fw-bold mb-0 text-dark">Có nhiều nguyên liệu</h6>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            Tối ưu mâm cơm tận dụng tối đa các nguyên liệu bạn đang có trong tủ lạnh.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className={`p-3 rounded-4 border cursor-pointer h-100 transition-all ${menuMode === 'mode2' ? 'border-warning bg-warning bg-opacity-10 shadow-sm' : 'bg-light'}`}
                                        onClick={() => setMenuMode('mode2')}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge rounded-pill bg-warning text-dark px-2.5 py-1">🟡 Chế độ 2</span>
                                            <h6 className="fw-bold mb-0 text-dark">Có ít nguyên liệu</h6>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            Chỉ có 1-2 món? Hệ thống sẽ gợi ý mâm cơm và lên sẵn danh sách cần mua bổ sung.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div
                                        className={`p-3 rounded-4 border cursor-pointer h-100 transition-all ${menuMode === 'mode3' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'bg-light'}`}
                                        onClick={() => setMenuMode('mode3')}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge rounded-pill bg-primary px-2.5 py-1">🔵 Chế độ 3</span>
                                            <h6 className="fw-bold mb-0 text-dark">Theo sở thích & Nhu cầu</h6>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            Không cần nhập nguyên liệu. Tự động lập thực đơn theo độ khó, thời gian & khẩu vị.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleGenerateMenu}>
                            {/* CHẾ ĐỘ 1 VÀ 2: CHỌN NGUYÊN LIỆU TRONG TỦ LẠNH */}
                            {(menuMode === 'mode1' || menuMode === 'mode2') && (
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold text-dark mb-0">
                                            <i className="fas fa-refrigerator me-2 text-success"></i>
                                            {menuMode === 'mode1' ? '1. Chọn các nguyên liệu có trong tủ lạnh (tối thiểu 2 món):' : '1. Chọn nguyên liệu bạn đang có (1 hoặc 2 món):'}
                                        </h5>
                                        {selectedIngredients.length > 0 && (
                                            <span className="badge bg-success rounded-pill px-3 py-1.5">
                                                Đã chọn {selectedIngredients.length} nguyên liệu
                                            </span>
                                        )}
                                    </div>
                                    
                                    {Object.keys(ingredientGroups).length === 0 ? (
                                        <p className="text-muted italic">Đang tải danh sách nguyên liệu...</p>
                                    ) : (
                                        Object.keys(ingredientGroups).map(category => (
                                            <div key={category} className="mb-3 border-bottom pb-2">
                                                <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                                <div className="row g-2 pe-1" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                                    {ingredientGroups[category].map(item => (
                                                        <div className="col-md-3 col-6" key={item.id}>
                                                            <div className={`form-check border p-2 rounded-3 hover-shadow ${selectedIngredients.includes(item.id) ? 'bg-success bg-opacity-10 border-success' : 'bg-light'}`}>
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
                                </div>
                            )}

                            {/* CHẾ ĐỘ 3: CHỌN THEO SỞ THÍCH & NHU CẦU */}
                            {menuMode === 'mode3' && (
                                <div className="mb-4 p-4 rounded-4 bg-light border">
                                    <h5 className="fw-bold text-primary mb-3">
                                        <i className="fas fa-sliders-h me-2"></i> Thiết Lập Khẩu Vị & Nhu Cầu Dinh Dưỡng:
                                    </h5>

                                    <div className="row g-4">
                                        {/* Độ khó */}
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold text-secondary small">
                                                <i className="fas fa-award text-warning me-1"></i> Độ khó nấu nướng:
                                            </label>
                                            <select
                                                className="form-select rounded-pill"
                                                value={preferences.difficulty}
                                                onChange={e => setPreferences(prev => ({ ...prev, difficulty: e.target.value }))}
                                            >
                                                <option value="all">Mọi độ khó</option>
                                                <option value="Dễ">Dễ (Dành cho người mới)</option>
                                                <option value="Trung bình">Trung bình</option>
                                                <option value="Khó">Khó (Đầu bếp chuyên nghiệp)</option>
                                            </select>
                                        </div>

                                        {/* Thời gian */}
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold text-secondary small">
                                                <i className="fas fa-stopwatch text-danger me-1"></i> Thời gian chế biến tối đa:
                                            </label>
                                            <select
                                                className="form-select rounded-pill"
                                                value={preferences.maxTime}
                                                onChange={e => setPreferences(prev => ({ ...prev, maxTime: e.target.value }))}
                                            >
                                                <option value="all">Mọi thời gian</option>
                                                <option value="15">Nhanh (Dưới 15 phút)</option>
                                                <option value="30">Vừa phải (Dưới 30 phút)</option>
                                                <option value="60">Cầu kỳ (Dưới 60 phút)</option>
                                            </select>
                                        </div>

                                        {/* Khẩu vị / Phong cách */}
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold text-secondary small mb-2">
                                                <i className="fas fa-heart text-danger me-1"></i> Phong cách ẩm thực:
                                            </label>
                                            <div className="d-flex flex-wrap gap-1.5">
                                                {['Thanh đạm', 'Đậm đà', 'Món chay', 'Giàu đạm', 'Dễ tiêu hoá'].map(t => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        className={`btn btn-sm rounded-pill px-3 py-1 ${preferences.taste.includes(t) ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                                                        onClick={() => handleTasteToggle(t)}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cài đặt số ngày & Nút Lập Menu */}
                            <div className="row align-items-center mt-3 pt-3 border-top">
                                <div className="col-md-4 mb-3 mb-md-0">
                                    <label className="fw-bold text-dark mb-1">
                                        <i className="fas fa-calendar-alt me-1 text-primary"></i> Số ngày muốn lập thực đơn:
                                    </label>
                                    <select
                                        className="form-select rounded-pill py-2 px-3 border-2"
                                        value={days}
                                        onChange={e => setDays(e.target.value)}
                                    >
                                        <option value="1">1 Ngày (2 bữa Trưa & Tối)</option>
                                        <option value="2">2 Ngày (4 bữa)</option>
                                        <option value="3">3 Ngày (6 bữa - Khuyên dùng)</option>
                                        <option value="5">5 Ngày (10 bữa)</option>
                                        <option value="7">7 Ngày (Cả tuần)</option>
                                    </select>
                                </div>
                                <div className="col-md-8">
                                    <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold py-2.5 mt-md-4 text-white shadow-sm fs-5">
                                        <i className="fas fa-magic me-2"></i> Lập Thực Đơn Chuẩn Vị Ngay
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Hiển thị kết quả lập thực đơn */}
                    {menuLoading ? (
                        <div className="text-center text-muted py-5">
                            <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p className="mb-0 fw-semibold">Thuật toán thông minh đang tính toán mâm cơm cân bằng dinh dưỡng...</p>
                        </div>
                    ) : menuResult.length > 0 && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <div>
                                    <h4 className="fw-bold text-success mb-1">
                                        ✨ Thực Đơn Gợi Ý Tối Ưu ({days} Ngày - 2 Bữa / Ngày):
                                    </h4>
                                    {menuModeLabel && (
                                        <span className="badge bg-light text-dark border px-3 py-1.5 rounded-pill small">
                                            {menuModeLabel}
                                        </span>
                                    )}
                                </div>
                                <span className="badge bg-light text-muted border px-3 py-2 rounded-pill small">
                                    <i className="fas fa-info-circle me-1"></i> Bấm vào từng món để xem công thức chi tiết
                                </span>
                            </div>

                            {/* DANH SÁCH ĐI CHỢ BỔ SUNG (SHOPPING LIST CHO CHẾ ĐỘ 1 & 2) */}
                            {menuSummary?.shoppingList && menuSummary.shoppingList.length > 0 && (
                                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-warning">
                                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                        <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                            <i className="fas fa-shopping-cart text-warning fs-4"></i>
                                            Danh Sách Đi Chợ Bổ Sung Cho Thực Đơn ({menuSummary.shoppingList.length} món cần mua):
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-sm rounded-pill px-3 fw-semibold"
                                            onClick={handleCopyShoppingList}
                                        >
                                            <i className="fas fa-copy me-1"></i> Sao Chép Danh Sách Đi Chợ
                                        </button>
                                    </div>
                                    <p className="text-muted small mb-3">
                                        Dưới đây là các nguyên liệu cần mua bổ sung để hoàn thành trọn vẹn tất cả các món ăn trong thực đơn {days} ngày của bạn:
                                    </p>
                                    <div className="row g-2">
                                        {menuSummary.shoppingList.map((item, idx) => (
                                            <div className="col-md-4 col-sm-6" key={idx}>
                                                <div className="p-2.5 rounded-3 bg-light border d-flex justify-content-between align-items-center small">
                                                    <div>
                                                        <strong className="text-dark">🛒 {item.ten}</strong>
                                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            Dùng cho: {item.dishes.slice(0, 2).join(', ')}{item.dishes.length > 2 ? '...' : ''}
                                                        </div>
                                                    </div>
                                                    {item.so_luong && (
                                                        <span className="badge bg-success bg-opacity-10 text-success border border-success">
                                                            {item.so_luong} {item.don_vi}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Danh sách mâm cơm từng ngày */}
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