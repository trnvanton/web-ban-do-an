// ============================================================
// Dữ liệu món ăn phần 1: Món Mặn, Kho, Xào, Chiên & Rim (IDs: 1 - 15)
// Quy chuẩn đầu bếp: Các bước chi tiết, kỹ thuật nhiệt, thời gian, doneness check
// ============================================================

const PART_1 = {
    1: {
        mo_ta: "Món ăn quốc dân nhanh gọn nhưng đậm đà tinh tế, trứng bông xốp mềm mọng quyện nước sốt cà chua đỏ tươi sánh quyện chua thanh ngọt dịu.",
        do_kho: "Dễ",
        khau_phan: "2 - 3 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Trứng gà tươi", so_luong: 3, don_vi: "quả", ghi_chu: "chọn trứng gà ta lòng đỏ đậm" },
            { ten: "Cà chua chín mọng", so_luong: 2, don_vi: "quả (~200g)", ghi_chu: "bỏ cuống, lột vỏ thái hạt lựu" },
            { ten: "Hành tím", so_luong: 1, don_vi: "củ", ghi_chu: "băm nhuyễn phi thơm" },
            { ten: "Hành hoa", so_luong: 2, don_vi: "nhánh", ghi_chu: "rửa sạch, thái nhỏ 0.5cm" },
            { ten: "Nước mắm truyền thống", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "độ đạm 35 - 40 độ" },
            { ten: "Hạt nêm & Tiêu xay", so_luong: 0.5, don_vi: "thìa cà phê", ghi_chu: "tạo vị hài hòa" },
            { ten: "Dầu ăn thực vật", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "chia xào sốt và chiên trứng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Đánh bông trứng & Khóa ẩm",
                thoi_gian: "3 phút",
                noi_dung: "Đập 3 quả trứng gà ta vào tô thủy tinh sạch. Thêm 1 thìa cà phê nước mắm ngon, 1/2 thìa hạt nêm, 1/2 thìa cà phê tiêu xay, 1 thìa cà phê nước lọc (bí quyết giữ trứng mềm mướt không khô cứng) và một nửa lượng hành hoa thái nhỏ. Dùng đũa hoặc phới lồng đánh đều tay theo một chiều trong 1 phút đến khi hỗn hợp nổi bọt khí mịn màng."
            },
            {
                buoc: 2,
                tieu_de: "Lột vỏ & Xào sốt cà chua sánh mịn",
                thoi_gian: "4 phút",
                noi_dung: "Khía hình chữ thập ở đuôi cà chua, chần nhanh qua nước sôi 30 giây rồi bóc sạch lớp vỏ mỏng bên ngoài, thái hạt lựu nhuyễn. Đặt chảo lên bếp, cho 1 thìa dầu ăn vào đun nóng ở lửa vừa, phi thơm hành tím băm đến khi ngả vàng nhạt. Trút toàn bộ cà chua vào xào đều tay, nêm 1/2 thìa đường và 1/2 thìa hạt nêm giúp cà chua nhanh nhừ mềm. Dùng muôi gỗ dằm nhẹ liên tục đến khi cà chua tan nhuyễn tạo thành hỗn hợp sốt đỏ au sền sệt."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật tráng trứng vân mây mềm mọng",
                thoi_gian: "3 phút",
                noi_dung: "Khi sốt cà chua sôi lục bục, hạ lửa xuống mức nhỏ vừa. Từ từ rót hỗn hợp trứng đã đánh tan vào đều khắp mặt chảo. Chờ khoảng 15 - 20 giây cho lớp đáy trứng định hình se lại. Dùng muôi gỗ đẩy nhẹ nhàng từ mép ngoài viền chảo vào trung tâm để trứng dồn thành các lớp vân mềm xốp (kiểu scramble mịn), cho phần trứng lỏng còn lại tràn ra tiếp xúc với đáy chảo."
            },
            {
                buoc: 4,
                tieu_de: "Hoàn thiện & Thưởng thức nóng hổi",
                thoi_gian: "1 phút",
                noi_dung: "Khi trứng đạt độ chín khoảng 85 - 90% (vẫn giữ được độ bóng mượt, mềm mại ẩm mọng và không bị chiên quá khô xác), rắc nốt phần hành hoa còn lại và chút tiêu sọ xay thơm nồng lên mặt. Tắt bếp ngay lập tức, đậy vung 30 giây để hơi nóng làm hành chín tái dậy mùi thơm. Múc trứng ra đĩa sâu lòng, rưới nước sốt cà chua bóng bẩy lên trên và thưởng thức cùng cơm trắng nóng."
            }
        ],
        meo_nau_an: "Thêm 1 thìa cà phê nước lọc khi đánh trứng và tắt bếp khi trứng còn hơi ẩm mượt (khoảng 90% độ chín) sẽ giúp món trứng xào cà chua mềm mịn tan ngay trên đầu lưỡi, không bao giờ bị bã khô.",
        dinh_duong: { calo: 240, protein: "16g", chat_beo: "17g", carb: "6g" },
        tags: ["Nhanh gọn", "Dễ làm", "Bữa sáng/Tối", "Thanh đạm", "Giàu đạm"]
    },

    3: {
        mo_ta: "Thịt thăn bò mềm mọng ngấm đậm gia vị tỏi dầu hào kết hợp với bông cải xanh giòn sần sật ngọt lành, món xào bổ dưỡng giàu chất xơ và sắt.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt thăn bò tươi", so_luong: 300, don_vi: "g", ghi_chu: "thái lát mỏng ngang thớ bản rộng" },
            { ten: "Bông cải xanh (súp lơ)", so_luong: 1, don_vi: "cây (~400g)", ghi_chu: "tách nhánh vừa ăn, ngâm nước muối" },
            { ten: "Cà rốt tươi", so_luong: 0.5, don_vi: "củ", ghi_chu: "tỉa hoa thái lát mỏng 2mm" },
            { ten: "Tỏi khô ta", so_luong: 1.5, don_vi: "củ", ghi_chu: "băm nhỏ, chia làm 2 phần" },
            { ten: "Dầu hào cao cấp", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo màu bóng và vị ngọt thịt" },
            { ten: "Dầu mè & Tiêu đen", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "tạo hương thơm quyến rũ" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Thái mỏng & Ướp thịt bò chuẩn vị",
                thoi_gian: "15 phút",
                noi_dung: "Thịt bò dùng khăn giấy thấm khô, đặt dao nghiêng thái mỏng ngang thớ thịt (thái dọc thớ thịt sẽ bị dai). Cho thịt vào âu, ướp cùng 1 thìa canh dầu hào, 1/2 thìa cà phê hạt nêm, 1/2 lượng tỏi băm, 1 thìa cà phê dầu mè và 1 thìa canh dầu ăn. Trộn đều tay và để thịt nghỉ 15 phút. Dầu ăn sẽ bao bọc các thớ thịt giúp giữ trọn nước ngọt bên trong khi xào nhiệt cao."
            },
            {
                buoc: 2,
                tieu_de: "Chần sơ bông cải sốc nhiệt đá lạnh",
                thoi_gian: "3 phút",
                noi_dung: "Đun sôi một nồi nước lớn với 1 thìa cà phê muối hạt. Khi nước sôi sùng sục, thả bông cải xanh và cà rốt tỉa hoa vào chần nhanh đúng 60 giây. Vớt ngay ra thau nước đá lạnh ngâm 2 phút để khóa màu xanh mướt diệp lục và giữ độ giòn sần sật tự nhiên, sau đó vớt ra rổ lắc ráo nước."
            },
            {
                buoc: 3,
                tieu_de: "Xào tái thịt bò trên lửa lớn (Wok Hei)",
                thoi_gian: "2 phút",
                noi_dung: "Đặt chảo gang hoặc chảo sâu lòng lên bếp bật lửa lớn nhất đến khi chảo bốc khói nhẹ. Cho 1 thìa dầu ăn và lượng tỏi băm còn lại vào phi nhanh trong 10 giây cho dậy mùi thơm. Trút toàn bộ thịt bò vào đảo cực nhanh tay và dàn đều khắp mặt chảo trong 60 - 90 giây. Khi thịt vừa chuyển màu hồng nhạt chín tái (chín khoảng 70%), trút ngay thịt bò ra đĩa riêng (không để trong chảo làm thịt dai)."
            },
            {
                buoc: 4,
                tieu_de: "Xào rau củ & Hòa quyện thành phẩm",
                thoi_gian: "2 phút",
                noi_dung: "Tận dụng nước xào ngọt trong chảo, trút bông cải xanh và cà rốt vào đảo đều trên lửa lớn, nêm 1/2 thìa dầu hào và 1 thìa hạt nêm. Xào trong 1 phút cho rau ngấm vị. Đổ đĩa thịt bò cùng toàn bộ nước thịt ngọt trở lại chảo, đảo nhanh tay 30 giây cho hòa quyện. Rắc tiêu xay thô, đảo thêm 5 giây rồi trút ra đĩa lớn thưởng thức nóng."
            }
        ],
        meo_nau_an: "Bắt buộc phải xào thịt bò trên lửa lớn nhất và trút ra đĩa khi vừa chín tái. Không xào chung thịt bò với rau từ đầu vì thời gian nấu lâu sẽ làm thịt ra hết nước ngọt và dai cứng.",
        dinh_duong: { calo: 310, protein: "32g", chat_beo: "12g", carb: "14g" },
        tags: ["Giàu dinh dưỡng", "Eat Clean", "Bổ máu", "Món xào ngon", "Bữa cơm gia đình"]
    },

    4: {
        mo_ta: "Món thịt kho tàu truyền thống với những miếng ba chỉ vuông vắn mềm rục tan trong miệng, trứng cút ngấm đượm nước dừa tươi ngọt thanh thơm phức.",
        do_kho: "Trung bình",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 50,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt ba chỉ rút sườn", so_luong: 500, don_vi: "g", ghi_chu: "nạc mỡ đan xen liền khối, thái khối vuông 3.5cm" },
            { ten: "Trứng cút tươi", so_luong: 15, don_vi: "quả", ghi_chu: "luộc chín bóc sạch vỏ" },
            { ten: "Nước dừa xiêm tươi", so_luong: 450, don_vi: "ml", ghi_chu: "nước dừa ngọt thanh tự nhiên" },
            { ten: "Hành tím & Tỏi củ", so_luong: 4, don_vi: "củ", ghi_chu: "giã nhuyễn vắt lấy nước cốt ướp" },
            { ten: "Nước mắm nhĩ ngon", so_luong: 3, don_vi: "muỗng canh", ghi_chu: "nước mắm cốt truyền thống" },
            { ten: "Đường phèn hoặc đường thốt nốt", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "thắng nước màu hổ phách" },
            { ten: "Ớt sừng & Tiêu sọ", so_luong: 1, don_vi: "set", ghi_chu: "tạo vị ấm nồng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử mùi & Cắt khối chuẩn quy cách",
                thoi_gian: "10 phút",
                noi_dung: "Thịt ba chỉ rửa với nước muối loãng, cạo sạch bì. Đun sôi nồi nước có vài lát gừng và 1 thìa giấm, chần thịt trong 3 phút để đẩy hết bọt bẩn và máu đọng ra ngoài. Vớt ra rửa sạch dưới vòi nước lạnh, để ráo rồi dùng dao sắc cắt khối vuông vức kích thước 3.5 x 3.5cm."
            },
            {
                buoc: 2,
                tieu_de: "Ướp thịt đượm vị & Thắng nước hàng cánh gián",
                thoi_gian: "30 phút",
                noi_dung: "Ướp thịt với 2.5 muỗng nước mắm nhĩ, 1 thìa đường, nước cốt hành tỏi băm (vắt lấy nước giúp kho không bị cháy cặn đáy nồi), 1/2 thìa tiêu sọ và 1 quả ớt đập dập trong 30 phút. Đặt nồi kho lên bếp, cho 1.5 thìa đường phèn cùng 1 thìa dầu ăn, đun lửa nhỏ đến khi đường tan chảy sủi bọt khí li ti chuyển sang màu nâu cánh gián thì cho 2 thìa nước nóng vào hãm màu."
            },
            {
                buoc: 3,
                tieu_de: "Xào săn thớ thịt & Ninh với nước dừa tươi",
                thoi_gian: "35 phút",
                noi_dung: "Trút toàn bộ thịt đã ướp vào nồi nước màu, bật lửa vừa đảo liên tục trong 5 - 7 phút cho từng miếng thịt săn chắc lại, lớp mỡ chuyển trong veo và áo đều màu nâu bóng óng ả. Đổ 450ml nước dừa xiêm tươi vào ngập mặt thịt. Đun lửa lớn cho sôi bùng lên, dùng muôi hớt sạch toàn bộ bọt màng nổi trên mặt nước."
            },
            {
                buoc: 4,
                tieu_de: "Kho liu riu mở nắp & Thấm vị trứng cút",
                thoi_gian: "15 phút",
                noi_dung: "Hạ lửa thật nhỏ liu riu, kho mở hé nắp vung trong 30 phút để nước kho trong veo và thịt mềm rục. Cho tiếp 15 quả trứng cút luộc vào nồi, nêm nếm lại thêm chút nước mắm cho vị mặn ngọt đậm đà cân bằng. Tiếp tục kho thêm 15 phút đến khi nước kho cạn bớt keo sánh sền sệt ôm lấy miếng thịt trong suốt bóng mượt thì tắt bếp."
            }
        ],
        meo_nau_an: "Khi kho thịt với nước dừa tươi, tuyệt đối không đậy kín nắp vung nồi; kho mở nắp ở lửa nhỏ liu riu sẽ giúp nước kho trong vắt không bị đục và lớp mỡ thịt trở nên trong suốt như thạch.",
        dinh_duong: { calo: 480, protein: "30g", chat_beo: "36g", carb: "7g" },
        tags: ["Món truyền thống", "Đậm đà", "Món Tết", "Đưa cơm", "Gia đình"]
    },

    5: {
        mo_ta: "Thịt ba chỉ thái mỏng đảo cháy cạnh vàng giòn thơm nức mũi, quyện lớp sốt nước mắm đường cay the mặn ngọt bóng bẩy cực kỳ bắt cơm.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt ba chỉ tươi", so_luong: 400, don_vi: "g", ghi_chu: "nạc mỡ cân đối, thái lát mỏng 2 - 3mm" },
            { ten: "Hành tím khô", so_luong: 3, don_vi: "củ", ghi_chu: "thái lát mỏng" },
            { ten: "Hành hoa tươi", so_luong: 3, don_vi: "nhánh", ghi_chu: "cắt khúc 2.5cm" },
            { ten: "Nước mắm nguyên chất", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "độ mặn ngọt chuẩn vị" },
            { ten: "Đường vàng hoa mai", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo màu xém vàng óng ả" },
            { ten: "Tiêu xay & Ớt hiểm", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "tạo vị ấm cay the" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế & Thái lát mỏng chuẩn lửa",
                thoi_gian: "5 phút",
                noi_dung: "Thịt ba chỉ rửa sạch với muối hạt, thấm thật khô bề mặt. Dùng dao sắc thái thịt thành các lát mỏng đều tay khoảng 2 - 3mm (không thái quá dày thịt lâu xém cạnh, không thái quá mỏng thịt sẽ bị vụn khô xác)."
            },
            {
                buoc: 2,
                tieu_de: "Đảo kiệt mỡ & Tạo viền cháy cạnh vàng giòn",
                thoi_gian: "7 phút",
                noi_dung: "Đặt chảo chống dính sâu lòng lên bếp không cho dầu ăn. Khi chảo nóng, trút thịt ba chỉ vào đảo đều tay trên lửa vừa. Thịt sẽ tự tiết mỡ ra xèo xèo. Đảo liên tục trong 6 - 8 phút đến khi các cạnh miếng thịt xém vàng ươm, bề mặt se giòn rụm. Nghiêng chảo chắt bớt toàn bộ mỡ thừa ra chén (chỉ giữ lại khoảng 1 thìa nhỏ mỡ trong chảo để tránh bị ngấy)."
            },
            {
                buoc: 3,
                tieu_de: "Phi thơm hành & Nấu sốt rim mắm đường",
                thoi_gian: "3 phút",
                noi_dung: "Gạt thịt sang một bên chảo, cho hành tím thái lát vào phần mỡ còn lại phi nhanh trong 20 giây cho dậy mùi thơm nức. Pha chén sốt gồm: 2 muỗng nước mắm, 1.5 muỗng đường vàng, 1/2 thìa tiêu, ớt thái lát và 2 muỗng nước lọc khuấy tan hoàn toàn. Rưới toàn bộ chén sốt đều vào chảo thịt."
            },
            {
                buoc: 4,
                tieu_de: "Rim kẹo bóng bẩy & Hoàn thiện",
                thoi_gian: "2 phút",
                noi_dung: "Tăng lửa lên mức vừa, đảo đều tay liên tục để nước sốt mắm đường sôi sủi bọt keo lại, bao phủ một lớp caramel mặn ngọt bóng bẩy quanh từng miếng thịt vàng rộm. Thả toàn bộ hành hoa cắt khúc vào đảo nhanh tay trong 15 giây rồi tắt bếp ngay. Múc ra đĩa sâu lòng ăn cùng cơm trắng nóng hổi."
            }
        ],
        meo_nau_an: "Bắt buộc phải chắt bỏ phần mỡ thừa tiết ra sau khi đảo xém cạnh rồi mới rưới nước mắm đường vào rim; làm như vậy miếng thịt sẽ giòn dai đậm đà mà không hề bị ngấy dầu mỡ.",
        dinh_duong: { calo: 420, protein: "24g", chat_beo: "34g", carb: "5g" },
        tags: ["Đưa cơm", "Dễ làm", "Món mặn miền Bắc", "Bữa cơm hàng ngày"]
    },

    6: {
        mo_ta: "Cá lóc (hoặc cá basa) kho trong tộ đất chuẩn phong vị Nam Bộ, thịt cá chắc nịch không tanh ngấm đẫm tiêu ớt cay nồng và mỡ ba chỉ béo ngậy.",
        do_kho: "Trung bình",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 35,
        nguyen_lieu_chi_tiet: [
            { ten: "Cá lóc tươi (hoặc cá trắm, cá basa)", so_luong: 600, don_vi: "g", ghi_chu: "cắt khúc dày 3 - 3.5cm" },
            { ten: "Thịt ba chỉ heo", so_luong: 150, don_vi: "g", ghi_chu: "thái sợi con chì lót đáy tộ" },
            { ten: "Nước dừa tươi", so_luong: 150, don_vi: "ml", ghi_chu: "tạo vị ngọt sâu và bóng cá" },
            { ten: "Nước mắm ngon cốt cá cơm", so_luong: 3, don_vi: "muỗng canh", ghi_chu: "độ đạm cao" },
            { ten: "Nước hàng (nước màu thắng kẹo)", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "màu cánh gián đẹp" },
            { ten: "Hành tím, tỏi, ớt chỉ thiên", so_luong: 5, don_vi: "củ/trái", ghi_chu: "băm nhỏ và để nguyên quả" },
            { ten: "Tiêu sọ giã dập thô", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "linh hồn món cá kho tộ" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử tanh triệt để & Cắt khúc cá",
                thoi_gian: "10 phút",
                noi_dung: "Cá lóc đánh vảy, mổ sạch màng đen trong bụng (màng đen là nguyên nhân chính gây tanh). Xát muối hạt và nước cốt chanh lên khắp mình cá để làm sạch nhớt, rửa lại thật sạch dưới vòi nước lạnh rồi cắt khúc dày khoảng 3.5cm. Dùng khăn sạch thấm thật khô từng khúc cá."
            },
            {
                buoc: 2,
                tieu_de: "Ướp cá thấm sâu từng thớ thịt",
                thoi_gian: "25 phút",
                noi_dung: "Cho cá vào âu ướp cùng 2.5 muỗng nước mắm nhĩ, 1.5 muỗng nước hàng, 1 muỗng đường, 1/2 muỗng tiêu sọ giã dập, hành tỏi băm và ớt tươi. Trộn nhẹ nhàng và để cá ngấm gia vị trong ít nhất 20 - 25 phút. Lật mặt cá giữa thời gian ướp để gia vị ngấm đều hai mặt."
            },
            {
                buoc: 3,
                tieu_de: "Lót đáy tộ đất & Xếp cá đun săn",
                thoi_gian: "8 phút",
                noi_dung: "Dùng tộ đất hoặc nồi gang dày, xếp đều lớp thịt ba chỉ thái con chì xuống kín đáy nồi (lớp thịt này giúp cá không bị bén cháy đáy tộ và khi kho mỡ thịt tứa ra làm khúc cá béo ngậy). Xếp từng khúc cá lên trên lớp thịt, rưới toàn bộ phần nước ướp cá vào. Đặt tộ lên bếp bật lửa lớn đun sôi bùng trong 5 phút cho thớ thịt cá co săn chắc lại."
            },
            {
                buoc: 4,
                tieu_de: "Kho liu riu nước sôi nóng & Kẹo nước sốt",
                thoi_gian: "25 phút",
                noi_dung: "Đun sôi 150ml nước dừa tươi (hoặc nước sôi nóng già), từ từ châm vào quanh mép tộ cá (tuyệt đối không dùng nước lạnh sẽ làm tanh cá). Hạ lửa nhỏ nhất, đun liu riu mở hé nắp trong 25 - 30 phút cho cá chín mềm rục từ từ. Khi nước kho cạn dần sền sệt sánh đặc bám đều quanh từng khúc cá nâu óng, rắc nhiều tiêu sọ và hành lá cắt khúc lên mặt rồi tắt bếp."
            }
        ],
        meo_nau_an: "Khi châm thêm nước vào nồi cá đang kho, bắt buộc phải dùng nước thật sôi nóng. Nếu đổ nước lạnh vào cá đang nóng sẽ khiến thớ thịt cá bị tanh nồng và vỡ nát.",
        dinh_duong: { calo: 380, protein: "38g", chat_beo: "22g", carb: "6g" },
        tags: ["Đậm đà", "Món tộ đất", "Món ngon Nam Bộ", "Giàu đạm & Omega-3"]
    },

    7: {
        mo_ta: "Cánh gà chiên vàng ươm giòn rụm lớp da bên ngoài, thịt bên trong mềm ngọt mọng nước, áo đều lớp sốt tỏi ớt mắm đường thơm nức mũi.",
        do_kho: "Trung bình",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 25,
        nguyen_lieu_chi_tiet: [
            { ten: "Cánh gà tươi (hoặc tỏi gà)", so_luong: 600, don_vi: "g", ghi_chu: "chặt khúc vừa ăn, khía nhẹ mặt sau" },
            { ten: "Tỏi khô ta", so_luong: 2.5, don_vi: "củ", ghi_chu: "băm nhuyễn thật nhiều tỏi phi thơm" },
            { ten: "Ớt hiểm đỏ", so_luong: 2, don_vi: "trái", ghi_chu: "băm nhỏ" },
            { ten: "Nước mắm ngon cốt cá cơm", so_luong: 2.5, don_vi: "muỗng canh", ghi_chu: "độ đạm cao" },
            { ten: "Đường cát trắng", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "cân bằng mặn ngọt" },
            { ten: "Tương ớt Chin-su", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo độ sánh đỏ đẹp" },
            { ten: "Bột bắp / Bột chiên giòn", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "áo lớp mỏng giòn rụm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế gà & Khía thớ thịt",
                thoi_gian: "10 phút",
                noi_dung: "Cánh gà bóp kỹ với muối hạt, gừng đập dập và chút rượu trắng trong 3 phút để tẩy sạch mùi hôi đặc trưng, rửa sạch lại và để ráo hoàn toàn. Dùng dao khía 2 đường chéo ở mặt trong cánh gà để thịt dễ thấm gia vị và nhanh chín đều bên trong khi chiên."
            },
            {
                buoc: 2,
                tieu_de: "Áo bột mỏng & Chiên giòn 2 lần lửa",
                thoi_gian: "12 phút",
                noi_dung: "Rắc 2 thìa canh bột bắp lên cánh gà, xóc đều để bột bám một lớp mỏng tang như sương quanh miếng gà. Đun chảo ngập dầu nóng già ở lửa vừa, thả cánh gà vào chiên lần 1 trong 8 - 10 phút đến khi thịt gà chín tới, vỏ ngoài hơi hanh vàng thì vớt ra để ráo 5 phút. Trước khi đảo sốt, tăng lửa lớn chiên lại lần 2 trong 1 - 2 phút cho lớp da vàng ươm giòn rụm tối đa."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt nước mắm tỏi ớt kẹo sền sệt",
                thoi_gian: "3 phút",
                noi_dung: "Hòa tan hỗn hợp sốt gồm: 2.5 muỗng nước mắm, 2 muỗng đường, 1 muỗng tương ớt và 1 muỗng nước lọc. Chắt bớt dầu trong chảo chỉ chừa lại 1 thìa, cho toàn bộ tỏi băm và ớt băm vào phi vàng giòn dậy mùi thơm nức. Đổ chén sốt nước mắm vào đun sôi bùng, khuấy nhẹ cho đường tan chảy thành hỗn hợp sốt sủi bọt keo sánh đặc."
            },
            {
                buoc: 4,
                tieu_de: "Lắc gà đẫm sốt & Hoàn tất",
                thoi_gian: "2 phút",
                noi_dung: "Trút toàn bộ cánh gà đã chiên giòn vào chảo sốt đang sôi. Hạ lửa vừa, đảo và xóc chảo thật nhanh tay trong 1 - 2 phút cho lớp sốt mắm tỏi óng ánh bao phủ đều khắp các mặt miếng gà. Khi sốt cạn bám dính chặt quanh lớp da giòn rụm thì tắt bếp, bày ra đĩa ăn kèm dưa leo và rau răm."
            }
        ],
        meo_nau_an: "Kỹ thuật chiên 2 lần lửa (lần 1 lửa vừa cho gà chín kỹ, lần 2 lửa lớn trong 90 giây) là bí quyết giúp gà chiên nước mắm giữ được lớp da giòn rụm cả tiếng đồng hồ mà không hề bị mềm ỉu.",
        dinh_duong: { calo: 460, protein: "34g", chat_beo: "28g", carb: "16g" },
        tags: ["Món khoái khẩu", "Giòn rụm", "Mặn ngọt", "Thích hợp liên hoan/gia đình"]
    },

    8: {
        mo_ta: "Thịt bò thăn mềm mọng ngọt đậm đà xào trên lửa lớn cùng hành tây giòn ngọt và cần tỏi tây thơm ngát, món xào bổ dưỡng năng lượng dồi dào.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt thăn bò tươi", so_luong: 300, don_vi: "g", ghi_chu: "thái mỏng ngang thớ bản rộng" },
            { ten: "Hành tây trắng", so_luong: 1, don_vi: "củ", ghi_chu: "bổ múi cau dày 1.5cm" },
            { ten: "Cần tây & Tỏi tây (boa-rô)", so_luong: 100, don_vi: "g", ghi_chu: "cắt khúc 3.5cm" },
            { ten: "Cà chua chín", so_luong: 1, don_vi: "quả", ghi_chu: "bổ múi cau tạo độ ẩm" },
            { ten: "Tỏi khô băm nhuyễn", so_luong: 1.5, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Dầu hào & Nước tương", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "nêm nếm đậm đà" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Ướp thịt bò mềm mọng với dầu ăn",
                thoi_gian: "15 phút",
                noi_dung: "Thịt bò thái mỏng ngang thớ, ướp với 1 muỗng dầu hào, 1/2 thìa cà phê tiêu, 1/2 lượng tỏi băm và 1 thìa canh dầu ăn trong 15 phút. Dầu ăn sẽ khóa nước ngọt bên trong, giúp thịt bò khi tiếp xúc nhiệt độ cao không bị khô xác hay dai cứng."
            },
            {
                buoc: 2,
                tieu_de: "Xào tái thịt bò lửa lớn thần tốc",
                thoi_gian: "2 phút",
                noi_dung: "Đặt chảo lên bếp bật lửa lớn tối đa, cho 1 thìa dầu ăn phi thơm 1/2 lượng tỏi băm còn lại trong 5 giây. Trút thịt bò vào đảo cực nhanh tay và dứt khoát trong khoảng 60 giây đến khi thịt vừa chuyển tái hồng chín khoảng 70% thì trút ngay ra đĩa riêng."
            },
            {
                buoc: 3,
                tieu_de: "Xào hành tây & cần tỏi tây giòn ngọt",
                thoi_gian: "3 phút",
                noi_dung: "Thêm chút dầu vào chảo trên lửa lớn, cho hành tây và cà chua vào đảo nhanh trong 1.5 phút cho hành tây vừa chín tái bớt hăng. Thả tiếp cần tây và tỏi tây vào đảo đều tay, nêm 1 thìa hạt nêm và chút dầu hào cho rau củ ngấm đều vị."
            },
            {
                buoc: 4,
                tieu_de: "Đảo kết hợp & Rắc tiêu thơm lừng",
                thoi_gian: "1 phút",
                noi_dung: "Đổ đĩa thịt bò cùng toàn bộ nước thịt ngọt trở lại chảo rau, bật lửa to đảo nhanh tay trong 30 giây cho hòa quyện hương vị. Tắt bếp ngay, rắc hạt tiêu xay thô thơm lừng và trút ra đĩa thưởng thức nóng cùng cơm trắng."
            }
        ],
        meo_nau_an: "Cần tây và tỏi tây rất nhanh chín; chỉ xào chung khoảng 30 - 45 giây để giữ được mùi thơm tinh dầu nồng nàn và độ giòn ngọt mọng nước, không xào lâu rau sẽ bị dai vàng.",
        dinh_duong: { calo: 290, protein: "31g", chat_beo: "11g", carb: "12g" },
        tags: ["Nhanh gọn", "Bổ dưỡng", "Giàu đạm", "Bữa tối gia đình"]
    },

    9: {
        mo_ta: "Miếng đậu hũ vàng ruộm nhồi nhân thịt băm mộc nhĩ nấm hương béo bùi, om đẫm trong sốt cà chua đỏ au chua ngọt thanh mát cực kỳ bắt cơm.",
        do_kho: "Trung bình",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 20,
        nguyen_lieu_chi_tiet: [
            { ten: "Đậu hũ trắng mơ", so_luong: 4, don_vi: "miếng", ghi_chu: "cắt đôi hoặc khoét lỗ ở giữa" },
            { ten: "Thịt nạc vai xay", so_luong: 200, don_vi: "g", ghi_chu: "có chút mỡ cho nhân mềm mọng" },
            { ten: "Mộc nhĩ & Nấm hương khô", so_luong: 3, don_vi: "tai", ghi_chu: "ngâm nở, băm nhuyễn" },
            { ten: "Cà chua chín đỏ", so_luong: 3, don_vi: "quả", ghi_chu: "thái hạt lựu nhỏ" },
            { ten: "Hành tím & Hành hoa", so_luong: 3, don_vi: "nhánh", ghi_chu: "băm nhỏ" },
            { ten: "Nước mắm & Đường", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "nêm nước sốt" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Trộn nhân thịt mềm xốp & Khoét đậu",
                thoi_gian: "10 phút",
                noi_dung: "Đậu hũ cắt làm đôi, dùng thìa nhỏ nhẹ nhàng khoét bớt phần ruột ở giữa tạo thành hình chiếc thuyền (chừa lại thành đậu dày 0.8cm để không bị rách). Lấy phần ruột đậu vừa khoét dầm nát, trộn đều cùng thịt xay, mộc nhĩ nấm hương băm, hành tím, 1 thìa cà phê hạt nêm và 1/2 thìa tiêu (ruột đậu hũ trộn cùng giúp nhân mềm xốp không bị khô cứng sau khi rán)."
            },
            {
                buoc: 2,
                tieu_de: "Nhồi nhân thịt & Rán định hình",
                thoi_gian: "10 phút",
                noi_dung: "Dùng thìa múc nhân thịt nhồi chặt vào lòng từng miếng đậu, dùng lưng thìa miết phẳng mặt nhân cho gọn gàng đẹp mắt. Đặt chảo dầu lên bếp đun nóng vừa, úp mặt có nhân thịt xuống rán trước trong 3 phút để nhân thịt săn chắc định hình không bị rơi ra. Lật các mặt còn lại rán vàng đều lớp vỏ đậu rồi gắp ra đĩa."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt cà chua nhuyễn sánh",
                thoi_gian: "5 phút",
                noi_dung: "Chắt bớt dầu trong chảo, phi thơm hành tím băm rồi trút cà chua thái hạt lựu vào xào đều trên lửa vừa. Nêm 1.5 muỗng nước mắm, 1 muỗng đường, 1/2 muỗng hạt nêm và nửa chén nước sôi nóng. Dùng muôi dằm nhuyễn cà chua cho đến khi tan mịn thành nước sốt đỏ sánh đặc."
            },
            {
                buoc: 4,
                tieu_de: "Om đậu ngấm đẫm sốt cà chua",
                thoi_gian: "8 phút",
                noi_dung: "Xếp nhẹ nhàng các miếng đậu nhồi thịt vào chảo sốt cà chua. Dùng thìa múc nước sốt rưới đều lên mặt thịt. Đậy nắp chảo, hạ lửa nhỏ om liu riu trong 8 - 10 phút cho nhân thịt chín thấu bên trong và vỏ đậu hút đẫm vị chua ngọt của sốt. Mở nắp, rắc hành hoa thái nhỏ và tiêu thơm rồi tắt bếp."
            }
        ],
        meo_nau_an: "Bí quyết nhân thịt luôn mềm mướt không bị khô xác là hãy trộn thêm 2 thìa ruột đậu hũ nghiền nhuyễn vào nhân thịt trước khi nhồi; ruột đậu giữ ẩm cực tốt khi chiên rán.",
        dinh_duong: { calo: 350, protein: "26g", chat_beo: "22g", carb: "14g" },
        tags: ["Món ngon gia đình", "Dễ ăn", "Thanh đạm", "Đậm đà"]
    },

    10: {
        mo_ta: "Nem rán truyền thống với lớp vỏ bánh đa nem vàng ruộm giòn tan lâu ỉu, nhân thịt băm miến mộc nhĩ thơm bùi chấm nước mắm tỏi ớt chua ngọt chuẩn vị.",
        do_kho: "Khó",
        khau_phan: "4 - 5 người",
        thoi_gian_chuan_bi: 30,
        thoi_gian_nau: 30,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt nạc vai xay nhuyễn", so_luong: 350, don_vi: "g", ghi_chu: "thịt tươi có mỡ nhẹ để nhân ngậy" },
            { ten: "Miến dong & Mộc nhĩ, nấm hương", so_luong: 60, don_vi: "g", ghi_chu: "ngâm mềm cắt ngắn 1.5cm" },
            { ten: "Cà rốt & Su hào (hoặc củ đậu)", so_luong: 0.5, don_vi: "củ mỗi loại", ghi_chu: "bào sợi ngắn, vắt kiệt nước" },
            { ten: "Trứng gà tươi", so_luong: 2, don_vi: "quả", ghi_chu: "lấy 2 lòng đỏ + 1 lòng trắng" },
            { ten: "Bánh đa nem (vỏ ram Hà Tĩnh)", so_luong: 1, don_vi: "tập (~30 lá)", ghi_chu: "chọn loại giòn dai" },
            { ten: "Giá đỗ & Hành hoa", so_luong: 100, don_vi: "g", ghi_chu: "thái nhỏ ráo nước" },
            { ten: "Giấm gạo & Bia tươi", so_luong: 1, don_vi: "chén nhỏ", ghi_chu: "quét vỏ nem giòn rụm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế nguyên liệu & Vắt ráo nước củ quả",
                thoi_gian: "15 phút",
                noi_dung: "Mộc nhĩ, nấm hương ngâm nở rửa sạch thái sợi nhuyễn. Miến dong ngâm nước ấm 5 phút cho mềm rồi cắt khúc ngắn 1.5cm. Cà rốt và su hào bào sợi mỏng, bóp nhẹ với nhúm muối nhỏ trong 3 phút rồi dùng tay vắt thật kiệt nước (đây là bước quyết định giúp nhân nem không bị ra nước làm mềm rách vỏ khi cuốn và rán)."
            },
            {
                buoc: 2,
                tieu_de: "Kỹ thuật trộn nhân chuẩn độ ẩm",
                thoi_gian: "10 phút",
                noi_dung: "Cho thịt xay, miến, mộc nhĩ, nấm hương, cà rốt, su hào, giá đỗ và hành hoa vào âu lớn. Thêm 1 thìa cà phê tiêu sọ xay, 1 thìa hạt nêm. Đập 2 lòng đỏ và 1 lòng trắng trứng vào (không cho quá nhiều lòng trắng sẽ làm nhân nhão ướt). Dùng găng tay trộn nhẹ nhàng từ dưới lên cho nguyên liệu hòa quyện đều mà không bóp nát miến."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật cuốn nem vừa tay",
                thoi_gian: "15 phút",
                noi_dung: "Pha chén nước gồm 1 thìa giấm gạo và 2 thìa bia tươi, dùng cọ quét nhẹ một lớp thật mỏng lên lá bánh đa nem (giúp vỏ mềm dễ cuốn và khi rán sẽ giòn rụm màu vàng hổ phách). Múc 1 thìa nhân đặt vào 1/3 lá bánh, gấp mép hai bên lại rồi cuộn tròn vừa tay (tuyệt đối không cuộn quá chặt tay vì khi rán nhân nem nở ra sẽ làm bục nứt vỏ)."
            },
            {
                buoc: 4,
                tieu_de: "Chiên ngập dầu 2 lần lửa giòn tan 3 tiếng",
                thoi_gian: "20 phút",
                noi_dung: "Đun chảo dầu ngập 1/2 chiếc nem ở lửa vừa. Thả từng chiếc nem vào chiên lần 1 trong khoảng 4 - 5 phút đến khi vỏ nem se cứng định hình và hơi vàng nhạt thì vớt ra xếp lên rây để nguội ráo dầu. Trước khi ăn, đun dầu nóng già ở lửa lớn, thả nem vào chiên lại lần 2 trong 2 - 3 phút cho lớp vỏ phồng xốp vàng ruộm giòn tan rồi vớt ra giấy thấm dầu. Dọn ăn cùng bún tươi, rau sống và nước mắm chua ngọt."
            }
        ],
        meo_nau_an: "Bí quyết nem rán giòn rụm cả tiếng không ỉu: (1) Vắt thật kiệt nước ở cà rốt/su hào, (2) Quét một lớp bia pha giấm lên vỏ bánh trước khi cuốn, (3) Rán 2 lần lửa ngập dầu.",
        dinh_duong: { calo: 430, protein: "22g", chat_beo: "25g", carb: "28g" },
        tags: ["Món truyền thống", "Món cỗ Tết", "Giòn rụm", "Khoái khẩu"]
    },

    11: {
        mo_ta: "Sườn non heo chặt vừa miếng rán xém vàng giòn, rim đẫm sốt chua ngọt đỏ au sóng sánh từ giấm đường và cà chua, vị đậm đà đưa cơm tuyệt đỉnh.",
        do_kho: "Trung bình",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 25,
        nguyen_lieu_chi_tiet: [
            { ten: "Sườn non heo ngon", so_luong: 500, don_vi: "g", ghi_chu: "chọn sườn thăn nhiều sụn mềm, chặt khúc 3 - 4cm" },
            { ten: "Cà chua chín mọng", so_luong: 2, don_vi: "quả", ghi_chu: "bỏ hạt băm nhuyễn tạo sốt đỏ" },
            { ten: "Ớt chuông & Hành tây", so_luong: 0.5, don_vi: "củ/quả", ghi_chu: "cắt quân cờ vuông 2cm" },
            { ten: "Giấm gạo lên men tự nhiên", so_luong: 2.5, don_vi: "muỗng canh", ghi_chu: "tạo độ chua thanh dịu" },
            { ten: "Đường cát & Nước mắm", so_luong: 2, don_vi: "muỗng canh mỗi loại", ghi_chu: "tỉ lệ vàng mặn ngọt" },
            { ten: "Tương cà & Tương ớt", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo màu đẹp và độ sánh keo" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần sườn khử sạch bọt bẩn",
                thoi_gian: "10 phút",
                noi_dung: "Sườn chặt khúc 3 - 4cm, rửa sạch với nước muối. Cho sườn vào nồi nước lạnh cùng 1 thìa cà phê muối và vài lát gừng, đun sôi trong 3 phút để bọt bẩn và mùi hôi tiết ra hết. Vớt sườn ra rửa lại thật sạch bằng nước ấm, dùng khăn giấy thấm khô hoàn toàn."
            },
            {
                buoc: 2,
                tieu_de: "Chiên sườn xém vàng da",
                thoi_gian: "8 phút",
                noi_dung: "Ướp sườn với 1/2 thìa hạt nêm và chút tiêu trong 10 phút. Đun nóng chảo dầu ở lửa vừa, cho từng miếng sườn vào chiên đến khi các mặt xém vàng rộm óng ả (không chiên quá lâu làm thịt sườn bị khô rút nước). Vớt sườn ra đĩa có lót giấy thấm dầu."
            },
            {
                buoc: 3,
                tieu_de: "Pha nước sốt chua ngọt tỉ lệ vàng",
                thoi_gian: "4 phút",
                noi_dung: "Hòa tan hỗn hợp sốt trong chén gồm: 2 muỗng nước mắm, 2 muỗng đường, 2.5 muỗng giấm gạo, 1.5 muỗng tương cà, 1 muỗng tương ớt và 4 muỗng nước lọc. Phi thơm hành tỏi băm trên chảo với 1 thìa dầu ăn, cho cà chua băm nhuyễn vào xào chín nát rồi đổ toàn bộ chén sốt chua ngọt vào đun sôi sủi bọt sánh mịn."
            },
            {
                buoc: 4,
                tieu_de: "Rim sườn đẫm sốt sánh quyện",
                thoi_gian: "8 phút",
                noi_dung: "Trút toàn bộ sườn chiên vàng cùng ớt chuông và hành tây cắt khối vào chảo sốt. Hạ lửa nhỏ vừa, đảo đều tay liên tục trong 6 - 8 phút để nước sốt ngấm đượm và keo sánh lại, ôm một lớp áo đỏ óng ánh quanh từng miếng sườn. Rắc chút tiêu xay và hành hoa rồi tắt bếp múc ra đĩa."
            }
        ],
        meo_nau_an: "Thêm 1 thìa tương cà vào sốt chua ngọt sẽ giúp màu sắc đỏ óng ả bắt mắt và nước sốt có độ sệt tự nhiên mà không cần dùng đến bột năng.",
        dinh_duong: { calo: 490, protein: "32g", chat_beo: "30g", carb: "18g" },
        tags: ["Đưa cơm", "Chua ngọt", "Khoái khẩu trẻ em", "Bữa tối gia đình"]
    },

    12: {
        mo_ta: "Mực ống tươi ngọt giòn sần sật khía vảy rồng xào cùng dứa chín chua thơm và cần tỏi tây ngào ngạt, món hải sản thanh nhẹ kích thích vị giác.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Mực ống tươi loại dày thịt", so_luong: 400, don_vi: "g", ghi_chu: "mắt trong, thịt trắng đàn hồi" },
            { ten: "Dứa (thơm) chín vừa", so_luong: 0.5, don_vi: "quả", ghi_chu: "thái lát mỏng hình rẻ quạt" },
            { ten: "Cần tây & Tỏi tây", so_luong: 100, don_vi: "g", ghi_chu: "rửa sạch, cắt khúc 3.5cm" },
            { ten: "Cà chua & Hành tây", so_luong: 1, don_vi: "quả/củ", ghi_chu: "bổ múi cau" },
            { ten: "Gừng tươi & Rượu trắng", so_luong: 1, don_vi: "nhánh", ghi_chu: "khử sạch mùi tanh của mực" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử tanh & Khía hoa vảy rồng",
                thoi_gian: "10 phút",
                noi_dung: "Mực rút mai và túi mực, lột sạch lớp màng tím bên ngoài. Bóp mực với gừng giã nhuyễn và 2 thìa rượu trắng trong 2 phút để khử sạch hoàn toàn mùi tanh, rửa sạch lại và thấm khô. Đặt dao nghiêng 45 độ khía các đường ca-rô đan chéo vảy rồng trên thân mực, sau đó cắt thành từng miếng vuông 3.5 x 3.5cm."
            },
            {
                buoc: 2,
                tieu_de: "Chần nhanh mực & Khóa độ giòn sần sật",
                thoi_gian: "2 phút",
                noi_dung: "Đun sôi một nồi nước có vài lát gừng và nhúm muối nhỏ. Thả mực vào chần nhanh trong đúng 20 - 25 giây cho mực nở bung cánh hoa vảy rồng rồi vớt ra ngâm ngay vào thau nước đá lạnh trong 2 phút. Vớt ra rổ lắc thật ráo nước (bước này giúp mực khi xào không bị ra nước làm ỉu rau và giữ độ giòn đanh tối đa)."
            },
            {
                buoc: 3,
                tieu_de: "Xào thơm dứa và rau củ",
                thoi_gian: "3 phút",
                noi_dung: "Bật chảo lửa lớn, phi thơm tỏi băm với 1 thìa dầu ăn. Cho dứa và cà chua vào đảo nhanh tay trong 1.5 phút cho dứa tiết vị chua ngọt thơm nức. Thêm hành tây và cần tỏi tây vào đảo đều, nêm 1 thìa dầu hào và 1 thìa hạt nêm."
            },
            {
                buoc: 4,
                tieu_de: "Xào mực lửa lớn thần tốc",
                thoi_gian: "1 phút",
                noi_dung: "Trút toàn bộ mực đã ráo nước vào chảo rau củ. Giữ lửa lớn nhất đảo thật nhanh tay trong 45 - 60 giây cho mực ngấm đều gia vị bóng bẩy. Tắt bếp ngay lập tức, rắc nhiều tiêu sọ xay thơm nồng rồi trút ra đĩa thưởng thức nóng."
            }
        ],
        meo_nau_an: "Chần sơ mực qua nước sôi có gừng rồi ngâm ngay nước đá lạnh trước khi xào; mực sẽ nở hoa vảy rồng tuyệt đẹp, giòn sần sật và tuyệt đối không chảy nước ra chảo.",
        dinh_duong: { calo: 260, protein: "28g", chat_beo: "5g", carb: "15g" },
        tags: ["Hải sản tươi", "Chua ngọt", "Giàu đạm ít béo", "Món xào hấp dẫn"]
    },

    13: {
        mo_ta: "Thịt gà ta săn chắc đậm đà ngập tràn hương gừng tươi già thái sợi cay nồng, nước kho vàng óng ánh ấm bụng thích hợp cho ngày mưa hoặc se lạnh.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 25,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt gà ta tươi (đùi/cánh/lườn)", so_luong: 600, don_vi: "g", ghi_chu: "chặt miếng vuông 3cm" },
            { ten: "Gừng tươi củ già", so_luong: 1, don_vi: "củ to (~50g)", ghi_chu: "gọt vỏ, thái sợi chỉ dài" },
            { ten: "Hành tím khô", so_luong: 2, don_vi: "củ", ghi_chu: "băm nhỏ" },
            { ten: "Nước mắm ngon truyền thống", so_luong: 2.5, don_vi: "muỗng canh", ghi_chu: "độ đạm cao" },
            { ten: "Đường thốt nốt / Nước màu", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo màu cánh gián" },
            { ten: "Ớt hiểm & Tiêu xay", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "tạo vị ấm nồng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế gà sạch thơm & Cắt miếng",
                thoi_gian: "10 phút",
                noi_dung: "Gà chà xát kỹ với muối hạt và gừng giã trong 3 phút để tẩy sạch mùi hôi lông, rửa lại nước sạch để thật ráo. Dùng dao chặt dứt khoát thành từng miếng vuông vừa ăn khoảng 3 x 3cm (chặt dứt khoát để không bị vụn xương)."
            },
            {
                buoc: 2,
                tieu_de: "Ướp gà thấm đượm hương gừng",
                thoi_gian: "20 phút",
                noi_dung: "Ướp gà cùng 2 muỗng nước mắm ngon, 1 muỗng đường, 1 muỗng nước màu, hành tím băm, 1/2 muỗng tiêu xay và một nửa phần gừng thái sợi. Trộn bóp đều và để gà nghỉ 20 phút cho thớ thịt thấm sâu vị mặn ngọt và tinh dầu gừng ấm."
            },
            {
                buoc: 3,
                tieu_de: "Phi thơm gừng & Xào săn thịt gà",
                thoi_gian: "6 phút",
                noi_dung: "Đặt nồi lên bếp cho 1 thìa dầu ăn vào, trút phần gừng sợi còn lại vào phi trên lửa vừa cho đến khi gừng ngả vàng giòn dậy mùi thơm nức mũi. Trút toàn bộ thịt gà đã ướp vào xào đảo liên tục trên lửa vừa trong 5 - 6 phút đến khi thịt gà săn chắc lại, lớp da gà tưa mỡ vàng óng ả."
            },
            {
                buoc: 4,
                tieu_de: "Kho liu riu kẹo nước sốt",
                thoi_gian: "15 phút",
                noi_dung: "Châm thêm nửa chén nước sôi nóng vào ngang mặt thịt gà. Đậy hé nắp đun sôi bùng lên rồi hạ lửa nhỏ liu riu kho trong 15 - 18 phút cho thịt gà mềm thấu gia vị. Khi nước kho cạn keo sền sệt ôm bóng quanh từng miếng thịt gà vàng ươm, rắc ớt chỉ thiên và tiêu thơm rồi tắt bếp."
            }
        ],
        meo_nau_an: "Chia gừng làm 2 phần: 1 phần ướp sâu trong thịt gà, phần còn lại phi vàng giòn trong dầu trước khi xào gà; hương gừng sẽ tỏa ngát nồng nàn từ trong ra ngoài miếng thịt.",
        dinh_duong: { calo: 390, protein: "35g", chat_beo: "22g", carb: "5g" },
        tags: ["Món kho ấm bụng", "Đậm đà", "Món cơm mùa đông", "Truyền thống"]
    },

    14: {
        mo_ta: "Trứng cút bùi béo kết hợp thịt ba chỉ mềm ngậy đậm đà, đượm nước sốt kho màu cánh gián ngọt thanh, món ăn tuổi thơ quen thuộc trong mâm cơm người Việt.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 30,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt ba chỉ heo tươi", so_luong: 350, don_vi: "g", ghi_chu: "thái con chì dày 1.5 x 3cm" },
            { ten: "Trứng cút tươi", so_luong: 15, don_vi: "quả", ghi_chu: "luộc chín, bóc sạch vỏ" },
            { ten: "Hành tím khô băm nhỏ", so_luong: 3, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Nước mắm ngon & Đường", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "cân bằng mặn ngọt" },
            { ten: "Nước hàng (nước màu)", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo màu cánh gián" },
            { ten: "Tiêu xay & Hành hoa", so_luong: 1, don_vi: "thìa", ghi_chu: "rắc hoàn thiện" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Luộc & Bóc vỏ trứng cút nhanh gọn",
                thoi_gian: "8 phút",
                noi_dung: "Cho trứng cút vào nồi nước lạnh có chút muối và giấm, đun sôi trong 5 phút. Vớt ngay ra thau nước đá lạnh ngâm 3 phút. Lăn nhẹ quả trứng trên mặt bàn cho dập đều vỏ rồi lột vỏ dưới vòi nước chảy; lớp vỏ sẽ tuột ra dễ dàng mà không làm nát lòng trắng."
            },
            {
                buoc: 2,
                tieu_de: "Thái & Ướp thịt ba chỉ",
                thoi_gian: "15 phút",
                noi_dung: "Thịt ba chỉ rửa sạch với nước muối, thái con chì dày khoảng 1.5 x 3cm. Ướp thịt với 1.5 muỗng nước mắm, 1 muỗng đường, 1 muỗng nước màu, 1/2 muỗng tiêu xay và hành tím băm trong 15 phút."
            },
            {
                buoc: 3,
                tieu_de: "Xào săn thịt & Đun nước kho",
                thoi_gian: "7 phút",
                noi_dung: "Cho thịt đã ướp vào nồi đảo đều tay trên lửa vừa trong 4 - 5 phút cho mỡ tứa ra và thịt săn lại se màu vàng nâu bóng. Đổ 1 chén nước sôi nóng vào ngập ngang mặt thịt, đun sôi bùng và hớt bọt."
            },
            {
                buoc: 4,
                tieu_de: "Kho cùng trứng cút keo sánh",
                thoi_gian: "15 phút",
                noi_dung: "Hạ lửa nhỏ liu riu kho trong 10 phút cho thịt mềm. Thả toàn bộ trứng cút vào nồi kho chung thêm 10 phút, thỉnh thoảng dùng muôi lật nhẹ trứng cho ngấm đều màu nâu hổ phách. Khi nước kho sánh lại sền sệt bám quanh thịt và trứng, rắc hành hoa tiêu xay rồi tắt bếp."
            }
        ],
        meo_nau_an: "Nếu thích vỏ trứng cút dai dai và ngấm màu cánh gián đậm hơn, bạn có thể chiên sơ trứng cút ngập dầu trong 1 phút trước khi thả vào nồi kho cùng thịt.",
        dinh_duong: { calo: 420, protein: "26g", chat_beo: "32g", carb: "6g" },
        tags: ["Đưa cơm", "Gia đình", "Dễ làm", "Món mặn truyền thống"]
    },

    15: {
        mo_ta: "Tôm sú hoặc tôm đất tươi rim mặn ngọt óng ánh, vỏ giòn rụm sần sật, thịt tôm đỏ au săn ngọt ngào đậm đà thơm nồng tỏi ớt.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 12,
        nguyen_lieu_chi_tiet: [
            { ten: "Tôm tươi (tôm đất hoặc tôm sú)", so_luong: 350, don_vi: "g", ghi_chu: "cắt bỏ râu và ngạnh đầu nhọn" },
            { ten: "Tỏi khô ta băm nhuyễn", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "phi thơm" },
            { ten: "Nước mắm ngon cốt cá cơm", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "độ mặn chuẩn" },
            { ten: "Đường thốt nốt hoặc đường cát", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo độ keo dính bóng bẩy" },
            { ten: "Tiêu đen xay & Hành hoa", so_luong: 1, don_vi: "thìa", ghi_chu: "tạo mùi thơm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế & Rút chỉ lưng tôm",
                thoi_gian: "8 phút",
                noi_dung: "Tôm dùng kéo cắt bỏ phần râu dài và ngạnh nhọn ở đầu, cắt bớt chóp đuôi. Dùng tăm nhọn xiên vào đốt sống thứ 2 trên lưng tôm nhẹ nhàng kéo sạch sợi chỉ đen đắng ra ngoài. Rửa sạch tôm với nước muối loãng rồi dùng khăn thấm thật khô ráo."
            },
            {
                buoc: 2,
                tieu_de: "Đảo tôm săn giòn vỏ",
                thoi_gian: "3 phút",
                noi_dung: "Đặt chảo lên bếp với 1 thìa dầu ăn đun nóng già ở lửa lớn. Trút toàn bộ tôm vào đảo nhanh tay liên tục trong 2 - 3 phút đến khi tôm chuyển sang màu đỏ cam rực rỡ, lớp vỏ co săn giòn rụm thì trút tôm ra đĩa riêng."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt rim mặn ngọt caramel",
                thoi_gian: "3 phút",
                noi_dung: "Cho thêm 1 thìa dầu vào chảo phi thơm tỏi băm đến khi vàng ruộm. Trút hỗn hợp gồm 2 muỗng nước mắm, 1.5 muỗng đường, 1/2 muỗng tiêu và 1 muỗng nước lọc vào chảo. Đun lửa vừa khuấy đều cho đường tan chảy sủi bọt khí keo lại sền sệt."
            },
            {
                buoc: 4,
                tieu_de: "Rim tôm đẫm sốt óng ả",
                thoi_gian: "3 phút",
                noi_dung: "Đổ đĩa tôm trở lại chảo sốt, đảo đều tay liên tục trên lửa vừa trong 2 - 3 phút để nước sốt bám dính một lớp caramel đỏ bóng bao quanh từng con tôm. Khi sốt cạn ráo keo lại, rắc hành hoa thái nhỏ đảo 5 giây rồi tắt bếp múc ra đĩa."
            }
        ],
        meo_nau_an: "Đảo tôm trên lửa lớn cho vỏ săn trước khi cho sốt đường mắm vào rim; cách này giúp vỏ tôm giòn tan mà thịt tôm bên trong vẫn giữ nguyên vị ngọt mọng nước tự nhiên.",
        dinh_duong: { calo: 280, protein: "32g", chat_beo: "8g", carb: "10g" },
        tags: ["Đưa cơm", "Nhanh gọn", "Giàu canxi & đạm", "Món mặn dân dã"]
    }
};

module.exports = { PART_1 };
