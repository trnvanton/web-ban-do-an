import { Link } from 'react-router-dom';
import { imgUrl } from '../utils/img';

const testimonials = [
    {
        quote: 'Thực phẩm tươi ngon, giao hàng nhanh chóng và đóng gói rất cẩn thận. Gia đình tôi rất hài lòng về chất lượng rau củ ở đây!',
        name: 'Nguyễn Thị Hoa',
        profession: 'Nội trợ',
        stars: 5
    },
    {
        quote: 'Thực đơn thông minh gợi ý những món ăn hợp khẩu vị. Đặt món cực kỳ dễ dàng, nhân viên tư vấn tận tình, đáng để thử!',
        name: 'Trần Văn Minh',
        profession: 'Nhân viên văn phòng',
        stars: 4
    },
    {
        quote: 'Đã mua hàng nhiều lần, chất lượng luôn ổn định. Sản phẩm hữu cơ sạch sẽ, giá cả hợp lý. Sẽ tiếp tục ủng hộ cửa hàng!',
        name: 'Lê Thu Trang',
        profession: 'Giáo viên',
        stars: 5
    }
];

export default function Testimonial() {
    return (
        <>
            {/* Single Page Header */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Cảm Nhận Khách Hàng</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-white">Cảm nhận</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Testimonial Start */}
            <div className="container-fluid testimonial py-5">
                <div className="container py-5">
                    <div className="testimonial-header text-center">
                        <h4 className="text-primary">Đánh Giá Của Khách Hàng</h4>
                        <h1 className="display-5 mb-5 text-dark">Khách Hàng Nói Gì Về Chúng Tôi!</h1>
                    </div>
                    <div className="row g-4">
                        {testimonials.map((t, idx) => (
                            <div className="col-lg-4" key={idx}>
                                <div className="testimonial-item img-border-radius bg-light rounded p-4 h-100">
                                    <div className="position-relative">
                                        <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{ bottom: 30, right: 0 }}></i>
                                        <div className="mb-4 pb-4 border-bottom border-secondary">
                                            <p className="mb-0">{t.quote}</p>
                                        </div>
                                        <div className="d-flex align-items-center flex-nowrap">
                                            <div className="bg-secondary rounded">
                                                <img src={imgUrl('testimonial-1.jpg')} className="img-fluid rounded" style={{ width: 100, height: 100 }} alt={t.name} />
                                            </div>
                                            <div className="ms-4 d-block">
                                                <h4 className="text-dark mb-0">{t.name}</h4>
                                                <p className="m-0 pb-3">{t.profession}</p>
                                                <div className="d-flex pe-5">
                                                    {[...Array(5)].map((_, s) => (
                                                        <i key={s} className={'fas fa-star' + (s < t.stars ? ' text-primary' : '')}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Testimonial End */}
        </>
    );
}
