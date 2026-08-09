import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { api } from '../api';
import { imgUrl, esc } from '../utils/img';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        Promise.all([api.get('/api/san-pham'), api.get('/api/mon-an')])
            .then(([prods, mons]) => {
                if (cancelled) return;
                setProducts(prods);
                setDishes(mons);
            })
            .catch(err => {
                if (!cancelled) setError((err && err.message) || 'Không thể tải dữ liệu, vui lòng thử lại.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const categories = ['Tất cả', ...new Set(products.map(p => p.danh_muc).filter(Boolean))];
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
                            <h4 className="mb-3 text-secondary">100% Thực Phẩm Hữu Cơ</h4>
                            <h1 className="mb-5 display-3 text-primary">Rau Củ &amp; Trái Cây Tươi Sạch VietGAP</h1>
                            <form className="position-relative mx-auto" onSubmit={handleSearch}>
                                <input
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                    type="text"
                                    placeholder="Tìm kiếm nông sản..."
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
                                        <Link to="/shop" className="btn px-4 py-2 text-white rounded">Trái cây</Link>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="/img/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded" alt="Rau củ tươi" />
                                        <Link to="/shop" className="btn px-4 py-2 text-white rounded">Rau củ</Link>
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
            <div className="container-fluid featurs py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Giao Hàng Miễn Phí</h5>
                                    <p className="mb-0">Miễn phí cho đơn hàng từ 300.000đ</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-user-shield fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Thanh Toán An Toàn</h5>
                                    <p className="mb-0">Bảo mật thông tin 100%</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-exchange-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Đổi Trả Dễ Dàng</h5>
                                    <p className="mb-0">Hoàn tiền trong 30 ngày nếu lỗi</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fa fa-phone-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Hỗ Trợ 24/7</h5>
                                    <p className="mb-0">Giải đáp thắc mắc nhanh chóng</p>
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
                    <div className="tab-class text-center">
                        <div className="row g-4 align-items-center mb-4">
                            <div className="col-lg-4 text-start">
                                <h1 className="mb-0 fw-bold">Sản Phẩm Hữu Cơ</h1>
                            </div>
                            <div className="col-lg-8 text-end">
                                <ul className="nav nav-pills d-inline-flex text-center" id="category-tabs">
                                    {categories.map(c => (
                                        <li className="nav-item" key={c}>
                                            <a
                                                className={`d-flex m-2 py-2 bg-light rounded-pill ${activeCategory === c ? 'active' : ''}`}
                                                onClick={() => setActiveCategory(c)}
                                            >
                                                <span className="text-dark" style={{ width: 130 }}>{esc(c)}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="product-slider-wrapper">
                            {filteredProducts.length === 0 ? (
                                <div className="w-100 text-center py-5">
                                    <p className="text-muted fs-5">Không có sản phẩm nào thuộc danh mục này.</p>
                                </div>
                            ) : (
                                <Swiper
                                    key={activeCategory}
                                    modules={[Navigation]}
                                    slidesPerView={1}
                                    spaceBetween={24}
                                    navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
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
                            <div className="swiper-button-prev"></div>
                            <div className="swiper-button-next"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fruits Shop End */}

            {/* Featurs Start (Dịch vụ / Ưu đãi) */}
            <div className="container-fluid service py-5">
                <div className="container py-5">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <Link to="/">
                                <div className="service-item bg-secondary rounded border border-secondary">
                                    <img src="/img/featur-1.jpg" className="img-fluid rounded-top w-100" alt="Táo tươi" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-primary text-center p-4 rounded">
                                            <h5 className="text-white">Táo Tươi Hữu Cơ</h5>
                                            <h3 className="mb-0">Giảm 20%</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <Link to="/">
                                <div className="service-item bg-dark rounded border border-dark">
                                    <img src="/img/featur-2.jpg" className="img-fluid rounded-top w-100" alt="Hoa quả tươi" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-light text-center p-4 rounded">
                                            <h5 className="text-primary">Trái Cây Tươi Ngon</h5>
                                            <h3 className="mb-0">Miễn phí giao hàng</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <Link to="/">
                                <div className="service-item bg-primary rounded border border-primary">
                                    <img src="/img/featur-3.jpg" className="img-fluid rounded-top w-100" alt="Rau củ" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-secondary text-center p-4 rounded">
                                            <h5 className="text-white">Rau Củ Tươi Sạch</h5>
                                            <h3 className="mb-0">Ưu đãi lớn</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Featurs End */}

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
                                <Link to="/shop" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5 fw-bold">MUA NGAY</Link>
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
            <div className="container-fluid testimonial py-5">
                <div className="container py-5">
                    <div className="testimonial-header text-center">
                        <h4 className="text-primary">Gợi Ý Món Ăn Ngon</h4>
                        <h1 className="display-5 mb-5 text-dark">Thực Đơn Chế Biến Hàng Ngày</h1>
                    </div>
                    <div className="row g-4" id="dishes-recommend-container">
                        {dishes.length === 0 ? (
                            <div className="col-12 text-center text-muted">
                                <p>Chưa có món ăn gợi ý nào trong hệ thống.</p>
                            </div>
                        ) : (
                            dishes.slice(0, 6).map(d => (
                                <div className="col-md-6 col-lg-4" key={d.id}>
                                    <div className="testimonial-item bg-light rounded p-4 border h-100 d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="d-flex align-items-center mb-3">
                                                <img
                                                    src={imgUrl(d.hinh_anh)}
                                                    className="img-fluid rounded-circle me-3"
                                                    style={{ width: 70, height: 70, objectFit: 'cover' }}
                                                    alt={d.ten_mon}
                                                />
                                                <div>
                                                    <h4 className="text-dark mb-1 fs-5 fw-bold">{esc(d.ten_mon)}</h4>
                                                    <span className="text-muted small">{esc(d.nguyen_lieu_chinh)}</span>
                                                    {d.loai_mon && (
                                                        <div>
                                                            <span className="badge bg-warning text-dark mt-1">{esc(d.loai_mon)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-muted small mb-0"><strong>Công thức:</strong> {esc(d.cong_thuc || 'Chưa cập nhật chi tiết cách làm.')}</p>
                                        </div>
                                        <div className="text-start mt-3">
                                            <Link to="/goi-y-mon-an" className="btn btn-primary rounded-pill px-4 py-2">Xem</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {/* Testimonial End */}
        </>
    );
}
