require('dotenv').config();
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const PRODUCTS = [
    // 1. Món Chế Biến Sẵn (Ready-to-eat)
    {
        id: 1,
        ten_san_pham: "Cơm Bò Xào Bông Cải Sốt Tiêu",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 55000,
        so_luong_ton: 30,
        hinh_anh: "1786036482174.webp",
        mo_ta: "Thịt bò thăn mềm mọng xào cùng bông cải xanh giòn ngọt, sốt tiêu đen đậm đà kèm cơm trắng dẻo thơm nóng hổi. Phần ăn đầy đủ dinh dưỡng cho bữa trưa và bữa tối."
    },
    {
        id: 2,
        ten_san_pham: "Thịt Heo Kho Tàu Trứng Cút (Kèm Cơm)",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 50000,
        so_luong_ton: 25,
        hinh_anh: "1786036788088.webp",
        mo_ta: "Thịt ba chỉ kho mềm rục với nước dừa tươi béo ngậy, trứng cút ngấm vị mặn ngọt truyền thống. Ăn kèm dưa chua giòn rụm và cơm nóng."
    },
    {
        id: 3,
        ten_san_pham: "Canh Chua Tôm Sú Nam Bộ (Tô Lớn)",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 45000,
        so_luong_ton: 20,
        hinh_anh: "1786037230275.webp",
        mo_ta: "Tôm sú tươi ngọt thịt nấu cùng dứa chín, cà chua đỏ mọng, đậu bắp giòn và nước cốt me chua thanh ngọt hậu, rắc ngò gai ngò om thơm lừng."
    },
    {
        id: 4,
        ten_san_pham: "Cơm Sườn Xào Chua Ngọt Bắc Bộ",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 55000,
        so_luong_ton: 30,
        hinh_anh: "1786036904867.webp",
        mo_ta: "Sườn heo non chặt vừa miếng chiên xém vàng, ngấm đẫm lớp sốt chua ngọt giấm táo sánh dẻo óng ả. Món ăn khoái khẩu cực kỳ đưa cơm."
    },
    {
        id: 5,
        ten_san_pham: "Gà Chiên Nước Mắm Giòn Cay",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 48000,
        so_luong_ton: 25,
        hinh_anh: "1786036842355.webp",
        mo_ta: "Thịt gà tươi chiên vàng giòn rụm lớp da ngoài, bên trong ẩm mềm ngọt nước, đảo đều với sốt nước mắm tỏi ớt kẹo cay ngọt đậm vị."
    },
    {
        id: 6,
        ten_san_pham: "Mực Xào Dứa Thơm Giòn Cay",
        danh_muc: "Món Chế Biến Sẵn",
        gia: 60000,
        so_luong_ton: 20,
        hinh_anh: "1786036920587.webp",
        mo_ta: "Mực ống tươi khía vảy rồng xào trên lửa lớn cùng dứa chua ngọt và cần tây, giữ trọn độ giòn ngọt sần sật đặc trưng của hải sản biển."
    },

    // 2. Set Nấu Ăn Meal-kit (Ready-to-cook)
    {
        id: 7,
        ten_san_pham: "[Meal-kit] Set Canh Chua Tôm Tươi Sơ Chế Sẵn",
        danh_muc: "Set Nấu Ăn (Meal-kit)",
        gia: 65000,
        so_luong_ton: 15,
        hinh_anh: "1786037230275.webp",
        mo_ta: "Khay nguyên liệu định lượng chuẩn: 300g tôm sú bóc nõn sạch rút chỉ lưng + dứa, đậu bắp, giá đỗ, ngò om và chai cốt me nêm sẵn gia vị. Tự nấu thơm ngon chỉ 10 phút."
    },
    {
        id: 8,
        ten_san_pham: "[Meal-kit] Set Bò Tươi Ướp Sốt & Bông Cải VietGAP",
        danh_muc: "Set Nấu Ăn (Meal-kit)",
        gia: 75000,
        so_luong_ton: 18,
        hinh_anh: "1786036482174.webp",
        mo_ta: "Khay gồm 300g thịt thăn bò thái mỏng ướp sẵn dầu hào tỏi mè + 1 cây bông cải xanh tách nhánh sạch + cà rốt hoa. Chỉ cần xào nhanh trên chảo nóng 5 phút."
    },
    {
        id: 9,
        ten_san_pham: "[Meal-kit] Set Thịt Ba Chỉ & Trứng Cút Kho Tàu",
        danh_muc: "Set Nấu Ăn (Meal-kit)",
        gia: 70000,
        so_luong_ton: 15,
        hinh_anh: "1786036788088.webp",
        mo_ta: "Gồm 400g thịt ba chỉ cắt vuông chần sạch + 15 quả trứng cút luộc bóc vỏ + gói nước dừa xiêm tự nhiên và sốt kho thắng đường chuẩn màu cánh gián."
    },
    {
        id: 10,
        ten_san_pham: "[Meal-kit] Set Sườn Heo Ướp Sốt Chua Ngọt",
        danh_muc: "Set Nấu Ăn (Meal-kit)",
        gia: 75000,
        so_luong_ton: 12,
        hinh_anh: "1786036904867.webp",
        mo_ta: "500g sườn sụn non sơ chế sạch chặt miếng + chai sốt chua ngọt pha chế công thức độc quyền từ nước cốt dứa và giấm gạo. Nấu tiện lợi tại nhà."
    },
    {
        id: 11,
        ten_san_pham: "[Meal-kit] Set Đậu Hũ Nhồi Thịt Sốt Cà Chua",
        danh_muc: "Set Nấu Ăn (Meal-kit)",
        gia: 50000,
        so_luong_ton: 20,
        hinh_anh: "1786036870851.webp",
        mo_ta: "4 bìa đậu hũ nhồi thịt nạc băm nấm mèo gia vị thơm nức + khay cà chua lột vỏ băm nhuyễn và hành lá tươi. Nấu sốt cà chua sệt trong 10 phút."
    },

    // 3. Đồ Uống & Tráng Miệng
    {
        id: 12,
        ten_san_pham: "Nước Ép Trái Cây Tự Nhiên (Chai 350ml)",
        danh_muc: "Đồ Uống & Tráng Miệng",
        gia: 35000,
        so_luong_ton: 40,
        hinh_anh: "nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg",
        mo_ta: "Nước ép nguyên chất ép chậm từ cam sành, cà rốt và táo đỏ hữu cơ, thanh mát, bổ sung dồi dào vitamin C giúp tăng sức đề kháng."
    },
    {
        id: 13,
        ten_san_pham: "Hộp Trái Cây Tươi Cắt Sẵn Theo Mùa",
        danh_muc: "Đồ Uống & Tráng Miệng",
        gia: 30000,
        so_luong_ton: 25,
        hinh_anh: "fruite-item-2.jpg",
        mo_ta: "Hộp trái cây tươi gọt sẵn đóng kín gồm thanh long ruột đỏ, táo Mỹ và ổi giòn ướp lạnh, kèm hũ muối tôm Tây Ninh hảo hạng."
    },

    // 4. Nông Sản & Nguyên Liệu Tươi Sạch
    {
        id: 14,
        ten_san_pham: "Cà Chua Bi Hữu Cơ VietGAP (Hộp 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 25000,
        so_luong_ton: 50,
        hinh_anh: "1786008268041.jpg",
        mo_ta: "Cà chua bi tươi giòn, ngọt thanh, quả tròn đều chín mọng trồng theo tiêu chuẩn hữu cơ tại nông trường Đà Lạt Lâm Đồng."
    },
    {
        id: 15,
        ten_san_pham: "Khoai Tây Đà Lạt Tươi Sạch (Túi 1kg)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 35000,
        so_luong_ton: 45,
        hinh_anh: "1786008327361.jpg",
        mo_ta: "Khoai tây vàng ruột dẻo thơm, không mọc mầm, giàu vitamin C và khoáng chất, thích hợp làm các món xào, súp hầm hoặc chiên giòn."
    },
    {
        id: 16,
        ten_san_pham: "Bông Cải Xanh Đà Lạt (Cây 400g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 30000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Bông cải xanh (súp lơ xanh) bông to chắc, búp xanh mướt giòn ngọt tự nhiên, giàu chất xơ, vitamin K và chất chống oxy hóa."
    },

    // 5. Thịt & Hải Sản Tươi Sống
    {
        id: 17,
        ten_san_pham: "Tôm Sú Tươi Sống Nam Bộ (Khay 300g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 65000,
        so_luong_ton: 30,
        hinh_anh: "1786037230275.webp",
        mo_ta: "Tôm sú tươi sống bơi khỏe, thịt chắc ngọt đậm đà, giàu canxi và đạm, thích hợp nấu canh chua tôm, tôm rim mặn ngọt hoặc hấp bia."
    },
    {
        id: 18,
        ten_san_pham: "Thịt Thăn Bò Tươi VietGAP (Khay 300g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 75000,
        so_luong_ton: 25,
        hinh_anh: "1786036482174.webp",
        mo_ta: "Thịt thăn bò tươi mềm ngọt, thớ mịn không gân dai, đạt chuẩn VietGAP, chuyên dùng cho các món bò xào bông cải, cần tây hay bò sốt tiêu."
    },
    {
        id: 19,
        ten_san_pham: "Thịt Ba Chỉ Heo Tươi Sạch (Khay 400g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 58000,
        so_luong_ton: 30,
        hinh_anh: "1786036788088.webp",
        mo_ta: "Thịt ba chỉ heo tươi sạch tỷ lệ nạc mỡ cân đối, bì mỏng, thích hợp kho tàu trứng cút, luộc chấm mắm tôm hay rang cháy cạnh."
    },
    {
        id: 20,
        ten_san_pham: "Sườn Non Heo Tươi Chọn Lọc (Khay 500g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 72000,
        so_luong_ton: 20,
        hinh_anh: "1786036904867.webp",
        mo_ta: "Sườn non heo nhiều sụn giòn, dảnh xương nhỏ, thịt tươi mềm, lý tưởng cho món sườn xào chua ngọt, sườn nướng mật ong hoặc canh sườn."
    },
    {
        id: 21,
        ten_san_pham: "Thịt Gà Ta Thả Vườn Sơ Chế (Nửa Con 700g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 68000,
        so_luong_ton: 20,
        hinh_anh: "1786036842355.webp",
        mo_ta: "Thịt gà ta da vàng giòn, thịt thơm chắc ngọt không bị bở, chuyên dùng làm gà chiên nước mắm, luộc lá chanh hoặc xào sả ớt."
    },
    {
        id: 22,
        ten_san_pham: "Cá Lóc Tươi Cắt Khúc Sạch (Khay 450g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 48000,
        so_luong_ton: 25,
        hinh_anh: "1786007478565.webp",
        mo_ta: "Cá lóc đồng tươi sống làm sạch vảy mổ ruột cắt khúc đều, thịt trắng ngọt dai, nấu canh chua cá lóc hoặc kho tộ đưa cơm tuyệt đỉnh."
    },
    {
        id: 23,
        ten_san_pham: "Mực Ống Tươi Cấp Đông Biển (Khay 350g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 62000,
        so_luong_ton: 20,
        hinh_anh: "1786036920587.webp",
        mo_ta: "Mực ống biển tươi rói dày mình, thịt giòn ngọt sần sật, hoàn hảo cho món mực xào dứa chua ngọt, hấp gừng hoặc chiên giòn."
    },
    {
        id: 24,
        ten_san_pham: "Trứng Gà Ta Tươi Mới (Hộp 10 quả)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 35000,
        so_luong_ton: 60,
        hinh_anh: "1786037340314.webp",
        mo_ta: "Trứng gà ta chuẩn sạch, lòng đỏ to vàng au thơm béo, vỏ dày sạch sẽ, giàu protein và vitamin nhóm B."
    },
    {
        id: 25,
        ten_san_pham: "Trứng Cút Tươi Chọn Lọc (Hộp 30 quả)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 22000,
        so_luong_ton: 40,
        hinh_anh: "1786036788088.webp",
        mo_ta: "Trứng cút tươi đều quả, giàu dinh dưỡng, thích hợp nấu cùng thịt kho tàu, nấu súp hoặc luộc ăn kèm salad."
    },
    {
        id: 26,
        ten_san_pham: "Đậu Hũ Trắng Tươi Mới (Hộp 4 miếng)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 15000,
        so_luong_ton: 35,
        hinh_anh: "1786036870851.webp",
        mo_ta: "Đậu phụ non đậu nành nguyên chất 100%, mềm mịn béo ngậy, dùng nhồi thịt sốt cà chua, nấu canh hoặc chiên vàng giòn."
    },
    {
        id: 37,
        ten_san_pham: "Dẻ Sườn & Nạm Bắp Bò Úc (Khay 400g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 85000,
        so_luong_ton: 25,
        hinh_anh: "raw_beef_ribs.jpg",
        mo_ta: "Dẻ sườn và bắp bò vân mỡ đan xen đều, thịt mềm ngọt ngậy, dẻo sần sật, nguyên liệu hoàn hảo nhất cho món Bò sốt vang, Bò kho hay Bò hầm tiêu."
    },
    {
        id: 38,
        ten_san_pham: "Cua Đồng Tươi Xay Sạch (Túi 400g kèm gạch)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 45000,
        so_luong_ton: 30,
        hinh_anh: "1786007637594.webp",
        mo_ta: "Cua đồng tươi sống giã nhuyễn lọc sẵn kèm túi gạch vàng óng thơm lừng, chuyên nấu canh cua mồng tơi, bún riêu cua."
    },
    {
        id: 39,
        ten_san_pham: "Chả Lụa Bì Ớt Xiêm Xanh (Cây 300g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 45000,
        so_luong_ton: 25,
        hinh_anh: "cha-lua-bi-ot-xiem-xanh-meatdeli-cay-300g-clone_202509161340134561.webp",
        mo_ta: "Chả lụa bì giòn sần sật thơm nồng ớt xiêm xanh, ăn liền hoặc xào nóng cùng cơm trắng."
    },
    {
        id: 40,
        ten_san_pham: "Cá Hồi Tươi Phi Lê Na Uy (Khay 300g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 125000,
        so_luong_ton: 20,
        hinh_anh: "1786037065573.webp",
        mo_ta: "Cá hồi tươi phi lê nhập khẩu, giàu Omega-3 và DHA, thích hợp áp chảo sốt bơ chanh hoặc nấu canh chua cá hồi."
    },
    {
        id: 41,
        ten_san_pham: "Cá Diêu Hồng Tươi Sạch (Con 800g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 55000,
        so_luong_ton: 20,
        hinh_anh: "1786007478565.webp",
        mo_ta: "Cá diêu hồng tươi sống làm sạch mang vảy, thịt nạc ngọt dày, chuyên làm món hấp xì dầu hoặc chiên xù sốt cà."
    },
    {
        id: 42,
        ten_san_pham: "Nghêu Sống Bến Tre (Túi 1kg)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 38000,
        so_luong_ton: 30,
        hinh_anh: "1786037166093.webp",
        mo_ta: "Nghêu sống tươi béo múp ngâm sạch cát, chuyên dùng nấu canh chua nghêu hoặc nghêu hấp sả ớt."
    },
    {
        id: 43,
        ten_san_pham: "Bạch Tuộc Tươi Biển Sạch (Khay 400g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 65000,
        so_luong_ton: 20,
        hinh_anh: "1786036920587.webp",
        mo_ta: "Bạch tuộc tươi giòn ngọt sần sật, hoàn hảo cho món nướng sa tế hoặc xào cay cần tây."
    },
    {
        id: 44,
        ten_san_pham: "Thịt Heo Xay Nạc Vai Tươi (Khay 300g)",
        danh_muc: "Thịt & Hải Sản Tươi",
        gia: 42000,
        so_luong_ton: 35,
        hinh_anh: "1786036870851.webp",
        mo_ta: "Thịt nạc vai heo xay nhuyễn tỷ lệ nạc 85% mỡ 15%, dùng làm nhân đậu hũ nhồi, nem rán, canh thịt băm."
    },

    // 6. Rau Củ & Nông Sản Tươi Bổ Sung
    {
        id: 27,
        ten_san_pham: "Dứa (Thơm) Chín Mật Gọt Sẵn (Hộp 1 quả)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 20000,
        so_luong_ton: 40,
        hinh_anh: "vegetable-item-4.jpg",
        mo_ta: "Dứa mật chín vàng ươm ngọt lịm mọng nước, gọt sạch mắt tiện lợi, thích hợp nấu canh chua, xào mực hoặc ép nước giải khát."
    },
    {
        id: 28,
        ten_san_pham: "Đậu Bắp Xanh Tươi Non (Túi 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 15000,
        so_luong_ton: 45,
        hinh_anh: "vegetable-item-5.jpg",
        mo_ta: "Đậu bắp non giòn mướt không xơ cứng, giàu chất nhầy tốt cho dạ dày, chuyên nấu canh chua, luộc chấm chao hoặc nướng mỡ hành."
    },
    {
        id: 29,
        ten_san_pham: "Giá Đỗ Sạch Hữu Cơ Tươi Giòn (Túi 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 12000,
        so_luong_ton: 50,
        hinh_anh: "vegetable-item-1.jpg",
        mo_ta: "Giá đỗ thân mập giòn ngọt tự nhiên ủ hoàn toàn từ đậu xanh sạch, ăn sống kèm bún bò, nấu canh chua hoặc làm dưa giá."
    },
    {
        id: 30,
        ten_san_pham: "Cà Rốt Đà Lạt Tươi Giòn (Túi 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 18000,
        so_luong_ton: 40,
        hinh_anh: "vegetable-item-2.jpg",
        mo_ta: "Cà rốt củ tươi thẳng màu cam đậm, vị ngọt giòn thanh, dồi dào Beta-Carotene và vitamin A, thích hợp hầm canh, xào thịt hoặc bào sợi nộm."
    },
    {
        id: 31,
        ten_san_pham: "Cần Tây Tươi Giòn Đà Lạt (Túi 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 16000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-3.png",
        mo_ta: "Cần tây xanh mướt cọng giòn thơm nồng, thích hợp xào thịt bò, xào mực hải sản hoặc làm nước ép detox."
    },
    {
        id: 32,
        ten_san_pham: "Combo Hành Lá, Ngò Om & Ngò Gai (Gói 150g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 10000,
        so_luong_ton: 50,
        hinh_anh: "1786007443212.webp",
        mo_ta: "Gói rau thơm gia vị tổng hợp tươi sạch gồm hành lá, ngò gai (mùi tàu) và ngò om (ngổ hương) cho món canh chua chuẩn vị Nam Bộ."
    },
    {
        id: 33,
        ten_san_pham: "Cốt Me Chua Tự Nhiên (Hộp 200g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 15000,
        so_luong_ton: 40,
        hinh_anh: "1786007743217.jpg",
        mo_ta: "Me chua vắt chín dẻo nguyên chất, vị chua thanh tự nhiên không gắt, tạo nước dùng canh chua, sốt me sườn xào hay cánh gà sốt me."
    },
    {
        id: 34,
        ten_san_pham: "Mộc Nhĩ & Nấm Hương Khô Rừng (Gói 100g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 28000,
        so_luong_ton: 30,
        hinh_anh: "1786008422050.webp",
        mo_ta: "Nấm hương khô thơm lừng kết hợp mộc nhĩ tai dày giòn sần sật, nguyên liệu không thể thiếu cho món nem rán, thịt nhồi hay canh bóng."
    },
    {
        id: 35,
        ten_san_pham: "Nấm Kim Châm Tươi (Gói 150g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 14000,
        so_luong_ton: 40,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Nấm kim châm trắng muốt giòn ngọt tươi ngon, thích hợp cuộn thịt bò nướng, nấu lẩu hoặc nấu canh giải nhiệt."
    },
    {
        id: 36,
        ten_san_pham: "Bí Đỏ Hồ Lô Dẻo Ngọt (Quả 800g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 22000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-5.jpg",
        mo_ta: "Bí đỏ hồ lô hạt nhỏ thịt vàng cam dẻo bùi béo ngọt, giàu vitamin A và khoáng chất, chuyên nấu canh sườn bí đỏ hoặc làm sữa hạt."
    },
    {
        id: 46,
        ten_san_pham: "Bắp Cải Trắng Đà Lạt (Bắp 800g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 20000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Bắp cải cuốn chắc bẹ, ngọt giòn mọng nước, dùng luộc chấm trứng dầm nước mắm hoặc xào thịt bò."
    },
    {
        id: 47,
        ten_san_pham: "Bí Đao Xanh Thơm (Quả 700g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 18000,
        so_luong_ton: 30,
        hinh_anh: "vegetable-item-5.jpg",
        mo_ta: "Bí đao quả đặc ruột thanh mát giải nhiệt, nấu canh sườn hoặc xào lòng gà."
    },
    {
        id: 48,
        ten_san_pham: "Su Su & Cà Rốt Tươi Đà Lạt (Túi 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 16000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-2.jpg",
        mo_ta: "Su su giòn ngọt kết hợp cà rốt, thích hợp xào thịt heo, xào lòng hoặc nấu canh thanh mát."
    },
    {
        id: 49,
        ten_san_pham: "Măng Tây Xanh Loại 1 (Bó 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 35000,
        so_luong_ton: 25,
        hinh_anh: "vegetable-item-3.png",
        mo_ta: "Măng tây thân mập giòn ngọt, giàu dinh dưỡng, hoàn hảo cho món xào thịt bò hoặc áp chảo bơ tỏi."
    },
    {
        id: 50,
        ten_san_pham: "Đậu Hà Lan Tươi Giòn (Túi 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 25000,
        so_luong_ton: 30,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Đậu hà lan ngọt bùi tự nhiên, dùng nấu súp, xào hải sản hoặc cơm rang thập cẩm."
    },
    {
        id: 51,
        ten_san_pham: "Dưa Leo / Dưa Chuột Nếp Giòn (Túi 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 15000,
        so_luong_ton: 45,
        hinh_anh: "vegetable-item-4.jpg",
        mo_ta: "Dưa leo nếp đặc ruột giòn ngọt thơm nức, ăn sống kèm món kho hoặc làm nộm dưa chua ngọt."
    },
    {
        id: 52,
        ten_san_pham: "Rau Muống Sạch Nước Ngọt (Bó 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 14000,
        so_luong_ton: 50,
        hinh_anh: "1786007443212.webp",
        mo_ta: "Rau muống ngọn non xanh mướt, xào tỏi giòn sần sật hoặc luộc vắt chanh thanh nhiệt."
    },
    {
        id: 53,
        ten_san_pham: "Cải Thìa & Cải Ngọt VietGAP (Bó 400g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 16000,
        so_luong_ton: 40,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Cải thìa tươi non giòn ngọt, chuyên xào dầu hào, xào nấm đông cô hoặc nấu canh tôm."
    },
    {
        id: 54,
        ten_san_pham: "Xà Lách Mỡ & Rau Thơm Tổng Hợp (Gói 300g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 15000,
        so_luong_ton: 40,
        hinh_anh: "fruite-item-4.jpg",
        mo_ta: "Combo rau xà lách tươi sạch, tía tô, kinh giới, húng quế ăn kèm các món cuốn, bún riêu, thịt kho."
    },
    {
        id: 55,
        ten_san_pham: "Khoai Lang Mật Đà Lạt (Túi 1kg)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 30000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-5.jpg",
        mo_ta: "Khoai lang mật vàng dẻo quánh tươm mật ngọt ngào, nướng hoặc hấp thơm lừng."
    },
    {
        id: 56,
        ten_san_pham: "Bắp / Ngô Ngọt Mỹ Tươi (Set 2 bắp)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 18000,
        so_luong_ton: 40,
        hinh_anh: "vegetable-item-4.jpg",
        mo_ta: "Bắp ngọt hạt căng mọng vàng ươm ngọt lịm, dùng nấu canh sườn, xào bơ tép hoặc luộc ăn liền."
    },
    {
        id: 57,
        ten_san_pham: "Khổ Qua / Mướp Đắng Rừng (Túi 400g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 22000,
        so_luong_ton: 30,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Khổ qua tươi xanh giòn đậm vị, chuyên dùng làm khổ qua nhồi thịt hoặc xào trứng."
    },
    {
        id: 58,
        ten_san_pham: "Ớt Chuông Đà Lạt Ba Màu (Túi 400g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 28000,
        so_luong_ton: 30,
        hinh_anh: "vegetable-item-1.jpg",
        mo_ta: "Ớt chuông đỏ vàng xanh giòn ngọt không cay, giàu vitamin C, xào bò sốt tiêu hoặc làm salad."
    },
    {
        id: 59,
        ten_san_pham: "Combo Khoai Tây & Cà Rốt Tươi Cắt Sẵn (Khay 500g)",
        danh_muc: "Rau Củ & Nông Sản Tươi",
        gia: 22000,
        so_luong_ton: 35,
        hinh_anh: "potatoes_carrots_prep.jpg",
        mo_ta: "Khay khoai tây vàng dẻo và cà rốt tươi gọt sạch cắt khối vừa ăn, chuyên nấu canh xương, bò sốt vang hay súp rau củ."
    },

    // 7. Gia Vị & Nông Sản Bếp Nấu Ăn
    {
        id: 60,
        ten_san_pham: "Rượu Vang Đỏ Nấu Ăn & Sốt Vang (Chai 375ml)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 45000,
        so_luong_ton: 30,
        hinh_anh: "red_wine_cooking.jpg",
        mo_ta: "Rượu vang đỏ Cabernet chuyên dùng cho ẩm thực, tạo hương thơm nồng nàn quyến rũ và màu đỏ sánh óng ả cho món Bò sốt vang."
    },
    {
        id: 61,
        ten_san_pham: "Bơ Lạt Nấu Ăn & Tỏi Băm Tiện Lợi (Hộp 150g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 25000,
        so_luong_ton: 40,
        hinh_anh: "butter_garlic.jpg",
        mo_ta: "Bơ lạt Anchor béo ngậy kèm hũ tỏi ta băm nhuyễn phi thơm, linh hồn tạo độ thơm béo cho món bò sốt vang và bánh mì bơ tỏi."
    },
    {
        id: 62,
        ten_san_pham: "Sốt Cà Chua Paste Đậm Đặc (Hũ 200g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 22000,
        so_luong_ton: 45,
        hinh_anh: "tomato_paste.jpg",
        mo_ta: "Cà chua cô đặc nguyên chất 100%, màu đỏ tự nhiên sánh dẻo, tạo nước dùng sền sệt chua thanh chuẩn vị Âu - Á."
    },
    {
        id: 63,
        ten_san_pham: "Combo Thảo Mộc Gia Vị (Quế, Hoa Hồi, Thảo Quả) (Gói 50g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 18000,
        so_luong_ton: 50,
        hinh_anh: "spices_cinnamon_anise.jpg",
        mo_ta: "Set gia vị khô thảo mộc rừng tự nhiên gồm quế thanh, hoa hồi và thảo quả nướng thơm, chuyên dùng nấu Bò sốt vang, Bò kho, Phở bò."
    },
    {
        id: 64,
        ten_san_pham: "Bột Bắp / Bột Năng Cao Cấp (Gói 250g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 12000,
        so_luong_ton: 60,
        hinh_anh: "cornstarch_pack.jpg",
        mo_ta: "Bột bắp trắng tinh khiết tạo độ sánh mịn bóng mượt cho các món sốt vang, súp gà hoặc tẩm chiên giòn."
    },
    {
        id: 65,
        ten_san_pham: "Nước Dừa Xiêm Tươi Bến Tre (Hộp 330ml)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 18000,
        so_luong_ton: 50,
        hinh_anh: "nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg",
        mo_ta: "Nước dừa xiêm ngọt thanh tự nhiên 100%, chuyên dùng kho thịt kho tàu, nấu cari hoặc om gà."
    },
    {
        id: 66,
        ten_san_pham: "Tỏi Cô Đơn & Hành Tím Lý Sơn (Túi 300g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 25000,
        so_luong_ton: 50,
        hinh_anh: "vegetable-item-5.jpg",
        mo_ta: "Tỏi và hành tím củ chắc cay nồng thơm lừng, gia vị phi thơm nền tảng cho mọi món xào kho Việt."
    },
    {
        id: 67,
        ten_san_pham: "Gừng Tươi & Sả Cây Tươi Sạch (Gói 250g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 12000,
        so_luong_ton: 50,
        hinh_anh: "vegetable-item-2.jpg",
        mo_ta: "Gừng sẻ cay nồng và sả cây đập dập thơm lừng, khử tanh hải sản biển, nấu gà xào sả ớt hay hấp nghêu."
    },
    {
        id: 68,
        ten_san_pham: "Ớt Hiểm & Tiêu Sọ Phú Quốc (Combo 100g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 20000,
        so_luong_ton: 50,
        hinh_anh: "1786007743217.jpg",
        mo_ta: "Tiêu sọ thơm cay nồng ấm và ớt hiểm cay nồng đặc trưng, tạo hương vị đậm đà cho bữa cơm."
    },
    {
        id: 69,
        ten_san_pham: "Dầu Hào Thượng Hạng Maggi (Chai 350g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 24000,
        so_luong_ton: 45,
        hinh_anh: "1786036482174.webp",
        mo_ta: "Dầu hào sánh đậm vị ngọt hàu tự nhiên, ướp thịt bò nướng hoặc đảo rau xào bóng mượt."
    },
    {
        id: 70,
        ten_san_pham: "Dầu Mè Thơm Tinh Khiết (Chai 150ml)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 28000,
        so_luong_ton: 40,
        hinh_anh: "1786036870851.webp",
        mo_ta: "Dầu mè nguyên chất thơm phức, nhỏ vài giọt khi hoàn thiện món súp, trứng hoặc ướp thịt bò."
    },
    {
        id: 71,
        ten_san_pham: "Nước Mắm Cá Cơm Phú Quốc 40 Độ Đạm (Chai 500ml)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 48000,
        so_luong_ton: 50,
        hinh_anh: "1786007443212.webp",
        mo_ta: "Nước mắm truyền thống cốt cá cơm ủ chượp tự nhiên màu cánh gián, vị ngọt hậu đậm đà."
    },
    {
        id: 72,
        ten_san_pham: "Mắm Tôm & Mắm Nêm Truyền Thống (Hũ 200g)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 18000,
        so_luong_ton: 40,
        hinh_anh: "1786007637594.webp",
        mo_ta: "Mắm tôm Bắc chuẩn vị thơm ngon, dùng pha chanh đường ớt chấm thịt luộc, cà pháo hay bún đậu."
    },
    {
        id: 73,
        ten_san_pham: "Mật Ong Rừng Tự Nhiên (Hũ 250ml)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 65000,
        so_luong_ton: 30,
        hinh_anh: "fruite-item-3.jpg",
        mo_ta: "Mật ong rừng nguyên chất sánh vàng ngọt thơm, chuyên dùng ướp sườn nướng mật ong hay pha nước ấm."
    },
    {
        id: 74,
        ten_san_pham: "Giấm Gạo & Nước Tương Đậm Đặc (Combo 2 chai)",
        danh_muc: "Gia Vị & Nông Sản Bếp",
        gia: 26000,
        so_luong_ton: 40,
        hinh_anh: "1786007743217.jpg",
        mo_ta: "Bộ đôi giấm gạo lên men tự nhiên làm sốt chua ngọt và nước tương đậu nành nguyên chất đậm vị."
    }
];

async function seedProductsMySQL() {
    console.log('\n--- 1. CẬP NHẬT SẢN PHẨM VÀO MYSQL ---');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'web_ban_do_an',
            charset: 'utf8mb4'
        });

        for (const p of PRODUCTS) {
            const [rows] = await connection.query('SELECT id FROM san_pham WHERE id = ?', [p.id]);
            if (rows.length > 0) {
                await connection.query(`
                    UPDATE san_pham SET
                        ten_san_pham = ?,
                        danh_muc = ?,
                        gia = ?,
                        so_luong_ton = ?,
                        hinh_anh = ?,
                        mo_ta = ?
                    WHERE id = ?
                `, [p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta, p.id]);
            } else {
                await connection.query(`
                    INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [p.id, p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta]);
            }
        }

        console.log(`✅ Đã cập nhật thành công ${PRODUCTS.length} sản phẩm (Món ăn chế biến sẵn + Meal-kit + Đồ uống) vào MySQL.`);
        await connection.end();
    } catch (err) {
        console.error('❌ Lỗi seed sản phẩm MySQL:', err.message);
    }
}

function seedProductsSQLite() {
    console.log('\n--- 2. CẬP NHẬT SẢN PHẨM VÀO SQLITE ---');
    const dbPath = path.join(__dirname, '..', 'data', process.env.DB_FILE || 'app.db');
    if (!fs.existsSync(dbPath)) return;

    try {
        const db = new Database(dbPath);
        const checkStmt = db.prepare('SELECT id FROM san_pham WHERE id = ?');
        const updateStmt = db.prepare(`
            UPDATE san_pham SET
                ten_san_pham = ?,
                danh_muc = ?,
                gia = ?,
                so_luong_ton = ?,
                hinh_anh = ?,
                mo_ta = ?
            WHERE id = ?
        `);
        const insertStmt = db.prepare(`
            INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        db.transaction(() => {
            for (const p of PRODUCTS) {
                const row = checkStmt.get(p.id);
                if (row) {
                    updateStmt.run(p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta, p.id);
                } else {
                    insertStmt.run(p.id, p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta);
                }
            }
        })();

        console.log(`✅ Đã cập nhật thành công ${PRODUCTS.length} sản phẩm vào SQLite.`);
        db.close();
    } catch (err) {
        console.error('❌ Lỗi seed sản phẩm SQLite:', err.message);
    }
}

async function run() {
    await seedProductsMySQL();
    seedProductsSQLite();
    
    // Xuất lại mysql_sync.sql
    const { execSync } = require('child_process');
    try {
        const scriptPath = path.join(__dirname, 'export_mysql_to_d1.js');
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error('Lỗi export dump:', e.message);
    }
    console.log('\n🎉 HOÀN THÀNH CẬP NHẬT TOÀN BỘ SẢN PHẨM MÓN ĂN & MEAL-KIT!\n');
}

module.exports = { PRODUCTS };

if (require.main === module) {
    run();
}
