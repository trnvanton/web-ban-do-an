import { Link } from 'react-router-dom';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { useCart } from '../contexts/CartContext';

// Card sản phẩm dùng chung (giữ đúng giao diện card của template Fruitables)
export default function ProductCard({ p, compact = false }) {
    const { addItem } = useCart();
    const isOutOfStock = Number(p.so_luong_ton) <= 0;
    const to = `/san-pham/${p.id}`;

    if (compact) {
        return (
            <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="border border-primary rounded position-relative vesitable-item h-100 p-3 d-flex flex-column justify-content-between">
                    <div>
                        <div className="vesitable-img mb-3">
                            <Link to={to}>
                                <img src={imgUrl(p.hinh_anh)} className="img-fluid w-100 rounded-top" style={{ height: 160, objectFit: 'cover' }} alt={p.ten_san_pham} />
                            </Link>
                            <div className="text-white bg-warning px-3 py-1 rounded-pill position-absolute" style={{ top: 10, right: 10, fontSize: 12, fontWeight: 600 }}>
                                {esc(p.danh_muc || 'Nông sản')}
                            </div>
                        </div>
                        <h4 className="fs-6 fw-bold mb-2 text-start text-truncate">
                            <Link to={to} className="text-dark text-decoration-none" title={p.ten_san_pham}>{esc(p.ten_san_pham)}</Link>
                        </h4>
                        <p className="text-muted small mb-2 text-start product-desc-short">{esc(p.mo_ta || 'Sản phẩm tươi sạch chất lượng cao.')}</p>
                        <p className="text-secondary small mb-3 text-start">Còn kho: <strong className={isOutOfStock ? 'text-danger' : 'text-success'}>{esc(p.so_luong_ton)}</strong></p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-lg-wrap pt-2 border-top">
                        <span className="text-dark fs-5 fw-bold mb-0">{fmtVND(p.gia)}</span>
                        {isOutOfStock ? (
                            <button className="btn border border-secondary rounded-pill px-3 text-muted" disabled><i className="fa fa-ban me-1 text-danger"></i>Hết hàng</button>
                        ) : (
                            <button className="btn border border-primary rounded-pill px-3 text-primary" onClick={() => addItem(p)}><i className="fa fa-shopping-bag me-1 text-primary"></i>Thêm giỏ</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded position-relative fruite-item border border-secondary p-3 h-100 d-flex flex-column justify-content-between">
            <div>
                <div className="fruite-img mb-3 position-relative text-center">
                    <Link to={to}>
                        <img src={imgUrl(p.hinh_anh)} className="img-fluid rounded-top" style={{ height: 160, objectFit: 'contain', cursor: 'pointer' }} alt={p.ten_san_pham} />
                    </Link>
                    <div className="text-white bg-warning px-3 py-1 rounded-pill position-absolute" style={{ top: 0, left: 0, fontSize: 12, fontWeight: 600 }}>
                        {esc(p.danh_muc || 'Nông sản')}
                    </div>
                </div>
                <h4 className="fs-6 fw-bold mb-2 text-start text-truncate">
                    <Link to={to} className="text-dark text-decoration-none" title={p.ten_san_pham}>{esc(p.ten_san_pham)}</Link>
                </h4>
                <p className="text-muted small mb-2 text-start product-desc-short">{esc(p.mo_ta || 'Sản phẩm tươi sạch chất lượng cao.')}</p>
                <p className="text-secondary small mb-3 text-start">Còn kho: <strong className={isOutOfStock ? 'text-danger' : 'text-success'}>{esc(p.so_luong_ton)}</strong></p>
            </div>
            <div className="d-flex justify-content-between align-items-center flex-lg-wrap pt-2 border-top">
                <span className="text-dark fs-5 fw-bold mb-0">{fmtVND(p.gia)}</span>
                {isOutOfStock ? (
                    <button className="btn border border-secondary rounded-pill px-3 text-muted" disabled><i className="fa fa-ban me-1 text-danger"></i>Hết hàng</button>
                ) : (
                    <button className="btn border border-secondary rounded-pill px-3 text-primary" onClick={() => addItem(p)}><i className="fa fa-shopping-bag me-1 text-primary"></i>Thêm vào giỏ</button>
                )}
            </div>
        </div>
    );
}
