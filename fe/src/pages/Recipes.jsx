import { useEffect, useState } from 'react';
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
                    <div className="mb-2">
                        {dish.loai_mon ? <span className="badge bg-warning text-dark">{esc(dish.loai_mon)}</span> : null}
                    </div>
                    <p className="mb-2">
                        <span className="badge bg-secondary text-white">Nguyên liệu: {esc(dish.nguyen_lieu_chinh)}</span>
                    </p>
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
    const [keyword, setKeyword] = useState('');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDishes = async (kw) => {
        setLoading(true);
        try {
            const url = kw
                ? '/api/goi-y-mon-an?keyword=' + encodeURIComponent(kw)
                : '/api/mon-an';
            const list = await api.get(url);
            setDishes(list || []);
        } catch (e) {
            alert('❌ Lỗi tải món ăn: ' + e.message);
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDishes('');
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadDishes(keyword.trim());
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gợi Ý Món Ăn</li>
                </ol>
            </nav>

            <div className="text-center mx-auto mb-4" style={{ maxWidth: 700 }}>
                <h1 className="fw-bold text-primary">Gợi Ý Món Ngon & Lập Thực Đơn Thông Minh</h1>
                <p className="text-muted">
                    Tra cứu công thức nhanh hoặc dùng thuật toán lập mâm cơm chuẩn vị (Món mặn - Canh - Xào - Rau) theo ngày/tuần từ tủ lạnh của bạn.
                </p>
            </div>

            {/* Ô tìm kiếm từ khóa */}
            <div className="card shadow-sm border-0 rounded-3 p-4 mb-4 bg-white">
                <form className="row g-3 align-items-end" onSubmit={handleSearch}>
                    <div className="col-md-8">
                        <label className="form-label fw-bold text-secondary small mb-1">
                            <i className="fas fa-search me-1"></i> Tìm nhanh tên món / nguyên liệu:
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
            </div>

            {/* Kết quả */}
            {loading ? (
                <div className="text-center text-muted py-5">
                    <span className="spinner-border text-primary mb-2" role="status"></span>
                    <p className="mb-0">Đang tải danh sách món ăn...</p>
                </div>
            ) : dishes.length === 0 ? (
                <div className="col-12 text-center text-muted py-5">
                    <i className="fas fa-utensils fa-3x mb-3 text-secondary"></i>
                    <h5>Không tìm thấy món ăn nào</h5>
                </div>
            ) : (
                <div className="row g-4">
                    {dishes.map(d => <RecipeCard key={d.id || d.ten_mon} dish={d} />)}
                </div>
            )}
        </div>
    );
}
