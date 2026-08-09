import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { esc } from '../utils/img';
import ProductCard from '../components/ProductCard';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('Tất cả');
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = (searchParams.get('q') || '').trim();

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
        return products.filter(p => {
            const matchCat = category === 'Tất cả' || p.danh_muc === category;
            const matchKw = q === '' || (p.ten_san_pham || '').toLowerCase().includes(q);
            return matchCat && matchKw;
        });
    }, [products, category, keyword]);

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
                    <h1 className="mb-4">Danh Sách Nông Sản Hữu Cơ</h1>

                    {/* Thanh tìm kiếm */}
                    <div className="row g-4 mb-4 align-items-center">
                        <div className="col-xl-6">
                            <div className="input-group w-100 mx-auto d-flex">
                                <input
                                    type="search"
                                    className="form-control p-3"
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    value={keyword}
                                    onChange={onSearch}
                                />
                                <span className="input-group-text p-3 bg-primary text-white"><i className="fa fa-search"></i></span>
                            </div>
                        </div>
                        <div className="col-xl-6 text-center text-muted">
                            Hiển thị <strong className="text-primary">{list.length}</strong> sản phẩm
                        </div>
                    </div>

                    {/* Bộ lọc danh mục */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                        <span className="fw-bold me-2">Danh Mục:</span>
                        {categories.map(c => (
                            <button
                                key={c}
                                type="button"
                                className={`btn btn-sm rounded-pill px-3 ${category === c ? 'btn-primary text-white' : 'btn-light border text-dark'}`}
                                onClick={() => setCategory(c)}
                            >
                                {esc(c)}
                            </button>
                        ))}
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
