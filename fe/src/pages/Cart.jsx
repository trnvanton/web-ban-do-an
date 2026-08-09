import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { imgUrl, esc, fmtVND } from '../utils/img';

export default function Cart() {
    const { items, setQty, removeItem, total, count } = useCart();

    const changeQty = (item, delta) => {
        const next = item.quantity + delta;
        const max = item.stock || 9999;
        if (next > max) {
            alert(`⚠️ Trong kho chỉ còn ${item.stock} sản phẩm!`);
            return;
        }
        if (next < 1) return;
        setQty(item.id, next);
    };

    const onRemove = item => {
        if (confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
            removeItem(item.id);
        }
    };

    return (
        <>
            {/* Single Page Header start */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Giỏ Hàng</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                    <li className="breadcrumb-item active text-white">Giỏ hàng</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Cart Page Start */}
            <div className="container-fluid py-5">
                <div className="container py-5">
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fa fa-shopping-basket fa-4x text-muted mb-4"></i>
                            <h3 className="fw-bold">Giỏ hàng của bạn đang trống</h3>
                            <p className="text-muted mb-4">Hãy chọn thêm sản phẩm tươi ngon trước khi tiến hành thanh toán nhé.</p>
                            <Link to="/shop" className="btn btn-primary text-white rounded-pill px-5 py-3 fw-bold">
                                <i className="fa fa-arrow-left me-2"></i> Tiếp tục mua sắm
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Hình ảnh</th>
                                            <th scope="col">Tên sản phẩm</th>
                                            <th scope="col">Giá bán</th>
                                            <th scope="col">Số lượng</th>
                                            <th scope="col">Thành tiền</th>
                                            <th scope="col">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.id}>
                                                <th scope="row">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={imgUrl(item.image)}
                                                            className="img-fluid rounded"
                                                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                                            alt={esc(item.name)}
                                                        />
                                                    </div>
                                                </th>
                                                <td>
                                                    <p className="mb-0 mt-4 fw-bold">{esc(item.name)}</p>
                                                </td>
                                                <td>
                                                    <p className="mb-0 mt-4">{fmtVND(item.price)}</p>
                                                </td>
                                                <td>
                                                    <div className="input-group quantity mt-4" style={{ width: '120px' }}>
                                                        <div className="input-group-btn">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-minus rounded-circle bg-light border"
                                                                onClick={() => changeQty(item, -1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm text-center border-0 fw-bold"
                                                            value={item.quantity}
                                                            readOnly
                                                        />
                                                        <div className="input-group-btn">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-plus rounded-circle bg-light border"
                                                                onClick={() => changeQty(item, 1)}
                                                                disabled={item.stock && item.quantity >= item.stock}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className="mb-0 mt-4 fw-bold text-success">{fmtVND(item.price * item.quantity)}</p>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-md rounded-circle bg-light border mt-4"
                                                        onClick={() => onRemove(item)}
                                                    >
                                                        <i className="fa fa-trash text-danger"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Khung tính tổng tiền */}
                            <div className="row g-4 justify-content-end mt-4">
                                <div className="col-8"></div>
                                <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                                    <div className="bg-light rounded p-4">
                                        <h1 className="display-6 mb-4">Tổng <span className="fw-normal">đơn hàng</span></h1>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h5 className="mb-0 me-4">Tạm tính:</h5>
                                            <p className="mb-0 fw-bold text-dark" id="cart-subtotal">{fmtVND(total)}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h5 className="mb-0 me-4">Phí vận chuyển:</h5>
                                            <p className="mb-0 text-success fw-bold" id="shipping-fee">Miễn phí</p>
                                        </div>
                                        <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                                            <h5 className="mb-0 me-4">Tổng cộng:</h5>
                                            <p className="mb-0 pe-2 fs-4 fw-bold text-success" id="cart-total">{fmtVND(total)}</p>
                                        </div>
                                        <div className="d-flex flex-column gap-2">
                                            <Link to="/thanh-toan" className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase w-100 fw-bold">
                                                <i className="fa fa-credit-card me-2"></i> Tiến hành đặt hàng
                                            </Link>
                                            <Link to="/shop" className="btn btn-light border rounded-pill px-4 py-3 text-dark w-100 fw-bold">
                                                <i className="fa fa-arrow-left me-2"></i> Tiếp tục mua sắm
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Cart Page End */}
        </>
    );
}
