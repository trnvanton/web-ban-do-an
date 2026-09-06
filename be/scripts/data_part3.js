// ============================================================
// Dữ liệu món ăn phần 3: Canh, Món Xào Rau Củ & Chiên (IDs: 31 - 45)
// Quy chuẩn đầu bếp: Các bước chi tiết, kỹ thuật nhiệt, thời gian, doneness check
// ============================================================

const PART_3 = {
    31: {
        mo_ta: "Bát canh trứng cà chua đỏ rực điểm vân mây trứng gà vàng óng bồng bềnh mềm mại, món canh siêu tốc thơm ngon ngọt dịu khai vị hoàn hảo.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 5,
        nguyen_lieu_chi_tiet: [
            { ten: "Trứng gà ta tươi", so_luong: 2, don_vi: "quả", ghi_chu: "đánh tan với 1/2 thìa cà phê dầu ăn" },
            { ten: "Cà chua chín đỏ mọng", so_luong: 2, don_vi: "quả", ghi_chu: "bổ múi cau mỏng" },
            { ten: "Hành tím & Hành hoa", so_luong: 3, don_vi: "nhánh", ghi_chu: "băm nhỏ" },
            { ten: "Rau mùi (ngò rí)", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "thái nhỏ rắc canh" },
            { ten: "Nước mắm ngon & Tiêu xay", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "nêm vừa vị" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Đánh trứng & Chuẩn bị cà chua",
                thoi_gian: "2 phút",
                noi_dung: "Đập 2 quả trứng gà vào bát, thêm 1/2 thìa cà phê nước mắm, chút tiêu và 1/2 thìa cà phê dầu ăn (dầu ăn giúp sợi vân mây trứng khi gặp nước sôi sẽ mềm mại mượt mà không bị khô cứng). Đánh tan đều tay. Cà chua rửa sạch, bổ múi cau mỏng."
            },
            {
                buoc: 2,
                tieu_de: "Xào sốt cà chua đỏ sánh",
                thoi_gian: "2 phút",
                noi_dung: "Bắc nồi lên bếp với 1 thìa dầu ăn, phi thơm hành tím băm. Cho cà chua vào xào đều trên lửa vừa, nêm 1 thìa hạt nêm và dùng muôi dằm nhẹ cho cà chua ra nước sốt đỏ sánh đẹp mắt."
            },
            {
                buoc: 3,
                tieu_de: "Nấu nước canh sôi sùng sục",
                thoi_gian: "2 phút",
                noi_dung: "Đổ 800ml nước sôi nóng vào nồi cà chua, nêm 1 muỗng nước mắm ngon. Bật lửa lớn nhất để nước canh sôi sục thật mạnh (nước sôi sục mạnh là điều kiện tiên quyết để tạo vân mây trứng bồng bềnh)."
            },
            {
                buoc: 4,
                tieu_de: "Kỹ thuật rót dòng tạo vân mây bồng bềnh",
                thoi_gian: "1 phút",
                noi_dung: "Khi nước canh đang sôi bùng mạnh mẽ, một tay cầm bát trứng rót từ từ từng dòng thật nhỏ từ trên cao xuống khắp mặt nồi, tay kia dùng đũa khuấy nhẹ nhàng theo một chiều vòng tròn. Lòng đỏ và lòng trắng sẽ lập tức chín đông và tơ ra thành từng dải vân mây vàng óng bồng bềnh đẹp mắt. Tắt bếp ngay lập tức, rắc hành hoa, rau mùi và chút tiêu xay lên trên mặt."
            }
        ],
        meo_nau_an: "Bắt buộc nước canh phải sôi sùng sục ở lửa lớn khi rót trứng vào và khuấy theo một chiều nhẹ tay; trứng sẽ tạo thành những dải vân mây xốp mỏng như lụa mà không bị vữa tanh.",
        dinh_duong: { calo: 160, protein: "12g", chat_beo: "11g", carb: "5g" },
        tags: ["Nhanh như chớp", "Dễ làm nhất", "Bữa cơm tiện lợi", "Màu sắc bắt mắt"]
    },

    32: {
        mo_ta: "Nước canh ngao ngọt lịm từ biển cả nấu cùng dứa chín chua thơm, cà chua mọng nước và quả sấu giòn, món canh thanh nhiệt cực phẩm mùa hè miền Bắc.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Ngao tươi sống (nghêu)", so_luong: 1, don_vi: "kg", ghi_chu: "ngâm nước ớt nhả sạch cát" },
            { ten: "Cà chua chín mọng", so_luong: 2, don_vi: "quả", ghi_chu: "bổ múi cau" },
            { ten: "Dứa (thơm) chín vừa", so_luong: 0.5, don_vi: "quả", ghi_chu: "thái lát mỏng rẻ quạt" },
            { ten: "Quả sấu xanh (hoặc me)", so_luong: 3, don_vi: "quả", ghi_chu: "cạo vỏ khía cạnh" },
            { ten: "Rau răm & Hành hoa tươi", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "linh hồn món canh ngao" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Ngâm nhả cát & Luộc ngao lấy nước ngọt",
                thoi_gian: "10 phút",
                noi_dung: "Ngao ngâm trong thau nước vo gạo có cắt vài lát ớt tươi trong 30 phút để nhả sạch bùn cát, rửa sạch vỏ ngoài. Cho ngao vào nồi với 1 lít nước lạnh, đun lửa lớn đến khi ngao vừa hé miệng mở vỏ thì vớt ngao ra ngay. Để nồi nước luộc ngao lắng cặn trong 5 phút rồi nhẹ nhàng gạn lấy phần nước trong veo bên trên, bỏ phần cặn cát đọng đáy nồi."
            },
            {
                buoc: 2,
                tieu_de: "Tách thịt ngao & Xào săn thơm nức",
                thoi_gian: "5 phút",
                noi_dung: "Tách lấy phần ruột thịt ngao, bóp nhẹ rửa sạch phần phân đen bên trong để ngao không bị sạn. Đặt nồi lên bếp, phi thơm hành tím băm với 1 thìa dầu ăn, cho ruột ngao vào đảo nhanh tay trên lửa lớn cùng 1 thìa cà phê nước mắm trong 1 phút cho ngấm thơm rồi múc ra bát riêng."
            },
            {
                buoc: 3,
                tieu_de: "Nấu nước canh chua sấu thanh mát",
                thoi_gian: "6 phút",
                noi_dung: "Cho cà chua vào nồi xào lấy màu đỏ cam, đổ nước luộc ngao trong veo vào đun sôi. Thả quả sấu cạo vỏ và dứa thái lát vào đun sôi ở lửa vừa trong 5 phút cho sấu chín mềm. Dùng muôi dầm nát quả sấu để tinh chất chua thanh dịu của sấu hòa tan vào nước canh."
            },
            {
                buoc: 4,
                tieu_de: "Thả ruột ngao & Rau răm hoàn thiện",
                thoi_gian: "2 phút",
                noi_dung: "Trút toàn bộ bát ruột ngao xào vào nồi nước canh, nêm nếm lại thêm hạt nêm cho vị chua thanh ngọt đậm đà vừa miệng. Đun sôi bùng lại 30 giây rồi tắt bếp ngay. Rắc nhiều rau răm và hành hoa thái nhỏ lên mặt, múc ra tô thưởng thức nóng."
            }
        ],
        meo_nau_an: "Canh ngao nấu chua dứt khoát phải có rau răm; rau răm khử hoàn toàn tính hàn của ngao và mang lại hương vị thơm nồng nàn quyến rũ không thể thay thế.",
        dinh_duong: { calo: 170, protein: "22g", chat_beo: "3g", carb: "14g" },
        tags: ["Canh thanh nhiệt", "Giải độc mùa hè", "Hải sản ngọt lành", "Vị chua sấu Bắc"]
    },

    33: {
        mo_ta: "Đậu hũ non mềm tan mượt mà hòa cùng rong biển khô thanh mát ngọt tự nhiên và thịt băm ngọt nước, món canh chuẩn phong cách dưỡng sinh lành mạnh.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Đậu hũ non tươi", so_luong: 1, don_vi: "hộp (~300g)", ghi_chu: "cắt khối vuông 2cm" },
            { ten: "Rong biển khô nấu canh (Miyeok)", so_luong: 15, don_vi: "g", ghi_chu: "ngâm nở to, rửa sạch khử tanh" },
            { ten: "Thịt heo nạc vai xay", so_luong: 100, don_vi: "g", ghi_chu: "ướp chút gia vị" },
            { ten: "Gừng tươi già", so_luong: 1, don_vi: "nhánh nhỏ", ghi_chu: "thái chỉ mỏng ấm bụng" },
            { ten: "Dầu mè nguyên chất", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "nhỏ vào khi hoàn thành" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Ngâm nở & Khử tanh rong biển",
                thoi_gian: "10 phút",
                noi_dung: "Ngâm 15g rong biển khô vào thau nước lạnh trong 10 phút cho nở bung to gấp 5 lần. Bóp nhẹ rong biển với vài giọt rượu trắng và vài lát gừng đập dập để tẩy sạch hoàn toàn mùi tanh của biển, xả lại nước lạnh rồi dùng kéo cắt khúc vừa ăn 3cm."
            },
            {
                buoc: 2,
                tieu_de: "Xào thịt băm & Xào thơm rong biển với dầu mè",
                thoi_gian: "4 phút",
                noi_dung: "Đặt nồi lên bếp với 1 thìa cà phê dầu mè, cho thịt xay và gừng thái chỉ vào xào săn trên lửa vừa. Trút toàn bộ rong biển vào đảo đều tay cùng thịt trong 2 phút cho sợi rong biển săn lại và ngấm đượm hương gừng ấm."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sôi nước dùng thanh ngọt",
                thoi_gian: "5 phút",
                noi_dung: "Đổ 800ml nước sôi nóng vào nồi rong biển, bật lửa lớn đun sôi bùng, hớt sạch bọt. Nêm 1 muỗng canh nước tương đậu nành (hoặc nước mắm) và 1 thìa hạt nêm cho thanh vị."
            },
            {
                buoc: 4,
                tieu_de: "Thả đậu non mượt mà & Hoàn tất",
                thoi_gian: "2 phút",
                noi_dung: "Cắt đậu hũ non thành các khối vuông 2 x 2cm, nhẹ nhàng thả từng khối vào nồi canh đang sôi lăn tăn (tránh khuấy mạnh tay làm nát đậu non). Đun sôi nhẹ trong 2 phút, nhỏ vài giọt dầu mè thơm ngậy lên trên mặt rồi tắt bếp múc ra tô thưởng thức nóng."
            }
        ],
        meo_nau_an: "Xào sơ rong biển với vài sợi gừng tươi và dầu mè trước khi châm nước nấu giúp khử sạch 100% mùi tanh đặc trưng và làm nước canh thơm ngậy hấp dẫn.",
        dinh_duong: { calo: 180, protein: "18g", chat_beo: "8g", carb: "9g" },
        tags: ["Eat Clean", "Dưỡng sinh", "Giàu I-ốt & Khoáng chất", "Thanh đạm nhẹ bụng"]
    },

    34: {
        mo_ta: "Đĩa rau muống xào tỏi xanh ngắt mướt mát giòn sần sật, ngập tràn mùi tỏi phi thơm nức mũi, món rau xào quốc dân không thể thiếu trong bữa cơm Việt.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 5,
        nguyen_lieu_chi_tiet: [
            { ten: "Rau muống ngọn non", so_luong: 1, don_vi: "bó (~500g)", ghi_chu: "nhặt bớt lá già gốc cứng, rửa sạch" },
            { ten: "Tỏi khô ta thơm nồng", so_luong: 2, don_vi: "củ to", ghi_chu: "đập dập thô, chia 2 phần" },
            { ten: "Dầu ăn thực vật", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "giúp rau bóng bẩy mướt mắt" },
            { ten: "Nước mắm ngon & Dầu hào", so_luong: 1, don_vi: "muỗng canh mỗi loại", ghi_chu: "nêm đậm đà" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần sơ sốc nhiệt đá lạnh giữ màu xanh ngắt",
                thoi_gian: "3 phút",
                noi_dung: "Đun sôi một nồi nước lớn với 1 thìa cà phê muối hạt đầy. Khi nước sôi sùng sục trên lửa lớn, thả toàn bộ rau muống vào dùng đũa nhấn chìm đều trong đúng 40 giây. Vớt ngay ra thau nước đá lạnh ngâm 2 phút để khóa màu xanh diệp lục và giữ độ giòn sần sật, sau đó vớt ra rổ xóc thật ráo nước."
            },
            {
                buoc: 2,
                tieu_de: "Phi thơm tỏi vàng giòn",
                thoi_gian: "1 phút",
                noi_dung: "Đặt chảo gang hoặc chảo sâu lòng lên bếp bật lửa lớn, cho 2 muỗng canh dầu ăn vào đun nóng già. Cho 2/3 lượng tỏi đập dập vào phi nhanh trong 15 giây đến khi tỏi ngả vàng nhạt và tỏa mùi thơm nức mũi."
            },
            {
                buoc: 3,
                tieu_de: "Xào rau muống lửa cực lớn (Wok Hei)",
                thoi_gian: "2 phút",
                noi_dung: "Trút toàn bộ rau muống đã ráo nước vào chảo. Giữ ngọn lửa lớn nhất có thể, dùng đũa và muôi đảo thật nhanh tay và liên tục. Nêm 1 muỗng canh dầu hào, 1 thìa nước mắm ngon và 1 thìa hạt nêm. Đảo đều tay trong 60 - 90 giây để từng cọng rau ngấm đều gia vị và áo lớp dầu bóng bẩy."
            },
            {
                buoc: 4,
                tieu_de: "Cho tỏi tươi lần 2 & Bày đĩa",
                thoi_gian: "30 giây",
                noi_dung: "Khi rau vừa chín tới vẫn giữ độ giòn ngọt mọng nước, cho nốt 1/3 lượng tỏi đập dập còn lại vào đảo nhanh 10 giây (lớp tỏi sau giữ mùi hăng thơm tươi mới của tỏi sống kết hợp tỏi phi vàng). Tắt bếp trút ngay ra đĩa phẳng, không để rau trong chảo nóng sẽ làm rau bị ỉu xỉn màu."
            }
        ],
        meo_nau_an: "Bí quyết rau muống xào xanh ngắt không bao giờ thâm đen: Chần nhanh 40 giây qua nước sôi có muối rồi ngâm đá lạnh, xào trên ngọn lửa lớn nhất và cho tỏi làm 2 đợt.",
        dinh_duong: { calo: 120, protein: "5g", chat_beo: "7g", carb: "9g" },
        tags: ["Món xào quốc dân", "Giòn sần sật", "Thơm lừng tỏi phi", "Bữa cơm hàng ngày"]
    },

    35: {
        mo_ta: "Ngọn su su bánh tẻ non xanh giòn ngọt tự nhiên xào cùng tỏi thơm nức, món rau đặc sản vùng cao mát lành cực kỳ bắt cơm.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 5,
        nguyen_lieu_chi_tiet: [
            { ten: "Ngọn su su non", so_luong: 400, don_vi: "g", ghi_chu: "tước sạch xơ cuống, bẻ đoạn ngắn 5cm" },
            { ten: "Tỏi khô ta", so_luong: 2, don_vi: "củ", ghi_chu: "đập dập thô" },
            { ten: "Dầu hào & Hạt nêm", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo độ bóng ngậy" },
            { ten: "Tiêu xay & Nước mắm", so_luong: 1, don_vi: "thìa", ghi_chu: "tạo mùi thơm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Kỹ thuật tước xơ ngọn su su",
                thoi_gian: "10 phút",
                noi_dung: "Dùng móng tay tước sạch lớp xơ cứng bao quanh phần thân cuống su su (tước kỹ từ gốc lên ngọn để khi xào rau mềm giòn không bị bã). Bẻ thân su su thành từng đoạn dài 5 - 6cm, lá non vò nhẹ. Rửa sạch ngâm nước muối 5 phút rồi vớt ra để thật ráo."
            },
            {
                buoc: 2,
                tieu_de: "Phi thơm tỏi vàng ruộm",
                thoi_gian: "1 phút",
                noi_dung: "Đun nóng chảo với 1.5 muỗng dầu ăn trên lửa lớn, cho tỏi đập dập vào phi thơm vàng trong 15 giây."
            },
            {
                buoc: 3,
                tieu_de: "Xào nhanh tay lửa lớn",
                thoi_gian: "3 phút",
                noi_dung: "Trút ngọn su su vào đảo nhanh tay trên lửa lớn. Thêm 2 thìa canh nước sôi vào chảo (hơi nước sôi giúp su su chín đều nhanh mà không bị khô cháy). Nêm 1 thìa dầu hào, 1 thìa hạt nêm và chút nước mắm đảo đều tay trong 2 phút."
            },
            {
                buoc: 4,
                tieu_de: "Hoàn thiện & Bày đĩa",
                thoi_gian: "30 giây",
                noi_dung: "Khi ngọn su su vừa chín tới chuyển màu xanh nõn chuối bóng mượt giòn ngọt, tắt bếp ngay. Rắc chút tiêu xay rồi trút ra đĩa thưởng thức nóng."
            }
        ],
        meo_nau_an: "Tước kỹ lớp xơ cuống và thêm 2 thìa nước sôi khi xào giúp cọng su su chín mềm từ trong ruột mà lớp vỏ ngoài vẫn giòn sần sật mọng nước.",
        dinh_duong: { calo: 110, protein: "4g", chat_beo: "6g", carb: "10g" },
        tags: ["Đặc sản miền núi", "Giòn ngọt tự nhiên", "Giàu chất xơ", "Món xào thanh nhẹ"]
    },

    36: {
        mo_ta: "Bắp cải giòn ngọt xào cùng thịt ba chỉ béo ngậy thái mỏng xém cạnh, rắc chút hành hoa tiêu sọ thơm lừng, món xào ấm cúng cho bữa cơm sum họp.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Bắp cải tươi", so_luong: 400, don_vi: "g", ghi_chu: "thái sợi bản dày 0.8cm" },
            { ten: "Thịt ba chỉ heo", so_luong: 200, don_vi: "g", ghi_chu: "thái lát mỏng 2mm" },
            { ten: "Cà chua chín", so_luong: 1, don_vi: "quả", ghi_chu: "bổ múi cau tạo vị chua thanh" },
            { ten: "Hành tím & Hành hoa", so_luong: 3, don_vi: "nhánh", ghi_chu: "thái nhỏ" },
            { ten: "Nước mắm & Tiêu xay", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "nêm vừa vị" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Thái sợi bắp cải & Ráo nước",
                thoi_gian: "5 phút",
                noi_dung: "Bắp cải bỏ lá già, thái sợi bản rộng khoảng 0.8cm (không thái quá mỏng xào sẽ bị nhũn nát ra nước). Rửa sạch ngâm nước muối 5 phút rồi vớt ra rổ xóc thật ráo nước."
            },
            {
                buoc: 2,
                tieu_de: "Đảo thịt ba chỉ ra mỡ xém cạnh",
                thoi_gian: "4 phút",
                noi_dung: "Cho thịt ba chỉ vào chảo nóng ở lửa vừa (không cho dầu ăn). Đảo đều tay 3 - 4 phút cho thịt tiết bớt mỡ thơm và các cạnh xém vàng nâu, cho hành tím vào phi thơm cùng."
            },
            {
                buoc: 3,
                tieu_de: "Xào bắp cải lửa lớn không ra nước",
                thoi_gian: "4 phút",
                noi_dung: "Tăng lửa lớn, trút toàn bộ bắp cải và cà chua vào chảo xào chung với mỡ thịt. Đảo thật nhanh tay liên tục, nêm 1.5 muỗng nước mắm ngon và 1 thìa hạt nêm. Xào trong 3 phút đến khi sợi bắp cải vừa chín tới mềm mà vẫn giữ độ giòn sần sật."
            },
            {
                buoc: 4,
                tieu_de: "Rắc hành tiêu & Trình bày",
                thoi_gian: "1 phút",
                noi_dung: "Rắc hành hoa cắt khúc và hạt tiêu xay thơm nồng vào chảo, đảo đều 10 giây rồi tắt bếp ngay. Múc ra đĩa lớn thưởng thức nóng cùng cơm trắng."
            }
        ],
        meo_nau_an: "Xào bắp cải bắt buộc phải để lửa thật lớn và không đậy nắp vung; bắp cải sẽ giữ nguyên độ giòn ngọt mọng nước tự nhiên mà không bị chảy nước lênh láng ra đĩa.",
        dinh_duong: { calo: 260, protein: "15g", chat_beo: "18g", carb: "11g" },
        tags: ["Món xào gia đình", "Giòn ngọt", "Đưa cơm mùa lạnh", "Dễ làm"]
    },

    37: {
        mo_ta: "Mướp hương mềm mượt thơm nức mũi xào cùng lòng mề gà giòn sần sật đậm đà, món ăn thanh tao ngọt vị quen thuộc trong mâm cơm mùa hè.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Mướp hương non", so_luong: 2, don_vi: "quả (~400g)", ghi_chu: "gọt vỏ thái vát xéo dày 1.5cm" },
            { ten: "Bộ lòng mề gan gà tươi", so_luong: 2, don_vi: "bộ (~250g)", ghi_chu: "bóp muối khử sạch mùi" },
            { ten: "Hành tím & Hành hoa", so_luong: 3, don_vi: "nhánh", ghi_chu: "thái nhỏ" },
            { ten: "Dầu hào & Nước mắm", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "nêm nếm đậm đà" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế sạch lòng gà & Khía hoa mề",
                thoi_gian: "10 phút",
                noi_dung: "Mề gà bóc màng vàng, bóp kỹ với muối hạt và chanh trong 3 phút rửa sạch nhớt. Khía hoa ca-rô trên mặt mề rồi thái miếng vừa ăn (khía hoa giúp mề gà khi xào nở giòn đẹp mắt). Gan và lòng thái khúc 3cm. Ướp với 1 thìa cà phê nước mắm, tiêu và hành tím trong 10 phút."
            },
            {
                buoc: 2,
                tieu_de: "Xào chín tới lòng mề gà",
                thoi_gian: "3 phút",
                noi_dung: "Phi thơm hành tím với 1 thìa dầu ăn trên lửa lớn, trút lòng mề gà vào xào đảo nhanh tay trong 2.5 - 3 phút cho lòng chín tới săn giòn rồi múc ra đĩa riêng (không để lại trong chảo)."
            },
            {
                buoc: 3,
                tieu_de: "Xào mướp hương ngọt thơm",
                thoi_gian: "2 phút",
                noi_dung: "Thêm chút dầu vào chảo, cho mướp hương thái vát vào đảo nhanh tay trên lửa lớn cùng 1 thìa hạt nêm và 1 thìa nước lọc trong 1.5 phút cho mướp vừa chuyển màu xanh trong tái chín."
            },
            {
                buoc: 4,
                tieu_de: "Hòa quyện & Bày đĩa",
                thoi_gian: "1 phút",
                noi_dung: "Đổ đĩa lòng gà trở lại chảo mướp, đảo nhanh tay trong 30 giây cho ngấm vị mướp ngọt ngào. Rắc hành hoa, tiêu xay rồi tắt bếp trút ngay ra đĩa (không xào lâu mướp sẽ nhũn ra nước)."
            }
        ],
        meo_nau_an: "Xào lòng mề gà riêng rồi mới xào mướp; chỉ trộn chung 30 giây cuối để mướp không bị thâm nhũn và lòng gà giữ trọn độ giòn sần sật sảng khoái.",
        dinh_duong: { calo: 210, protein: "20g", chat_beo: "10g", carb: "10g" },
        tags: ["Mướp hương thơm ngát", "Giòn sần sật", "Thanh mát", "Món xào dân dã"]
    },

    38: {
        mo_ta: "Từng quả đậu cove xanh giòn ngọt tự nhiên xào quyện cùng những lát thịt bò thăn mềm mọng đẫm dầu hào và tỏi phi thơm nức mũi.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Đậu cove non tươi", so_luong: 350, don_vi: "g", ghi_chu: "tước xơ 2 bên, thái vát xéo mỏng" },
            { ten: "Thịt thăn bò tươi", so_luong: 250, don_vi: "g", ghi_chu: "thái mỏng ngang thớ bản rộng" },
            { ten: "Tỏi khô ta băm nhuyễn", so_luong: 2, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Dầu hào & Nước tương", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo màu nâu bóng thơm béo" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Ướp thịt bò mềm mọng với dầu hào",
                thoi_gian: "15 phút",
                noi_dung: "Thịt bò thái mỏng ngang thớ, ướp với 1 muỗng dầu hào, 1/2 lượng tỏi băm, 1/2 thìa tiêu và 1 thìa canh dầu ăn trong 15 phút để thớ thịt giữ ẩm."
            },
            {
                buoc: 2,
                tieu_de: "Xào tái thịt bò lửa lớn",
                thoi_gian: "2 phút",
                noi_dung: "Phi thơm tỏi trên chảo lửa lớn với 1 thìa dầu ăn, trút thịt bò vào đảo cực nhanh tay trong 60 giây cho thịt vừa chín tái hồng thì trút ngay ra đĩa riêng."
            },
            {
                buoc: 3,
                tieu_de: "Xào đậu cove giòn ngọt",
                thoi_gian: "4 phút",
                noi_dung: "Cho đậu cove thái vát vào chảo đảo đều trên lửa lớn, thêm 3 thìa nước sôi và 1 thìa hạt nêm. Đậy vung chảo trong 1 phút cho hơi nước làm đậu chín giòn đều từ bên trong mà vẫn xanh mướt."
            },
            {
                buoc: 4,
                tieu_de: "Trộn đều & Hoàn tất",
                thoi_gian: "1 phút",
                noi_dung: "Đổ đĩa thịt bò cùng toàn bộ nước ngọt vào chảo đậu, đảo nhanh tay 30 giây cho hòa quyện rồi tắt bếp, rắc tiêu xay và trút ra đĩa thưởng thức nóng."
            }
        ],
        meo_nau_an: "Thêm 3 thìa nước sôi và đậy vung 1 phút khi xào đậu cove giúp hạt đậu chín ngọt mềm mà vỏ ngoài vẫn giữ màu xanh nõn chuối giòn tan.",
        dinh_duong: { calo: 270, protein: "29g", chat_beo: "9g", carb: "18g" },
        tags: ["Giàu đạm & xơ", "Eat Clean", "Nhanh gọn", "Bổ dưỡng gia đình"]
    },

    39: {
        mo_ta: "Tôm tươi chắc ngọt đỏ au xào cùng bông cải xanh giòn mát thấm đẫm sốt tỏi dầu hào bóng bẩy, món ăn giàu vitamin và khoáng chất tốt cho sức khỏe.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Bông cải xanh (súp lơ)", so_luong: 1, don_vi: "cây (~400g)", ghi_chu: "tách nhánh vừa ăn, ngâm nước muối" },
            { ten: "Tôm sú tươi bóc nõn", so_luong: 250, don_vi: "g", ghi_chu: "chừa đuôi rút sạch chỉ lưng" },
            { ten: "Cà rốt tỉa hoa", so_luong: 0.5, don_vi: "củ", ghi_chu: "thái mỏng 2mm" },
            { ten: "Tỏi khô ta băm", so_luong: 1.5, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Dầu hào & Dầu mè", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo mùi thơm béo" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần sơ bông cải xanh giữ vitamin",
                thoi_gian: "3 phút",
                noi_dung: "Đun sôi nồi nước với 1 thìa cà phê muối. Thả bông cải xanh và cà rốt vào chần nhanh đúng 60 giây rồi vớt ra ngâm ngay vào thau nước đá lạnh 2 phút, vớt ra để ráo."
            },
            {
                buoc: 2,
                tieu_de: "Xào săn tôm tươi đỏ au",
                thoi_gian: "2 phút",
                noi_dung: "Phi thơm tỏi băm trên chảo với 1 thìa dầu ăn, trút tôm vào đảo đều trên lửa lớn trong 1.5 phút đến khi tôm chuyển màu đỏ cam săn chắc thì trút ra đĩa riêng."
            },
            {
                buoc: 3,
                tieu_de: "Xào bông cải xanh ngấm sốt dầu hào",
                thoi_gian: "2 phút",
                noi_dung: "Cho súp lơ và cà rốt vào chảo đảo đều trên lửa lớn cùng 1 muỗng dầu hào và 1 thìa hạt nêm trong 1.5 phút cho rau củ bóng bẩy ngấm vị."
            },
            {
                buoc: 4,
                tieu_de: "Hòa quyện & Dầu mè thơm ngậy",
                thoi_gian: "1 phút",
                noi_dung: "Trút đĩa tôm vào đảo chung 30 giây, nhỏ vài giọt dầu mè thơm ngậy lên mặt rồi tắt bếp trút ra đĩa thưởng thức nóng."
            }
        ],
        meo_nau_an: "Chần sơ súp lơ qua nước sôi rồi ngâm đá lạnh trước khi xào giúp giữ nguyên 100% vitamin và độ giòn ngọt mọng nước tự nhiên.",
        dinh_duong: { calo: 230, protein: "26g", chat_beo: "6g", carb: "16g" },
        tags: ["Healthy", "Giàu canxi & vitamin C", "Màu sắc hấp dẫn", "Tốt cho tim mạch"]
    },

    40: {
        mo_ta: "Ngọn rau lang non mướt xào mềm ngọt hòa cùng hương tỏi phi thơm lừng nức mũi, món rau dân dã giàu chất xơ và cực kỳ nhuận tràng tốt cho tiêu hóa.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 5,
        nguyen_lieu_chi_tiet: [
            { ten: "Rau lang non (khoai lang)", so_luong: 400, don_vi: "g", ghi_chu: "nhặt ngọn non búp lá, ngâm muối rửa sạch" },
            { ten: "Tỏi khô ta", so_luong: 2, don_vi: "củ to", ghi_chu: "đập dập thô" },
            { ten: "Dầu ăn", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "xào rau bóng mượt" },
            { ten: "Hạt nêm & Nước mắm", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "nêm vừa miệng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần nhanh khử nhựa chát & Giữ màu xanh",
                thoi_gian: "3 phút",
                noi_dung: "Đun sôi nồi nước lớn với 1 thìa muối hạt. Thả rau lang vào chần nhanh trong 40 giây rồi vớt ra ngâm ngay vào nước lạnh (chần nhanh giúp khử sạch chất nhựa chát và ngăn rau bị thâm đen)."
            },
            {
                buoc: 2,
                tieu_de: "Phi thơm ngập tỏi vàng giòn",
                thoi_gian: "1 phút",
                noi_dung: "Đun nóng chảo với 2 muỗng dầu ăn, phi thơm tỏi đập dập trên lửa vừa đến khi dậy mùi thơm nức mũi."
            },
            {
                buoc: 3,
                tieu_de: "Xào nhanh tay lửa lớn",
                thoi_gian: "2 phút",
                noi_dung: "Trút rau lang vào đảo thật nhanh tay trên ngọn lửa lớn nhất, nêm 1 thìa hạt nêm và 1 thìa nước mắm ngon cho rau ngấm đều gia vị bóng bẩy."
            },
            {
                buoc: 4,
                tieu_de: "Hoàn tất & Thưởng thức",
                thoi_gian: "30 giây",
                noi_dung: "Rau chín mềm mượt mà vẫn giữ màu xanh tươi mát, tắt bếp ngay và trút ra đĩa dùng nóng."
            }
        ],
        meo_nau_an: "Rau lang rất dễ bị thâm đen do nhựa; chần nhanh 40 giây qua nước sôi có muối hạt sẽ giữ cho đĩa rau lang xào luôn xanh mướt mượt mà.",
        dinh_duong: { calo: 115, protein: "4g", chat_beo: "6g", carb: "11g" },
        tags: ["Nhuận tràng", "Dân dã thanh mát", "Dễ làm", "Thơm lừng tỏi phi"]
    },

    41: {
        mo_ta: "Đĩa củ quả thập cẩm luộc đủ sắc màu rực rỡ xanh đỏ trắng giòn ngọt thanh tao, chấm kèm kho quẹt tộ đất hay muối vừng bùi béo tuyệt ngon.",
        do_kho: "Dễ",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Bắp cải tươi", so_luong: 200, don_vi: "g", ghi_chu: "cắt miếng vuông 4cm" },
            { ten: "Cà rốt & Su hào", so_luong: 1, don_vi: "củ mỗi loại", ghi_chu: "tỉa hoa cắt thanh que dày 1.2cm" },
            { ten: "Đậu cove non", so_luong: 100, don_vi: "g", ghi_chu: "tước xơ bẻ đôi" },
            { ten: "Bông cải xanh", so_luong: 150, don_vi: "g", ghi_chu: "tách nhánh vừa ăn" },
            { ten: "Muối hạt tinh khiết", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "cho vào nước luộc giữ màu" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế & Tỉa hoa củ quả đồng đều",
                thoi_gian: "8 phút",
                noi_dung: "Cà rốt, su hào gọt vỏ tỉa hoa cắt thanh que dày 1.2cm. Đậu cove tước xơ bẻ đôi. Súp lơ tách nhánh, bắp cải cắt miếng vuông 4 x 4cm. Rửa sạch tất cả để ráo."
            },
            {
                buoc: 2,
                tieu_de: "Luộc củ cứng trước chuẩn thời gian",
                thoi_gian: "4 phút",
                noi_dung: "Đun sôi 1.5 lít nước với 1 thìa muối hạt. Thả cà rốt và su hào vào luộc trước trong đúng 3 phút vì củ cứng lâu chín hơn."
            },
            {
                buoc: 3,
                tieu_de: "Luộc rau mềm tiếp theo",
                thoi_gian: "3 phút",
                noi_dung: "Tiếp tục cho đậu cove, súp lơ xanh và bắp cải vào luộc chung thêm 2.5 - 3 phút cho tất cả vừa chín tới vẫn giữ độ giòn ngọt mọng nước."
            },
            {
                buoc: 4,
                tieu_de: "Bày đĩa thập cẩm ngũ sắc",
                thoi_gian: "2 phút",
                noi_dung: "Dùng muôi thủng vớt rau củ ra xếp xen kẽ màu sắc đỏ, cam, xanh, trắng quanh đĩa tròn, dọn kèm chén kho quẹt tôm thịt hoặc nước chấm kho đậm đà."
            }
        ],
        meo_nau_an: "Luộc theo thứ tự: củ cứng (cà rốt, su hào) cho vào trước, rau mềm (súp lơ, bắp cải) cho vào sau để tất cả cùng chín tới giòn ngọt đều nhau.",
        dinh_duong: { calo: 90, protein: "4g", chat_beo: "1g", carb: "18g" },
        tags: ["Thanh lọc cơ thể", "Chấm kho quẹt cực phẩm", "Giàu vitamin", "Không dầu mỡ"]
    },

    42: {
        mo_ta: "Từng lát dưa leo giòn tan sần sật thấm đẫm vị chua chua ngọt ngọt cay nhẹ của tỏi ớt, món gỏi nộm giải ngấy số một cho các món chiên xào thịt kho.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Dưa leo (dưa chuột) tươi", so_luong: 3, don_vi: "quả (~400g)", ghi_chu: "chọn quả đặc ruột, rửa sạch ngâm muối" },
            { ten: "Tỏi khô ta & Ớt sừng", so_luong: 1.5, don_vi: "củ / trái", ghi_chu: "băm nhỏ" },
            { ten: "Giấm gạo lên men tự nhiên", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "tạo vị chua thanh" },
            { ten: "Đường cát trắng", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "cân bằng chua ngọt" },
            { ten: "Nước mắm & Rau mùi", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo hương thơm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Nạo ruột dưa & Thái lát xéo",
                thoi_gian: "5 phút",
                noi_dung: "Dưa leo ngâm nước muối 10 phút, gọt vỏ sọc dưa xen kẽ, chẻ đôi theo chiều dọc. Dùng thìa nhỏ nạo sạch phần ruột ướt ở giữa (ruột dưa là phần làm nộm bị chảy nước ỉu nhão). Dùng dao sắc thái lát xéo dày 0.5cm."
            },
            {
                buoc: 2,
                tieu_de: "Kỹ thuật xóc muối rút nước giòn đanh",
                thoi_gian: "5 phút",
                noi_dung: "Trộn dưa leo với 1/2 thìa cà phê muối hạt trong 5 phút để dưa tiết bớt nước hăng, xả nhanh lại với nước lạnh rồi dùng tay vắt nhẹ ráo nước (bước này giúp từng lát dưa giòn tan đanh sần sật)."
            },
            {
                buoc: 3,
                tieu_de: "Pha nước sốt chua ngọt tỏi ớt",
                thoi_gian: "3 phút",
                noi_dung: "Khuấy tan hoàn toàn hỗn hợp gồm: 2 muỗng đường, 2 muỗng giấm gạo, 1 muỗng nước mắm cùng tỏi băm và ớt băm nhuyễn."
            },
            {
                buoc: 4,
                tieu_de: "Trộn đều & Ướp lạnh",
                thoi_gian: "15 phút",
                noi_dung: "Đổ nước sốt vào dưa leo trộn đều tay, để trong ngăn mát tủ lạnh 15 phút cho ngấm sâu vị chua ngọt mát lạnh rồi rắc rau mùi thái nhỏ thưởng thức."
            }
        ],
        meo_nau_an: "Nạo bỏ ruột dưa và xóc muối vắt nhẹ trước khi trộn giúp dưa leo giữ trọn độ giòn rôm rốp cả tiếng mà không bao giờ bị chảy nước lõng bõng.",
        dinh_duong: { calo: 75, protein: "2g", chat_beo: "0.5g", carb: "15g" },
        tags: ["Món kèm giải ngấy", "Giòn tan sần sật", "Chua ngọt dịu mát", "Không dầu mỡ"]
    },

    43: {
        mo_ta: "Cải thảo muối giòn đượm màu ớt đỏ rực rỡ, vị cay nồng nàn thơm ngát hương tỏi gừng lê táo, chua dịu kích thích vị giác đưa cơm cực đỉnh.",
        do_kho: "Trung bình",
        khau_phan: "5 - 6 người",
        thoi_gian_chuan_bi: 40,
        thoi_gian_nau: 0,
        nguyen_lieu_chi_tiet: [
            { ten: "Cải thảo búp tươi chắc", so_luong: 1.5, don_vi: "kg", ghi_chu: "chẻ đôi hoặc làm tư, xát muối hạt" },
            { ten: "Bột ớt vảy Hàn Quốc", so_luong: 60, don_vi: "g", ghi_chu: "tạo màu đỏ đẹp và vị cay ấm" },
            { ten: "Củ cải trắng & Cà rốt", so_luong: 1, don_vi: "củ mỗi loại", ghi_chu: "bào sợi mỏng 3cm" },
            { ten: "Hẹ & Hành boa-rô", so_luong: 100, don_vi: "g", ghi_chu: "cắt khúc 4cm" },
            { ten: "Lê ngọt hoặc táo chín", so_luong: 0.5, don_vi: "quả", ghi_chu: "xay nhuyễn tạo ngọt lên men tự nhiên" },
            { ten: "Hồ nếp nấu chín để nguội", so_luong: 1, don_vi: "chén nhỏ", ghi_chu: "giúp sốt bám dính đều" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Xát muối làm mềm bẹ cải thảo",
                thoi_gian: "30 phút",
                noi_dung: "Cải thảo chẻ làm tư, xát kỹ muối hạt vào từng bẹ lá từ trong ra ngoài. Để nghỉ trong 2 tiếng cho bẹ cải thảo dẻo dai uốn cong không gãy. Xả sạch lại 3 lần nước lạnh cho hết vị mặn gắt rồi dùng tay vắt thật ráo nước."
            },
            {
                buoc: 2,
                tieu_de: "Nấu hồ nếp & Xay hỗn hợp sốt lê táo",
                thoi_gian: "10 phút",
                noi_dung: "Khuấy 2 thìa bột nếp với 1 chén nước trên lửa nhỏ thành hồ loãng sánh để nguội. Xay nhuyễn nửa quả lê cùng tỏi, gừng, hành tây và nước mắm. Trộn hồ nếp cùng hỗn hợp lê xay, 60g bột ớt Hàn Quốc và 1.5 muỗng đường thành âu sốt đỏ au sền sệt thơm nức."
            },
            {
                buoc: 3,
                tieu_de: "Trộn nhân củ cải hẹ",
                thoi_gian: "5 phút",
                noi_dung: "Cho củ cải bào sợi, cà rốt và hẹ cắt khúc vào âu sốt trộn đều tay để làm phần nhân kim chi thơm ngọt."
            },
            {
                buoc: 4,
                tieu_de: "Phết sốt vào từng bẹ lá & Lên men chuẩn vị",
                thoi_gian: "15 phút",
                noi_dung: "Đeo găng tay, phết đều hỗn hợp sốt nhân vào từng kẽ lá cải thảo từ trong ra ngoài. Cuộn tròn bắp cải xếp chặt vào hộp thủy tinh kín nắp. Để ở nhiệt độ phòng 1 - 2 ngày cho lên men chua dịu rồi bảo quản trong ngăn mát tủ lạnh dùng dần."
            }
        ],
        meo_nau_an: "Xay thêm nửa quả lê hoặc táo ngọt vào hỗn hợp sốt kim chi sẽ giúp kim chi lên men chua thanh tự nhiên cực kỳ thơm ngon mà không bị chua gắt chát.",
        dinh_duong: { calo: 85, protein: "3g", chat_beo: "1g", carb: "16g" },
        tags: ["Món muối chua ngon", "Men vi sinh Probiotic", "Cay nồng đưa cơm", "Giải ngấy tuyệt vời"]
    },

    44: {
        mo_ta: "Từng miếng đậu hũ trắng ngần được chiên phồng vàng ruộm giòn tan lớp vỏ ngoài, bên trong béo mềm mướt như kem chấm mắm tôm sủi bọt hoặc mắm tỏi ớt.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Đậu hũ trắng mơ tươi mềm", so_luong: 4, don_vi: "miếng", ghi_chu: "cắt khối vuông 3 x 3cm" },
            { ten: "Dầu ăn chiên ngập", so_luong: 300, don_vi: "ml", ghi_chu: "giúp đậu phồng giòn đều 4 mặt" },
            { ten: "Mắm tôm hoặc mắm tỏi ớt", so_luong: 1, don_vi: "chén", ghi_chu: "đánh sủi bọt chanh đường" },
            { ten: "Kinh giới & Tía tô tươi", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "rau thơm ăn kèm chuẩn vị" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Thấm khô tuyệt đối bề mặt miếng đậu",
                thoi_gian: "3 phút",
                noi_dung: "Cắt đậu hũ thành các khối vuông 3 x 3cm vừa ăn. Dùng khăn giấy chuyên dụng dặm thật khô ráo toàn bộ các mặt miếng đậu (lau khô nước là bí quyết giúp chiên không bắn dầu và lớp vỏ đậu nhanh phồng giòn rụm)."
            },
            {
                buoc: 2,
                tieu_de: "Canh nhiệt dầu nóng già chuẩn xác",
                thoi_gian: "2 phút",
                noi_dung: "Đổ dầu ngập 1/2 miếng đậu vào chảo sâu lòng, đun nóng già ở lửa vừa (thử đầu đũa gỗ thấy sủi bọt khí tăm tắp mạnh mẽ là dầu đạt nhiệt độ lý tưởng khoảng 170°C)."
            },
            {
                buoc: 3,
                tieu_de: "Chiên phồng vàng giòn rụm các mặt",
                thoi_gian: "6 phút",
                noi_dung: "Nhẹ nhàng thả từng miếng đậu vào chảo, để khoảng cách không cho các miếng đậu dính vào nhau. Chiên lửa vừa trong 3 phút cho mặt dưới phồng xốp se vàng cứng thì lật mặt chiên tiếp các cạnh còn lại cho miếng đậu vàng ruộm giòn tan."
            },
            {
                buoc: 4,
                tieu_de: "Thấm dầu & Thưởng thức nóng giòn",
                thoi_gian: "2 phút",
                noi_dung: "Vớt đậu ra đĩa có lót giấy thấm dầu. Dọn ăn ngay khi còn bốc khói nóng giòn cùng rau kinh giới, tía tô và chén mắm tôm vắt chanh ớt đánh sủi bọt trắng xóa."
            }
        ],
        meo_nau_an: "Bắt buộc phải lau thật khô nước trên miếng đậu trước khi thả vào chảo dầu nóng già; đậu sẽ phồng xốp giòn rụm bên ngoài mà bên trong vẫn mềm béo ngậy.",
        dinh_duong: { calo: 280, protein: "22g", chat_beo: "20g", carb: "4g" },
        tags: ["Giòn rụm bên ngoài", "Mềm béo bên trong", "Dân dã", "Ăn kèm bún đậu mắm tôm"]
    },

    45: {
        mo_ta: "Trứng chiên vàng xốp bông thơm lừng hương hành hoa thái nhỏ quyện cùng nước mắm nhĩ, món ăn tuổi thơ siêu tốc chưa đầy 5 phút là có ngay trên bàn ăn.",
        do_kho: "Dễ",
        khau_phan: "2 - 3 người",
        thoi_gian_chuan_bi: 3,
        thoi_gian_nau: 5,
        nguyen_lieu_chi_tiet: [
            { ten: "Trứng gà tươi", so_luong: 3, don_vi: "quả", ghi_chu: "chọn trứng gà ta thơm bùi" },
            { ten: "Hành hoa (hành lá) tươi", so_luong: 3, don_vi: "nhánh", ghi_chu: "rửa sạch thái nhỏ nhuyễn" },
            { ten: "Nước mắm truyền thống", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "tạo mùi thơm nồng nàn" },
            { ten: "Tiêu xay & Nước lọc", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "giúp trứng bông xốp" },
            { ten: "Dầu ăn", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tráng chảo nóng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Đánh bông trứng cùng hành hoa",
                thoi_gian: "2 phút",
                noi_dung: "Đập 3 quả trứng vào tô, thêm 1 muỗng nước mắm ngon, 1/2 thìa tiêu, 1 thìa cà phê nước lọc và toàn bộ hành hoa thái nhỏ. Dùng đũa đánh đều tay liên tục trong 1 phút cho trứng sủi bọt mịn li ti."
            },
            {
                buoc: 2,
                tieu_de: "Làm nóng chảo dầu",
                thoi_gian: "1 phút",
                noi_dung: "Đặt chảo chống dính lên bếp với 1.5 muỗng dầu ăn đun nóng già ở lửa vừa, láng dầu đều khắp mặt chảo."
            },
            {
                buoc: 3,
                tieu_de: "Đổ trứng & Rán vàng se mặt",
                thoi_gian: "2 phút",
                noi_dung: "Rót hỗn hợp trứng vào giữa chảo, nghiêng chảo cho trứng dàn mỏng đều. Hạ lửa nhỏ vừa rán trong 2 phút cho mặt đáy se vàng óng ả."
            },
            {
                buoc: 4,
                tieu_de: "Cuộn tròn hoặc lật mặt hoàn thiện",
                thoi_gian: "1 phút",
                noi_dung: "Khéo léo dùng xẻng lật mặt trứng hoặc cuộn tròn trứng lại trên chảo, đun thêm 30 giây cho chín đều rồi trút ra đĩa cắt khúc thưởng thức cùng cơm nóng."
            }
        ],
        meo_nau_an: "Cho 1 thìa cà phê nước lọc và đánh thật kỹ cho trứng sủi bọt trước khi rán, trứng chiên sẽ xốp mềm bông xốp và dày dặn hơn rất nhiều.",
        dinh_duong: { calo: 220, protein: "15g", chat_beo: "17g", carb: "2g" },
        tags: ["Nhanh nhất trần đời", "Dễ làm", "Bữa sáng tiện lợi", "Trẻ nhỏ mê tít"]
    }
};

module.exports = { PART_3 };
