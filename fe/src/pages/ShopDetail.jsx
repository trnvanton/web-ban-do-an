import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { imgUrl, esc, fmtVND } from '../utils/img';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import './ShopDetail.css';

export default function ShopDetail() {
    const { id } = useParams();
    const { items, addItem } = useCart();
    const { user } = useAuth();
    const dialog = useDialog();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'nutrition', 'reviews'

    const [reviewData, setReviewData] = useState({ total_reviews: 0, rating_average: 0, reviews: [] });

    useEffect(() => {
        window.scrollTo(0, 0);
        let mounted = true;
        setLoading(true);
        setError('');
        setProduct(null);
        setRelated([]);
        setQty(1);
        setActiveTab('desc');

        (async () => {
            try {
                const p = await api.get('/api/san-pham/' + id);
                if (!mounted) return;
                setProduct(p);

                // Lấy đánh giá của sản phẩm
                api.get('/api/danh-gia/san-pham/' + id)
                    .then(data => {
                        if (mounted && data) {
                            setReviewData({
                                total_reviews: Number(data.total_reviews) || 0,
                                rating_average: Number(data.rating_average) || 0,
                                reviews: Array.isArray(data.reviews) ? data.reviews : []
                            });
                        }
                    })
                    .catch(() => {});

                try {
                    const all = await api.get('/api/san-pham');
                    if (!mounted) return;
                    const arr = Array.isArray(all) ? all : [];
                    setRelated(arr.filter(x => x.danh_muc === p.danh_muc && x.id !== p.id).slice(0, 4));
                } catch (e) {
                    // Không chặn nếu lỗi tải món liên quan
                }
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    const stock = Number(product && product.so_luong_ton) || 0;
    const isOutOfStock = stock <= 0;
    const inCartQty = items.find(i => i.id === (product && product.id))?.quantity || 0;

    const minus = () => setQty(q => Math.max(1, q - 1));

    const plus = () => {
        if (qty + 1 > stock) {
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm!`, { title: 'Số Lượng Tối Đa' });
            return;
        }
        setQty(q => Math.min(q + 1, stock));
    };

    const handleAddToCart = async () => {
        if (!user) {
            const goLogin = await dialog.confirm('Bạn cần đăng nhập tài khoản để thêm món vào giỏ hàng.', {
                title: 'Yêu Cầu Đăng Nhập',
                type: 'warning',
                confirmText: 'Đăng nhập ngay',
                cancelText: 'Để sau'
            });
            if (goLogin) {
                navigate('/dang-nhap', { state: { from: location.pathname + location.search } });
            }
            return;
        }
        if (inCartQty + qty > stock) {
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm (bạn đã có ${inCartQty} trong giỏ hàng).`, {
                title: 'Số Lượng Không Đủ'
            });
            return;
        }
        addItem(product, qty);
        const viewCart = await dialog.confirm(`Đã thêm ${qty} x "${product.ten_san_pham}" vào giỏ hàng thành công! Bạn có muốn đến giỏ hàng ngay không?`, {
            title: 'Thêm Giỏ Hàng Thành Công',
            type: 'success',
            confirmText: 'Đến giỏ hàng',
            cancelText: 'Mua tiếp'
        });
        if (viewCart) {
            navigate('/gio-hang');
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            const goLogin = await dialog.confirm('Bạn cần đăng nhập tài khoản để đặt mua món ăn.', {
                title: 'Yêu Cầu Đăng Nhập',
                type: 'warning',
                confirmText: 'Đăng nhập ngay',
                cancelText: 'Để sau'
            });
            if (goLogin) {
                navigate('/dang-nhap', { state: { from: location.pathname + location.search } });
            }
            return;
        }
        if (inCartQty + qty > stock) {
            dialog.warning(`Trong kho chỉ còn ${stock} sản phẩm (bạn đã có ${inCartQty} trong giỏ hàng).`, {
                title: 'Số Lượng Không Đủ'
            });
            return;
        }
        addItem(product, qty);
        navigate('/gio-hang');
    };

    if (loading) {
        return (
            <div className="shop-detail-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <div className="text-muted fw-semibold">Đang tải thông tin món ăn...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="shop-detail-wrapper py-5">
                <div className="container py-5 text-center">
                    <div className="card shadow-sm border-0 rounded-4 p-5 mx-auto" style={{ maxWidth: 500 }}>
                        <i className="fas fa-utensils-slash text-danger display-4 mb-3"></i>
                        <h4 className="fw-bold text-dark mb-2">Không tìm thấy món ăn</h4>
                        <p className="text-muted mb-4">{esc(error || 'Món ăn bạn tìm kiếm không tồn tại hoặc đã tạm dừng phục vụ.')}</p>
                        <Link to="/shop" className="btn btn-success rounded-pill px-4 py-2 fw-bold">
                            <i className="fas fa-arrow-left me-2"></i> Quay lại thực đơn
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const price = Number(product.gia) || 0;
    const subtotal = price * qty;
    
    // Dynamic Product Profile calculation
    const profile = (() => {
        const name = (product.ten_san_pham || '').toLowerCase();
        const cat = (product.danh_muc || '').toLowerCase();

        const isProduce = cat.includes('nông sản') || cat.includes('nguyên liệu') || cat.includes('trái cây') || cat.includes('rau củ') ||
            name.includes('cà chua') || name.includes('khoai tây') || name.includes('bông cải') || name.includes('táo') ||
            name.includes('cam') || name.includes('chuối') || name.includes('ổi') || name.includes('thanh long') ||
            name.includes('cà rốt') || name.includes('xà lách') || name.includes('dưa') || name.includes('bắp') ||
            name.includes('nấm') || name.includes('rau') || name.includes('củ');

        const isDrink = cat.includes('đồ uống') || cat.includes('nước ép') || cat.includes('tráng miệng') ||
            name.includes('nước ép') || name.includes('sinh tố') || name.includes('trà') || name.includes('nước dừa') || name.includes('hộp trái cây');

        const isMealkit = cat.includes('meal-kit') || cat.includes('set nấu') || name.includes('[meal-kit]') || name.includes('set ');

        if (isProduce) {
            let unitText = '1 Hộp / Túi tiêu chuẩn';
            if (name.includes('hộp 500g') || name.includes('500g')) unitText = 'Hộp 500g chuẩn VietGAP';
            else if (name.includes('túi 1kg') || name.includes('1kg')) unitText = 'Túi 1kg tươi sạch';
            else if (name.includes('cây 400g') || name.includes('400g')) unitText = 'Cây 400g tươi ngon';

            let nutritionCards = [
                { label: 'Năng lượng tự nhiên', value: '~ 18 - 45 kcal / 100g', color: 'text-success' },
                { label: 'Vitamin & Vi chất', value: 'Dồi dào Vitamin C & A', color: 'text-primary' },
                { label: 'Chất xơ hòa tan', value: 'Giàu chất xơ thanh lọc', color: 'text-warning' },
                { label: 'Chất chống oxy hóa', value: 'Lycopene & Polyphenol', color: 'text-danger' }
            ];

            if (name.includes('khoai tây')) {
                nutritionCards = [
                    { label: 'Năng lượng', value: '~ 77 kcal / 100g', color: 'text-success' },
                    { label: 'Carbohydrate phức', value: 'Tinh bột no lâu, giàu năng lượng', color: 'text-primary' },
                    { label: 'Khoáng chất thiết yếu', value: 'Dồi dào Kali & Vitamin B6', color: 'text-warning' },
                    { label: 'Chất xơ tự nhiên', value: '~ 2.2g / 100g', color: 'text-dark' }
                ];
            } else if (name.includes('bông cải') || name.includes('súp lơ')) {
                nutritionCards = [
                    { label: 'Năng lượng', value: '~ 34 kcal / 100g', color: 'text-success' },
                    { label: 'Vitamin C & K', value: 'Bổ sung 89mg Vitamin C', color: 'text-primary' },
                    { label: 'Chất xơ & Sulforaphane', value: 'Chống oxy hóa & bổ dưỡng', color: 'text-warning' },
                    { label: 'Khoáng chất', value: 'Axit Folic & Sắt thực vật', color: 'text-info' }
                ];
            }

            return {
                type: 'produce',
                badge: 'Nông Sản Hữu Cơ Tươi Sạch',
                badgeIcon: 'fas fa-seedling',
                unit: unitText,
                freshBadge: '100% VietGAP Hữu Cơ',
                specs: [
                    { icon: 'fas fa-location-dot', label: 'Xuất xứ:', val: 'Đà Lạt / Nông trường VietGAP' },
                    { icon: 'fas fa-leaf', label: 'Đặc tính:', val: 'Tươi sạch hái trong ngày' },
                    { icon: 'fas fa-temperature-arrow-down', label: 'Bảo quản:', val: 'Ngăn mát 4°C - 8°C' },
                    { icon: 'fas fa-box-open', label: 'Đóng gói:', val: 'Hộp / Túi màng thở an toàn' }
                ],
                btnAddToCart: 'Thêm Vào Giỏ Hàng',
                btnBuyNow: 'Mua Hàng Ngay',
                stockLabel: `Còn ${stock} sản phẩm`,
                tabTitle1: 'Thông Tin Nông Sản & Nguồn Gốc',
                tabTitle2: 'Giá Trị Dinh Dưỡng & Vitamin',
                descTitle: `Giới thiệu về ${esc(product.ten_san_pham)}`,
                descIntro: esc(product.mo_ta || 'Nông sản hữu cơ được canh tác tự nhiên theo quy chuẩn VietGAP nghiêm ngặt, cam kết không sử dụng thuốc bảo vệ thực vật hóa học độc hại, an toàn tuyệt đối cho cả gia đình.'),
                guideTitle: 'Gợi ý sơ chế & Thưởng thức ngon nhất:',
                guideTips: [
                    'Rửa nhẹ dưới vòi nước sạch trước khi sử dụng trực tiếp hoặc chế biến.',
                    'Thích hợp ăn tươi giòn ngọt, làm salad thanh mát, ép nước sinh tố hoặc nấu canh dinh dưỡng.',
                    'Bảo quản trong ngăn mát tủ lạnh để giữ được độ giòn mọng và hàm lượng vitamin cao nhất.'
                ],
                qualityTitle: 'Tiêu chuẩn chất lượng Fruitables Organic:',
                qualityStandards: [
                    'Thu hoạch và tuyển chọn quả loại 1 đều đẹp, tươi mọng không dập nát.',
                    'Chứng nhận an toàn vệ sinh thực phẩm và chuẩn VietGAP kiểm định định kỳ.',
                    'Đóng gói cẩn thận, giao hỏa tốc giữ trọn độ tươi nguyên của rau củ quả.'
                ],
                nutritionTitle: 'Thành Phần Vi Chất & Dinh Dưỡng Tự Nhiên',
                nutritionIntro: 'Nông sản và rau củ quả tươi tự nhiên là nguồn cung cấp vitamin, chất khoáng và chất chống oxy hóa tự nhiên, hoàn toàn không chứa cholesterol:',
                nutritionCards,
                allergyNotice: 'Nông sản hữu cơ 100% tự nhiên không chất bảo quản hóa học. Nên rửa sạch với nước trước khi dùng để thưởng thức trọn vẹn vị tươi ngon mát lành.'
            };
        }

        if (isDrink) {
            const isCutFruit = name.includes('cắt sẵn') || name.includes('hộp trái cây');
            return {
                type: 'drink',
                badge: isCutFruit ? 'Trái Cây Tươi Cắt Sẵn' : 'Đồ Uống Tươi Sạch',
                badgeIcon: isCutFruit ? 'fas fa-apple-whole' : 'fas fa-glass-water',
                unit: isCutFruit ? 'Hộp 400g kèm muối ớt' : 'Chai 350ml nguyên chất',
                freshBadge: 'Ướp lạnh tươi mát',
                specs: [
                    { icon: 'fas fa-bottle-droplet', label: 'Chế biến:', val: isCutFruit ? 'Cắt gọt vệ sinh vô trùng' : 'Ép chậm 100% nguyên chất' },
                    { icon: 'fas fa-apple-whole', label: 'Thành phần:', val: 'Trái cây tươi tự nhiên' },
                    { icon: 'fas fa-snowflake', label: 'Bảo quản:', val: 'Ướp lạnh 2°C - 6°C' },
                    { icon: 'fas fa-clock-rotate-left', label: 'Hạn dùng:', val: 'Trong vòng 24 - 48 giờ' }
                ],
                btnAddToCart: 'Thêm Vào Giỏ Hàng',
                btnBuyNow: 'Mua Thưởng Thức Ngay',
                stockLabel: `Còn ${stock} phần`,
                tabTitle1: 'Mô Tả & Trải Nghiệm Thưởng Thức',
                tabTitle2: 'Dinh Dưỡng & Vitamin Tự Nhiên',
                descTitle: `Giới thiệu về ${esc(product.ten_san_pham)}`,
                descIntro: esc(product.mo_ta || 'Sản phẩm giải khát và tráng miệng lành mạnh từ hoa quả tươi hữu cơ, không pha đường hóa học, giúp thanh nhiệt cơ thể và bổ sung vi chất tức thì.'),
                guideTitle: 'Gợi ý thưởng thức thanh mát:',
                guideTips: [
                    'Lắc đều trước khi uống đối với nước ép, thưởng thức ngay khi còn lạnh.',
                    'Hộp trái cây tươi dùng kèm muối tôm Tây Ninh hảo hạng để tăng thêm hương vị đậm đà.',
                    'Bảo quản trong ngăn mát tủ lạnh, tránh ánh nắng trực tiếp.'
                ],
                qualityTitle: 'Cam kết chất lượng đồ uống Fruitables:',
                qualityStandards: [
                    '100% trái cây sạch tuyển chọn, không sử dụng hương liệu hoặc phẩm màu nhân tạo.',
                    'Quy trình gọt ép khép kín đảm bảo tiêu chuẩn vệ sinh an toàn thực phẩm.',
                    'Giao nhanh trong túi giữ nhiệt để giữ trọn độ mát lạnh sảng khoái.'
                ],
                nutritionTitle: 'Giá Trị Dinh Dưỡng Bổ Sung Hàng Ngày',
                nutritionIntro: 'Nguồn vitamin C và enzyme tự nhiên giúp tăng cường hệ miễn dịch, làm sáng da và bổ sung năng lượng thanh sạch:',
                nutritionCards: [
                    { label: 'Năng lượng tự nhiên', value: '~ 90 - 130 kcal', color: 'text-success' },
                    { label: 'Vitamin C tự nhiên', value: 'Bổ sung dồi dào năng lượng', color: 'text-primary' },
                    { label: 'Đường hoa quả', value: '100% Fructose tự nhiên', color: 'text-warning' },
                    { label: 'Khoáng & Điện giải', value: 'Bù nước & thanh lọc cơ thể', color: 'text-info' }
                ],
                allergyNotice: 'Thành phần hoàn toàn từ hoa quả thiên nhiên tươi sạch, không chất bảo quản, khuyên dùng trong ngày sau khi mở nắp.'
            };
        }

        if (isMealkit) {
            return {
                type: 'mealkit',
                badge: 'Set Nấu Ăn (Meal-kit)',
                badgeIcon: 'fas fa-kitchen-set',
                unit: '1 Set nguyên liệu (2 - 3 người ăn)',
                freshBadge: 'Tiện lợi chỉ 10 phút nấu',
                specs: [
                    { icon: 'fas fa-fire-burner', label: 'Thời gian nấu:', val: 'Chỉ 5 - 10 phút tại nhà' },
                    { icon: 'fas fa-users', label: 'Khẩu phần:', val: '2 - 3 người ăn' },
                    { icon: 'fas fa-scale-balanced', label: 'Định lượng:', val: 'Thịt/Tôm + Rau củ + Sốt' },
                    { icon: 'fas fa-box-archive', label: 'Đóng khay:', val: 'Khay kín bảo quản mát' }
                ],
                btnAddToCart: 'Thêm Vào Giỏ Hàng',
                btnBuyNow: 'Đặt Set Nấu Ngay',
                stockLabel: `Còn ${stock} set`,
                tabTitle1: 'Hướng Dẫn Nấu Nhanh Tại Nhà',
                tabTitle2: 'Định Lượng & Thành Phần Dinh Dưỡng',
                descTitle: `Chi tiết về ${esc(product.ten_san_pham)}`,
                descIntro: esc(product.mo_ta || 'Giải pháp vào bếp tiện lợi cho người bận rộn: Nguyên liệu tươi sống đã được sơ chế sạch sẽ, tẩm ướp sốt chuẩn vị nhà hàng, chỉ cần bật bếp xào/nấu vài phút là có ngay bữa cơm thơm ngon nóng hổi.'),
                guideTitle: '3 bước nấu nhanh siêu ngon:',
                guideTips: [
                    'Làm nóng chảo hoặc nồi với 1 thìa dầu ăn nhỏ trên lửa vừa.',
                    'Cho phần thịt/tôm đã ướp vào đảo săn 2-3 phút, sau đó cho rau củ và gói sốt đi kèm vào xào chín tới.',
                    'Tắt bếp và thưởng thức nóng hổi cùng cơm dẻo cho bữa cơm gia đình đầm ấm.'
                ],
                qualityTitle: 'Tiêu chuẩn nguyên liệu Meal-kit:',
                qualityStandards: [
                    'Thịt, hải sản tươi mới được làm sạch và tẩm ướp sốt gia vị trong ngày.',
                    'Rau củ chuẩn VietGAP nhặt sạch rễ, rửa nước muối và cắt khúc vừa ăn.',
                    'Gói nước sốt độc quyền từ đầu bếp Fruitables, không cần nêm nếm thêm.'
                ],
                nutritionTitle: 'Tỉ Lệ Dinh Dưỡng Cho Bữa Cơm Gia Đình',
                nutritionIntro: 'Tỉ lệ các nhóm chất Đạm - Chất Xơ - Năng Lượng được định lượng khoa học cho 2 - 3 khẩu phần:',
                nutritionCards: [
                    { label: 'Năng lượng ước tính', value: '~ 450 - 650 kcal / phần', color: 'text-success' },
                    { label: 'Protein (Đạm tươi)', value: '~ 25 - 35g (Thịt / Tôm tươi)', color: 'text-primary' },
                    { label: 'Rau củ & Chất xơ', value: '~ 150 - 200g sạch', color: 'text-warning' },
                    { label: 'Gói sốt gia vị', value: 'Nêm chuẩn vị tự nhiên', color: 'text-dark' }
                ],
                allergyNotice: 'Ghi chú dị ứng: Nếu bạn dị ứng với hải sản, đậu phộng, mè hoặc hành tỏi, vui lòng kiểm tra thành phần hoặc ghi chú khi đặt đơn.'
            };
        }

        // Cooked Meals
        return {
            type: 'cooked',
            badge: 'Món Ăn Chế Biến Sẵn',
            badgeIcon: 'fas fa-utensils',
            unit: '1 Suất phần đầy đủ nóng hổi',
            freshBadge: 'Nấu nóng giao ngay',
            specs: [
                { icon: 'fas fa-clock', label: 'Chuẩn bị:', val: '10 - 15 phút' },
                { icon: 'fas fa-utensils', label: 'Khẩu phần:', val: '1 người ăn' },
                { icon: 'fas fa-bowl-food', label: 'Hình thức:', val: 'Chế biến nóng hổi' },
                { icon: 'fas fa-box', label: 'Đóng gói:', val: 'Hộp giữ nhiệt an toàn' }
            ],
            btnAddToCart: 'Thêm Vào Giỏ Hàng',
            btnBuyNow: 'Đặt Món Ngay',
            stockLabel: `Còn ${stock} suất`,
            tabTitle1: 'Mô Tả Chi Tiết & Thưởng Thức',
            tabTitle2: 'Thành Phần & Dinh Dưỡng Bữa Ăn',
            descTitle: `Giới thiệu về ${esc(product.ten_san_pham)}`,
            descIntro: esc(product.mo_ta || 'Món ăn đậm đà chuẩn vị truyền thống, được các đầu bếp giàu kinh nghiệm chế biến từ nguyên liệu tươi sạch đạt chuẩn an toàn vệ sinh thực phẩm.'),
            guideTitle: 'Gợi ý thưởng thức ngon nhất:',
            guideTips: [
                'Dùng ngay khi món ăn còn nóng hổi sau khi nhận từ shipper để cảm nhận trọn vẹn hương vị.',
                'Kết hợp tuyệt vời cùng cơm trắng dẻo thơm, thêm một phần canh thanh mát.',
                'Bảo quản trong ngăn mát tủ lạnh nếu chưa dùng hết trong vòng 24 giờ.'
            ],
            qualityTitle: 'Tiêu chuẩn chất lượng Fruitables:',
            qualityStandards: [
                'Thịt, hải sản và rau củ nhập tươi mỗi ngày từ các đối tác VietGAP uy tín.',
                'Không sử dụng phẩm màu công nghiệp hoặc chất bảo quản có hại.',
                'Quy trình bếp sạch 1 chiều đạt chứng nhận An Toàn Thực Phẩm.'
            ],
            nutritionTitle: 'Định Lượng Dinh Dưỡng Cho Bữa Ăn Hoàn Chỉnh',
            nutritionIntro: 'Các nguyên liệu được định lượng cân đối theo tỉ lệ dinh dưỡng vàng cho một bữa ăn hoàn chỉnh:',
            nutritionCards: [
                { label: 'Năng lượng ước tính', value: '~ 450 - 580 kcal', color: 'text-success' },
                { label: 'Protein (Đạm)', value: '~ 28 - 35g', color: 'text-primary' },
                { label: 'Chất xơ & Rau củ', value: '~ 120g', color: 'text-warning' },
                { label: 'Gia vị & Tinh bột', value: 'Chuẩn định lượng', color: 'text-dark' }
            ],
            allergyNotice: 'Ghi chú dị ứng: Nếu bạn có tiền sử dị ứng với hải sản, đậu phộng, hành tỏi hoặc bột ngọt, vui lòng ghi chú khi tạo đơn hàng để đầu bếp điều chỉnh phù hợp.'
        };
    })();

    return (
        <div className="shop-detail-wrapper">
            {/* Breadcrumb Bar */}
            <div className="detail-breadcrumb-bar">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <ul className="detail-breadcrumb">
                            <li><Link to="/"><i className="fas fa-house me-1"></i> Trang chủ</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li><Link to="/shop">Thực đơn</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li><Link to={`/shop?category=${encodeURIComponent(product.danh_muc || 'Tất cả')}`}>{esc(product.danh_muc || 'Món ngon')}</Link></li>
                            <li className="separator"><i className="fas fa-chevron-right"></i></li>
                            <li className="active-item">{esc(product.ten_san_pham)}</li>
                        </ul>
                        <Link to="/shop" className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold">
                            <i className="fas fa-arrow-left me-1"></i> Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Hero Product Card */}
                <div className="detail-hero-card">
                    <div className="row g-5 align-items-start">
                        {/* Cột trái: Hình ảnh & Cam kết dịch vụ */}
                        <div className="col-lg-5">
                            <div className="detail-image-box shadow-sm">
                                {/* Badges */}
                                <div className="detail-badge-top-left">
                                    <span className="badge bg-success bg-gradient px-3 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-1">
                                        <i className={profile.badgeIcon || 'fas fa-utensils'}></i> {profile.badge || esc(product.danh_muc || 'Món ngon')}
                                    </span>
                                </div>
                                <div className="detail-badge-top-right">
                                    {isOutOfStock ? (
                                        <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold shadow-sm">
                                            <i className="fas fa-ban me-1"></i> Hết hàng
                                        </span>
                                    ) : (
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold shadow-sm">
                                            <i className="fas fa-cubes text-success me-1"></i> {profile.stockLabel}
                                        </span>
                                    )}
                                </div>

                                {/* Main Image */}
                                <img
                                    src={imgUrl(product.hinh_anh)}
                                    className="detail-main-img"
                                    alt={esc(product.ten_san_pham)}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fruite-item-1.jpg'; }}
                                />
                            </div>

                            {/* Guarantee Grid */}
                            <div className="detail-guarantee-grid">
                                <div className="guarantee-pill">
                                    <div className="guarantee-icon green">
                                        <i className="fas fa-truck-fast"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Giao Nhanh Tươi Sạch</strong>
                                        <span>30 - 45 phút</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon blue">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Chuẩn VietGAP</strong>
                                        <span>100% An toàn</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon orange">
                                        <i className="fas fa-rotate-left"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Đổi Trả Dễ Dàng</strong>
                                        <span>Bảo hành nếu lỗi</span>
                                    </div>
                                </div>

                                <div className="guarantee-pill">
                                    <div className="guarantee-icon purple">
                                        <i className="fas fa-qrcode"></i>
                                    </div>
                                    <div className="guarantee-text">
                                        <strong>Thanh Toán Tiện Lợi</strong>
                                        <span>VietQR & COD</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin món ăn & Đặt hàng */}
                        <div className="col-lg-7">
                            <div className="ps-lg-2">
                                {/* Title */}
                                <h1 className="detail-title">{esc(product.ten_san_pham)}</h1>

                                {/* Rating & Stats */}
                                <div className="detail-meta-row">
                                    <div className="meta-rating">
                                        <div className="text-warning">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <i key={s} className={s <= Math.round(reviewData.rating_average || 5) ? 'fas fa-star text-warning' : 'far fa-star text-muted opacity-50'}></i>
                                            ))}
                                        </div>
                                        <span className="ms-1">{reviewData.rating_average > 0 ? reviewData.rating_average : '5.0'}</span>
                                    </div>
                                    <span className="text-muted">•</span>
                                    <span className="text-muted">{reviewData.total_reviews} nhận xét</span>
                                    <span className="text-muted">•</span>
                                    <span className="meta-sold"><i className="fas fa-fire text-danger me-1"></i>Đã bán 120+ lượt</span>
                                </div>

                                {/* Price Box */}
                                <div className="detail-price-box">
                                    <div>
                                        <div className="detail-price-val">{fmtVND(price)}</div>
                                        <div className="detail-price-unit">Đơn vị: {profile.unit}</div>
                                    </div>
                                    <span className="badge bg-white text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                                        <i className="fas fa-tags me-1"></i> {profile.freshBadge}
                                    </span>
                                </div>

                                {/* Quick Specs */}
                                <div className="detail-specs-grid">
                                    {profile.specs.map((sp, idx) => (
                                        <div key={idx} className="spec-item">
                                            <i className={sp.icon}></i>
                                            <div><strong>{sp.label}</strong> {sp.val}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Description excerpt */}
                                <div className="mb-4">
                                    <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.96rem' }}>
                                        {profile.descIntro}
                                    </p>
                                </div>

                                {/* Quantity & Subtotal */}
                                <div className="detail-action-card">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                                        <div>
                                            <label className="fw-bold text-dark d-block mb-1 small text-uppercase">
                                                <i className="fas fa-calculator text-success me-1"></i> Chọn số lượng:
                                            </label>
                                            <div className="stepper-capsule">
                                                <button
                                                    type="button"
                                                    className="stepper-btn"
                                                    onClick={minus}
                                                    disabled={isOutOfStock || qty <= 1}
                                                    title="Giảm"
                                                >
                                                    <i className="fas fa-minus small"></i>
                                                </button>
                                                <span className="stepper-val">{qty}</span>
                                                <button
                                                    type="button"
                                                    className="stepper-btn"
                                                    onClick={plus}
                                                    disabled={isOutOfStock || qty >= stock}
                                                    title="Tăng"
                                                >
                                                    <i className="fas fa-plus small"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <div className="text-muted small">Tạm tính thanh toán:</div>
                                            <div className="fs-4 fw-extrabold text-success">{fmtVND(subtotal)}</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {isOutOfStock ? (
                                        <button className="btn btn-secondary w-100 py-3 rounded-pill fw-bold" disabled>
                                            <i className="fas fa-ban me-2"></i> Sản phẩm này hiện đang tạm hết hàng
                                        </button>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                className="btn-add-cart-modern flex-grow-1"
                                                onClick={handleAddToCart}
                                            >
                                                <i className="fas fa-cart-plus fs-5"></i>
                                                <span>{profile.btnAddToCart}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-buy-now-modern flex-grow-1"
                                                onClick={handleBuyNow}
                                            >
                                                <i className="fas fa-bolt fs-5"></i>
                                                <span>{profile.btnBuyNow}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Hotline */}
                                <div className="p-3 bg-light rounded-4 border text-muted small d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div>
                                        <i className="fas fa-headset text-success me-2 fs-5 align-middle"></i>
                                        <span>Cần hỗ trợ tư vấn & đặt số lượng lớn?</span>
                                    </div>
                                    <a href="tel:0987654321" className="fw-bold text-success text-decoration-none">
                                        <i className="fas fa-phone-volume me-1"></i> 0987 654 321
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Information Section */}
                <div className="detail-tabs-wrapper">
                    <div className="custom-nav-tabs">
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                            onClick={() => setActiveTab('desc')}
                        >
                            <i className="fas fa-file-lines me-2"></i> {profile.tabTitle1}
                        </button>
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
                            onClick={() => setActiveTab('nutrition')}
                        >
                            <i className="fas fa-heart-pulse me-2"></i> {profile.tabTitle2}
                        </button>
                        <button
                            type="button"
                            className={`custom-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <i className="fas fa-comments me-2"></i> Đánh Giá Từ Khách Hàng ({reviewData.total_reviews})
                        </button>
                    </div>

                    {/* Tab 1: Mô tả chi tiết */}
                    {activeTab === 'desc' && (
                        <div className="tab-content-panel">
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fas fa-leaf text-success me-2"></i> {profile.descTitle}
                            </h5>
                            <p className="text-secondary lh-lg mb-4" style={{ fontSize: '1rem' }}>
                                {profile.descIntro}
                            </p>

                            <div className="row g-4 mt-2">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">
                                            <i className="fas fa-lightbulb text-warning me-2"></i> {profile.guideTitle}
                                        </h6>
                                        <ul className="text-secondary small mb-0 ps-3 lh-lg">
                                            {profile.guideTips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">
                                            <i className="fas fa-shield-heart text-success me-2"></i> {profile.qualityTitle}
                                        </h6>
                                        <ul className="text-secondary small mb-0 ps-3 lh-lg">
                                            {profile.qualityStandards.map((std, idx) => (
                                                <li key={idx}>{std}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Nguyên liệu & Dinh dưỡng */}
                    {activeTab === 'nutrition' && (
                        <div className="tab-content-panel">
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fas fa-seedling text-success me-2"></i> {profile.nutritionTitle}
                            </h5>
                            <p className="text-secondary mb-4 small">
                                {profile.nutritionIntro}
                            </p>

                            <div className="row g-3 mb-4">
                                {profile.nutritionCards.map((c, idx) => (
                                    <div key={idx} className="col-sm-6 col-md-3">
                                        <div className="p-3 bg-light rounded-3 text-center border h-100 d-flex flex-column justify-content-center">
                                            <div className="text-muted small mb-1">{c.label}</div>
                                            <div className={`fs-5 fw-bold ${c.color}`}>{c.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="alert alert-success bg-opacity-10 border-success border-opacity-25 rounded-3 d-flex align-items-center gap-3">
                                <i className="fas fa-circle-check text-success fs-4"></i>
                                <div className="small">
                                    <strong>Lưu ý:</strong> {profile.allergyNotice}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Đánh giá nhận xét */}
                    {activeTab === 'reviews' && (
                        <div className="tab-content-panel">
                            <div className="row g-4 align-items-center mb-4">
                                <div className="col-md-4">
                                    <div className="rating-summary-card">
                                        <div className="text-muted small mb-2">Đánh Giá Trung Bình</div>
                                        <div className="rating-score-huge text-warning">
                                            {reviewData.rating_average > 0 ? reviewData.rating_average : '5.0'}
                                        </div>
                                        <div className="text-warning my-2 fs-5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <i key={s} className={s <= Math.round(reviewData.rating_average || 5) ? 'fas fa-star text-warning' : 'far fa-star text-muted opacity-50'}></i>
                                            ))}
                                        </div>
                                        <div className="text-muted small">Dựa trên {reviewData.total_reviews} lượt đánh giá thực tế</div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="p-3 bg-light rounded-4 border">
                                        <h6 className="fw-bold text-dark mb-2">Chính sách đánh giá minh bạch</h6>
                                        <p className="text-muted small mb-0">
                                            Tất cả đánh giá đều được gửi từ các khách hàng đã hoàn thành đơn hàng tại Fruitables nhằm đảm bảo tính khách quan và chân thực nhất.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {reviewData.reviews.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-light rounded-4 border">
                                    <i className="far fa-comment-dots fa-3x mb-3 text-secondary opacity-50"></i>
                                    <h6 className="fw-bold text-dark">Chưa có đánh giá nào</h6>
                                    <p className="text-muted small mb-0">Hãy đặt món và trở thành người đầu tiên để lại nhận xét cho món ăn này nhé!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {reviewData.reviews.map(r => (
                                        <div key={r.id} className="review-item-card">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="review-avatar">
                                                        {(r.ten_user || 'K').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold mb-0 text-dark">{esc(r.ten_user || 'Khách hàng')}</h6>
                                                        <div className="text-muted small">
                                                            <i className="far fa-calendar-alt me-1"></i>
                                                            {r.ngay_danh_gia ? new Date(r.ngay_danh_gia).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                                            <span className="badge bg-success bg-opacity-10 text-success ms-2 fw-semibold">
                                                                <i className="fas fa-check-circle me-1"></i> Đã mua hàng
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-warning">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <i key={s} className={s <= r.so_sao ? 'fas fa-star text-warning' : 'far fa-star text-muted opacity-50'}></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-0 text-secondary ps-md-5 pt-2" style={{ fontSize: '0.95rem' }}>
                                                {esc(r.noi_dung || 'Món ăn đóng gói rất cẩn thận, hương vị thơm ngon và giao nhanh!')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sản phẩm liên quan */}
                {related.length > 0 && (
                    <div className="mt-5 pt-3">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h3 className="fw-bold text-dark mb-1">
                                    <i className="fas fa-fire-flame-curved text-danger me-2"></i> Gợi Ý Món Ăn Cùng Danh Mục
                                </h3>
                                <p className="text-muted small mb-0">Các món ăn hấp dẫn khác bạn có thể thích trong thực đơn hôm nay</p>
                            </div>
                            <Link to={`/shop?category=${encodeURIComponent(product.danh_muc || 'Tất cả')}`} className="btn btn-outline-success rounded-pill btn-sm px-3 fw-bold">
                                Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {related.map(p => (
                                <ProductCard key={p.id} p={p} compact />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
