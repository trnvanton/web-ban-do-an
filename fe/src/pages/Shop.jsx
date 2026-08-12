import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { esc } from '../utils/img';
import ProductCard from '../components/ProductCard';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
    const [priceRange, setPriceRange] = useState('all'); // 'all', 'under-30', '30-60', 'above-60'
    const [searchParams, setSearchParams] = useSearchParams();
    
    const keyword = (searchParams.get('q') || '').trim();
    const urlCategory = searchParams.get('category') || 'Tất cả';
    const [category, setCategory] = useState(urlCategory);

    useEffect(() => {
        const catFromUrl = searchParams.get('category');
        if (catFromUrl) {
            setCategory(catFromUrl);
        } else if (!searchParams.has('category')) {
            setCategory('Tất cả');
        }
    }, [searchParams]);

    const handleCategoryClick = (c) => {
        setCategory(c);
        const nextParams = {};
        if (keyword) nextParams.q = keyword;
        if (c !== 'Tất cả') nextParams.category = c;
        setSearchParams(nextParams);
    };

    useEffect(() => {
        let mounted = true;
        api.get('/api/san-pham')
            .then(data => {
                if (mounted) setProducts(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                if (mounted) setError(err.message);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    const categories = useMemo(
        () => ['Tất cả', ...new Set(products.map(p => p.danh_muc).filter(Boolean))],
        [products]
    );

    const list = useMemo(() => {
        const q = keyword.toLowerCase();
        let filtered = products.filter(p => {
            const matchCat = category === 'Tất cả' || p.danh_muc === category;
            const matchKw = q === '' || (p.ten_san_pham || '').toLowerCase().includes(q);
            const price = Number(p.gia) || 0;
            
            let matchPrice = true;
            if (priceRange === 'under-30') matchPrice = price < 30000;
            else if (priceRange === '30-60') matchPrice = price >= 30000 && price <= 60000;
            else if (priceRange === 'above-60') matchPrice = price > 60000;

            return matchCat && matchKw && matchPrice;
        });

        // Sắp xếp
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => Number(a.gia) - Number(b.gia));
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => Number(b.gia) - Number(a.gia));
        } else {
            filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    }, [products, category, keyword, sortBy, priceRange]);

    const onSearch = e => {
        const q = e.target.value.trim();
        setSearchParams(q ? { q } : {}, { replace: true });
    };

    return (
        <>
            {/* Single Page Header start */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Cửa Hàng Nông Sản</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-white">Cửa hàng</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Fruits Shop Start */}
            <div className="container-fluid fruite py-5">
                <div className="container py-5">
                    <div className="row g-4 mb-4 align-items-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="input-group w-100 d-flex">
                                <input
                                    type="search"
                                    className="form-control p-3"
                                    placeholder="Nhập tên nông sản cần tìm..."
                                    value={keyword}
                                    onChange={onSearch}
                                />
                                <span className="input-group-text p-3 bg-primary text-white"><i className="fa fa-search"></i></span>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="d-flex align-items-center justify-content-md-end gap-2">
                                <label className="fw-bold mb-0 text-nowrap"><i className="fa fa-sort me-1 text-primary"></i>Sắp xếp:</label>
                                <select className="form-select w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá: Thấp đến Cao</option>
                                    <option value="price-desc">Giá: Cao đến Thấp</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-3 text-lg-end text-muted">
                            Hiển thị <strong className="text-primary fs-5">{list.length}</strong> sản phẩm
                        </div>
                    </div>

                    {/* Bộ lọc Danh mục & Khoảng giá */}
                    <div className="bg-light p-3 rounded mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="fw-bold me-2"><i className="fa fa-filter me-1 text-primary"></i>Danh mục:</span>
                            {categories.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 transition-all ${category === c ? 'btn-primary text-white shadow-sm fw-bold' : 'btn-white border text-dark'}`}
                                    onClick={() => handleCategoryClick(c)}
                                >
                                    {esc(c)}
                                </button>
                            ))}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-nowrap"><i className="fa fa-tag me-1 text-primary"></i>Mức giá:</span>
                            <select className="form-select form-select-sm w-auto" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                                <option value="all">Tất cả mức giá</option>
                                <option value="under-30">Dưới 30.000đ</option>
                                <option value="30-60">30.000đ - 60.000đ</option>
                                <option value="above-60">Trên 60.000đ</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <p className="text-danger fs-5">Lỗi tải sản phẩm: {esc(error)}</p>
                        </div>
                    ) : list.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted fs-5">Không tìm thấy sản phẩm nào.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {list.map(p => (
                                <div className="col-md-6 col-lg-4 col-xl-3" key={p.id}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Fruits Shop End */}
        </>
    );
}
