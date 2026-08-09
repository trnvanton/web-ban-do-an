import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
                <div className="container py-5">
                    <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-3">
                                <Link to="/">
                                    <h1 className="text-primary mb-0">Fruitables</h1>
                                    <p className="text-secondary mb-0">Nông sản hữu cơ sạch</p>
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <form
                                    className="position-relative mx-auto"
                                    onSubmit={e => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận tin!'); }}
                                >
                                    <input className="form-control border-0 w-100 py-3 px-4 rounded-pill" type="email" placeholder="Nhập Email của bạn..." required />
                                    <button type="submit" className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white" style={{ top: 0, right: 0 }}>
                                        Đăng Ký Ngay
                                    </button>
                                </form>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex justify-content-end pt-3">
                                    <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-youtube"></i></a>
                                    <a className="btn btn-outline-secondary btn-md-square rounded-circle" href="#"><i className="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-item">
                                <h4 className="text-light mb-3">Về Fruitables</h4>
                                <p className="mb-4">Chuyên cung cấp các sản phẩm rau củ quả, trái cây tươi sạch đạt tiêu chuẩn VietGAP, đảm bảo an toàn sức khỏe cho mọi gia đình.</p>
                                <Link to="/" className="btn border-secondary py-2 px-4 rounded-pill text-primary">Xem thêm</Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex flex-column text-start footer-item">
                                <h4 className="text-light mb-3">Thông Tin Cửa Hàng</h4>
                                <Link className="btn-link" to="/">Trang chủ</Link>
                                <a className="btn-link" href="#">Giới thiệu</a>
                                <a className="btn-link" href="#">Chính sách bảo mật</a>
                                <a className="btn-link" href="#">Điều khoản dịch vụ</a>
                                <a className="btn-link" href="#">Chính sách đổi trả</a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex flex-column text-start footer-item">
                                <h4 className="text-light mb-3">Tài Khoản</h4>
                                <Link className="btn-link" to="/gio-hang">Giỏ hàng</Link>
                                <Link className="btn-link" to="/thanh-toan">Thanh toán</Link>
                                <Link className="btn-link" to="/dang-nhap">Đăng nhập</Link>
                                <Link className="btn-link" to="/admin">Quản trị viên</Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-item">
                                <h4 className="text-light mb-3">Liên Hệ</h4>
                                <p><i className="fas fa-map-marker-alt me-2 text-primary"></i>Địa chỉ: Hà Nội, Việt Nam</p>
                                <p><i className="fas fa-envelope me-2 text-primary"></i>Email: contact@fruitables.vn</p>
                                <p><i className="fas fa-phone me-2 text-primary"></i>Hotline: 0987 654 321</p>
                                <p className="mb-2">Hỗ trợ thanh toán:</p>
                                <img src="/img/payment.png" className="img-fluid" alt="Phương thức thanh toán" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer End */}

            {/* Copyright */}
            <div className="container-fluid copyright bg-dark py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <span className="text-light"><Link to="/"><i className="fas fa-copyright text-light me-2"></i>Fruitables Store</Link> - Bản quyền thuộc về Cửa hàng Nông sản Hữu cơ.</span>
                        </div>
                        <div className="col-md-6 my-auto text-center text-md-end text-white-50">
                            Thiết kế bởi <Link className="border-bottom text-primary" to="/">Fruitables Team</Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Copyright End */}

            {/* Back to Top */}
            <a href="#" className="btn btn-primary border-3 border-primary rounded-circle back-to-top" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa fa-arrow-up"></i>
            </a>
        </>
    );
}
