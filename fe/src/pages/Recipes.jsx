import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';

function RecipeCard({ dish }) {
    const [expanded, setExpanded] = useState(false);
    const congThuc = dish.cong_thuc || 'Chưa cập nhật';

    return (
        <div className="col-md-6 col-lg-4">
            <div className="bg-white rounded shadow-sm border overflow-hidden h-100 d-flex flex-column">
                <img
                    src={imgUrl(dish.hinh_anh)}
                    className="w-100"
                    style={{ height: 200, objectFit: 'cover' }}
                    alt={esc(dish.ten_mon)}
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <h4 className="fw-bold text-dark mb-1">{esc(dish.ten_mon)}</h4>
                    {dish.nguyen_lieu_chinh && (
                        <p className="text-success small mb-2">
                            <i className="fas fa-carrot me-1"></i> <strong>Nguyên liệu chính:</strong> {esc(dish.nguyen_lieu_chinh)}
                        </p>
                    )}
                    <p
                        className="text-muted small flex-grow-1 mb-2"
                        style={expanded ? {} : {
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        <strong>Cách làm:</strong> {esc(congThuc)}
                    </p>
                    {congThuc.length > 120 && (
                        <div>
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                onClick={() => setExpanded(e => !e)}
                            >
                                <i className={'fas fa-chevron-' + (expanded ? 'up' : 'down') + ' me-1'}></i>
                                {expanded ? 'Thu gọn' : 'Xem công thức đầy đủ'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Recipes() {
    const [activeTab, setActiveTab] = useState('search'); // 'search' hoặc 'menu'
    
    // State cho tìm kiếm & lọc theo nguyên liệu (Tab 1)
    const [keyword, setKeyword] = useState('');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchIngredients, setSearchIngredients] = useState([]); // Nguyên liệu chọn để tra cứu

    // State chung cho danh sách nguyên liệu từ CSDL
    const [ingredientGroups, setIngredientGroups] = useState({});

    // State cho lập menu thông minh (Tab 2)
    const [days, setDays] = useState(3);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [menuResult, setMenuResult] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);

    // 1. Tải danh sách món ăn khi tra cứu (Hỗ trợ cả từ khóa và nguyên liệu chọn)
    const loadDishes = async (kw = '', ingIds = []) => {
        setLoading(true);
        try {
            let url = '/api/mon-an';
            if (kw) {
                url = '/api/goi-y-mon-an?keyword=' + encodeURIComponent(kw);
            }
            const list = await api.get(url);
            let result = list || [];

            // Nếu người dùng có chọn nguyên liệu để lọc ở tab tra cứu
            if (ingIds.length > 0 && !kw) {
                // Gọi API lấy món theo nguyên liệu hoặc lọc phía client
                const resMatch = await api.post('/api/menu/generate', { ingredients: ingIds, days: 1 });
                if (resMatch && resMatch.success) {
                    result = resMatch.data.map(item => item.mon_an || item.mon_man).filter(Boolean);
                }
            }

            setDishes(result);
        } catch (e) {
            alert('❌ Lỗi tải món ăn: ' + e.message);
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    // 2. Tải danh sách nguyên liệu từ CSDL
    const loadIngredients = async () => {
        try {
            const res = await api.get('/api/nguyen-lieu');
            // Do api.js trả về thẳng dữ liệu đã bóc tách (.data hoặc trực tiếp object)
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

    // Xử lý chọn/bỏ chọn checkbox nguyên liệu cho Tab Tra Cứu
    const handleSearchCheckbox = (id) => {
        setSearchIngredients(prev => {
            const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            loadDishes(keyword.trim(), updated);
            return updated;
        });
    };

    // Xử lý chọn/bỏ chọn checkbox nguyên liệu cho Tab Lập Menu
    const handleMenuCheckbox = (id) => {
        setSelectedIngredients(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Gửi yêu cầu tạo thực đơn xuống Backend
    // Gửi yêu cầu tạo thực đơn xuống Backend
    const handleGenerateMenu = async (e) => {
        e.preventDefault();
        if (selectedIngredients.length === 0) {
            alert('⚠️ Vui lòng chọn ít nhất một nguyên liệu từ tủ lạnh của bạn!');
            return;
        }

        setMenuLoading(true);
        try {
            const res = await api.post('/api/menu/generate', {
                ingredients: selectedIngredients,
                days: Number(days)
            });
            
            // Xử lý linh hoạt: nhận cả dạng có res.success hoặc trả về thẳng mảng kết quả
            if (res) {
                if (res.success === false) {
                    // Nếu backend thông báo lỗi nhưng có danh sách dự phòng, ta vẫn lấy
                    alert('⚠️ ' + (res.message || 'Không thể tạo thực đơn phù hợp.'));
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
            alert('❌ Lỗi hệ thống khi lập menu: ' + err.message);
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
                    Tra cứu công thức nhanh, chọn nguyên liệu có sẵn hoặc dùng thuật toán lập mâm cơm chuẩn vị không trùng lặp theo ngày.
                </p>
            </div>

            {/* Thanh chuyển đổi tính năng (Tabs) */}
            <div className="d-flex justify-content-center mb-4">
                <div className="btn-group shadow-sm" role="group">
                    <button
                        type="button"
                        className={`btn px-4 fw-bold ${activeTab === 'search' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <i className="fas fa-search me-2"></i> Tra Cứu & Lọc Món Ăn
                    </button>
                    <button
                        type="button"
                        className={`btn px-4 fw-bold ${activeTab === 'menu' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        <i className="fas fa-utensils me-2"></i> Lập Thực Đơn Tự Động
                    </button>
                </div>
            </div>

            {/* TAB 1: TRA CỨU MÓN ĂN & CHỌN NGUYÊN LIỆU KẾT HỢP */}
            {activeTab === 'search' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-3 p-4 mb-4 bg-white">
                        <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                            <div className="col-md-8">
                                <label className="form-label fw-bold text-secondary small mb-1">
                                    <i className="fas fa-search me-1"></i> Tìm nhanh tên món:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: Thịt bò, canh..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-primary w-100 rounded-pill text-white fw-bold">
                                    <i className="fas fa-search me-1"></i> Tra Cứu
                                </button>
                            </div>
                        </form>

                        {/* Bổ sung phần chọn nguyên liệu ngay tại tab Tra Cứu */}
                        <div className="mt-4 pt-3 border-top">
                            <label className="form-label fw-bold text-secondary small mb-2">
                                <i className="fas fa-carrot me-1"></i> Hoặc chọn nhanh nguyên liệu bạn đang có để lọc món:
                            </label>
                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted small">Đang tải danh sách nguyên liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2">
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div className="form-check border p-2 rounded bg-light">
                                                        <input
                                                            className="form-check-input ms-1"
                                                            type="checkbox"
                                                            id={`search-ing-${item.id}`}
                                                            checked={searchIngredients.includes(item.id)}
                                                            onChange={() => handleSearchCheckbox(item.id)}
                                                        />
                                                        <label className="form-check-label ms-2 fw-semibold text-dark cursor-pointer" htmlFor={`search-ing-${item.id}`}>
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
                            <span className="spinner-border text-primary mb-2" role="status"></span>
                            <p className="mb-0">Đang tải danh sách món ăn...</p>
                        </div>
                    ) : dishes.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5">
                            <i className="fas fa-utensils fa-3x mb-3 text-secondary"></i>
                            <h5>Không tìm thấy món ăn nào phù hợp</h5>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {dishes.map(d => <RecipeCard key={d.id || d.ten_mon} dish={d} />)}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: LẬP THỰC ĐƠN THÔNG MINH (DỮ LIỆU THẬT) */}
            {activeTab === 'menu' && (
                <div>
                    <div className="card shadow-sm border-0 rounded-3 p-4 mb-4 bg-white">
                        <form onSubmit={handleGenerateMenu}>
                            <h4 className="fw-bold text-dark mb-3">1. Chọn nguyên liệu có sẵn trong tủ lạnh:</h4>
                            
                            {Object.keys(ingredientGroups).length === 0 ? (
                                <p className="text-muted italic">Đang tải danh sách nguyên liệu hoặc chưa có dữ liệu trong cơ sở dữ liệu...</p>
                            ) : (
                                Object.keys(ingredientGroups).map(category => (
                                    <div key={category} className="mb-3 border-bottom pb-2">
                                        <h6 className="fw-bold text-secondary mb-2">📌 {category}</h6>
                                        <div className="row g-2">
                                            {ingredientGroups[category].map(item => (
                                                <div className="col-md-3 col-6" key={item.id}>
                                                    <div className="form-check border p-2 rounded bg-light">
                                                        <input
                                                            className="form-check-input ms-1"
                                                            type="checkbox"
                                                            id={`ing-${item.id}`}
                                                            checked={selectedIngredients.includes(item.id)}
                                                            onChange={() => handleMenuCheckbox(item.id)}
                                                        />
                                                        <label className="form-check-label ms-2 fw-semibold text-dark cursor-pointer" htmlFor={`ing-${item.id}`}>
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
                                    <label className="fw-bold text-dark mb-1">2. Số ngày muốn lập thực đơn:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max="7"
                                        value={days}
                                        onChange={e => setDays(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold py-2 mt-4 text-white shadow-sm">
                                        <i className="fas fa-magic me-2"></i> Tạo Thực Đơn Thông Minh
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Hiển thị kết quả lập thực đơn */}
                    {menuLoading ? (
                        <div className="text-center text-muted py-5">
                            <span className="spinner-border text-success mb-2" role="status"></span>
                            <p className="mb-0">Hệ thống đang tính toán thực đơn tối ưu...</p>
                        </div>
                    ) : menuResult.length > 0 && (
                        <div className="mt-4">
                            <h3 className="fw-bold text-success mb-3">✨ Kết Quả Thực Đơn Đề Xuất (2 Bữa / Ngày):</h3>
                            <div className="row g-4">
                                {menuResult.map((item, index) => (
                                    <div className="col-md-4" key={index}>
                                        <div className="card h-100 shadow-sm border-success">
                                            <div className="card-header bg-success text-white fw-bold text-center fs-5">
                                                {item.ngay}
                                            </div>
                                            <div className="card-body p-3 d-flex flex-column gap-3">
                                                {/* BỮA TRƯA */}
                                                {item.bua_trua && (
                                                    <div className="p-2 border rounded bg-light">
                                                        <h6 className="fw-bold text-primary mb-2 border-bottom pb-1">☀️ Bữa Trưa</h6>
                                                        <ul className="list-unstyled small mb-0">
                                                            <li className="mb-1">🍲 <strong>Canh:</strong> {esc(item.bua_trua.mon_canh?.ten_mon || 'Chưa có')}</li>
                                                            <li className="mb-1">🍖 <strong>Mặn:</strong> {esc(item.bua_trua.mon_man?.ten_mon || 'Chưa có')}</li>
                                                            <li className="mb-1">🍳 <strong>Xào/Rán:</strong> {esc(item.bua_trua.mon_xao_ran?.ten_mon || 'Chưa có')}</li>
                                                            <li>🍉 <strong>Tráng miệng:</strong> {esc(item.bua_trua.trang_mieng?.ten_mon || 'Chưa có')}</li>
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* BỮA TỐI */}
                                                {item.bua_toi && (
                                                    <div className="p-2 border rounded bg-light">
                                                        <h6 className="fw-bold text-danger mb-2 border-bottom pb-1">🌙 Bữa Tối</h6>
                                                        <ul className="list-unstyled small mb-0">
                                                            <li className="mb-1">🍲 <strong>Canh:</strong> {esc(item.bua_toi.mon_canh?.ten_mon || 'Chưa có')}</li>
                                                            <li className="mb-1">🍖 <strong>Mặn:</strong> {esc(item.bua_toi.mon_man?.ten_mon || 'Chưa có')}</li>
                                                            <li className="mb-1">🍳 <strong>Xào/Rán:</strong> {esc(item.bua_toi.mon_xao_ran?.ten_mon || 'Chưa có')}</li>
                                                            <li>🍉 <strong>Tráng miệng:</strong> {esc(item.bua_toi.trang_mieng?.ten_mon || 'Chưa có')}</li>
                                                        </ul>
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
        </div>
    );
}