import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            {/* Single Page Header */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">404 Error</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-white">404</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* 404 Start */}
            <div className="container-fluid py-5">
                <div className="container py-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                            <h1 className="display-1">404</h1>
                            <h1 className="mb-4">Trang Không Tìm Thấy</h1>
                            <p className="mb-4">
                                Xin lỗi, trang bạn đang tìm kiếm không tồn tại trên website của chúng tôi!
                                Vui lòng quay về trang chủ hoặc thử tìm kiếm lại.
                            </p>
                            <Link className="btn border-secondary rounded-pill py-3 px-5 fw-bold" to="/">
                                <i className="fas fa-home me-2"></i>Về Trang Chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* 404 End */}
        </>
    );
}
