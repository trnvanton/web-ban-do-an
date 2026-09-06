import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import { useDialog } from '../contexts/DialogContext';
import RecipeDetailModal from '../components/RecipeDetailModal';
import './Recipes.css';

function MealDishRow({ dish, typeKey, onOpenDetail }) {
    if (!dish) return null;
    const isMatched = dish.isMatchedIngredient;
    const badgeText = dish.badgeText;

    let icon = '🍲';
    let tagClass = 'tag-canh';
    let label = 'Canh';

    if (typeKey === 'mon_man') {
        icon = '🍖';
        tagClass = 'tag-man';
        label = 'Mặn';
    } else if (typeKey === 'mon_xao_ran') {
        icon = '🍳';
        tagClass = 'tag-xao';
        label = 'Xào';
    } else if (typeKey === 'trang_mieng') {
        icon = '🍉';
        tagClass = 'tag-trang-mieng';
        label = 'Tráng miệng';
    }

    return (
        <div
            className="meal-dish-row"
            onClick={() => onOpenDetail(dish)}
            title="Nhấn để xem chi tiết & công thức nấu"
        >
            <div className="meal-dish-top">
                <div className="meal-dish-meta">
                    <span className={`meal-category-tag ${tagClass}`}>
                        {icon} {label}
                    </span>
                    <span className="meal-dish-name" title={dish.ten_mon}>
                        {esc(dish.ten_mon)}
                    </span>
                </div>
                <i className="fas fa-chevron-right text-muted" style={{ fontSize: '0.75rem', flexShrink: 0 }}></i>
            </div>
            {(badgeText || dish.thoi_gian_nau) && (
                <div className="meal-dish-bottom">
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {dish.thoi_gian_nau ? `⏱️ ${dish.thoi_gian_nau} phút` : ''}
                    </span>
                    {isMatched ? (
                        <span className="badge-matched-pill">
                            🌱 Khớp nguyên liệu
                        </span>
                    ) : badgeText ? (
                        <span className="badge-extra-pill">
                            💡 Gợi ý thêm
                        </span>
                    ) : null}
                </div>
            )}
        </div>
    );
}

function RecipeCard({ dish, onSelectDish, userIngredientsCount = 0 }) {
    const totalTime = (dish.thoi_gian_chuan_bi || 10) + (dish.thoi_gian_nau || 15);
    
    // Icon and label for category
    const getCategoryIcon = (cat) => {
        const c = (cat || '').toLowerCase();
        if (c.includes('canh')) return '🍲';
        if (c.includes('xào') || c.includes('rau')) return '🍳';
        if (c.includes('tráng miệng') || c.includes('quả') || c.includes('chè')) return '🍉';
        return '🍖';
    };

    // Difficulty badge config
    const diff = dish.do_kho || 'Dễ';
    let diffClass = 'diff-easy';
    let diffIcon = '🌱';
    if (diff === 'Trung bình') {
        diffClass = 'diff-med';
        diffIcon = '⭐';
    } else if (diff === 'Khó') {
        diffClass = 'diff-hard';
        diffIcon = '🔥';
    }

    const analysis = dish.analysis;
    const hasMatch = analysis && analysis.matchScore > 0;
    const matchPct = analysis ? (analysis.matchPercentage || 0) : 0;
    const matchClass = matchPct >= 90 ? 'match-gold' : matchPct >= 70 ? 'match-silver' : 'match-bronze';
    const matchMedal = matchPct >= 90 ? '🥇' : matchPct >= 70 ? '🥈' : '🥉';

    return (
        <div className="col-md-6 col-lg-4">
            <div className="recipe-card-modern">
                {/* Image Wrap */}
                <div className="recipe-img-wrap">
                    <img
                        src={imgUrl(dish.hinh_anh)}
                        alt={esc(dish.ten_mon)}
                        loading="lazy"
                    />
                    <div className="recipe-img-gradient"></div>

                    {/* Category badge */}
                    <div className="recipe-badge-category">
                        <span>{getCategoryIcon(dish.loai_mon)}</span>
                        <span>{dish.loai_mon || 'Món mặn'}</span>
                    </div>

                    {/* Difficulty Badge */}
                    <div className={`recipe-badge-diff ${diffClass}`}>
                        {diffIcon} {diff}
                    </div>

                    {/* Match percentage badge if filtering by ingredients */}
                    {hasMatch && userIngredientsCount > 0 && (
                        <div className={`recipe-badge-match ${matchClass}`}>
                            <span>{matchMedal}</span>
                            <span>Khớp {matchPct}%</span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="recipe-card-content">
                    <h5 className="recipe-dish-title" title={dish.ten_mon}>
                        {esc(dish.ten_mon)}
                    </h5>

                    {/* Quick Metric Chips */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <div className="recipe-chip">
                            <i className="fas fa-clock text-primary"></i>
                            <span>{totalTime} phút</span>
                        </div>
                        <div className="recipe-chip">
                            <i className="fas fa-user-friends text-success"></i>
                            <span>{dish.khau_phan || '2 - 3 người'}</span>
                        </div>
                    </div>

                    {/* Ingredient Analysis or Description */}
                    {hasMatch && userIngredientsCount > 0 ? (
                        <div className="recipe-analysis-box">
                            {analysis.matchedIngredients?.length > 0 && (
                                <div className="text-success fw-bold mb-1 text-truncate">
                                    <i className="fas fa-check-circle me-1"></i>
                                    <span>Đã có: {analysis.matchedIngredients.join(', ')}</span>
                                </div>
                            )}
                            {analysis.missingIngredients?.length > 0 && (
                                <div style={{ color: '#d97706' }} className="fw-semibold text-truncate">
                                    <i className="fas fa-shopping-basket me-1"></i>
                                    <span>Cần thêm ({analysis.missingCount}): {analysis.missingIngredients.filter(m => !m.isBasicPantry).slice(0, 3).map(m => m.ten).join(', ') || 'Gia vị'}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="recipe-desc-text" title={dish.mo_ta || dish.nguyen_lieu_chinh}>
                            {dish.mo_ta || (dish.nguyen_lieu_chinh ? `Nguyên liệu chính: ${dish.nguyen_lieu_chinh}` : 'Món ăn gia đình thơm ngon, giàu dinh dưỡng và dễ dàng chế biến tại nhà.')}
                        </p>
                    )}

                    {/* Tags preview */}
                    {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mb-3" style={{ minHeight: '26px' }}>
                            {dish.tags.slice(0, 3).map((t, idx) => (
                                <span key={idx} className="recipe-tag-pill">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="button"
                        className="recipe-btn-view"
                        onClick={() => onSelectDish(dish)}
                    >
                        <i className="fas fa-book-open"></i> Xem Công Thức Chi Tiết
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

    // State cho 2 Chế Độ Lập Menu (Tab 2)
    const [menuMode, setMenuMode] = useState('ingredients'); // 'ingredients' (Theo nguyên liệu) hoặc 'preferences' (Theo sở thích)
    const [days, setDays] = useState(3);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    
    // State tiêu chí Chế độ Sở thích
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
                queryParts.push('mode=ingredients');
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

    // Checkbox chọn ở tab lập menu (Chế độ theo nguyên liệu)
    const handleMenuCheckbox = (id) => {
        setSelectedIngredients(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Xử lý thay đổi tiêu chí sở thích
    const handleTasteToggle = (t) => {
        setPreferences(prev => ({
            ...prev,
            taste: prev.taste.includes(t) ? prev.taste.filter(item => item !== t) : [...prev.taste, t]
        }));
    };

    // Gửi yêu cầu tạo thực đơn xuống Backend
    const handleGenerateMenu = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra ràng buộc bắt buộc: Chưa chọn nguyên liệu thì không cho lập menu theo nguyên liệu
        if (menuMode === 'ingredients') {
            if (selectedIngredients.length === 0) {
                dialog.warning('⚠️ Vui lòng chọn ít nhất một nguyên liệu từ tủ lạnh của bạn! (Hoặc chuyển sang Chế độ Lập thực đơn theo sở thích nếu bạn không có sẵn nguyên liệu)');
                return;
            }
        }

        setMenuLoading(true);
        try {
            const payload = {
                mode: menuMode,
                ingredients: menuMode === 'ingredients' ? selectedIngredients : [],
                days: Number(days),
                preferences: menuMode === 'preferences' ? preferences : null
            };

            const res = await api.post('/api/menu/generate', payload);
            
            let list = [];
            let summaryObj = null;
            let modeText = '';

            if (Array.isArray(res)) {
                list = res;
            } else if (res && typeof res === 'object') {
                if (res.success === false) {
                    dialog.warning(res.message || '😥 Chưa tìm thấy thực đơn phù hợp.');
                    setMenuResult([]);
                    setMenuSummary(null);
                    return;
                }
                list = Array.isArray(res.data) ? res.data : [];
                summaryObj = res.summary || null;
                modeText = res.modeLabel || '';
            }

            if (!list || list.length === 0) {
                dialog.warning('😥 Chưa tìm thấy thực đơn phù hợp. Hãy thử chọn thêm nguyên liệu phổ biến khác!');
                setMenuResult([]);
                setMenuSummary(null);
            } else {
                setMenuResult(list);
                setMenuSummary(summaryObj);
                setMenuModeLabel(modeText);
            }
        } catch (err) {
            dialog.error('Lỗi hệ thống khi lập menu: ' + (err.message || 'Không thể kết nối đến máy chủ'));
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

            <div className="text-center mx-auto mb-4" style={{ maxWidth: 750 }}>
                <h1 className="fw-bold text-primary">Gợi Ý Món Ngon & Lập Thực Đơn Thông Minh</h1>
                <p className="text-muted">
                    Hệ thống tích hợp thuật toán gợi ý dựa trên nguyên liệu có sẵn trong tủ lạnh và Lập mâm cơm tự động không trùng lặp theo ngày.
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
                        <i className="fas fa-search me-2"></i> 1. Gợi Ý & Tra Cứu Món Ăn
                    </button>
                    <button
                        type="button"
                        className={`btn px-4 py-2.5 rounded-pill fw-bold transition-all ${activeTab === 'menu' ? 'btn-success text-white shadow-sm' : 'text-secondary btn-light'}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        <i className="fas fa-magic me-2"></i> 2. Lập Thực Đơn Mâm Cơm Tự Động
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
                                    <i className="fas fa-filter me-1 text-success"></i> Chọn nguyên liệu bạn đang có để xem độ khớp:
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

                            {searchIngredients.length > 0 && (
                                <div className="alert alert-success rounded-4 d-flex align-items-center gap-2 py-2 px-3 mb-3 small">
                                    <i className="fas fa-check-circle fs-5 text-success"></i>
                                    <div>
                                        Đang phân tích độ khớp với <strong>{searchIngredients.length} nguyên liệu</strong> đã chọn. Các món sử dụng nhiều nguyên liệu có sẵn nhất được xếp lên đầu!
                                    </div>
                                </div>
                            )}

                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted small">Đang tải danh sách nguyên liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2 pe-1" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div
                                                        className={`ing-checkbox-item ${searchIngredients.includes(item.id) ? 'checked' : 'unchecked'}`}
                                                        onClick={() => handleSearchCheckbox(item.id)}
                                                    >
                                                        <input
                                                            className="form-check-input ms-1 me-2"
                                                            type="checkbox"
                                                            id={`search-ing-${item.id}`}
                                                            checked={searchIngredients.includes(item.id)}
                                                            onChange={() => {}}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <label className="form-check-label fw-semibold text-truncate mb-0 cursor-pointer" style={{ maxWidth: '85%' }} htmlFor={`search-ing-${item.id}`} title={item.ten_nguyen_lieu}>
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

            {/* TAB 2: LẬP THỰC ĐƠN THÔNG MINH (2 CHẾ ĐỘ RÕ RÀNG) */}
            {activeTab === 'menu' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                        {/* 2 Chế Độ Lập Thực Đơn */}
                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark mb-2 fs-5">
                                🎯 Chọn Phương Thức Lập Mâm Cơm:
                            </label>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div
                                        className={`recipe-mode-btn ${menuMode === 'ingredients' ? 'mode-active-ing' : 'mode-inactive'}`}
                                        onClick={() => setMenuMode('ingredients')}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span style={{ backgroundColor: '#16a34a', color: '#ffffff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Chế độ 1
                                            </span>
                                            <h6 className="fw-bold mb-0" style={{ color: '#15803d', fontSize: '1.05rem' }}>
                                                🥗 Lập thực đơn theo nguyên liệu có sẵn
                                            </h6>
                                        </div>
                                        <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                                            Tối ưu mâm cơm ưu tiên nấu từ các nguyên liệu có sẵn trong tủ lạnh của bạn. Nếu kho nguyên liệu chưa đủ số ngày, hệ thống sẽ tự động bổ sung thêm món phụ để đảm bảo không trùng lặp.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div
                                        className={`recipe-mode-btn ${menuMode === 'preferences' ? 'mode-active-pref' : 'mode-inactive'}`}
                                        onClick={() => setMenuMode('preferences')}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                Chế độ 2
                                            </span>
                                            <h6 className="fw-bold mb-0" style={{ color: '#1d4ed8', fontSize: '1.05rem' }}>
                                                🎯 Lập thực đơn theo sở thích & Khẩu vị
                                            </h6>
                                        </div>
                                        <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                                            Dành cho người chưa có sẵn nguyên liệu. Tự động thiết lập mâm cơm đầy đủ chất dinh dưỡng theo độ khó, thời gian chế biến và phong cách ẩm thực mong muốn.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleGenerateMenu}>
                            {/* CHẾ ĐỘ 1: CHỌN NGUYÊN LIỆU TRONG TỦ LẠNH */}
                            {menuMode === 'ingredients' && (
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold text-dark mb-0">
                                            <i className="fas fa-refrigerator me-2 text-success"></i>
                                            Chọn nguyên liệu bạn đang có trong tủ lạnh (chọn ít nhất 1 món):
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
                                                            <div
                                                                className={`ing-checkbox-item ${selectedIngredients.includes(item.id) ? 'checked' : 'unchecked'}`}
                                                                onClick={() => handleMenuCheckbox(item.id)}
                                                            >
                                                                <input
                                                                    className="form-check-input ms-1 me-2"
                                                                    type="checkbox"
                                                                    id={`ing-${item.id}`}
                                                                    checked={selectedIngredients.includes(item.id)}
                                                                    onChange={() => {}}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                                <label className="form-check-label fw-semibold text-truncate mb-0 cursor-pointer" style={{ maxWidth: '85%' }} htmlFor={`ing-${item.id}`} title={item.ten_nguyen_lieu}>
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

                            {/* CHẾ ĐỘ 2: CHỌN THEO SỞ THÍCH & NHU CẦU */}
                            {menuMode === 'preferences' && (
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

                            {/* Danh sách mâm cơm từng ngày */}
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {menuResult.map((item, index) => (
                                    <div className="col" key={index}>
                                        <div className="menu-day-card">
                                            <div className="menu-day-header">
                                                <i className="fas fa-calendar-check me-2"></i> {item.ngay}
                                            </div>
                                            <div className="menu-day-body">
                                                {/* BỮA TRƯA */}
                                                {item.bua_trua && (
                                                    <div className="meal-box meal-box-lunch">
                                                        <div className="meal-box-title">
                                                            <span>☀️ Bữa Trưa (4 món)</span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a16207' }}>Mâm trưa</span>
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <MealDishRow dish={item.bua_trua.mon_man} typeKey="mon_man" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_trua.mon_xao_ran} typeKey="mon_xao_ran" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_trua.mon_canh} typeKey="mon_canh" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_trua.trang_mieng} typeKey="trang_mieng" onOpenDetail={handleOpenDetail} />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* BỮA TỐI */}
                                                {item.bua_toi && (
                                                    <div className="meal-box meal-box-dinner">
                                                        <div className="meal-box-title">
                                                            <span>🌙 Bữa Tối (4 món)</span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>Mâm tối</span>
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <MealDishRow dish={item.bua_toi.mon_man} typeKey="mon_man" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_toi.mon_xao_ran} typeKey="mon_xao_ran" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_toi.mon_canh} typeKey="mon_canh" onOpenDetail={handleOpenDetail} />
                                                            <MealDishRow dish={item.bua_toi.trang_mieng} typeKey="trang_mieng" onOpenDetail={handleOpenDetail} />
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