import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

export default function ShopDetail() {
    const { id } = useParams();
    const { items, addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelated([]);
        setQty(1);

        (async () => {
            try {
                const p = await api.get('/api/san-pham/' + id);
                if (!mounted) return;
                setProduct(p);

                try {
                    const all = await api.get('/api/san-pham');
                    if (!mounted) return;
                    const arr = Array.isArray(all) ? all : [];
                    setRelated(arr.filter(x => x.danh_muc === p.danh_muc && x.id !== p.id).slice(0, 4));
                } catch (e) {
                    // Lỗi tải sản phẩm liên quan không làm hỏng trang
                }
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    const stock = Number(product && product.so_luong_ton) || 0;
    const isOutOfStock = stock <= 0;
    const inCartQty = items.find(i => i.id === (product && product.id))?.quantity || 0;

    const minus = () => setQty(q => Math.max(1, q - 1));

    const plus = () => {
        if (qty + 1 > stock) {
            alert(`⚠️ Trong kho chỉ còn ${stock} sản phẩm!`);
            return;
        }
        setQty(q => Math.min(q + 1, stock));
    };

    const handleAddToCart = () => {
        if (inCartQty + qty > stock) {
            alert(`⚠️ Trong kho chỉ còn ${stock} sản phẩm!`);
            return;
        }
        addItem(product, qty);
        alert(`✅ Đã thêm ${qty} "${product.ten_san_pham}" vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <>
                <div className="container-fluid page-header py-5">
                    <h1 className="text-center text-white display-6">Chi Tiết Sản Phẩm</h1>
                </div>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5 text-center">
                    <h3 className="text-danger mb-3">Không tải được sản phẩm</h3>
                    <p className="text-muted mb-4">{esc(error)}</p>
                    <Link to="/shop" className="btn btn-primary rounded-pill px-4 py-2">
                        <i className="fa fa-arrow-left me-2"></i>Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Single Page Header start */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">{esc(product.ten_san_pham)}</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active text-white">{esc(product.ten_san_pham)}</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Single Product Start */}
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        {/* Hình ảnh sản phẩm */}
                        <div className="col-lg-6">
                            <div className="border rounded p-2 text-center bg-white">
                                <img
                                    src={imgUrl(product.hinh_anh)}
                                    className="img-fluid rounded"
                                    alt={product.ten_san_pham}
                                    style={{ maxHeight: 380, objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="col-lg-6">
                            <h4 className="fw-bold mb-3">{esc(product.ten_san_pham)}</h4>
                            <p className="mb-3 text-muted">
                                Danh mục: <span className="badge bg-warning text-dark ms-1">{esc(product.danh_muc || 'Nông sản')}</span>
                            </p>
                            <h4 className="fw-bold mb-3 text-success">{fmtVND(product.gia)}</h4>

                            <div className="d-flex mb-3 text-warning">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <span className="text-muted ms-2 small">(5.0 Đánh giá)</span>
                            </div>

                            <p className="mb-3 text-secondary">
                                Tình trạng kho:&nbsp;
                                <strong className={isOutOfStock ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                    {isOutOfStock ? 'Hết hàng' : `Còn ${stock} sản phẩm trong kho`}
                                </strong>
                            </p>
                            <p className="mb-4 text-muted">{esc(product.mo_ta || 'Sản phẩm hữu cơ đạt chuẩn tươi sạch.')}</p>

                            {/* Bộ chọn số lượng mua */}
                            <div className="input-group quantity mb-4" style={{ width: 130 }}>
                                <div className="input-group-btn">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-minus rounded-circle bg-light border"
                                        id="qty-minus"
                                        onClick={minus}
                                        disabled={isOutOfStock}
                                    >
                                        <i className="fa fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" className="form-control form-control-sm text-center border-0 fw-bold" value={qty} readOnly />
                                <div className="input-group-btn">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-plus rounded-circle bg-light border"
                                        id="qty-plus"
                                        onClick={plus}
                                        disabled={isOutOfStock}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            {isOutOfStock ? (
                                <button className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-muted" disabled>
                                    <i className="fa fa-ban me-2 text-danger"></i> Hết hàng
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary fw-bold"
                                    onClick={handleAddToCart}
                                >
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sản phẩm liên quan */}
                    {related.length > 0 && (
                        <>
                            <h2 className="fw-bold mb-4">Sản Phẩm Tương Tự</h2>
                            <div className="row g-4">
                                {related.map(p => (
                                    <ProductCard key={p.id} p={p} compact />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Single Product End */}
        </>
    );
}
