import { useState, useEffect, useRef } from 'react';
import { imgUrl, esc } from '../utils/img';
import './RecipeDetailModal.css';

export default function RecipeDetailModal({ dish, isOpen, onClose }) {
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const backdropRef = useRef(null);
    const dialogRef = useRef(null);

    // Reset checked items and scroll position to top when modal opens with a new dish
    useEffect(() => {
        setCheckedIngredients({});
    }, [dish?.id]);

    // Lock body scroll and reset scroll to top on open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Reset scroll to top
            if (backdropRef.current) backdropRef.current.scrollTop = 0;
            if (dialogRef.current) dialogRef.current.scrollTop = 0;
            window.scrollTo({ top: window.scrollY }); // Prevent jumping

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen, dish?.id]);

    // Listen for ESC key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !dish) return null;

    const toggleIngredient = (idx) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    // Chuẩn bị danh sách nguyên liệu
    let ingredients = [];
    if (Array.isArray(dish.nguyen_lieu_chi_tiet) && dish.nguyen_lieu_chi_tiet.length > 0) {
        ingredients = dish.nguyen_lieu_chi_tiet;
    } else if (dish.nguyen_lieu_chinh) {
        ingredients = dish.nguyen_lieu_chinh.split(',').map(item => ({
            ten: item.trim(),
            so_luong: '',
            don_vi: '',
            ghi_chu: ''
        }));
    }

    // Chuẩn bị danh sách các bước
    let steps = [];
    if (Array.isArray(dish.cac_buoc_thuc_hien) && dish.cac_buoc_thuc_hien.length > 0) {
        steps = dish.cac_buoc_thuc_hien;
    } else if (dish.cong_thuc) {
        steps = [{
            buoc: 1,
            tieu_de: 'Hướng dẫn chế biến',
            noi_dung: dish.cong_thuc
        }];
    }

    // Màu sắc độ khó
    const difficultyColors = {
        'Dễ': { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
        'Trung bình': { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
        'Khó': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
    };
    const diffStyle = difficultyColors[dish.do_kho] || difficultyColors['Dễ'];

    return (
        <div className="recipe-modal-backdrop" ref={backdropRef} onClick={onClose}>
            <div className="recipe-modal-dialog" ref={dialogRef} onClick={e => e.stopPropagation()}>
                {/* Hero Header */}
                <div className="recipe-modal-hero">
                    <img src={imgUrl(dish.hinh_anh)} alt={esc(dish.ten_mon)} />
                    <button
                        type="button"
                        className="recipe-modal-close"
                        onClick={onClose}
                        title="Đóng (Esc)"
                        aria-label="Đóng"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="recipe-modal-hero-overlay">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge rounded-pill bg-success px-3 py-1 text-white shadow-sm">
                                <i className="fas fa-utensils me-1"></i> {dish.loai_mon || 'Món ăn'}
                            </span>
                            {dish.do_kho && (
                                <span
                                    className="badge rounded-pill px-3 py-1"
                                    style={{
                                        background: diffStyle.bg,
                                        color: diffStyle.text,
                                        border: `1px solid ${diffStyle.border}`
                                    }}
                                >
                                    Độ khó: {dish.do_kho}
                                </span>
                            )}
                        </div>
                        <h2 className="text-white fw-bold mb-1">{esc(dish.ten_mon)}</h2>
                        {dish.mo_ta && (
                            <p className="text-white-50 small mb-0" style={{ maxWidth: '650px' }}>
                                {dish.mo_ta}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Metrics Bar */}
                <div className="recipe-metrics-grid">
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-primary">
                            <i className="fas fa-users"></i>
                        </span>
                        <span className="recipe-metric-label">Khẩu phần</span>
                        <span className="recipe-metric-value">{dish.khau_phan || '2 - 3 người'}</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-info">
                            <i className="fas fa-clock"></i>
                        </span>
                        <span className="recipe-metric-label">Chuẩn bị</span>
                        <span className="recipe-metric-value">{dish.thoi_gian_chuan_bi || 10} phút</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-danger">
                            <i className="fas fa-fire-alt"></i>
                        </span>
                        <span className="recipe-metric-label">Nấu chín</span>
                        <span className="recipe-metric-value">{dish.thoi_gian_nau || 15} phút</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-warning">
                            <i className="fas fa-award"></i>
                        </span>
                        <span className="recipe-metric-label">Độ khó</span>
                        <span className="recipe-metric-value">{dish.do_kho || 'Dễ'}</span>
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="recipe-modal-content">
                    {/* NGUYÊN LIỆU CHI TIẾT (Checklist) */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="recipe-section-title mb-0">
                                <i className="fas fa-carrot"></i> Nguyên Liệu & Định Lượng
                            </h5>
                            <span className="text-muted small">
                                ({Object.values(checkedIngredients).filter(Boolean).length}/{ingredients.length} đã chuẩn bị)
                            </span>
                        </div>
                        <div className="ingredient-list">
                            {ingredients.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`ingredient-item ${checkedIngredients[idx] ? 'checked' : ''}`}
                                    onClick={() => toggleIngredient(idx)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!checkedIngredients[idx]}
                                        onChange={() => {}}
                                    />
                                    <div className="ingredient-info">
                                        <div className="ingredient-name">{item.ten}</div>
                                        <div>
                                            {(item.so_luong || item.don_vi) && (
                                                <span className="ingredient-amount">
                                                    {item.so_luong} {item.don_vi}
                                                </span>
                                            )}
                                            {item.ghi_chu && (
                                                <span className="ingredient-note">
                                                    ({item.ghi_chu})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CÁC BƯỚC THỰC HIỆN */}
                    <div className="mb-4">
                        <h5 className="recipe-section-title">
                            <i className="fas fa-list-ol"></i> Các Bước Nấu Chuẩn Đầu Bếp
                        </h5>
                        <div className="step-timeline">
                            {steps.map((s, idx) => (
                                <div className="step-item" key={idx}>
                                    <div className="step-badge">{s.buoc || (idx + 1)}</div>
                                    <div className="step-card">
                                        <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                                            {s.tieu_de && (
                                                <div className="step-title mb-0">{s.tieu_de}</div>
                                            )}
                                            {s.thoi_gian && (
                                                <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill small">
                                                    <i className="fas fa-stopwatch text-success me-1"></i> {s.thoi_gian}
                                                </span>
                                            )}
                                        </div>
                                        <p className="step-desc">{s.noi_dung}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MẸO NHÀ BẾP (NẾU CÓ) */}
                    {dish.meo_nau_an && (
                        <div className="chef-tips-box">
                            <div className="chef-tips-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <div className="chef-tips-content">
                                <h6>Mẹo Bí Truyền Của Đầu Bếp:</h6>
                                <p>{dish.meo_nau_an}</p>
                            </div>
                        </div>
                    )}

                    {/* THÔNG TIN DINH DƯỠNG (NẾU CÓ) */}
                    {dish.dinh_duong && (
                        <div className="mt-4">
                            <h5 className="recipe-section-title">
                                <i className="fas fa-heartbeat text-danger"></i> Giá Trị Dinh Dưỡng Ước Tính (1 Khẩu Phần)
                            </h5>
                            <div className="nutrition-grid">
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Năng lượng</div>
                                    <div className="nutrition-val text-primary">
                                        {dish.dinh_duong.calo || 0} <small className="fs-6 text-muted">kcal</small>
                                    </div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Chất đạm (Protein)</div>
                                    <div className="nutrition-val text-success">
                                        {dish.dinh_duong.protein || '--'}
                                    </div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Chất béo (Fat)</div>
                                    <div className="nutrition-val text-warning">
                                        {dish.dinh_duong.chat_beo || '--'}
                                    </div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Tinh bột (Carb)</div>
                                    <div className="nutrition-val text-info">
                                        {dish.dinh_duong.carb || '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAGS / KHẨU VỊ */}
                    {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                        <div className="recipe-tags-list">
                            <span className="small text-muted me-1 align-self-center">
                                <i className="fas fa-tags me-1"></i> Đặc điểm:
                            </span>
                            {dish.tags.map((t, idx) => (
                                <span key={idx} className="recipe-tag">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* MODAL BOTTOM ACTIONS */}
                    <div className="recipe-modal-footer">
                        <button
                            type="button"
                            className="btn btn-light border rounded-pill px-4 py-2 fw-semibold text-secondary d-flex align-items-center gap-2"
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i> Đóng cửa sổ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
