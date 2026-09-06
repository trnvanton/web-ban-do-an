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
        'Đồ Uống & Tráng Miệng',
        'Nông Sản & Nguyên Liệu'
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
    const vegList = products.filter(p => (p.danh_muc || '').toLowerCase().includes('rau'));
    const displayVegs = vegList.length > 0 ? vegList.slice(0, 4) : products.slice(0, 4);
    const bestsellers = products.slice(0, 4);

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
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <h4 className="mb-3 text-secondary">Nền Tảng Đặt Món &amp; Gợi Ý Thực Đơn Thông Minh</h4>
                            <h1 className="mb-5 display-3 text-primary">Món Ăn Nóng Sốt &amp; Set Nấu Ăn Tận Nơi</h1>
                            <form className="position-relative mx-auto" onSubmit={handleSearch}>
                                <input
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                    type="text"
                                    placeholder="Tìm món ăn, set meal-kit, đồ uống..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100" style={{ top: 0, right: '25%' }}>
                                    Tìm Ngay
                                </button>
                            </form>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img src="/img/hero-img-1.png" className="img-fluid w-100 h-100 bg-secondary rounded" alt="Trái cây tươi" />
                                        <Link to="/shop?category=Trái cây" className="btn px-4 py-2 text-white rounded">Trái cây</Link>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="/img/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded" alt="Rau củ tươi" />
                                        <Link to="/shop?category=Rau củ" className="btn px-4 py-2 text-white rounded">Rau củ</Link>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Trước</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
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
                            <div className="featurs-item text-center rounded-4 bg-light p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm border border-light transition-all hover-lift">
                                <div className="featurs-icon rounded-circle bg-warning mb-4 mx-auto d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <i className="fas fa-car-side fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark">Giao Hàng Miễn Phí</h5>
                                    <p className="mb-0 text-muted small">Miễn phí vận chuyển cho tất cả đơn hàng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-light p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm border border-light transition-all hover-lift">
                                <div className="featurs-icon rounded-circle bg-warning mb-4 mx-auto d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <i className="fas fa-user-shield fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark">Thanh Toán An Toàn</h5>
                                    <p className="mb-0 text-muted small">Bảo mật thông tin & VietQR ngân hàng 100%</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-light p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm border border-light transition-all hover-lift">
                                <div className="featurs-icon rounded-circle bg-warning mb-4 mx-auto d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <i className="fas fa-exchange-alt fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark">Đổi Trả Dễ Dàng</h5>
                                    <p className="mb-0 text-muted small">Hoàn tiền hoặc đổi sản phẩm trong 30 ngày</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded-4 bg-light p-4 h-100 d-flex flex-column align-items-center justify-content-center shadow-sm border border-light transition-all hover-lift">
                                <div className="featurs-icon rounded-circle bg-warning mb-4 mx-auto d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <i className="fa fa-phone-alt fa-2x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5 className="fw-bold mb-2 text-dark">Hỗ Trợ 24/7</h5>
                                    <p className="mb-0 text-muted small">Giải đáp thắc mắc và hỗ trợ khách hàng nhanh chóng</p>
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
                        <span className="badge badge-soft-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase mb-2 shadow-sm">
                            <i className="fas fa-utensils me-1"></i> Thực Đơn &amp; Món Ăn Bán Chạy
                        </span>
                        <h1 className="display-6 fw-bold text-dark mb-2">Thực Đơn Đặt Món Trực Tuyến</h1>
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

            {/* Featurs Start (Dịch vụ / Ưu đãi) */}
            {/* Service & Promotion Banners Start */}
            <div className="container-fluid py-5">
                <div className="container py-4">
                    <div className="row g-4 justify-content-center">
                        {/* Banner 1: Lọc Trái Cây giảm giá */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/shop?category=Trái cây" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all" style={{ height: '360px' }}>
                                    <img 
                                        src="/img/banner-fruit-promo.png" 
                                        className="w-100 h-100 object-fit-cover transition-transform" 
                                        style={{ filter: 'brightness(0.9)' }}
                                        alt="Trái Cây Tươi Ngon" 
                                    />
                                    <div 
                                        className="position-absolute d-flex flex-column justify-content-between p-4"
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
                                            top: 0, bottom: 0, left: 0, right: 0
                                        }}
                                    >
                                        <div>
                                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold shadow-sm">
                                                🍎 NÔNG SẢN HỮU CƠ
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Trái Cây Tươi Hữu Cơ</h4>
                                            <p className="text-white-50 small mb-3">Nhập mới mỗi ngày - Đạt chuẩn VietGAP</p>
                                            <span className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Lọc Trái Cây <i className="fa fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Banner 2: Đưa sang trang Gợi Ý Món Ngon & Lập Thực Đơn */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/goi-y-mon-an" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all" style={{ height: '360px' }}>
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
                                            <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-bold shadow-sm">
                                                ⭐ TÍNH NĂNG ĐỘC QUYỀN
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Gợi Ý Món Ngon Mỗi Ngày</h4>
                                            <p className="text-white-50 small mb-3">Lập thực đơn tự động theo tủ lạnh của bạn</p>
                                            <span className="btn btn-warning text-dark rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Khám Phá Ngay <i className="fa fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Banner 3: Lọc Rau Củ VietGAP */}
                        <div className="col-md-6 col-lg-4">
                            <Link to="/shop?category=Rau củ" className="text-decoration-none">
                                <div className="position-relative rounded-4 overflow-hidden shadow-sm hover-shadow-lg transition-all" style={{ height: '360px' }}>
                                    <img 
                                        src="/img/banner-veggie-fresh.png" 
                                        className="w-100 h-100 object-fit-cover transition-transform" 
                                        style={{ filter: 'brightness(0.9)' }}
                                        alt="Rau Củ Tươi Sạch" 
                                    />
                                    <div 
                                        className="position-absolute d-flex flex-column justify-content-between p-4"
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
                                            top: 0, bottom: 0, left: 0, right: 0
                                        }}
                                    >
                                        <div>
                                            <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold shadow-sm">
                                                🌱 100% ORGANIC
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1 fs-4">Rau Củ Quả VietGAP</h4>
                                            <p className="text-white-50 small mb-3">Tươi ngon thu hoạch trực tiếp từ trang trại</p>
                                            <span className="btn btn-light text-dark rounded-pill px-4 py-2 fw-bold small d-inline-flex align-items-center gap-2 shadow-sm">
                                                Mua Rau Củ <i className="fa fa-arrow-right"></i>
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

            {/* Vesitable Shop Start (Rau củ tươi) */}
            <div className="container-fluid vesitable py-5">
                <div className="container py-5">
                    <h1 className="mb-4">Rau Củ &amp; Nông Sản Tươi Sạch</h1>
                    <div className="row g-4" id="vegetables-container">
                        {displayVegs.map(p => (
                            <ProductCard key={p.id} p={p} compact />
                        ))}
                    </div>
                </div>
            </div>
            {/* Vesitable Shop End */}

            {/* Banner Section Start */}
            <div className="container-fluid banner bg-secondary my-5">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="py-4">
                                <h1 className="display-3 text-white">Nông Sản Hữu Cơ Tươi</h1>
                                <p className="fw-normal display-3 text-dark mb-4">Mới Nhập Mỗi Ngày</p>
                                <p className="mb-4 text-dark">Cam kết sản phẩm đạt tiêu chuẩn VietGAP, an toàn cho sức khỏe gia đình bạn với mức giá ưu đãi nhất.</p>
                                <Link to="/shop?category=Trái cây" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5 fw-bold">MUA NGAY</Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <img src="/img/baner-1.png" className="img-fluid w-100 rounded" alt="Banner" />
                                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute" style={{ width: 140, height: 140, top: 0, left: 0 }}>
                                    <h1 style={{ fontSize: 80 }} className="mb-0">1</h1>
                                    <div className="d-flex flex-column">
                                        <span className="h3 mb-0">KG</span>
                                        <span className="h5 text-muted mb-0">GIÁ TỐT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Banner Section End */}

            {/* Bestseller Product Start */}
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
                        <h1 className="display-4">Sản Phẩm Bán Chạy</h1>
                        <p>Những mặt hàng đạt chất lượng cao được ưa chuộng nhất tuần qua.</p>
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
                    <div className="bg-light p-5 rounded">
                        <div className="row g-4 justify-content-center">
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5 text-center">
                                    <i className="fa fa-users fa-3x text-secondary mb-3"></i>
                                    <h5 className="text-muted">Khách Hàng Năng Động</h5>
                                    <h1>{esc(products.length)}</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5 text-center">
                                    <i className="fa fa-check-circle fa-3x text-secondary mb-3"></i>
                                    <h5 className="text-muted">Đánh Giá Hài Lòng</h5>
                                    <h1>99%</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5 text-center">
                                    <i className="fa fa-award fa-3x text-secondary mb-3"></i>
                                    <h5 className="text-muted">Chứng Nhận VietGAP</h5>
                                    <h1>100%</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5 text-center">
                                    <i className="fa fa-box fa-3x text-secondary mb-3"></i>
                                    <h5 className="text-muted">Sản Phẩm Trong Kho</h5>
                                    <h1>{esc(products.length)}</h1>
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
                        <span className="badge badge-soft-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-2 shadow-sm">
                            <i className="fas fa-hat-chef me-1"></i> Gợi Ý Món Ngon Hàng Ngày
                        </span>
                        <h1 className="display-6 fw-bold text-dark mb-2">Hôm Nay Bạn Muốn Nấu Món Gì?</h1>
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
                        <Link to="/recipes" className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                            <i className="fas fa-layer-group"></i> Khám Phá Toàn Bộ {dishes.length || 52}+ Món Ăn & Lên Thực Đơn
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
                    onClose={() => setSelectedDish(null)}
                />
            )}
        </>
    );
}
