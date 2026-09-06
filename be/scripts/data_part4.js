// ============================================================
// Dữ liệu món ăn phần 4: Món Ăn Kèm, Trứng, Nhắm & Tráng Miệng (IDs: 46 - 53)
// Quy chuẩn đầu bếp: Các bước chi tiết, kỹ thuật nhiệt, thời gian, doneness check
// ============================================================

const PART_4 = {
    46: {
        mo_ta: "Trứng ốp la viền giòn rụm màu vàng nâu thơm phức, lòng trắng chín đông mềm mọng, lòng đào vàng óng dẻo béo ngậy tan chảy chấm bánh mì hay xì dầu cực phẩm.",
        do_kho: "Dễ",
        khau_phan: "1 - 2 người",
        thoi_gian_chuan_bi: 2,
        thoi_gian_nau: 3,
        nguyen_lieu_chi_tiet: [
            { ten: "Trứng gà tươi mới", so_luong: 2, don_vi: "quả", ghi_chu: "trứng mới lòng đỏ căng tròn không vỡ" },
            { ten: "Dầu ăn hoặc bơ lạt", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo mùi thơm ngậy" },
            { ten: "Muối tiêu hoặc nước tương", so_luong: 1, don_vi: "chút", ghi_chu: "rắc lên bề mặt" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Làm nóng chảo & Canh nhiệt viền giòn",
                thoi_gian: "1 phút",
                noi_dung: "Đặt chảo chống dính lên bếp bật lửa vừa với 1 muỗng canh dầu ăn (hoặc bơ lạt). Đun nóng già đến khi dầu lăn tăn sủi bọt nhẹ."
            },
            {
                buoc: 2,
                tieu_de: "Kỹ thuật đập trứng giữ nguyên lòng đỏ",
                thoi_gian: "30 giây",
                noi_dung: "Hạ lửa xuống mức nhỏ vừa, đập nhẹ nhàng từng quả trứng gà sát mặt chảo để lòng đỏ nằm nguyên vẹn tròn trịa ở chính giữa lòng trắng, không bị vỡ màng."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật hấp hơi chín lòng đào hoàn hảo",
                thoi_gian: "1.5 phút",
                noi_dung: "Rán trong 1 phút cho viền lòng trắng xém vàng giòn rụm. Nhỏ 1 thìa cà phê nước lọc vào mép chảo rồi đậy vung lại ngay trong 30 giây (hơi nước bốc lên sẽ làm chín se lớp màng trên của lòng trắng trong khi lòng đỏ bên trong vẫn dẻo quánh sóng sánh)."
            },
            {
                buoc: 4,
                tieu_de: "Trình bày & Rắc tiêu",
                thoi_gian: "30 giây",
                noi_dung: "Dùng xẻng dẹt nhẹ nhàng múc trứng ra đĩa, rắc chút muối tiêu sọ và vài giọt nước tương lên bề mặt, thưởng thức ngay khi còn nóng giòn cùng bánh mì."
            }
        ],
        meo_nau_an: "Bí quyết lòng đào chín dẻo không sống tanh: Nhỏ 1 thìa nước lọc vào mép chảo và đậy vung 30 giây cuối; hơi nước sẽ nấu chín màng lòng trắng trên cùng mà viền đáy vẫn giòn rụm.",
        dinh_duong: { calo: 190, protein: "13g", chat_beo: "15g", carb: "1g" },
        tags: ["Bữa sáng nhanh", "Lòng đào béo ngậy", "Giàu đạm", "Ăn kèm bánh mì"]
    },

    47: {
        mo_ta: "Dưa giá đỗ muối chua ngọt giòn sần sật điểm sắc xanh của hẹ và sắc cam của cà rốt, món ăn kèm thanh mát giải ngấy hoàn hảo cho thịt kho tàu hay nem rán.",
        do_kho: "Dễ",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Giá đỗ sạch mập mạp", so_luong: 300, don_vi: "g", ghi_chu: "rửa sạch ngắt bớt chân rễ dài" },
            { ten: "Bông hẹ tươi", so_luong: 100, don_vi: "g", ghi_chu: "rửa sạch cắt khúc 4cm" },
            { ten: "Cà rốt tươi", so_luong: 0.5, don_vi: "củ", ghi_chu: "bào sợi mỏng dài 4cm" },
            { ten: "Giấm gạo & Đường cát", so_luong: 2, don_vi: "muỗng canh mỗi loại", ghi_chu: "pha nước muối chua ngọt" },
            { ten: "Muối hạt tinh khiết", so_luong: 1, don_vi: "thìa canh", ghi_chu: "lên men chuẩn vị" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế & Làm ráo kiệt nguyên liệu",
                thoi_gian: "8 phút",
                noi_dung: "Giá đỗ ngâm nước muối loãng 5 phút, rửa sạch vớt ra để thật ráo nước. Hẹ cắt khúc dài bằng cọng giá (khoảng 4cm). Cà rốt gọt vỏ bào sợi mỏng, ớt sừng thái sợi dài."
            },
            {
                buoc: 2,
                tieu_de: "Nấu nước ngâm giấm đường & Để nguội hoàn toàn",
                thoi_gian: "5 phút",
                noi_dung: "Đun sôi 500ml nước với 2 muỗng đường, 2 muỗng giấm gạo và 1 thìa canh muối hạt, khuấy tan đều rồi tắt bếp. Để nước ngâm nguội hoàn toàn về nhiệt độ phòng (nếu đổ nước còn ấm vào giá sẽ bị chín nhũn ủng)."
            },
            {
                buoc: 3,
                tieu_de: "Trộn đều & Xếp vào hũ",
                thoi_gian: "2 phút",
                noi_dung: "Trộn đều giá đỗ, hẹ và cà rốt bào sợi trong âu sạch, xếp nhẹ nhàng vào hũ thủy tinh hoặc âu sứ."
            },
            {
                buoc: 4,
                tieu_de: "Ngâm chua lên men thần tốc",
                thoi_gian: "4 tiếng",
                noi_dung: "Rót nước ngâm đã nguội hẳn ngập mặt giá đỗ. Dùng nan tre hoặc đĩa nhỏ gài nén nhẹ. Để ở nhiệt độ phòng sau 4 - 6 tiếng là dưa giá đã lên men chua dịu, giòn sần sật ăn được ngay."
            }
        ],
        meo_nau_an: "Bắt buộc nước ngâm giấm đường phải để thật nguội hẳn mới đổ vào giá đỗ; nếu đổ khi nước còn ấm giá đỗ sẽ bị chín nhũn ủng và thâm xỉn.",
        dinh_duong: { calo: 65, protein: "3g", chat_beo: "0.2g", carb: "13g" },
        tags: ["Giải ngấy thịt kho", "Giòn sần sật", "Chua ngọt thanh mát", "Món kèm kinh điển"]
    },

    48: {
        mo_ta: "Từng quả cà pháo trắng muốt giòn tan rôm rốp quyện cùng vị cay nồng của riềng tỏi ớt băm và vị chua ngọt mặn mà, linh hồn ăn kèm canh cua mồng tơi ngày hè.",
        do_kho: "Dễ",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Cà pháo tươi bánh tẻ", so_luong: 400, don_vi: "g", ghi_chu: "chọn quả vừa phải, không quá non hay già" },
            { ten: "Củ riềng tươi", so_luong: 30, don_vi: "g", ghi_chu: "thái chỉ mỏng hoặc giã dập" },
            { ten: "Tỏi khô & Ớt chỉ thiên", so_luong: 1.5, don_vi: "củ / 3 trái", ghi_chu: "băm nhỏ" },
            { ten: "Nước cốt chanh tươi", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "tạo vị chua thanh xổi nhanh" },
            { ten: "Nước mắm ngon & Đường", so_luong: 2, don_vi: "muỗng canh mỗi loại", ghi_chu: "hòa quyện vị đậm đà" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử nhựa thâm & Cắt cà ngâm nước muối chanh",
                thoi_gian: "15 phút",
                noi_dung: "Chuẩn bị thau nước đun sôi để nguội pha 1 thìa muối hạt và 1 quả chanh vắt nước. Cà pháo dùng dao sắc gọt bỏ cuống (không gọt sâu vào thịt cà), bổ đôi hoặc khía chữ thập rồi thả ngay vào thau nước muối chanh ngâm trong 20 phút để ra sạch nhựa đắng chát và giữ miếng cà trắng tinh không bị thâm đen."
            },
            {
                buoc: 2,
                tieu_de: "Rửa sạch & Vắt ráo kiệt nước",
                thoi_gian: "5 phút",
                noi_dung: "Vớt cà pháo ra rửa xả lại 2 lần bằng nước đun sôi để nguội, dùng tay bóp nhẹ cho ráo kiệt nước rồi để lên rây."
            },
            {
                buoc: 3,
                tieu_de: "Pha sốt mắm riềng tỏi ớt đậm đà",
                thoi_gian: "3 phút",
                noi_dung: "Khuấy tan hoàn toàn hỗn hợp gồm: 2 muỗng nước mắm nhĩ, 2 muỗng đường, 2 muỗng nước cốt chanh tươi cùng tỏi băm, ớt băm và củ riềng thái chỉ mỏng thơm nồng."
            },
            {
                buoc: 4,
                tieu_de: "Trộn xổi & Thấm vị giòn tan",
                thoi_gian: "1 tiếng",
                noi_dung: "Trút toàn bộ cà pháo vào âu sốt mắm riềng, dùng thìa trộn đều tay cho nước sốt bao bọc đều khắp từng miếng cà. Để nghỉ ở nhiệt độ phòng trong 1 - 2 tiếng cho cà ngấm đượm vị giòn tan chua cay mặn ngọt là dùng được ngay."
            }
        ],
        meo_nau_an: "Thả ngay miếng cà vào thau nước muối chanh loãng ngay sau khi cắt cuống; cà sẽ giữ được màu trắng phao tinh tươm và khử sạch hoàn toàn nhựa đắng chát.",
        dinh_duong: { calo: 70, protein: "2g", chat_beo: "0.3g", carb: "15g" },
        tags: ["Cà giòn rôm rốp", "Cặp đôi canh cua", "Dân dã Bắc Bộ", "Chua cay mặn ngọt"]
    },

    49: {
        mo_ta: "Khoanh chả lụa (giò lụa) truyền thống màu trắng hồng mịn màng điểm vân bọt khí tự nhiên, thái lát tam giác giòn dai thơm ngát mùi lá chuối và nước mắm nhĩ.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Chả lụa (giò lụa) tươi ngon", so_luong: 300, don_vi: "g", ghi_chu: "gói lá chuối thơm nức mùi thịt tươi" },
            { ten: "Muối tiêu chanh hoặc tương ớt", so_luong: 1, don_vi: "chén nhỏ", ghi_chu: "chấm kèm" },
            { ten: "Dưa leo & Rau thơm ngò rí", so_luong: 1, don_vi: "set", ghi_chu: "bày đĩa trang trí" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Bóc vỏ chuối giữ nguyên hương thơm",
                thoi_gian: "2 phút",
                noi_dung: "Dùng dao rạch nhẹ lớp lá chuối bao quanh khoanh giò lụa, bóc sạch lá và gạt bỏ lớp mỡ mỏng dính quanh viền, đặt khoanh giò lên mặt thớt sạch khô ráo."
            },
            {
                buoc: 2,
                tieu_de: "Kỹ thuật cắt lát tam giác cánh hoa đều tăm tắp",
                thoi_gian: "3 phút",
                noi_dung: "Cắt khoanh giò làm đôi theo đường kính. Sau đó dùng dao sắc cắt mỗi nửa khoanh thành 3 hoặc 4 miếng hình tam giác đều nhau có độ dày khoảng 1cm (dùng dao sắc một đường dứt khoát để mặt giò láng mịn không bị răng cưa)."
            },
            {
                buoc: 3,
                tieu_de: "Xếp hình cánh hoa trang trọng",
                thoi_gian: "2 phút",
                noi_dung: "Xếp các miếng giò xòe tròn đều như cánh hoa nở quanh đĩa tròn, các đỉnh tam giác hướng ra ngoài hoặc hướng vào tâm. Đặt nhánh ngò rí hoặc lát ớt sừng tỉa hoa ở chính giữa đĩa."
            },
            {
                buoc: 4,
                tieu_de: "Chuẩn bị nước chấm & Dùng kèm",
                thoi_gian: "1 phút",
                noi_dung: "Pha chén muối tiêu chanh ớt hoặc chuẩn bị chén tương ớt cay nồng chấm kèm, thưởng thức trực tiếp cùng cơm nóng, xôi nếp hoặc bánh giầy."
            }
        ],
        meo_nau_an: "Giò lụa ngon chuẩn truyền thống khi cắt ra bề mặt sẽ có những lỗ lăn tăn bọt khí tự nhiên, màu hơi ửng hồng phớt và tỏa mùi thơm dịu nhẹ của nước mắm cốt nhĩ.",
        dinh_duong: { calo: 270, protein: "21g", chat_beo: "19g", carb: "2g" },
        tags: ["Món nguội tiện lợi", "Mâm cỗ ngày Tết", "Giòn dai thơm ngọt", "Ăn kèm bánh giầy/xôi"]
    },

    50: {
        mo_ta: "Hạt lạc (đậu phộng) rang chín vàng ruộm thơm bùi béo ngậy áo đều lớp muối mịn màng mằn mặn, món nhắm nhâm nhi và đưa cơm siêu bền bỉ.",
        do_kho: "Dễ",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Lạc nhân (đậu phộng) đỏ", so_luong: 300, don_vi: "g", ghi_chu: "hạt mẩy tròn đều, không lép mốc" },
            { ten: "Muối tinh hoặc bột canh", so_luong: 1.5, don_vi: "thìa cà phê", ghi_chu: "rang khô rắc đều khi ấm" },
            { ten: "Dầu ăn thực vật", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "tạo độ bóng và dính muối" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sàng sẩy & Nhặt bỏ hạt lép",
                thoi_gian: "3 phút",
                noi_dung: "Đổ lạc ra rổ nhặt bỏ các hạt lép, mốc sâu hỏng để mẻ lạc rang đạt độ thơm bùi đồng đều không bị đắng hôi."
            },
            {
                buoc: 2,
                tieu_de: "Rang nhỏ lửa đều tay liên tục",
                thoi_gian: "12 phút",
                noi_dung: "Cho lạc vào chảo gang khô trên lửa nhỏ nhất. Dùng đũa đảo đều tay liên tục không ngừng nghỉ trong 12 - 14 phút. Khi nghe tiếng nổ lách tách rộn ràng, vỏ lụa nứt nhẹ và mùi thơm bùi nồng nàn bốc lên thì thử cắn nhẹ hạt lạc thấy giòn tan là lạc đã chín thấu bên trong."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật ủ giấy báo & Áo dầu bóng",
                thoi_gian: "5 phút",
                noi_dung: "Trút lạc ra ủ trong tờ giấy báo hoặc khăn vải sạch trong 5 phút để hơi nóng làm lạc giòn rụm lâu dài. Sau đó đổ lại vào chảo khi còn hơi ấm, nhỏ 1 thìa cà phê dầu ăn đảo nhanh 20 giây cho từng hạt lạc bóng bẩy."
            },
            {
                buoc: 4,
                tieu_de: "Xóc muối khi còn hơi ấm & Bảo quản",
                thoi_gian: "2 phút",
                noi_dung: "Rắc muối tinh vào chảo lạc còn hơi ấm, xóc đều tay để muối bám dính một lớp trắng mịn quanh vỏ lạc. Để nguội hoàn toàn rồi trút vào hũ thủy tinh đậy kín nắp bảo quản giòn tan cả tháng."
            }
        ],
        meo_nau_an: "Chờ lạc nguội bớt còn hơi ấm rồi mới rắc muối; nếu rắc muối lúc lạc vừa bắc khỏi bếp còn quá nóng, muối sẽ bị chảy nước tan ra làm ỉu lạc ngay lập tức.",
        dinh_duong: { calo: 560, protein: "25g", chat_beo: "49g", carb: "16g" },
        tags: ["Món ăn dân dã", "Bùi béo giòn rụm", "Để dành ăn lâu", "Món nhắm bia"]
    },

    51: {
        mo_ta: "Từng miếng dưa hấu đỏ tươi mọng nước mát lạnh ngọt lịm tan chảy xua tan cảm giác ngấy và đem lại sự sảng khoái tức thì sau bữa ăn.",
        do_kho: "Dễ",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Dưa hấu tươi già ngọt", so_luong: 1, don_vi: "kg", ghi_chu: "cuống héo, đáy vàng sẫm, vỗ kêu đanh" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Rửa sạch vỏ ngoài & Ướp lạnh",
                thoi_gian: "5 phút",
                noi_dung: "Rửa sạch vỏ ngoài quả dưa hấu dưới vòi nước lạnh, lau khô. Để vào ngăn mát tủ lạnh trước 1 - 2 tiếng trước khi bổ để miếng dưa mát lạnh sảng khoái."
            },
            {
                buoc: 2,
                tieu_de: "Bổ dưa làm tư theo chiều dọc",
                thoi_gian: "2 phút",
                noi_dung: "Dùng dao lớn sắc bổ quả dưa làm tư theo chiều dọc từ cuống xuống đáy thành các thanh dưa dài đều nhau."
            },
            {
                buoc: 3,
                tieu_de: "Gọt vỏ & Cắt miếng tam giác",
                thoi_gian: "2 phút",
                noi_dung: "Dùng dao lướt nhẹ gọt bỏ lớp vỏ xanh và phần cùi trắng sát đáy vỏ. Cắt thịt dưa thành các lát tam giác dày khoảng 1.5cm vừa miệng."
            },
            {
                buoc: 4,
                tieu_de: "Bày đĩa hình cánh quạt & Thưởng thức",
                thoi_gian: "1 phút",
                noi_dung: "Xếp so le các miếng dưa hình cánh quạt trên đĩa tròn lớn, cắm tăm tre dọn tráng miệng mát lành sau bữa cơm."
            }
        ],
        meo_nau_an: "Chọn quả dưa hấu có vết rám màu vàng kem ở đáy và cuống teo nhỏ khô cong là quả dưa già chín ngọt lịm mọng nước nhiều đường.",
        dinh_duong: { calo: 60, protein: "1g", chat_beo: "0.2g", carb: "15g" },
        tags: ["Tráng miệng mát lành", "Nhiều vitamin A & C", "Bổ sung nước", "Giải nhiệt mùa hè"]
    },

    52: {
        mo_ta: "Những miếng xoài cát chín vàng óng ả mềm thơm nức mũi, vị ngọt lịm đậm đà thanh tao đặc trưng của trái cây nhiệt đới Việt Nam.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Xoài cát Hòa Lộc chín vàng", so_luong: 2, don_vi: "quả (~700g)", ghi_chu: "vỏ vàng ươm căng mịn, thơm lừng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Rửa sạch & Cắt sát hai bên má xoài",
                thoi_gian: "2 phút",
                noi_dung: "Rửa sạch vỏ xoài, lau khô. Đặt đứng quả xoài, dùng dao sắc đưa lưỡi dao khía sát hai bên má hạt xoài để cắt rời 2 phần má thịt xoài lớn nhiều nạc."
            },
            {
                buoc: 2,
                tieu_de: "Khía vảy rồng ca-rô nghệ thuật",
                thoi_gian: "2 phút",
                noi_dung: "Dùng đầu mũi dao sắc khía các đường ca-rô vuông trên má thịt xoài cách nhau 1.5cm nhưng khéo léo không làm rách lớp vỏ dưới."
            },
            {
                buoc: 3,
                tieu_de: "Ấn lộn ngược đáy tạo hình nhím đẹp mắt",
                thoi_gian: "1 phút",
                noi_dung: "Dùng hai tay cầm hai đầu má xoài, dùng ngón tay ấn nhẹ từ dưới tâm đáy vỏ lên; các khối xoài vuông sẽ xòe bung ra như hình vảy nhím nở hoa tuyệt đẹp."
            },
            {
                buoc: 4,
                tieu_de: "Bày đĩa & Thưởng thức ngọt lịm",
                thoi_gian: "1 phút",
                noi_dung: "Đặt các má xoài lên đĩa tráng miệng, phần thịt quanh hạt gọt sạch vỏ cắt khối xếp kèm xung quanh, ướp lạnh 10 phút trước khi dùng."
            }
        ],
        meo_nau_an: "Tỉa vảy rồng ca-rô rồi lộn ngược đáy vừa giúp món tráng miệng đẹp mắt sang trọng vừa giúp thưởng thức dễ dàng không lo dính nước ngọt ra tay.",
        dinh_duong: { calo: 90, protein: "1.2g", chat_beo: "0.4g", carb: "23g" },
        tags: ["Trái cây nhiệt đới", "Ngọt lịm thơm lừng", "Tráng miệng hảo hạng", "Giàu vitamin A"]
    },

    53: {
        mo_ta: "Từng khối thanh long thanh mát mềm ngọt với hàng ngàn hạt nhỏ li ti vui miệng, món tráng miệng giải nhiệt dịu dàng hỗ trợ tiêu hóa sau bữa cơm.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Thanh long ruột đỏ hoặc trắng", so_luong: 1, don_vi: "quả (~600g)", ghi_chu: "vỏ đỏ tươi, tai xanh bóng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Cắt cuống & Bổ đôi",
                thoi_gian: "1 phút",
                noi_dung: "Rửa sạch vỏ ngoài quả thanh long, dùng dao cắt bỏ phần cuống và chóp đuôi. Bổ đôi quả thanh long theo chiều dọc."
            },
            {
                buoc: 2,
                tieu_de: "Lột vỏ mượt mà",
                thoi_gian: "1 phút",
                noi_dung: "Dùng tay cầm mép vỏ ở đầu nhọn nhẹ nhàng kéo lột ngược về sau; lớp vỏ đỏ sẽ tách rời hoàn toàn khỏi khối thịt quả một cách dễ dàng."
            },
            {
                buoc: 3,
                tieu_de: "Cắt khối vuông quân cờ đều tay",
                thoi_gian: "2 phút",
                noi_dung: "Đặt nửa quả thanh long lên thớt, cắt thành các khối vuông quân cờ kích thước 2 x 2cm đều tăm tắp."
            },
            {
                buoc: 4,
                tieu_de: "Ướp lạnh & Bày đĩa",
                thoi_gian: "1 phút",
                noi_dung: "Xếp các khối thanh long vào đĩa tráng miệng, để trong ngăn mát tủ lạnh 15 phút trước khi dùng để tăng vị thanh mát giòn ngọt sảng khoái."
            }
        ],
        meo_nau_an: "Thanh long ruột đỏ có vị ngọt đậm đà và chứa nhiều chất chống oxy hóa anthocyanin hơn ruột trắng; phối hợp cả hai loại trên đĩa tạo hiệu ứng màu sắc tương phản rực rỡ.",
        dinh_duong: { calo: 70, protein: "1.5g", chat_beo: "0.5g", carb: "16g" },
        tags: ["Thanh mát giải nhiệt", "Nhuận tràng tiêu hóa", "Chống oxy hóa", "Tráng miệng tươi ngon"]
    }
};

module.exports = { PART_4 };
