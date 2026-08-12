import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer 
                className="footer text-white-50 pt-5 mt-5 shadow-lg"
                style={{
                    background: 'linear-gradient(145deg, #111827 0%, #1f2937 100%)',
                    borderTop: '4px solid #81c408'
                }}
            >
                <div className="container py-4">
                    <div className="row g-4">
                        {/* Cột 1: Thương Hiệu & Giới Thiệu */}
                        <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <Link to="/" className="text-decoration-none d-inline-block mb-3">
                                <h2 className="text-primary fw-bold display-6 mb-0 d-flex align-items-center">
                                    <i className="fas fa-leaf text-success me-2 fs-3"></i>Fruitables
                                </h2>
                                <span className="badge bg-success text-white px-2 py-1 mt-1 small">Nông sản hữu cơ sạch VietGAP</span>
                            </Link>
                            <p className="text-white-50 mb-4 pe-lg-3" style={{ fontSize: '14.5px', lineHeight: '1.7' }}>
                                Chuyên cung cấp các loại trái cây tươi sạch, rau củ quả hữu cơ cao cấp, đảm bảo an toàn thực phẩm và sức khỏe cho mọi gia đình Việt.
                            </p>
                            {/* Mạng xã hội */}
                            <div className="d-flex gap-2">
                                <a className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} href="#" title="YouTube"><i className="fab fa-youtube text-danger"></i></a>
                                <a className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} href="#" title="Instagram"><i className="fab fa-instagram text-warning"></i></a>
                                <a className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} href="#" title="Zalo"><i className="fas fa-comment-dots text-info"></i></a>
                            </div>
                        </div>

                        {/* Cột 2: Danh Mục & Cửa Hàng */}
                        <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                            <h5 className="text-white fw-bold mb-4 position-relative pb-2 border-bottom border-success border-2 d-inline-block">
                                Khám Phá
                            </h5>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '14.5px' }}>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/"><i className="fas fa-chevron-right text-success small me-2"></i>Trang Chủ</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/shop"><i className="fas fa-chevron-right text-success small me-2"></i>Cửa Hàng</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/shop?category=Trái cây"><i className="fas fa-chevron-right text-success small me-2"></i>Trái Cây Tươi</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/shop?category=Rau củ"><i className="fas fa-chevron-right text-success small me-2"></i>Rau Củ VietGAP</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/goi-y-mon-an"><i className="fas fa-chevron-right text-success small me-2"></i>Món Ngon Mỗi Ngày</Link></li>
                            </ul>
                        </div>

                        {/* Cột 3: Chính Sách & Hỗ Trợ */}
                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                            <h5 className="text-white fw-bold mb-4 position-relative pb-2 border-bottom border-success border-2 d-inline-block">
                                Chính Sách & Hỗ Trợ
                            </h5>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '14.5px' }}>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/gio-hang"><i className="fas fa-shield-alt text-warning small me-2"></i>Giỏ Hàng Của Bạn</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/don-hang"><i className="fas fa-truck text-warning small me-2"></i>Kiểm Tra Đơn Hàng</Link></li>
                                <li><Link className="text-white-50 text-decoration-none hover-primary transition-all" to="/lien-he"><i className="fas fa-headset text-warning small me-2"></i>Trung Tâm Hỗ Trợ</Link></li>
                                <li><span className="text-white-50"><i className="fas fa-sync text-warning small me-2"></i>Đổi Trả Hàng Tươi Sạch 24h</span></li>
                                <li><span className="text-white-50"><i className="fas fa-lock text-warning small me-2"></i>Bảo Mật Thông Tin 100%</span></li>
                            </ul>
                        </div>

                        {/* Cột 4: Thông Tin Liên Hệ */}
                        <div className="col-lg-3 col-md-6">
                            <h5 className="text-white fw-bold mb-4 position-relative pb-2 border-bottom border-success border-2 d-inline-block">
                                Liên Hệ Cửa Hàng
                            </h5>
                            <div className="d-flex flex-column gap-3" style={{ fontSize: '14.5px' }}>
                                <div className="d-flex align-items-start">
                                    <i className="fas fa-map-marker-alt text-danger fs-5 me-3 mt-1"></i>
                                    <div>
                                        <span className="text-white fw-bold d-block">Địa Chỉ Kho Hàng</span>
                                        <span className="text-white-50">Hà Nội, Việt Nam</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-phone-alt text-success fs-5 me-3"></i>
                                    <div>
                                        <span className="text-white fw-bold d-block">Hotline Tư Vấn</span>
                                        <span className="text-warning fw-bold fs-6">0987 654 321</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-envelope text-info fs-5 me-3"></i>
                                    <div>
                                        <span className="text-white fw-bold d-block">Email Hỗ Trợ</span>
                                        <span className="text-white-50">contact@fruitables.vn</span>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-top border-secondary">
                                    <span className="text-white-50 small d-block mb-2">Thanh Toán An Toàn Qua:</span>
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-light text-dark px-2 py-1 border fw-bold"><i className="fas fa-qrcode text-primary me-1"></i>VietQR</span>
                                        <span className="badge bg-light text-dark px-2 py-1 border fw-bold"><i className="fas fa-money-bill-wave text-success me-1"></i>COD</span>
                                        <span className="badge bg-light text-dark px-2 py-1 border fw-bold"><i className="fas fa-university text-info me-1"></i>Techcombank</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-3 mt-4" style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="container">
                        <div className="row align-items-center text-center text-md-start">
                            <div className="col-md-6 mb-2 mb-md-0">
                                <span className="small text-white-50">
                                    © 2026 <strong className="text-success">Fruitables Store</strong> - Nông Sản Hữu Cơ Sạch VietGAP. Tất cả quyền được bảo lưu.
                                </span>
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <span className="small text-white-50 me-3">Website Bán Nông Sản Hữu Cơ</span>
                                <a className="text-success text-decoration-none small fw-bold" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                    Lên Đỉnh Trang <i className="fas fa-arrow-up ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to Top Floating Button */}
            <a href="#" className="btn btn-success border-2 rounded-circle back-to-top shadow-lg" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <i className="fa fa-arrow-up"></i>
            </a>
        </>
    );
}
