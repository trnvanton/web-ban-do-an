import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { useCart } from '../contexts/CartContext';

export default function Checkout() {
    const { items, total, clear } = useCart();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({ ho_ten: '', sdt: '', dia_chi: '' });
    const [saveNew, setSaveNew] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'BANK_QR'
    const [qrModalData, setQrModalData] = useState(null);

    useEffect(() => {
        let mounted = true;
        api.get('/api/user/dia-chi')
            .then(list => {
                if (!mounted) return;
                const arr = Array.isArray(list) ? list : [];
                setAddresses(arr);
                const def = arr.find(a => a.mac_dinh) || arr[0];
                if (def) {
                    setForm({ ho_ten: def.ho_ten, sdt: def.sdt, dia_chi: def.dia_chi });
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

    const useAddress = a => {
        setForm({ ho_ten: a.ho_ten, sdt: a.sdt, dia_chi: a.dia_chi });
    };

    const finishOrder = () => {
        if (qrModalData) {
            alert(`🎉 Shop đã ghi nhận yêu cầu thanh toán cho đơn hàng #${qrModalData.orderId}! Vui lòng chờ Shop kiểm tra tài khoản và xử lý đơn hàng.`);
        }
        setQrModalData(null);
        clear();
        navigate('/don-hang');
    };

    const onSubmit = async e => {
        e.preventDefault();
        const ho_ten = form.ho_ten.trim();
        const sdt = form.sdt.trim();
        const dia_chi = form.dia_chi.trim();

        if (!ho_ten || !sdt || !dia_chi) {
            alert('⚠️ Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
            return;
        }
        if (items.length === 0) {
            alert('⚠️ Giỏ hàng trống!');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/api/don-hang', {
                ho_ten,
                sdt,
                dia_chi,
                tong_tien: total,
                chi_tiet: items,
                phuong_thuc_thanh_toan: paymentMethod
            });
            if (saveNew) {
                api.post('/api/user/dia-chi', { user_id: null, ho_ten, sdt, dia_chi, mac_dinh: 0 }).catch(() => {});
            }

            const orderId = res?.data?.id || res?.id || Math.floor(Date.now() / 1000);

            if (paymentMethod === 'BANK_QR') {
                setQrModalData({
                    orderId,
                    total
                });
            } else {
                alert('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
                clear();
                navigate('/don-hang');
            }
        } catch (err) {
            alert('❌ Có lỗi xảy ra khi đặt hàng: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Single Page Header start */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Thanh Toán</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/gio-hang">Giỏ hàng</Link></li>
                    <li className="breadcrumb-item active text-white">Thanh toán</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Checkout Page Start */}
            <div className="container-fluid py-5">
                <div className="container py-5">
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fa fa-shopping-bag fa-4x text-muted mb-4"></i>
                            <h3 className="fw-bold">Giỏ hàng của bạn đang trống!</h3>
                            <p className="text-muted mb-4">Hãy chọn thêm sản phẩm tươi ngon trước khi tiến hành thanh toán nhé.</p>
                            <Link to="/shop" className="btn btn-primary text-white rounded-pill px-5 py-3 fw-bold">
                                <i className="fa fa-arrow-left me-2"></i> Quay lại Cửa hàng
                            </Link>
                        </div>
                    ) : (
                        <form id="checkout-form" onSubmit={onSubmit}>
                            <h1 className="mb-4 fw-bold">Thông Tin Thanh Toán & Giao Hàng</h1>
                            <div className="row g-5">
                                {/* Bên trái: Form thông tin người nhận */}
                                <div className="col-md-12 col-lg-6 col-xl-7">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold mb-0">Địa Chỉ Nhận Hàng</h4>
                                    </div>

                                    {/* Sổ địa chỉ đã lưu */}
                                    {addresses.length > 0 && (
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-2">Địa chỉ đã lưu:</h6>
                                            <div className="d-flex flex-column gap-2">
                                                {addresses.map(a => (
                                                    <div
                                                        key={a.id}
                                                        className="border rounded p-3 bg-light d-flex justify-content-between align-items-center"
                                                    >
                                                        <div>
                                                            <h6 className="fw-bold mb-1">
                                                                {esc(a.ho_ten)} ({esc(a.sdt)}){' '}
                                                                {a.mac_dinh ? <span className="badge bg-success ms-1">Mặc định</span> : null}
                                                            </h6>
                                                            <p className="mb-0 text-muted small">{esc(a.dia_chi)}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success rounded-pill px-3"
                                                            onClick={() => useAddress(a)}
                                                        >
                                                            Sử dụng
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-item mb-3">
                                        <label className="form-label fw-bold" htmlFor="checkout-name">Họ và tên người nhận <sup>*</sup></label>
                                        <input type="text" id="checkout-name" className="form-control" required placeholder="Nhập họ và tên..." value={form.ho_ten} onChange={set('ho_ten')} />
                                    </div>

                                    <div className="form-item mb-3">
                                        <label className="form-label fw-bold" htmlFor="checkout-phone">Số điện thoại <sup>*</sup></label>
                                        <input type="tel" id="checkout-phone" className="form-control" required placeholder="Nhập số điện thoại..." value={form.sdt} onChange={set('sdt')} />
                                    </div>

                                    <div className="form-item mb-3">
                                        <label className="form-label fw-bold" htmlFor="checkout-address">Địa chỉ nhận hàng chi tiết <sup>*</sup></label>
                                        <textarea id="checkout-address" className="form-control" rows="3" required placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..." value={form.dia_chi} onChange={set('dia_chi')}></textarea>
                                    </div>

                                    <div className="form-check mb-3">
                                        <input type="checkbox" className="form-check-input" id="save-address" checked={saveNew} onChange={e => setSaveNew(e.target.checked)} />
                                        <label className="form-check-label fw-bold" htmlFor="save-address">
                                            Lưu địa chỉ mới vào sổ
                                        </label>
                                    </div>
                                </div>

                                {/* Bên phải: Tóm tắt đơn hàng */}
                                <div className="col-md-12 col-lg-6 col-xl-5">
                                    <div className="p-4 rounded bg-light border">
                                        <h4 className="fw-bold mb-4">Đơn Hàng Của Bạn</h4>
                                        <div className="table-responsive mb-3">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Sản phẩm</th>
                                                        <th scope="col">Tên</th>
                                                        <th scope="col">Đơn giá</th>
                                                        <th scope="col">SL</th>
                                                        <th scope="col">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="checkout-cart-items">
                                                    {items.map(item => (
                                                        <tr key={item.id}>
                                                            <th scope="row">
                                                                <img
                                                                    src={imgUrl(item.image)}
                                                                    className="img-fluid rounded-circle"
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    alt={esc(item.name)}
                                                                />
                                                            </th>
                                                            <td className="py-3 text-truncate" style={{ maxWidth: '120px' }}>{esc(item.name)}</td>
                                                            <td className="py-3">{fmtVND(item.price)}</td>
                                                            <td className="py-3 text-center">{item.quantity}</td>
                                                            <td className="py-3 fw-bold">{fmtVND(item.price * item.quantity)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Phương thức thanh toán */}
                                        <div className="mb-4">
                                            <h5 className="fw-bold mb-3"><i className="fa fa-credit-card me-2 text-primary"></i>Phương Thức Thanh Toán</h5>
                                            <div className="form-check mb-2 p-3 border rounded bg-white cursor-pointer" onClick={() => setPaymentMethod('COD')}>
                                                <input 
                                                    className="form-check-input ms-0 me-2" 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    id="pm-cod" 
                                                    checked={paymentMethod === 'COD'} 
                                                    onChange={() => setPaymentMethod('COD')} 
                                                />
                                                <label className="form-check-label fw-bold cursor-pointer" htmlFor="pm-cod">
                                                    💵 Thanh toán khi nhận hàng (COD)
                                                </label>
                                                <p className="text-muted small mb-0 mt-1">Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận hàng.</p>
                                            </div>

                                            <div className="form-check p-3 border rounded bg-white cursor-pointer" onClick={() => setPaymentMethod('BANK_QR')}>
                                                <input 
                                                    className="form-check-input ms-0 me-2" 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    id="pm-qr" 
                                                    checked={paymentMethod === 'BANK_QR'} 
                                                    onChange={() => setPaymentMethod('BANK_QR')} 
                                                />
                                                <label className="form-check-label fw-bold cursor-pointer" htmlFor="pm-qr">
                                                    📲 Chuyển khoản VietQR / Ví MoMo
                                                </label>
                                                <p className="text-muted small mb-0 mt-1">Quét mã QR bằng App Ngân hàng hoặc MoMo để chuyển khoản nhanh.</p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary py-3 px-4 text-uppercase w-100 text-white fw-bold shadow mt-2"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Đang xử lý...' : paymentMethod === 'BANK_QR' ? 'Đặt Hàng & Thanh Toán QR' : 'Xác Nhận Đặt Hàng'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {/* Checkout Page End */}

            {/* Modal Thanh toán VietQR */}
            {qrModalData && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold text-white mb-0">
                                    <i className="fa fa-qrcode me-2"></i>Thanh Toán Đơn Hàng #{qrModalData.orderId}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={finishOrder}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <div className="alert alert-success fw-bold py-2 mb-3">
                                    🎉 Đặt hàng thành công! Vui lòng quét mã QR bên dưới để hoàn tất thanh toán.
                                </div>
                                <div className="row align-items-center g-4">
                                    <div className="col-md-6">
                                        <div className="p-3 border rounded-3 bg-light d-inline-block shadow-sm">
                                            <img 
                                                src={`https://img.vietqr.io/image/TCB-9974838304-compact2.png?amount=${qrModalData.total}&addInfo=FRUITE${qrModalData.orderId}&accountName=TRINH%20VAN%20TOAN`} 
                                                className="img-fluid rounded" 
                                                alt="Mã VietQR Thanh Toán"
                                                style={{ maxHeight: 280 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-start">
                                        <h6 className="fw-bold text-primary mb-3">Thông Tin Chuyển Khoản:</h6>
                                        <div className="mb-2">
                                            <span className="text-muted">Ngân hàng:</span> <strong className="text-dark">Techcombank (NH Kỹ Thương)</strong>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Số tài khoản:</span> <strong className="text-danger fs-5 ms-1">9974838304</strong>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Chủ tài khoản:</span> <strong className="text-dark">TRINH VAN TOAN</strong>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Số tiền:</span> <strong className="text-success fs-5 ms-1">{fmtVND(qrModalData.total)}</strong>
                                        </div>
                                        <div className="mb-3">
                                            <span className="text-muted">Nội dung CK:</span> <strong className="bg-warning text-dark px-2 py-1 rounded ms-1">FRUITE{qrModalData.orderId}</strong>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            <i className="fa fa-info-circle me-1 text-primary"></i>
                                            Hệ thống sẽ tự động cập nhật đơn hàng sau khi nhận được tiền chuyển khoản.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light py-3">
                                <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" onClick={finishOrder}>
                                    <i className="fa fa-paper-plane me-1"></i> Tôi Đã Hoàn Tất Chuyển Khoản (Chờ Shop Kiểm Tra)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
