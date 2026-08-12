import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn! Chúng tôi sẽ liên hệ sớm.');
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <>
            {/* Single Page Header */}
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Liên Hệ</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-white">Liên hệ</li>
                </ol>
            </div>
            {/* Single Page Header End */}

            {/* Contact Start */}
            <div className="container-fluid contact py-5">
                <div className="container py-5">
                    <div className="p-5 bg-light rounded">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="text-center mx-auto" style={{ maxWidth: 700 }}>
                                    <h1 className="text-primary">Liên Hệ Với Chúng Tôi</h1>
                                    <p className="mb-4">
                                        Bạn có thắc mắc về sản phẩm, đơn hàng hay cần tư vấn thực đơn?
                                        Hãy gửi cho chúng tôi một tin nhắn, đội ngũ Fruitables sẽ phản hồi sớm nhất có thể!
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="h-100 rounded">
                                    {/* Map placeholder */}
                                    <iframe
                                        className="rounded w-100"
                                        style={{ height: 400, border: 0 }}
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096814183571!2d105.85229231533235!3d21.028511493153683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x6b107e3848b1112b!2sH%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1694259649153!5m2!1svi!2s"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Bản đồ cửa hàng Fruitables"
                                    ></iframe>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        className="w-100 form-control border-0 py-3 mb-4"
                                        placeholder="Họ và tên của bạn"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="email"
                                        className="w-100 form-control border-0 py-3 mb-4"
                                        placeholder="Địa chỉ Email của bạn"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        className="w-100 form-control border-0 mb-4"
                                        rows="5"
                                        cols="10"
                                        placeholder="Nội dung tin nhắn"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                    <button className="w-100 btn form-control border-secondary py-3 bg-white text-primary fw-bold" type="submit">
                                        Gửi Liên Hệ
                                    </button>
                                </form>
                            </div>

                            <div className="col-lg-5">
                                <div className="d-flex p-4 rounded mb-4 bg-white">
                                    <i className="fas fa-map-marker-alt fa-2x text-primary me-4"></i>
                                    <div>
                                        <h4>Địa Chỉ</h4>
                                        <p className="mb-2">123 Street, Hà Nội, Việt Nam</p>
                                    </div>
                                </div>
                                <div className="d-flex p-4 rounded mb-4 bg-white">
                                    <i className="fas fa-envelope fa-2x text-primary me-4"></i>
                                    <div>
                                        <h4>Gửi Mail</h4>
                                        <p className="mb-2">info@fruitables.vn</p>
                                    </div>
                                </div>
                                <div className="d-flex p-4 rounded bg-white">
                                    <i className="fa fa-phone-alt fa-2x text-primary me-4"></i>
                                    <div>
                                        <h4>Điện Thoại</h4>
                                        <p className="mb-2">(+024) 3456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact End */}
        </>
    );
}
