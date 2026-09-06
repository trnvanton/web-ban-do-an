import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';

// Phát âm thanh chúc mừng thành công (Web Audio API - không phụ thuộc file ngoài)
function playSuccessChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.45);
        });
    } catch (e) {}
}

export default function Checkout() {
    const { items, total, clear } = useCart();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [form, setForm] = useState({ ho_ten: '', sdt: '', dia_chi: '' });
    const [saveNew, setSaveNew] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'BANK_QR'
    
    // QR Modal State
    const [qrModalData, setQrModalData] = useState(null);
    const [isPaidSuccess, setIsPaidSuccess] = useState(false);
    const [copiedField, setCopiedField] = useState('');
    const [mockTesting, setMockTesting] = useState(false);

    // SePay Config
    const [sepayConfig, setSepayConfig] = useState({
        bankCode: 'MB',
        accountNumber: '0974838034',
        accountName: 'TRINH VAN TOAN',
        prefix: 'FRUITE'
    });

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

        api.get('/api/sepay/config')
            .then(cfg => {
                if (mounted && cfg) {
                    setSepayConfig(cfg);
                }
            })
            .catch(() => {});

        return () => { mounted = false; };
    }, []);

    // Polling kiểm tra trạng thái thanh toán đơn hàng real-time từ SePay Webhook
    useEffect(() => {
        if (!qrModalData?.orderId || isPaidSuccess) return;
        let isPolling = true;

        const interval = setInterval(async () => {
            try {
                const res = await api.get(`/api/don-hang/${qrModalData.orderId}/trang-thai-thanh-toan`);
                if (isPolling && res && res.is_paid) {
                    clearInterval(interval);
                    setIsPaidSuccess(true);
                    playSuccessChime();
                    clear(); // Xóa giỏ hàng

                    // Tự động chuyển hướng đến trang đơn hàng sau 3.5 giây
                    setTimeout(() => {
                        navigate('/don-hang');
                    }, 3500);
                }
            } catch (err) {
                // Bỏ qua lỗi tạm thời khi polling
            }
        }, 2000);

        return () => {
            isPolling = false;
            clearInterval(interval);
        };
    }, [qrModalData, isPaidSuccess, clear, navigate]);

    const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

    const useAddress = a => {
        setForm({ ho_ten: a.ho_ten, sdt: a.sdt, dia_chi: a.dia_chi });
    };

    const copyToClipboard = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        });
    };

    const handleMockPayment = async () => {
        if (!qrModalData?.orderId) return;
        setMockTesting(true);
        try {
            await api.post('/api/sepay/mock-payment', { orderId: qrModalData.orderId });
        } catch (err) {
            alert('Lỗi giả lập: ' + err.message);
        } finally {
            setMockTesting(false);
        }
    };

    const closeModal = () => {
        setQrModalData(null);
        setIsPaidSuccess(false);
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

            const orderId = res?.data?.donHangId || res?.donHangId || res?.data?.id || res?.id;

            if (paymentMethod === 'BANK_QR') {
                setIsPaidSuccess(false);
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

    const transferContent = `${sepayConfig.prefix || 'FRUITE'}${qrModalData?.orderId || ''}`;
    const qrUrl = qrModalData
        ? `https://img.vietqr.io/image/${sepayConfig.bankCode || 'TCB'}-${sepayConfig.accountNumber || '9974838304'}-compact2.png?amount=${qrModalData.total}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(sepayConfig.accountName || 'TRINH VAN TOAN')}`
        : '';

    return (
        <>
            {/* Breadcrumb Header */}
            <div className="container-fluid page-header py-4">
                <h1 className="text-center text-white display-6 fw-bold">Thanh Toán Đơn Hàng</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/gio-hang" className="text-white opacity-75">Giỏ hàng</Link></li>
                    <li className="breadcrumb-item active text-white">Thanh toán</li>
                </ol>
            </div>

            {/* Checkout Page Start */}
            <div className="container-fluid py-5 bg-light">
                <div className="container py-3">
                    {items.length === 0 ? (
                        <div className="card shadow-sm border-0 rounded-4 text-center py-5 px-3 mx-auto" style={{ maxWidth: 500 }}>
                            <i className="fas fa-cart-shopping fa-4x text-muted mb-4"></i>
                            <h4 className="fw-bold">Giỏ hàng của bạn đang trống!</h4>
                            <p className="text-muted mb-4">Hãy chọn thêm sản phẩm tươi ngon trước khi tiến hành thanh toán nhé.</p>
                            <Link to="/shop" className="btn btn-success text-white rounded-pill px-4 py-2 fw-bold">
                                <i className="fas fa-arrow-left me-2"></i> Quay lại Thực đơn
                            </Link>
                        </div>
                    ) : (
                        <form id="checkout-form" onSubmit={onSubmit}>
                            <div className="row g-5">
                                {/* Bên trái: Form thông tin người nhận */}
                                <div className="col-md-12 col-lg-6 col-xl-7">
                                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
                                        <h4 className="fw-bold mb-3 text-dark">
                                            <i className="fas fa-location-dot text-success me-2"></i> Địa Chỉ Nhận Hàng
                                        </h4>

                                        {/* Sổ địa chỉ đã lưu */}
                                        {addresses.length > 0 && (
                                            <div className="mb-4">
                                                <label className="fw-bold text-muted small text-uppercase mb-2">Chọn nhanh địa chỉ đã lưu:</label>
                                                <div className="d-flex flex-column gap-2">
                                                    {addresses.map(a => (
                                                        <div
                                                            key={a.id}
                                                            className="border rounded-3 p-3 bg-light d-flex justify-content-between align-items-center"
                                                        >
                                                            <div>
                                                                <h6 className="fw-bold mb-1 text-dark">
                                                                    {esc(a.ho_ten)} - <span className="text-success">{esc(a.sdt)}</span>{' '}
                                                                    {a.mac_dinh ? <span className="badge bg-success ms-1">Mặc định</span> : null}
                                                                </h6>
                                                                <p className="mb-0 text-muted small">{esc(a.dia_chi)}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold"
                                                                onClick={() => useAddress(a)}
                                                            >
                                                                Sử dụng
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted" htmlFor="checkout-name">
                                                Họ và tên người nhận <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="checkout-name"
                                                className="form-control rounded-3 py-2"
                                                required
                                                placeholder="Ví dụ: Nguyễn Văn A"
                                                value={form.ho_ten}
                                                onChange={set('ho_ten')}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted" htmlFor="checkout-phone">
                                                Số điện thoại liên hệ <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="checkout-phone"
                                                className="form-control rounded-3 py-2"
                                                required
                                                placeholder="Ví dụ: 0987654321"
                                                value={form.sdt}
                                                onChange={set('sdt')}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted" htmlFor="checkout-address">
                                                Địa chỉ giao hàng chi tiết <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                id="checkout-address"
                                                className="form-control rounded-3 py-2"
                                                rows="3"
                                                required
                                                placeholder="Số nhà, ngõ ngách, tên đường, phường/xã, quận/huyện..."
                                                value={form.dia_chi}
                                                onChange={set('dia_chi')}
                                            ></textarea>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="save-address"
                                                checked={saveNew}
                                                onChange={e => setSaveNew(e.target.checked)}
                                            />
                                            <label className="form-check-label fw-semibold text-dark small" htmlFor="save-address">
                                                Lưu thông tin này vào Sổ địa chỉ để dùng cho lần sau
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Bên phải: Tóm tắt đơn hàng & Phương thức thanh toán */}
                                <div className="col-md-12 col-lg-6 col-xl-5">
                                    <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                                        <h4 className="fw-bold mb-4 text-dark">
                                            <i className="fas fa-receipt text-success me-2"></i> Đơn Hàng Của Bạn
                                        </h4>

                                        <div className="table-responsive mb-3" style={{ maxHeight: 250, overflowY: 'auto' }}>
                                            <table className="table align-middle">
                                                <tbody>
                                                    {items.map(item => (
                                                        <tr key={item.id}>
                                                            <td style={{ width: 50 }}>
                                                                <img
                                                                    src={imgUrl(item.image)}
                                                                    className="rounded-3 shadow-sm"
                                                                    style={{ width: 45, height: 45, objectFit: 'cover' }}
                                                                    alt={esc(item.name)}
                                                                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: 150 }}>
                                                                    {esc(item.name)}
                                                                </div>
                                                                <div className="text-muted small">
                                                                    {fmtVND(item.price)} x {item.quantity}
                                                                </div>
                                                            </td>
                                                            <td className="text-end fw-bold text-success">
                                                                {fmtVND(item.price * item.quantity)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="p-3 bg-light rounded-3 mb-4">
                                            <div className="d-flex justify-content-between mb-2 small text-muted">
                                                <span>Tạm tính hàng:</span>
                                                <span className="fw-semibold text-dark">{fmtVND(total)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2 small text-muted">
                                                <span>Phí giao hàng hỏa tốc:</span>
                                                <span className="fw-semibold text-success">Miễn phí 0 đ</span>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong className="text-dark fs-6">Tổng thanh toán:</strong>
                                                <strong className="text-success fs-4">{fmtVND(total)}</strong>
                                            </div>
                                        </div>

                                        {/* Phương thức thanh toán */}
                                        <div className="mb-4">
                                            <h6 className="fw-bold text-dark mb-3">
                                                <i className="fas fa-credit-card text-success me-2"></i> Chọn Phương Thức Thanh Toán:
                                            </h6>

                                            {/* Option 1: VietQR Tự động */}
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'BANK_QR' ? 'selected' : ''}`}
                                                onClick={() => setPaymentMethod('BANK_QR')}
                                            >
                                                <div className="d-flex align-items-start gap-3">
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="radio"
                                                        name="paymentMethod"
                                                        id="pm-qr"
                                                        checked={paymentMethod === 'BANK_QR'}
                                                        onChange={() => setPaymentMethod('BANK_QR')}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <label className="form-check-label method-title d-flex align-items-center justify-content-between cursor-pointer" htmlFor="pm-qr">
                                                            <span>Chuyển Khoản VietQR (MBBank)</span>
                                                            <span className="badge bg-success text-white rounded-pill px-2 py-1 small">
                                                                <i className="fas fa-bolt me-1"></i> Tự động nhận
                                                            </span>
                                                        </label>
                                                        <p className="method-desc">
                                                            Quét mã QR bằng App Ngân hàng bất kỳ. Web tự động xác nhận sau 1-3 giây qua SePay!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Option 2: COD */}
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                                                onClick={() => setPaymentMethod('COD')}
                                            >
                                                <div className="d-flex align-items-start gap-3">
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="radio"
                                                        name="paymentMethod"
                                                        id="pm-cod"
                                                        checked={paymentMethod === 'COD'}
                                                        onChange={() => setPaymentMethod('COD')}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <label className="form-check-label method-title cursor-pointer" htmlFor="pm-cod">
                                                            💵 Tiền mặt khi nhận hàng (COD)
                                                        </label>
                                                        <p className="method-desc">
                                                            Thanh toán trực tiếp cho shipper khi nhận được món ăn.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-success py-3 px-4 w-100 text-white fw-bold rounded-pill shadow-sm"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <span><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</span>
                                            ) : paymentMethod === 'BANK_QR' ? (
                                                <span><i className="fas fa-qrcode me-2"></i>Đặt Món & Thanh Toán VietQR Tự Động</span>
                                            ) : (
                                                <span><i className="fas fa-check-circle me-2"></i>Xác Nhận Đặt Hàng</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Modal Thanh toán VietQR & SePay Real-time Auto Detection */}
            {qrModalData && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content qr-modal-card">
                            {/* Modal Header */}
                            <div className="modal-header bg-success text-white py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="fas fa-qrcode fs-4"></i>
                                    <div>
                                        <h5 className="modal-title fw-bold text-white mb-0">Thanh Toán Đơn Hàng #{qrModalData.orderId}</h5>
                                        <span className="small text-white-50">Tích hợp SePay Auto-Banking Real-time</span>
                                    </div>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal} title="Đóng"></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-4 text-center">
                                {isPaidSuccess ? (
                                    /* Màn hình Chúc Mừng Thanh Toán Thành Công */
                                    <div className="py-4">
                                        <div className="success-check-animation shadow-sm">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <h3 className="fw-bold text-success mb-2">🎉 THANH TOÁN THÀNH CÔNG!</h3>
                                        <p className="text-secondary mb-3" style={{ fontSize: '1.05rem' }}>
                                            Hệ thống <strong>SePay</strong> đã tự động nhận diện biến động số dư cho đơn hàng <strong>#{qrModalData.orderId}</strong>.
                                        </p>
                                        <div className="badge bg-success bg-opacity-10 text-success fs-6 py-2 px-4 rounded-pill mb-4 border border-success border-opacity-25">
                                            <i className="fas fa-shield-halved me-2"></i>Số tiền: {fmtVND(qrModalData.total)} - Đã thanh toán
                                        </div>
                                        <p className="text-muted small mb-3">
                                            <span className="spinner-border spinner-border-sm me-2 text-success"></span>
                                            Đang tự động chuyển hướng đến trang đơn hàng của bạn...
                                        </p>
                                        <button type="button" className="btn btn-success rounded-pill px-5 py-2.5 fw-bold" onClick={() => { setQrModalData(null); navigate('/don-hang'); }}>
                                            Xem Đơn Hàng Của Tôi Ngay <i className="fas fa-arrow-right ms-2"></i>
                                        </button>
                                    </div>
                                ) : (
                                    /* Màn hình Quét Mã QR Real-time */
                                    <div>
                                        {/* Radar indicator */}
                                        <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                            <div className="qr-live-indicator">
                                                <span className="pulse-dot"></span>
                                                <span>Đang chờ chuyển khoản... (Tự động nhận sau 1-3s)</span>
                                            </div>
                                            
                                            {/* Nút giả lập demo cho đồ án */}
                                            <button
                                                type="button"
                                                className="mock-test-pill btn btn-sm"
                                                onClick={handleMockPayment}
                                                disabled={mockTesting}
                                                title="Dành cho báo cáo đồ án / test trên localhost"
                                            >
                                                <i className="fas fa-flask me-1 text-warning"></i>
                                                {mockTesting ? 'Đang giả lập...' : '🧪 Demo Đồ Án: Bấm giả lập đã nhận tiền'}
                                            </button>
                                        </div>

                                        <div className="row align-items-center g-4">
                                            {/* QR Code */}
                                            <div className="col-md-6">
                                                <div className="qr-image-wrapper shadow-sm">
                                                    <img
                                                        src={qrUrl}
                                                        className="img-fluid rounded-3"
                                                        alt="VietQR SePay"
                                                        style={{ maxHeight: 270 }}
                                                    />
                                                </div>
                                                <div className="text-muted small mt-2">
                                                    <i className="fas fa-camera text-success me-1"></i> Mở App Ngân hàng bất kỳ để quét mã
                                                </div>
                                            </div>

                                            {/* Chi tiết chuyển khoản */}
                                            <div className="col-md-6 text-start">
                                                <div className="bg-light p-3 rounded-4 border">
                                                    <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                                                        <i className="fas fa-building-columns text-success me-2"></i>Thông Tin Chuyển Khoản:
                                                    </h6>

                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-muted small">Ngân hàng:</span>
                                                        <strong className="text-dark small">MBBank (Ngân Hàng Quân Đội)</strong>
                                                    </div>

                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-muted small">Số tài khoản:</span>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <strong className="text-danger fs-6">{sepayConfig.accountNumber}</strong>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-light border py-0 px-2 rounded copy-badge-btn"
                                                                onClick={() => copyToClipboard(sepayConfig.accountNumber, 'stk')}
                                                                title="Sao chép STK"
                                                            >
                                                                {copiedField === 'stk' ? <span className="text-success small fw-bold">✓ Đã chép</span> : <i className="far fa-copy text-secondary"></i>}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-muted small">Chủ tài khoản:</span>
                                                        <strong className="text-dark small text-uppercase">{sepayConfig.accountName}</strong>
                                                    </div>

                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-muted small">Số tiền:</span>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <strong className="text-success fs-5">{fmtVND(qrModalData.total)}</strong>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-light border py-0 px-2 rounded copy-badge-btn"
                                                                onClick={() => copyToClipboard(String(qrModalData.total), 'amount')}
                                                                title="Sao chép số tiền"
                                                            >
                                                                {copiedField === 'amount' ? <span className="text-success small fw-bold">✓ Đã chép</span> : <i className="far fa-copy text-secondary"></i>}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border">
                                                        <span className="text-muted small">Nội dung CK:</span>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <strong className="bg-warning text-dark px-2 py-0.5 rounded fw-bold">
                                                                {transferContent}
                                                            </strong>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-light border py-0 px-2 rounded copy-badge-btn"
                                                                onClick={() => copyToClipboard(transferContent, 'content')}
                                                                title="Sao chép nội dung"
                                                            >
                                                                {copiedField === 'content' ? <span className="text-success small fw-bold">✓ Đã chép</span> : <i className="far fa-copy text-secondary"></i>}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="alert alert-warning py-2 px-3 mb-0 small rounded-3">
                                                        <i className="fas fa-triangle-exclamation me-1"></i>
                                                        Vui lòng giữ nguyên nội dung chuyển khoản <strong>{transferContent}</strong> để hệ thống SePay nhận diện tự động tức thì.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            {!isPaidSuccess && (
                                <div className="modal-footer bg-light py-2.5 px-4 d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">
                                        <i className="fas fa-shield-check text-success me-1"></i> Bảo mật giao dịch Napas 247
                                    </span>
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-bold" onClick={closeModal}>
                                        Đóng
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
