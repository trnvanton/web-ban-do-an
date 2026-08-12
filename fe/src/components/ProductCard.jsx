import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ p, compact = false }) {
    const { items, addItem } = useCart();
    const [cardQty, setCardQty] = useState(1);
    const stock = Number(p.so_luong_ton) || 0;
    const isOutOfStock = stock <= 0;
    const to = `/san-pham/${p.id}`;

    const handleAddToCart = (e) => {
        e.preventDefault();
        const existingInCart = items.find(i => i.id === p.id)?.quantity || 0;
        if (existingInCart + cardQty > stock) {
            alert(`⚠️ Không thể thêm! Trong kho chỉ còn ${stock} sản phẩm (Bạn đã có ${existingInCart} trong giỏ).`);
            return;
        }
        addItem(p, cardQty);
        alert(`✅ Đã thêm ${cardQty} x "${p.ten_san_pham}" vào giỏ hàng!`);
    };

    const cardBody = (
        <div className="bg-white rounded-4 shadow-sm border border-light p-3 h-100 d-flex flex-column justify-content-between transition-all card-product-hover">
            <div>
                {/* Khối Ảnh Sản Phẩm */}
                <div className="bg-light rounded-3 p-3 mb-3 position-relative text-center overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '170px' }}>
                    <Link to={to} className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <img
                            src={imgUrl(p.hinh_anh)}
                            className="img-fluid rounded transition-transform img-hover-zoom"
                            style={{ maxHeight: '150px', objectFit: 'contain' }}
                            alt={p.ten_san_pham}
                        />
                    </Link>
                    {/* Badge Danh Mục */}
                    <span 
                        className="badge bg-warning text-dark position-absolute shadow-sm fw-bold px-2 py-1"
                        style={{ top: '10px', left: '10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                        {esc(p.danh_muc || 'Nông sản')}
                    </span>
                    {/* Badge Tồn Kho */}
                    <span 
                        className={`badge position-absolute shadow-sm fw-bold px-2 py-1 ${isOutOfStock ? 'bg-danger text-white' : 'bg-success text-white'}`}
                        style={{ top: '10px', right: '10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                        {isOutOfStock ? 'Hết hàng' : `Kho: ${stock}`}
                    </span>
                </div>

                {/* Tên & Mô Tả */}
                <h6 className="fw-bold mb-1 text-start" style={{ lineHeight: '1.4', height: '2.8em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    <Link to={to} className="text-dark text-decoration-none hover-primary" title={p.ten_san_pham}>
                        {esc(p.ten_san_pham)}
                    </Link>
                </h6>
                <p 
                    className="text-muted small mb-2 text-start" 
                    style={{ fontSize: '12.5px', height: '2.5em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                    {esc(p.mo_ta || 'Nông sản hữu cơ tươi sạch chất lượng cao.')}
                </p>
            </div>

            {/* Khối Giá & Nút Thao Tác */}
            <div className="pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success fw-bold fs-5 mb-0">{fmtVND(p.gia)}</span>
                </div>

                {isOutOfStock ? (
                    <button className="btn btn-light border text-muted w-100 rounded-pill btn-sm" disabled>
                        <i className="fa fa-ban me-1 text-danger"></i> Tạm hết hàng
                    </button>
                ) : (
                    <div className="d-flex align-items-center justify-content-between gap-1">
                        {/* Bộ tăng giảm số lượng */}
                        <div className="input-group input-group-sm rounded-pill overflow-hidden border" style={{ width: '85px' }}>
                            <button 
                                className="btn btn-light px-2 py-0 border-0" 
                                type="button" 
                                onClick={() => setCardQty(q => Math.max(1, q - 1))}
                            >-</button>
                            <input 
                                type="text" 
                                className="form-control text-center px-0 fw-bold border-0 bg-white" 
                                value={cardQty} 
                                readOnly 
                                style={{ fontSize: '13px' }}
                            />
                            <button 
                                className="btn btn-light px-2 py-0 border-0" 
                                type="button" 
                                onClick={() => setCardQty(q => Math.min(q + 1, stock))}
                            >+</button>
                        </div>

                        {/* Nút Thêm vào giỏ */}
                        <button 
                            type="button"
                            className="btn btn-primary btn-sm rounded-pill px-3 fw-bold text-white shadow-sm d-flex align-items-center gap-1"
                            onClick={handleAddToCart}
                        >
                            <i className="fa fa-shopping-bag small"></i> Thêm giỏ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (compact) {
        return (
            <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
                {cardBody}
            </div>
        );
    }

    return cardBody;
}
