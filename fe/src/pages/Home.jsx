import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import ProductCard from '../components/ProductCard';
import RecipeDetailModal from '../components/RecipeDetailModal';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [keyword, setKeyword] = useState('');
    const [selectedDish, setSelectedDish] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        Promise.all([api.get('/api/san-pham'), api.get('/api/mon-an')])
            .then(([prods, mons]) => {
                if (cancelled) return;
                
                // Nếu prods hoặc mons là đối tượng có thuộc tính 'data', hãy lấy nó
                const productList = prods.data ? prods.data : (Array.isArray(prods) ? prods : []);
                const dishList = mons.data ? mons.data : (Array.isArray(mons) ? mons : []);
                
                setProducts(productList);
                setDishes(dishList);
            })
            .catch(err => {
                if (!cancelled) setError((err && err.message) || 'Không thể tải dữ liệu.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const PREFERRED_CAT_ORDER = [
        'Tất cả',
        'Món Chế Biến Sẵn',
        'Set Nấu Ăn (Meal-kit)',
        'Thịt & Hải Sản Tươi',
        'Rau Củ & Nông Sản Tươi',
        'Gia Vị & Nông Sản Bếp',
        'Đồ Uống & Tráng Miệng'
    ];

    const availableCats = [...new Set(products.map(p => p.danh_muc).filter(Boolean))];
    const categories = [
        'Tất cả',
        ...PREFERRED_CAT_ORDER.filter(c => c !== 'Tất cả' && availableCats.includes(c)),
        ...availableCats.filter(c => !PREFERRED_CAT_ORDER.includes(c))
    ];
    const filteredProducts = activeCategory === 'Tất cả'
        ? products
        : products.filter(p => p.danh_muc === activeCategory);

    const mealKitAndFreshList = products.filter(p => 
        p.danh_muc === 'Set Nấu Ăn (Meal-kit)' || 
        p.danh_muc === 'Nông Sản & Nguyên Liệu' ||
        (p.danh_muc || '').toLowerCase().includes('nấu ăn') ||
        (p.danh_muc || '').toLowerCase().includes('nông sản')
    );
    const displayMealKits = mealKitAndFreshList.length > 0 ? mealKitAndFreshList.slice(0, 4) : products.slice(0, 4);
    const bestsellers = [...products].sort((a, b) => (Number(b.da_ban) || 0) - (Number(a.da_ban) || 0)).slice(0, 4);

    const handleSearch = (e) => {
        e.preventDefault();
        const kw = keyword.trim();
        navigate(`/shop?q=${encodeURIComponent(kw)}`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="container pt-3">
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        {esc(error)}
                    </div>
                </div>
            )}

            {/* Hero Start */}
            <div className="container-fluid py-4 py-lg-5 mb-5 hero-header">
                <div className="container py-4 py-lg-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <span 
                                className="badge px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-2 shadow-sm"
                                style={{ backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', fontSize: '0.88rem' }}
                            >
                                <i className="fas fa-sparkles text-success"></i> Nền Tảng Đặt Món &amp; Gợi Ý Thực Đơn Thông Minh
                            </span>
                            <h1 className="mb-4 display-4 text-primary fw-bold" style={{ letterSpacing: '-0.5px', lineHeight: 1.25 }}>
                                Món Ngon Nóng Sốt &amp; Set Nấu Ăn Tận Nơi
                            </h1>
                            <p className="text-secondary fs-5 mb-4" style={{ lineHeight: 1.6 }}>
                                Thưởng thức các món ăn chuẩn vị, set Meal-kit sơ chế sẵn tiện lợi và tính năng tự động lập thực đơn theo tủ lạnh của bạn.
                            </p>
                            <form className="position-relative mx-auto mb-4" onSubmit={handleSearch}>
                                <input
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill shadow-sm"
                                    type="text"
                                    placeholder="Tìm món ăn, set meal-kit, đồ uống..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    style={{ fontSize: '0.95rem' }}
                                />
                                <button type="submit" className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100 shadow-sm fw-bold" style={{ top: 0, right: '25%' }}>
                                    <i className="fas fa-search me-1"></i> Tìm Ngay
                                </button>
                            </form>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span className="small text-muted fw-semibold me-1">Gợi ý nhanh:</span>
                                <Link 
                                    to="/shop?category=Món Chế Biến Sẵn" 
                                    className="badge text-decoration-none px-3 py-2 rounded-pill fw-semibold shadow-sm transition-all"
                                    style={{ backgroundColor: '#ffffff', color: '#495057', border: '1px solid #ced4da', fontSize: '0.82rem' }}
                                >
                                    🍲 Món Chế Biến Sẵn
                                </Link>
                                <Link 
                                    to="/shop?category=Set Nấu Ăn (Meal-kit)" 
                                    className="badge text-decoration-none px-3 py-2 rounded-pill fw-semibold shadow-sm transition-all"
                                    style={{ backgroundColor: '#ffffff', color: '#495057', border: '1px solid #ced4da', fontSize: '0.82rem' }}
                                >
                                    🍳 Set Meal-Kit
                                </Link>
                                <Link 
                                    to="/goi-y-mon-an" 
                                    className="badge text-decoration-none px-3 py-2 rounded-pill fw-bold shadow-sm transition-all"
                                    style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #81c408', fontSize: '0.82rem' }}
                                >
                                    ⭐ Gợi Ý Thực Đơn
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active" style={{ height: '360px' }}>
                                        <img src="/img/banner-recipe-suggest.png" className="d-block w-100 h-100 object-fit-cover" alt="Gợi Ý Món Ăn" />
                                        <div className="position-absolute start-0 end-0 bottom-0 p-4 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }}>
                                            <h5 className="text-white fw-bold mb-2">Gợi Ý Món Ngon Hàng Ngày</h5>
                                            <Link to="/goi-y-mon-an" className="btn btn-warning text-dark px-4 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1">
                                                <span>Khám Phá Thực Đơn</span> <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="carousel-item" style={{ height: '360px' }}>
                                        <img src="/img/hero-img-2.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Món Chế Biến Sẵn" />
                                        <div className="position-absolute start-0 end-0 bottom-0 p-4 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }}>
                                            <h5 className="text-white fw-bold mb-2">Món Ăn Nóng Sốt Giao Nhanh</h5>
                                            <Link to="/shop?category=Món Chế Biến Sẵn" className="btn btn-primary text-white px-4 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1">
                                                <span>Đặt Món Ngay</span> <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="carousel-item" style={{ height: '360px' }}>
                                        <img src="/img/banner-veggie-fresh.png" className="d-block w-100 h-100 object-fit-cover" alt="Set Nấu Ăn Meal-kit" />
                                        <div className="position-absolute start-0 end-0 bottom-0 p-4 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)', zIndex: 5 }}>
                                            <h5 className="text-white fw-bold mb-2">Set Meal-Kit Tự Nấu Tiện Lợi</h5>
                                            <Link to="/shop?category=Set Nấu Ăn (Meal-kit)" className="btn btn-success text-white px-4 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1">
                                                <span>Xem Set Meal-Kit</span> <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev" style={{ zIndex: 10 }}>
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Trước</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next" style={{ zIndex: 10 }}>
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Sau</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Featurs Section Start */}
            <div className="container-fluid featurs py-4">
                <div className="container py-4">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-white p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm">
                                <div className="featurs-icon rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center shadow-sm" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #ff9f43 0%, #ff5252 100%)' }}>
                                    <i className="fas fa-shipping-fast fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark fs-6">Giao Hàng Siêu Tốc</h5>
                                    <p className="mb-0 text-muted small">Món ăn giữ trọn vị nóng sốt, giao nhanh tận nơi 30 phút</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-white p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm">
                                <div className="featurs-icon rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center shadow-sm" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #10ac84 0%, #2ed573 100%)' }}>
                                    <i className="fas fa-qrcode fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark fs-6">Thanh Toán An Toàn</h5>
                                    <p className="mb-0 text-muted small">Quét mã VietQR ngân hàng tiện lợi hoặc trả tiền mặt khi nhận</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-white p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm">
                                <div className="featurs-icon rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center shadow-sm" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #3742fa 0%, #70a1ff 100%)' }}>
                                    <i className="fas fa-utensils fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark fs-6">Gợi Ý Món Ăn Thông Minh</h5>
                                    <p className="mb-0 text-muted small">Lên thực đơn và công thức chuẩn theo nguyên liệu tủ lạnh</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-white p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm">
                                <div className="featurs-icon rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center shadow-sm" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #81c408 0%, #20bf6b 100%)' }}>
                                    <i className="fas fa-check-circle fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark fs-6">100% Vệ Sinh An Toàn</h5>
                                    <p className="mb-0 text-muted small">Nguyên liệu VietGAP tươi sạch, chứng nhận an toàn thực phẩm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Featurs Section End */}

            {/* Fruits Shop Start */}
            <div className="container-fluid fruite py-5">
                <div className="container py-5">
                    {/* Header: Title + Subtitle centered */}
                    <div className="text-center mb-4">
                        <span 
                            className="badge px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm"
                            style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', fontSize: '0.82rem' }}
                        >
                            <i className="fas fa-utensils me-1 text-success"></i> Thực Đơn &amp; Món Ăn Bán Chạy
                        </span>
                        <h2 className="display-6 fw-bold text-dark mb-2">Thực Đơn Đặt Món Trực Tuyến</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: 620 }}>
                            Món ăn chế biến sẵn nóng sốt giao liền, set nguyên liệu Meal-kit tự nấu thông minh và đồ uống thanh mát mỗi ngày.
                        </p>
                    </div>

                    {/* Category Filter Pills: Centered segmented capsule */}
                    <div className="d-flex justify-content-center mb-5">
                        <div className="d-inline-flex flex-wrap justify-content-center align-items-center gap-2 p-1.5 bg-light rounded-pill border shadow-sm" style={{ maxWidth: '100%' }}>
                            {categories.map(c => {
                                const isActive = activeCategory === c;
                                const iconMap = {
                                    'Tất cả': 'fa-border-all',
                                    'Món Chế Biến Sẵn': 'fa-fire-burner',
                                    'Set Nấu Ăn (Meal-kit)': 'fa-kitchen-set',
                                    'Đồ Uống & Tráng Miệng': 'fa-glass-water',
                                    'Nông Sản & Nguyên Liệu': 'fa-leaf'
                                };
                                const icon = iconMap[c] || 'fa-utensils';
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`btn rounded-pill px-3.5 py-2 fw-bold text-nowrap transition-all d-flex align-items-center gap-2 ${
                                            isActive 
                                                ? 'btn-primary text-white shadow-sm' 
                                                : 'btn-transparent text-secondary border-0 hover-bg-white'
                                        }`}
                                        onClick={() => setActiveCategory(c)}
                                        style={{ fontSize: '0.92rem' }}
                                    >
                                        <i className={`fas ${icon}`}></i>
                                        <span>{c}</span>
                                        {isActive && (
                                            <span className="badge bg-white text-primary rounded-pill small ms-1" style={{ fontSize: '0.72rem' }}>
                                                {filteredProducts.length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="product-slider-wrapper">
                        {filteredProducts.length === 0 ? (
                            <div className="w-100 text-center py-5">
                                <p className="text-muted fs-5">Không có món ăn nào thuộc danh mục này.</p>
                            </div>
                        ) : (
                            <Swiper
                                key={activeCategory}
                                modules={[Navigation]}
                                navigation={true}
                                grabCursor={true}
                                slidesPerView={1}
                                spaceBetween={24}
                                breakpoints={{
                                    576: { slidesPerView: 2, spaceBetween: 20 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 24 }
                                }}
                                className="productSwiper pb-2"
                            >
                                {filteredProducts.map(p => (
                                    <SwiperSlide key={p.id}>
                                        <ProductCard p={p} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
            {/* Fruits Shop End */}

            {/* Service & Promotion Banners Start */}
            <div className="container-fluid py-5 bg-light bg-opacity-50">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <span 
                            className="badge px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm"
                            style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', fontSize: '0.82rem' }}
                        >
                            <i className="fas fa-tags me-1 text-success"></i> Dịch Vụ &amp; Trải Nghiệm Nổi Bật
                        </span>
                        <h2 className="display-6 fw-bold text-dark mb-2">Khám Phá Giải Pháp Bữa Ăn Tiện Lợi</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: 650 }}>
                            Từ món ăn giao liền nóng sốt, set tự nấu meal-kit chuẩn vị đến gợi ý thực đơn thông minh mỗi ngày.
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {/* Banner 1: Món Chế Biến Sẵn */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/shop?category=Món Chế Biến Sẵn" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all h-100" style={{ minHeight: '380px' }}>
                                    <img 
                                        src="/img/hero-img-2.jpg" 
                                        className="w-100 h-100 object-fit-cover transition-transform" 
                                        style={{ filter: 'brightness(0.85)' }}
                                        alt="Món Chế Biến Sẵn" 
                                    />
                                    <div 
                                        className="position-absolute d-flex flex-column justify-content-between p-4"
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
                                            top: 0, bottom: 0, left: 0, right: 0
                                        }}
                                    >
                                        <div>
                                            <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm text-white" style={{ backgroundColor: '#dc3545' }}>
                                                🍲 CHẾ BIẾN SẴN NÓNG SỐT
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Món Ăn Nóng Giao Liền</h4>
                                            <p className="text-white-50 small mb-3">Cơm tấm, phở bò, bún chả thơm lừng giao ngay trong 30 phút</p>
                                            <span className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Đặt Món Ngay <i className="fa fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Banner 2: Đưa sang trang Gợi Ý Món Ngon & Lập Thực Đơn */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/goi-y-mon-an" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all h-100" style={{ minHeight: '380px' }}>
                                    <img 
                                        src="/img/banner-recipe-suggest.png" 
                                        className="w-100 h-100 object-fit-cover transition-transform" 
                                        style={{ filter: 'brightness(0.85)' }}
                                        alt="Gợi Ý Món Ngon" 
                                    />
                                    <div 
                                        className="position-absolute d-flex flex-column justify-content-between p-4"
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)',
                                            top: 0, bottom: 0, left: 0, right: 0
                                        }}
                                    >
                                        <div>
                                            <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm text-white" style={{ backgroundColor: '#198754' }}>
                                                ⭐ TÍNH NĂNG ĐỘC QUYỀN
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Gợi Ý Món Ngon Mỗi Ngày</h4>
                                            <p className="text-white-50 small mb-3">Lập thực đơn thông minh theo nguyên liệu tủ lạnh của bạn</p>
                                            <span className="btn btn-warning text-dark rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Khám Phá Ngay <i className="fa fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Banner 3: Set Meal-kit tự nấu */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/shop?category=Set Nấu Ăn (Meal-kit)" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all h-100" style={{ minHeight: '380px' }}>
                                    <img 
                                        src="/img/banner-veggie-fresh.png" 
                                        className="w-100 h-100 object-fit-cover transition-transform" 
                                        style={{ filter: 'brightness(0.85)' }}
                                        alt="Set Nấu Ăn Meal-kit" 
                                    />
                                    <div 
                                        className="position-absolute d-flex flex-column justify-content-between p-4"
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
                                            top: 0, bottom: 0, left: 0, right: 0
                                        }}
                                    >
                                        <div>
                                            <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm text-dark" style={{ backgroundColor: '#0dcaf0' }}>
                                                🍳 TIẾT KIỆM THỜI GIAN
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Set Nấu Ăn (Meal-kit)</h4>
                                            <p className="text-white-50 small mb-3">Sơ chế sẵn sạch sẽ, định lượng chuẩn gia vị theo công thức</p>
                                            <span className="btn btn-light text-dark rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Xem Set Meal-Kit <i className="fa fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Service & Promotion Banners End */}

            {/* Meal-Kit & Fresh Items Section Start */}
            <div className="container-fluid vesitable py-5">
                <div className="container py-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                        <div>
                            <span 
                                className="badge px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm"
                                style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', fontSize: '0.82rem' }}
                            >
                                <i className="fas fa-leaf me-1 text-success"></i> Tự Nấu Tiện Lợi
                            </span>
                            <h2 className="display-6 fw-bold mb-0">Set Nấu Ăn &amp; Nông Sản Tươi Sạch</h2>
                        </div>
                        <Link to="/shop?category=Set Nấu Ăn (Meal-kit)" className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold mt-3 mt-sm-0">
                            Xem tất cả Set Nấu <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                    <div className="row g-4" id="vegetables-container">
                        {displayMealKits.map(p => (
                            <ProductCard key={p.id} p={p} compact />
                        ))}
                    </div>
                </div>
            </div>
            {/* Meal-Kit & Fresh Items Section End */}

            {/* Interactive Smart Meal Planner CTA Banner Start */}
            <div className="container-fluid my-5">
                <div className="container">
                    <div 
                        className="rounded-4 p-4 p-lg-5 position-relative overflow-hidden shadow-lg"
                        style={{ 
                            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
                            color: '#fff'
                        }}
                    >
                        <div className="row g-4 align-items-center position-relative" style={{ zIndex: 2 }}>
                            <div className="col-lg-7">
                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm" style={{ fontSize: '0.85rem' }}>
                                    <i className="fas fa-brain me-1"></i> TRỢ LÝ ẨM THỰC THÔNG MINH
                                </span>
                                <h2 className="display-5 text-white fw-bold mb-3">
                                    Hôm Nay Nấu Gì? Để Fruitables Giúp Bạn!
                                </h2>
                                <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: 580 }}>
                                    Không còn đau đầu nghĩ món mỗi bữa ăn. Hãy chọn nguyên liệu có sẵn trong tủ lạnh của bạn, hệ thống sẽ gợi ý ngay các món ngon bổ dưỡng kèm công thức chi tiết.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Link to="/goi-y-mon-an" className="btn btn-warning text-dark rounded-pill py-3 px-4 fw-bold shadow d-inline-flex align-items-center gap-2">
                                        <i className="fas fa-wand-magic-sparkles"></i> Lập Thực Đơn Thông Minh
                                    </Link>
                                    <Link to="/shop" className="btn btn-outline-light rounded-pill py-3 px-4 fw-bold d-inline-flex align-items-center gap-2">
                                        <i className="fas fa-store"></i> Mua Sắm Nguyên Liệu
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-5 text-center">
                                <div className="p-4 bg-white rounded-4 shadow text-start">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, flexShrink: 0 }}>
                                            <i className="fas fa-book-open fs-5 text-dark"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0" style={{ color: '#212529', fontSize: '1rem' }}>52+ Công Thức Chi Tiết</h6>
                                            <small className="text-muted" style={{ fontSize: '0.85rem' }}>Định lượng &amp; thời gian nấu chuẩn</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, flexShrink: 0 }}>
                                            <i className="fas fa-clock fs-5 text-white"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0" style={{ color: '#212529', fontSize: '1rem' }}>Nấu Nhanh Chỉ 15 - 30 Phút</h6>
                                            <small className="text-muted" style={{ fontSize: '0.85rem' }}>Phù hợp cho người bận rộn</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, flexShrink: 0, backgroundColor: '#0dcaf0' }}>
                                            <i className="fas fa-cart-plus fs-5 text-white"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0" style={{ color: '#212529', fontSize: '1rem' }}>Mua Kèm Nguyên Liệu Liền</h6>
                                            <small className="text-muted" style={{ fontSize: '0.85rem' }}>Đặt nhanh set Meal-kit tương ứng</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Interactive Smart Meal Planner CTA Banner End */}

            {/* Bestseller Product Start */}
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
                        <span 
                            className="badge px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm"
                            style={{ backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '0.82rem' }}
                        >
                            <i className="fas fa-fire me-1 text-danger"></i> Được Yêu Thích Nhất
                        </span>
                        <h2 className="display-5 fw-bold">Sản Phẩm Bán Chạy</h2>
                        <p className="text-muted">Những món ăn và nguyên liệu được đông đảo khách hàng tin dùng và đánh giá cao.</p>
                    </div>
                    <div className="row g-4" id="bestseller-container">
                        {bestsellers.map(p => (
                            <ProductCard key={p.id} p={p} compact />
                        ))}
                    </div>
                </div>
            </div>
            {/* Bestseller Product End */}

            {/* Fact Start (Thống kê thực tế từ CSDL) */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="bg-light p-5 rounded-4 shadow-sm">
                        <div className="row g-4 justify-content-center">
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded-4 p-4 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <i className="fa fa-users fa-3x text-primary mb-3"></i>
                                    <h5 className="text-muted">Khách Hàng Hài Lòng</h5>
                                    <h2 className="fw-bold text-dark mb-0">1,200+</h2>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded-4 p-4 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <i className="fa fa-utensils fa-3x text-success mb-3"></i>
                                    <h5 className="text-muted">Công Thức Món Ăn</h5>
                                    <h2 className="fw-bold text-dark mb-0">{dishes.length || 52}+ Món</h2>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded-4 p-4 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <i className="fa fa-award fa-3x text-warning mb-3"></i>
                                    <h5 className="text-muted">Chuẩn Vệ Sinh An Toàn</h5>
                                    <h2 className="fw-bold text-dark mb-0">100%</h2>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded-4 p-4 text-center shadow-sm h-100 d-flex flex-column justify-content-center">
                                    <i className="fa fa-box-open fa-3x text-info mb-3"></i>
                                    <h5 className="text-muted">Mặt Hàng Cung Ứng</h5>
                                    <h2 className="fw-bold text-dark mb-0">{products.length}+ Sản phẩm</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fact End */}

            {/* Testimonial Start (Hiển thị Món Ăn Gợi Ý từ CSDL) */}
            <div className="container-fluid testimonial py-5 bg-light bg-opacity-50">
                <div className="container py-4">
                    <div className="testimonial-header text-center mb-5">
                        <span 
                            className="badge px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm"
                            style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', fontSize: '0.82rem' }}
                        >
                            <i className="fas fa-hat-chef me-1 text-success"></i> Gợi Ý Món Ngon Hàng Ngày
                        </span>
                        <h2 className="display-6 fw-bold text-dark mb-2">Hôm Nay Bạn Muốn Nấu Món Gì?</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: 650 }}>
                            Khám phá các công thức nấu ăn chuẩn đầu bếp, hướng dẫn chi tiết từng bước với đầy đủ định lượng và mẹo nhà bếp tinh tế.
                        </p>
                    </div>

                    <div className="row g-4" id="dishes-recommend-container">
                        {dishes.length === 0 ? (
                            <div className="col-12 text-center text-muted py-4">
                                <p>Chưa có món ăn gợi ý nào trong hệ thống.</p>
                            </div>
                        ) : (
                            dishes.slice(0, 6).map(d => {
                                const totalTime = (d.thoi_gian_chuan_bi || 10) + (d.thoi_gian_nau || 15);
                                const diffColors = {
                                    'Dễ': 'bg-success',
                                    'Trung bình': 'bg-warning text-dark',
                                    'Khó': 'bg-danger'
                                };
                                const diffBadge = diffColors[d.do_kho] || 'bg-success';

                                return (
                                    <div className="col-md-6 col-lg-4" key={d.id}>
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                                            {/* Dish Thumbnail */}
                                            <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
                                                <img
                                                    src={imgUrl(d.hinh_anh)}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                    alt={esc(d.ten_mon)}
                                                />
                                                <div className="position-absolute top-0 start-0 m-3">
                                                    <span className="badge rounded-pill badge-soft-dark text-white px-2.5 py-1.5 shadow-sm small">
                                                        <i className="fas fa-utensils me-1"></i> {esc(d.loai_mon || 'Món mặn')}
                                                    </span>
                                                </div>
                                                {d.do_kho && (
                                                    <div className="position-absolute top-0 end-0 m-3">
                                                        <span className={`badge rounded-pill px-2.5 py-1.5 shadow-sm small ${diffBadge}`}>
                                                            {d.do_kho}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dish Body */}
                                            <div className="p-4 d-flex flex-column flex-grow-1">
                                                <h5 className="fw-bold text-dark mb-2 text-truncate" title={d.ten_mon}>
                                                    {esc(d.ten_mon)}
                                                </h5>

                                                {/* Meta Chips */}
                                                <div className="d-flex flex-wrap gap-2 mb-3">
                                                    <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill small">
                                                        <i className="fas fa-clock text-primary me-1"></i> {totalTime} phút
                                                    </span>
                                                    <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill small">
                                                        <i className="fas fa-user-friends text-success me-1"></i> {d.khau_phan || '2 - 3 người'}
                                                    </span>
                                                </div>

                                                {/* Description or Ingredients */}
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
                                                    {d.mo_ta || (d.nguyen_lieu_chinh ? `Nguyên liệu: ${d.nguyen_lieu_chinh}` : (d.cong_thuc || 'Công thức chuẩn đầu bếp.'))}
                                                </p>

                                                {/* Action Button */}
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mt-auto"
                                                    onClick={() => setSelectedDish(d)}
                                                >
                                                    <i className="fas fa-book-open"></i> Xem Công Thức Chi Tiết
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-5">
                        <Link to="/goi-y-mon-an" className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                            <i className="fas fa-layer-group"></i> Khám Phá Toàn Bộ {dishes.length || 52}+ Món Ăn &amp; Lên Thực Đơn
                            <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Testimonial End */}

            {/* Modal Chi tiết Món ăn khi xem từ Trang Chủ */}
            {selectedDish && (
                <RecipeDetailModal
                    dish={selectedDish}
                    isOpen={Boolean(selectedDish)}
                    onClose={() => setSelectedDish(null)}
                />
            )}
        </>
    );
}
