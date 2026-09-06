// ============================================================
// Dữ liệu món ăn phần 2: Món Mặn, Hầm, Luộc, Canh Truyền Thống (IDs: 16 - 30)
// Quy chuẩn đầu bếp: Các bước chi tiết, kỹ thuật nhiệt, thời gian, doneness check
// ============================================================

const PART_2 = {
    16: {
        mo_ta: "Chả cá thác lác quết dẻo quánh tự nhiên, dậy mùi thơm đặc trưng của thì là tươi và tiêu sọ, chiên phồng vàng ươm dai giòn không hàn the.",
        do_kho: "Trung bình",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt cá thác lác nạo tươi", so_luong: 400, don_vi: "g", ghi_chu: "giữ thật lạnh để chả dai giòn" },
            { ten: "Mỡ heo phần thăn", so_luong: 50, don_vi: "g", ghi_chu: "luộc sơ, thái hạt lựu nhỏ giúp chả không bị khô" },
            { ten: "Thì là tươi & Hành hoa", so_luong: 50, don_vi: "g", ghi_chu: "rửa sạch, thái thật nhuyễn" },
            { ten: "Hành tím băm nhuyễn", so_luong: 2, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Nước mắm ngon & Tiêu sọ đập dập", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "tạo mùi thơm nồng nàn" },
            { ten: "Dầu ăn chiên ngập", so_luong: 250, don_vi: "ml", ghi_chu: "chiên chả phồng đều" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chuẩn bị độ lạnh & Sơ chế thì là",
                thoi_gian: "10 phút",
                noi_dung: "Thịt cá nạo để trong ngăn đá tủ lạnh khoảng 15 phút trước khi làm cho thịt cá se lạnh (nhiệt độ lạnh là bí quyết vàng để protein cá kết dính dẻo dai mà không cần hàn the). Mỡ heo luộc sơ thái hạt lựu thật nhỏ ướp chút đường cho trong veo. Thì là và hành hoa rửa sạch, vẩy ráo nước rồi dùng dao sắc thái thật nhuyễn."
            },
            {
                buoc: 2,
                tieu_de: "Kỹ thuật quết chả cá dẻo quánh",
                thoi_gian: "12 phút",
                noi_dung: "Cho cá nạo vào âu cùng 1.5 muỗng nước mắm nhĩ, 1 thìa cà phê hạt nêm, 1 thìa tiêu sọ giã dập thô, hành tím băm và 1 thìa dầu ăn. Dùng muôi gỗ hoặc thìa lớn miết và quết thật mạnh tay theo một chiều cố định liên tục trong 10 - 12 phút. Khi thấy khối cá dẻo quánh, dính chặt vào muôi và bóng mịn thì trút mỡ hạt lựu và thì là vào trộn đều nhẹ nhàng."
            },
            {
                buoc: 3,
                tieu_de: "Tạo hình miếng chả tròn dẹt",
                thoi_gian: "5 phút",
                noi_dung: "Thoa một lớp mỏng dầu ăn lên hai lòng bàn tay để chống dính. Múc từng viên cá nặng khoảng 50g, vo tròn trong lòng bàn tay rồi ấn dẹt thành miếng chả tròn dày khoảng 1.2 - 1.5cm (không nặn quá mỏng chả sẽ khô, không nặn quá dày chả lâu chín ở giữa)."
            },
            {
                buoc: 4,
                tieu_de: "Chiên phồng vàng ruộm & Hoàn thiện",
                thoi_gian: "10 phút",
                noi_dung: "Đun nóng chảo dầu ở mức nhiệt vừa (khoảng 160°C). Nhẹ nhàng thả từng miếng chả cá vào chiên. Khi miếng chả nổi lên mặt dầu và phồng căng tròn, lật mặt chiên tiếp trong 3 - 4 phút cho cả hai mặt chuyển sang màu vàng ruộm óng ả. Vớt ra để ráo dầu trên vỉ inox rồi dùng dao thái lát xéo ăn kèm tương ớt hoặc nước mắm chanh tỏi."
            }
        ],
        meo_nau_an: "Bắt buộc thịt cá phải giữ thật lạnh trước khi quết và chỉ quết theo một chiều cố định; các thớ protein sẽ đan xen tạo độ dai giòn tự nhiên 100% không cần hóa chất.",
        dinh_duong: { calo: 320, protein: "30g", chat_beo: "18g", carb: "4g" },
        tags: ["Món chiên ngon", "Thì là thơm lừng", "Dẻo dai tự nhiên", "Món nhắm / ăn cơm"]
    },

    17: {
        mo_ta: "Bò sốt vang phong cách ẩm thực Pháp - Việt tinh tế, từng thớ thịt nạm bò mềm rục ngấm hương quế hồi và rượu vang đỏ sóng sánh ăn kèm bánh mì hoặc cơm nóng.",
        do_kho: "Khó",
        khau_phan: "4 - 5 người",
        thoi_gian_chuan_bi: 25,
        thoi_gian_nau: 60,
        nguyen_lieu_chi_tiet: [
            { ten: "Dẻ sườn hoặc nạm bắp bò", so_luong: 600, don_vi: "g", ghi_chu: "có gân nạc đan xen, thái quân cờ 3.5cm" },
            { ten: "Khoai tây & Cà rốt", so_luong: 2, don_vi: "củ mỗi loại", ghi_chu: "gọt vỏ cắt khối dày 3cm" },
            { ten: "Rượu vang đỏ (Cabernet/Merlot)", so_luong: 150, don_vi: "ml", ghi_chu: "chia làm 2 lần nấu" },
            { ten: "Cà chua chín & Sốt cà chua Paste", so_luong: 2, don_vi: "quả / 2 muỗng", ghi_chu: "tạo màu đỏ vang đẹp" },
            { ten: "Quế, hoa hồi, thảo quả", so_luong: 1, don_vi: "set", ghi_chu: "rang thơm dậy mùi" },
            { ten: "Bơ lạt & Tỏi băm nhuyễn", so_luong: 30, don_vi: "g", ghi_chu: "xào thịt bò thơm ngậy" },
            { ten: "Bột bắp (hoặc bột năng)", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "hòa nước tạo độ sánh" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần thịt bò & Cắt khối quân cờ",
                thoi_gian: "10 phút",
                noi_dung: "Thịt dẻ sườn bò rửa sạch với rượu gừng, chần qua nước sôi 3 phút rồi vớt ra xả nước lạnh để thịt sạch bọt cặn và không bị ngái mùi. Cắt thịt thành từng khối vuông vức kích thước 3.5 x 3.5cm (khi hầm thịt co lại là vừa ăn)."
            },
            {
                buoc: 2,
                tieu_de: "Ướp thịt bò với rượu vang đỏ lần 1",
                thoi_gian: "30 phút",
                noi_dung: "Cho thịt bò vào âu cùng 100ml rượu vang đỏ, 1 muỗng tỏi băm, 1 thìa canh hạt nêm, 1 thìa đường, 1/2 thìa ngũ vị hương, 1 thìa tiêu đen và 1 muỗng nước mắm. Trộn đều và bọc màng thực phẩm ướp trong ít nhất 30 phút để cồn trong rượu vang phá vỡ cấu trúc cơ thịt giúp thịt mềm nhừ nhanh chóng."
            },
            {
                buoc: 3,
                tieu_de: "Xào săn thịt với bơ tỏi & Sốt cà chua",
                thoi_gian: "8 phút",
                noi_dung: "Đặt nồi dày lên bếp, đun chảy 30g bơ lạt, phi thơm tỏi băm đến khi dậy mùi thơm béo. Cho cà chua băm và 2 thìa sốt cà chua paste vào xào nhuyễn lấy màu đỏ ruby. Trút thịt bò đã ướp vào đảo đều tay trên lửa lớn trong 5 phút cho các cạnh thịt săn chắc lại và ngấm màu đỏ đẹp."
            },
            {
                buoc: 4,
                tieu_de: "Hầm nhừ cùng thảo mộc quế hồi",
                thoi_gian: "40 phút",
                noi_dung: "Đổ nước sôi nóng ngập mặt thịt khoảng 2 đốt ngón tay. Cho thanh quế, 2 cánh hoa hồi và 1 quả thảo quả đã nướng thơm vào nồi. Đậy vung đun sôi bùng, hớt sạch bọt rồi hạ lửa nhỏ nhất hầm liu riu trong 40 phút cho thịt bò mềm rục, thớ gân trong veo dẻo quánh."
            },
            {
                buoc: 5,
                tieu_de: "Nấu rau củ, Thêm vang đỏ lần 2 & Tạo độ sánh",
                thoi_gian: "15 phút",
                noi_dung: "Thả khoai tây và cà rốt vào hầm thêm 12 phút cho củ quả vừa chín mềm bở tơi. Rót 50ml rượu vang đỏ còn lại vào nồi (giữ hương thơm nguyên bản của vang), nêm nếm lại gia vị vừa miệng. Từ từ rót bát bột bắp hòa nước vào khuấy đều nhẹ tay theo một chiều trong 2 phút đến khi nước sốt sánh mịn bóng bẩy ôm lấy miếng thịt thì tắt bếp. Rắc ngò gai thái nhỏ thưởng thức cùng bánh mì nóng giòn."
            }
        ],
        meo_nau_an: "Bí quyết vàng của món bò sốt vang chuẩn Âu: Chia rượu vang làm 2 lần - 2/3 dùng để ướp thịt từ đầu giúp thịt mềm rục, 1/3 còn lại cho vào trước khi tắt bếp 3 phút để giữ trọn vẹn hương nồng nàn quyến rũ.",
        dinh_duong: { calo: 480, protein: "36g", chat_beo: "24g", carb: "22g" },
        tags: ["Món hầm sang trọng", "Ăn kèm bánh mì", "Hương vị Á-Âu", "Món ngon cuối tuần"]
    },

    18: {
        mo_ta: "Gà ta luộc da vàng óng căng bóng giòn sần sật, thịt chắc ngọt mọng nước thơm thoang thoảng mùi gừng hành và lá chanh thái chỉ tươi non.",
        do_kho: "Dễ",
        khau_phan: "4 - 5 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 30,
        nguyen_lieu_chi_tiet: [
            { ten: "Gà ta thả vườn nguyên con", so_luong: 1.4, don_vi: "kg", ghi_chu: "chọn gà mái tơ ức đầy, da vàng tự nhiên" },
            { ten: "Lá chanh tươi bánh tẻ", so_luong: 12, don_vi: "lá", ghi_chu: "thái chỉ thật mỏng rắc mặt" },
            { ten: "Gừng củ & Hành tím khô", so_luong: 3, don_vi: "củ mỗi loại", ghi_chu: "nướng sơ đập dập" },
            { ten: "Mỡ gà rán vàng trộn bột nghệ", so_luong: 1, don_vi: "thìa", ghi_chu: "quét da gà vàng ươm bóng bẩy" },
            { ten: "Muối hạt & Chanh ớt", so_luong: 1, don_vi: "set", ghi_chu: "làm muối tiêu chanh chuẩn vị" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế gà sạch thơm & Định hình cánh tiên",
                thoi_gian: "10 phút",
                noi_dung: "Gà xát kỹ với muối hạt và gừng giã trong 3 phút khử sạch mùi hôi, rửa sạch dưới vòi nước lạnh, mổ moi sạch phổi và máu tụ trong xương sống. Bẻ gập 2 cánh gà về phía sau lườn hoặc dùng lạt buộc cánh tiên để khi luộc gà có tư thế ngẩng cao đầu trang trọng."
            },
            {
                buoc: 2,
                tieu_de: "Luộc gà nước lạnh & Canh nhiệt độ sôi",
                thoi_gian: "15 phút",
                noi_dung: "Đặt gà vào nồi to úp phần bụng xuống dưới đáy nồi (lưng hướng lên trên). Đổ nước lạnh ngập hoàn toàn thân gà. Thả hành khô nướng, gừng đập dập và 1 thìa canh hạt nêm vào nồi. Bật lửa lớn đun đến khi nước sôi bùng lên thì hạ ngay lửa xuống mức nhỏ nhất, vớt sạch bọt và đậy hé vung đun liu riu đúng 15 phút."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật ngâm ủ chín thấu từ trong tủy",
                thoi_gian: "15 phút",
                noi_dung: "Sau 15 phút sôi liu riu, tắt bếp hoàn toàn nhưng KHÔNG vớt gà ra ngay. Đậy kín nắp vung nồi và để gà ngâm ủ trong nước nóng thêm đúng 15 phút. Hơi nóng thẩm thấu từ từ sẽ làm phần thịt đùi và khớp xương chín mềm ngọt mọng mà da gà tuyệt đối không bị rách nứt hay thâm đỏ tủy."
            },
            {
                buoc: 4,
                tieu_de: "Sốc nhiệt nước đá & Quét mỡ nghệ bóng bẩy",
                thoi_gian: "10 phút",
                noi_dung: "Vớt gà ra thả ngay vào thau nước đá lạnh ngập thân gà trong 5 phút. Nước đá lạnh sẽ làm lớp da gà co săn lại tức thì, tạo độ giòn sần sật đặc trưng. Vớt gà ra để ráo, dùng cọ quét đều hỗn hợp mỡ gà pha chút tinh bột nghệ lên khắp bề mặt da để tạo màu vàng óng ả căng bóng. Dùng dao sắc chặt miếng vuông vắn đều tăm tắp, xếp ra đĩa và rắc lá chanh thái chỉ mỏng như sợi tơ lên trên."
            }
        ],
        meo_nau_an: "Công thức vàng: 'Luộc 15 phút lửa nhỏ - Tắt bếp ngâm ủ 15 phút - Sốc nhiệt nước đá 5 phút' đảm bảo 100% da gà căng bóng giòn rụm nguyên vẹn, thịt chín mọng nước không bao giờ bị đỏ xương.",
        dinh_duong: { calo: 340, protein: "38g", chat_beo: "18g", carb: "0g" },
        tags: ["Món cỗ truyền thống", "Thanh đạm", "Giòn ngọt", "Giàu protein"]
    },

    19: {
        mo_ta: "Thăn bò áp chảo mềm ngọt mọng nước tan ngay trên đầu lưỡi, thơm ngậy bơ tỏi và hương thảo mộc tinh tế phong cách bít tết hảo hạng.",
        do_kho: "Trung bình",
        khau_phan: "2 - 3 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 8,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt thăn bò tươi (Tenderloin / Ribeye)", so_luong: 400, don_vi: "g", ghi_chu: "cắt tảng dày 2.5 - 3cm, vân mỡ đều" },
            { ten: "Bơ lạt động vật Anchor", so_luong: 30, don_vi: "g", ghi_chu: "tạo mùi thơm béo ngậy" },
            { ten: "Tỏi khô ta nguyên tép", so_luong: 1, don_vi: "củ", ghi_chu: "đập dập nhẹ cả vỏ" },
            { ten: "Nhánh hương thảo tươi (Rosemary)", so_luong: 2, don_vi: "nhánh", ghi_chu: "tinh dầu thơm quyến rũ" },
            { ten: "Muối biển hạt thô & Tiêu đen xay", so_luong: 1, don_vi: "thìa", ghi_chu: "nêm ngay trước khi áp chảo" },
            { ten: "Dầu ô liu nguyên chất", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "chịu nhiệt áp chảo" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Đưa thịt về nhiệt độ phòng & Thấm khô tuyệt đối",
                thoi_gian: "10 phút",
                noi_dung: "Lấy miếng thăn bò ra khỏi tủ lạnh trước 15 - 20 phút để thịt đạt nhiệt độ phòng (nếu áp chảo khi thịt còn lạnh, tâm thịt sẽ bị nguội sống mà vỏ ngoài đã cháy). Dùng khăn giấy chuyên dụng dặm thật khô bề mặt miếng thịt. Rắc muối biển hạt thô và tiêu đen xay thô đều lên cả hai mặt thịt ngay trước khi cho vào chảo (không rắc muối quá sớm sẽ làm thịt chảy nước)."
            },
            {
                buoc: 2,
                tieu_de: "Áp chảo tạo lớp vỏ caramel nâu giòn (Sear)",
                thoi_gian: "4 phút",
                noi_dung: "Đặt chảo gang dày lên bếp đun thật nóng với 1 muỗng dầu ô liu đến khi bốc khói nhẹ. Cẩn thận đặt miếng bò vào chảo. Giữ nguyên không xê dịch miếng thịt trong 2 phút ở lửa lớn để phản ứng Maillard tạo lớp vỏ ngoài nâu vàng caramel giòn thơm. Lật mặt miếng thịt và áp chảo tiếp tục trong 2 phút."
            },
            {
                buoc: 3,
                tieu_de: "Kỹ thuật rưới bơ tỏi thơm ngậy (Basting)",
                thoi_gian: "2 phút",
                noi_dung: "Hạ lửa xuống mức vừa, thả 30g bơ lạt, các tép tỏi đập dập và nhánh rosemary vào chảo. Bơ sẽ nhanh chóng tan chảy sủi bọt thơm lừng. Nghiêng chảo một góc 30 độ, dùng thìa lớn liên tục múc bơ tan chảy nóng rưới đều khắp bề mặt miếng thịt trong 60 - 90 giây để thịt chín đều và thẩm thấu trọn vẹn hương thơm ngậy của bơ tỏi thảo mộc."
            },
            {
                buoc: 4,
                tieu_de: "Kỹ thuật nghỉ thịt (Resting) khóa trọn nước ngọt",
                thoi_gian: "6 phút",
                noi_dung: "Gắp miếng thịt bò ra thớt gỗ hoặc đĩa ấm, để thịt nghỉ yên tĩnh trong đúng 5 - 7 phút (tuyệt đối không cắt ngay). Trong thời gian nghỉ, các sợi cơ thịt thư giãn và nước ngọt cốt tủy sẽ phân bổ ngược lại đều khắp miếng thịt. Dùng dao sắc thái lát dày 0.8cm xéo thớ, rắc chút muối tiêu thưởng thức cùng khoai tây nghiền và măng tây."
            }
        ],
        meo_nau_an: "Quy tắc bất di bất dịch của bít tết hảo hạng: Bắt buộc phải để thịt nghỉ 5 phút sau khi áp chảo trước khi cắt; nếu cắt ngay lập tức toàn bộ nước ngọt màu hồng quý giá bên trong sẽ tuôn sạch ra ngoài thớt khiến miếng thịt khô bã nguội lạnh.",
        dinh_duong: { calo: 420, protein: "36g", chat_beo: "28g", carb: "1g" },
        tags: ["Bít tết thơm ngon", "Mọng nước", "Phong cách Tây", "Bổ máu giàu kẽm"]
    },

    20: {
        mo_ta: "Cá chiên vàng giòn rụm lớp vảy bên ngoài, thịt cá trắng ngọt ngào ngấm đượm sốt cà chua đỏ tươi sánh sệt và thì là ngát hương thơm.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 20,
        nguyen_lieu_chi_tiet: [
            { ten: "Cá điêu hồng tươi (hoặc cá chép)", so_luong: 700, don_vi: "g", ghi_chu: "đánh vảy mổ sạch, khía chéo thân" },
            { ten: "Cà chua chín đỏ mọng", so_luong: 3, don_vi: "quả", ghi_chu: "thái hạt lựu nhỏ" },
            { ten: "Hành tím & Tỏi băm", so_luong: 2, don_vi: "củ", ghi_chu: "phi thơm" },
            { ten: "Thì là & Hành hoa tươi", so_luong: 50, don_vi: "g", ghi_chu: "cắt khúc 3cm" },
            { ten: "Nước mắm ngon & Đường", so_luong: 2, don_vi: "muỗng canh", ghi_chu: "nêm nước sốt" },
            { ten: "Dầu ăn chiên cá", so_luong: 150, don_vi: "ml", ghi_chu: "chiên giòn đều mặt" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử tanh cá & Khía chéo thân",
                thoi_gian: "10 phút",
                noi_dung: "Cá mổ sạch ruột, cạo sạch màng đen trong bụng, xát muối hạt và chanh rửa sạch nhớt. Dùng khăn sạch lau khô hoàn toàn cả trong lẫn ngoài thân cá (lau khô giúp khi rán không bị bắn dầu và da cá giòn rụm). Khía 3 đường chéo trên mỗi mặt thân cá sâu chạm tới xương để cá nhanh chín và dễ thấm sốt."
            },
            {
                buoc: 2,
                tieu_de: "Chiên cá vàng giòn hai mặt",
                thoi_gian: "10 phút",
                noi_dung: "Đun chảo dầu nóng già ở lửa vừa (thử đầu đũa sủi bọt tăm lăn tăn). Rắc một nhúm bột bắp nhỏ vào chảo để chống bắn dầu. Nhẹ nhàng thả cá vào chiên trong 5 - 6 phút cho mặt dưới se cứng vàng ruộm thì mới lật mặt chiên tiếp 4 - 5 phút cho mặt còn lại chín giòn đều. Vớt cá ra đĩa để ráo dầu."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt cà chua thì là sánh mịn",
                thoi_gian: "5 phút",
                noi_dung: "Chắt bớt dầu trong chảo, cho hành tỏi băm vào phi thơm vàng. Trút cà chua thái hạt lựu vào xào đều tay trên lửa vừa, nêm 2 muỗng nước mắm, 1 muỗng đường, 1/2 muỗng hạt nêm và nửa bát nước lọc nóng. Dùng muôi dằm nhuyễn cà chua cho tan mịn thành hỗn hợp sốt đỏ sánh đặc sủi bọt."
            },
            {
                buoc: 4,
                tieu_de: "Om cá ngấm sốt & Bày đĩa",
                thoi_gian: "5 phút",
                noi_dung: "Đặt cá đã chiên vào chảo sốt cà chua, dùng muôi múc nước sốt rưới đều lên mình cá liên tục trong 3 - 4 phút ở lửa nhỏ cho thớ cá ngấm vị chua ngọt đậm đà. Rải đều hành hoa và thì là cắt khúc lên trên cá, đun thêm 30 giây cho rau thơm chín tái dậy mùi ngào ngạt rồi tắt bếp, trút ra đĩa sâu lòng."
            }
        ],
        meo_nau_an: "Tuyệt đối không lật cá khi mặt dưới chưa chín vàng cứng; lật cá quá sớm sẽ làm da cá bị rách nát dính chặt vào chảo.",
        dinh_duong: { calo: 350, protein: "34g", chat_beo: "16g", carb: "8g" },
        tags: ["Món cá đưa cơm", "Chua thanh dịu", "Món ăn gia đình", "Giàu Omega-3"]
    },

    21: {
        mo_ta: "Đặc sản miền Tây Nam Bộ danh tiếng với thịt vịt béo mềm thơm lừng ngấm vị béo bùi của chao đỏ trắng, khoai môn dẻo bùi sánh ngậy nước dùng dừa tươi ngọt thanh.",
        do_kho: "Khó",
        khau_phan: "4 - 5 người",
        thoi_gian_chuan_bi: 30,
        thoi_gian_nau: 45,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt vịt xiêm tươi béo", so_luong: 1, don_vi: "kg", ghi_chu: "chặt miếng dày 3.5cm" },
            { ten: "Chao trắng & Chao đỏ", so_luong: 1, don_vi: "hũ nhỏ (~6 viên)", ghi_chu: "tán nhuyễn lấy cả nước chao" },
            { ten: "Khoai môn cao (khoai sáp)", so_luong: 400, don_vi: "g", ghi_chu: "gọt vỏ cắt khối chiên sơ" },
            { ten: "Nước dừa xiêm tươi", so_luong: 600, don_vi: "ml", ghi_chu: "nước ngọt thanh tự nhiên" },
            { ten: "Sả cây, gừng già, tỏi, ớt", so_luong: 4, don_vi: "cây/củ", ghi_chu: "đập dập băm nhuyễn" },
            { ten: "Bún tươi & Rau muống non", so_luong: 1, don_vi: "set", ghi_chu: "nhúng lẩu ăn kèm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử hôi lông vịt triệt để bằng rượu gừng",
                thoi_gian: "15 phút",
                noi_dung: "Cắt bỏ phao câu vịt (nguyên nhân gây hôi hàng đầu). Giã nát 1 củ gừng trộn cùng nửa bát rượu trắng, chà xát thật mạnh tay lên khắp mình vịt trong 5 phút từ trong ra ngoài. Rửa lại thật sạch với nước lạnh rồi để ráo. Dùng dao chặt thịt vịt thành các miếng vuông vừa ăn khoảng 3.5 x 3.5cm."
            },
            {
                buoc: 2,
                tieu_de: "Ướp vịt đậm đà với cốt chao béo ngậy",
                thoi_gian: "40 phút",
                noi_dung: "Dùng thìa tán nhuyễn 4 viên chao trắng, 2 viên chao đỏ cùng 3 thìa canh nước chao. Trộn cùng 1.5 muỗng đường, 1 muỗng hạt nêm, sả băm, tỏi ớt băm và 1 thìa dầu hào. Ướp đều vào thịt vịt, dùng tay bóp nhẹ cho ngấm sâu và để thịt nghỉ trong ít nhất 40 phút."
            },
            {
                buoc: 3,
                tieu_de: "Chiên sơ khoai môn giữ độ bở nguyên khối",
                thoi_gian: "8 phút",
                noi_dung: "Khoai môn gọt vỏ (đeo găng tay tránh ngứa), cắt thành các khối vuông dày 3cm. Đun nóng chảo dầu ở lửa vừa, thả khoai môn vào chiên sơ trong 3 - 4 phút đến khi mặt ngoài se cứng hanh vàng thì vớt ra để ráo (chiên khoai giúp khoai khi hầm không bị tan rã làm đục nước lẩu mà vẫn bùi dẻo nguyên miếng)."
            },
            {
                buoc: 4,
                tieu_de: "Xào săn vịt & Hầm nước dừa tươi",
                thoi_gian: "30 phút",
                noi_dung: "Bắc nồi lên bếp, phi thơm sả đập dập với chút dầu ăn. Trút toàn bộ thịt vịt đã ướp vào xào đảo lửa lớn trong 8 - 10 phút cho mỡ vịt tứa ra và thịt săn chắc lại ngấm đều vị chao thơm lừng. Đổ 600ml nước dừa xiêm tươi vào ngập mặt thịt. Đun sôi bùng lên, hớt sạch bọt rồi hạ lửa nhỏ hầm trong 25 phút cho thịt vịt mềm nhừ."
            },
            {
                buoc: 5,
                tieu_de: "Thêm khoai môn & Thưởng thức dạng lẩu",
                thoi_gian: "15 phút",
                noi_dung: "Thả khoai môn đã chiên vào nồi nấu chung thêm 12 - 15 phút cho khoai chín bở bùi sánh ngậy nước dùng. Nếm lại gia vị cho vừa miệng. Đặt nồi lên bếp lẩu mini tại bàn ăn, nhúng rau muống non, cải bẹ xanh và ăn kèm bún tươi cùng chén nước chấm chao pha đường tỏi ớt."
            }
        ],
        meo_nau_an: "Chiên sơ khoai môn trước khi hầm là bí quyết giúp nước dùng vịt nấu chao luôn trong và sánh mịn tự nhiên, khoai bở bùi không bao giờ bị nát vụn làm đục nồi lẩu.",
        dinh_duong: { calo: 560, protein: "38g", chat_beo: "36g", carb: "24g" },
        tags: ["Đặc sản miền Tây", "Món lẩu tụ họp", "Béo bùi ngậy vị", "Cuối tuần sum họp"]
    },

    22: {
        mo_ta: "Từng miếng giò lụa dai giòn được rim săn đượm nước mắm nhĩ và tiêu xanh tươi cay nồng nàn, món mặn siêu tốc đưa cơm giải ngấy sau lễ Tết.",
        do_kho: "Dễ",
        khau_phan: "3 người",
        thoi_gian_chuan_bi: 5,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Giò lụa (chả lụa) tươi ngon", so_luong: 300, don_vi: "g", ghi_chu: "cắt thanh con chì dài 4cm dày 1.5cm" },
            { ten: "Tiêu xanh tươi (hoặc tiêu sọ)", so_luong: 2, don_vi: "nhánh", ghi_chu: "đập dập nhẹ lấy tinh dầu" },
            { ten: "Hành tím khô", so_luong: 2, don_vi: "củ", ghi_chu: "thái lát mỏng" },
            { ten: "Nước mắm ngon cốt truyền thống", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "độ đạm cao" },
            { ten: "Đường vàng & Nước màu", so_luong: 1, don_vi: "muỗng canh mỗi loại", ghi_chu: "tạo vị kẹo ngọt óng ả" },
            { ten: "Hành hoa & Ớt sừng", so_luong: 1, don_vi: "nhánh", ghi_chu: "trang trí" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Thái giò lụa thanh con chì",
                thoi_gian: "3 phút",
                noi_dung: "Giò lụa bóc sạch lá chuối, dùng dao sắc thái thành các thanh con chì dài khoảng 4cm và dày 1.5cm (thái thanh con chì giúp giò thấm sốt đều và khi rim không bị teo khô)."
            },
            {
                buoc: 2,
                tieu_de: "Áp chảo se vàng miếng giò",
                thoi_gian: "3 phút",
                noi_dung: "Đặt chảo lên bếp với 1 thìa dầu ăn, cho các thanh giò lụa vào đảo nhẹ trên lửa vừa trong 2 - 3 phút cho các mặt giò hơi se vàng nhạt và dậy mùi thơm đặc trưng của giò rán."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt tiêu xanh đậm đà",
                thoi_gian: "2 phút",
                noi_dung: "Gạt giò sang bên mép chảo, cho hành tím và các nhánh tiêu xanh đập dập vào phi thơm trong 20 giây cho tỏa hương thơm nồng. Hòa tan hỗn hợp gồm 1.5 muỗng nước mắm, 1 muỗng đường, 1 muỗng nước màu và 3 muỗng nước sôi nóng rồi rưới vào chảo."
            },
            {
                buoc: 4,
                tieu_de: "Rim kẹo sền sệt & Thưởng thức",
                thoi_gian: "2 phút",
                noi_dung: "Hạ lửa vừa, đảo đều tay liên tục trong 2 - 3 phút để nước sốt mắm tiêu keo sánh lại, ôm một lớp caramel cay mặn óng ánh quanh từng miếng giò lụa. Rắc hành hoa cắt khúc và chút tiêu xay rồi tắt bếp, múc ra đĩa ăn nóng cùng cơm trắng."
            }
        ],
        meo_nau_an: "Giò lụa vốn đã có độ mặn sẵn, nên khi nêm nước mắm cần cân đối lượng đường vừa phải để nước kho có vị mặn ngọt hài hòa keo bóng mà không bị mặn gắt.",
        dinh_duong: { calo: 310, protein: "22g", chat_beo: "21g", carb: "6g" },
        tags: ["Nhanh gọn lẹ", "Vét sạch nồi cơm", "Món mặn dân dã", "Tiêu xanh nồng ấm"]
    },

    23: {
        mo_ta: "Những viên thịt băm tròn trịa mềm mọng ngọt béo đậm đà kết hợp với nước sốt cà chua chua ngọt sánh mịn, món ăn khoái khẩu của cả người lớn lẫn trẻ nhỏ.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Thịt nạc vai heo xay nhuyễn", so_luong: 350, don_vi: "g", ghi_chu: "có mỡ nhẹ để viên thịt mềm không khô" },
            { ten: "Cà chua chín đỏ mọng", so_luong: 3, don_vi: "quả", ghi_chu: "bỏ hạt thái hạt lựu nhỏ" },
            { ten: "Lòng trắng trứng gà", so_luong: 1, don_vi: "cái", ghi_chu: "giúp viên thịt kết dính xốp mềm" },
            { ten: "Hành tím & Hành hoa", so_luong: 3, don_vi: "nhánh", ghi_chu: "băm nhỏ" },
            { ten: "Nước mắm & Đường", so_luong: 1.5, don_vi: "muỗng canh", ghi_chu: "nêm vừa miệng" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Quết thịt & Vo viên tròn mềm mọng",
                thoi_gian: "10 phút",
                noi_dung: "Cho thịt xay vào tô cùng 1 lòng trắng trứng gà, 1 thìa hành tím băm, 1 thìa cà phê nước mắm, 1 thìa cà phê hạt nêm, 1/2 thìa tiêu và 1 thìa dầu ăn. Dùng thìa quết đều tay theo một chiều trong 3 phút để thịt dẻo dính. Thoa chút dầu ăn vào lòng bàn tay, ngắt từng phần thịt vo tròn thành các viên cỡ quả bóng bàn (khoảng 3cm)."
            },
            {
                buoc: 2,
                tieu_de: "Rán sơ định hình viên thịt tròn xoe",
                thoi_gian: "5 phút",
                noi_dung: "Đặt chảo lên bếp với 2 thìa dầu ăn ở lửa vừa. Nhẹ nhàng thả các viên thịt vào lăn đều trong 3 - 4 phút cho bề mặt thịt săn chắc định hình, hơi ngả vàng nhạt lớp vỏ ngoài (không rán kỹ làm khô thịt) rồi gắp ra đĩa riêng."
            },
            {
                buoc: 3,
                tieu_de: "Nấu sốt cà chua nhuyễn sánh",
                thoi_gian: "4 phút",
                noi_dung: "Tận dụng chảo dầu, phi thơm hành tím băm rồi cho cà chua thái hạt lựu vào đảo nhuyễn. Nêm 1.5 muỗng nước mắm, 1 muỗng đường, 1/2 muỗng hạt nêm và nửa chén nước nóng. Đun lửa vừa dằm nhuyễn đến khi cà chua tan mịn thành sốt sánh đặc đỏ au."
            },
            {
                buoc: 4,
                tieu_de: "Om thịt viên đẫm sốt",
                thoi_gian: "6 phút",
                noi_dung: "Thả các viên thịt vào chảo sốt cà chua, dùng thìa múc sốt rưới đều lên từng viên thịt. Đậy vung om nhỏ lửa liu riu trong 6 - 8 phút cho thịt chín thấu bên trong và ngấm vị chua ngọt của sốt. Mở vung, rắc hành hoa thái nhỏ tiêu xay rồi tắt bếp."
            }
        ],
        meo_nau_an: "Thêm 1 lòng trắng trứng và 1 thìa dầu ăn khi quết thịt băm sẽ giúp viên thịt sau khi rim sốt giữ trọn độ ẩm mọng, xốp mềm tan trong miệng mà không bị khô xơ.",
        dinh_duong: { calo: 360, protein: "27g", chat_beo: "24g", carb: "11g" },
        tags: ["Trẻ nhỏ yêu thích", "Dễ ăn", "Món cơm gia đình", "Chua ngọt thơm mềm"]
    },

    24: {
        mo_ta: "Bát canh chua cá lóc chuẩn vị Nam Bộ thanh mát giải nhiệt, vị chua thanh từ me hòa quyện vị ngọt béo của cá lóc tươi và vị giòn thanh của dọc mùng, đậu bắp, giá đỗ ngào ngạt ngò om tỏi phi.",
        do_kho: "Trung bình",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 20,
        nguyen_lieu_chi_tiet: [
            { ten: "Cá lóc đồng tươi", so_luong: 600, don_vi: "g", ghi_chu: "cắt khúc dày 3cm, khử sạch tanh" },
            { ten: "Dứa (thơm) & Cà chua", so_luong: 0.5, don_vi: "quả / 2 quả", ghi_chu: "thái lát rẻ quạt và múi cau" },
            { ten: "Dọc mùng (bạc hà) & Đậu bắp", so_luong: 150, don_vi: "g", ghi_chu: "tước vỏ, thái vát xéo" },
            { ten: "Giá đỗ sạch & Me chua chín", so_luong: 100, don_vi: "g / 40g me", ghi_chu: "dầm me lấy nước cốt chua thanh" },
            { ten: "Ngò om (rau ngổ) & Ngò gai", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "linh hồn món canh chua" },
            { ten: "Tỏi phi vàng giòn & Ớt tươi", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "rắc lên mặt tô canh" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế cá lóc & Tước dọc mùng không ngứa",
                thoi_gian: "10 phút",
                noi_dung: "Cá lóc mổ sạch màng đen bụng, xát muối chanh khử nhớt, cắt khúc 3cm để ráo. Dọc mùng tước sạch lớp vỏ xơ bên ngoài, thái vát xéo dày 1cm rồi bóp kỹ với 1 thìa muối hạt trong 3 phút, rửa xả lại 3 lần nước lạnh rồi dùng tay vắt thật kiệt nước (bóp muối và vắt ráo giúp dọc mùng giòn tan và tuyệt đối không ngứa cổ họng). Đậu bắp cắt xéo, dứa thái lát, cà chua bổ múi cau."
            },
            {
                buoc: 2,
                tieu_de: "Nấu nước dùng chua ngọt chuẩn vị Nam Bộ",
                thoi_gian: "5 phút",
                noi_dung: "Cho vắt me vào chén múc nước sôi dầm nát lọc lấy nước cốt chua. Đun sôi 1.2 lít nước trên bếp. Nêm vào nồi nước dùng: nước cốt me, 2 muỗng canh nước mắm ngon, 2 muỗng canh đường cát và 1 thìa hạt nêm (canh chua Nam Bộ đặc trưng bởi vị chua thanh dịu đi liền với vị ngọt hậu đậm đà)."
            },
            {
                buoc: 3,
                tieu_de: "Nấu chín tới cá lóc ngọt thịt",
                thoi_gian: "7 phút",
                noi_dung: "Khi nước canh sôi bùng sùng sục, thả từng khúc cá lóc vào nồi. Nấu ở lửa vừa trong 6 - 8 phút cho thịt cá vừa chín tới trắng ngần. Dùng muôi thủng nhẹ nhàng vớt các khúc cá ra đĩa riêng (vớt cá ra riêng giúp cá không bị nát nhừ khi cho rau củ vào đun)."
            },
            {
                buoc: 4,
                tieu_de: "Nấu rau củ giòn & Bày tô hoàn thiện",
                thoi_gian: "3 phút",
                noi_dung: "Cho dứa, cà chua, đậu bắp và dọc mùng vào nồi nước canh đang sôi, đun trong 2 phút cho rau củ vừa chín giòn. Thêm giá đỗ vào đun sôi bùng lại 30 giây rồi tắt bếp. Múc rau củ và nước canh ra tô lớn, đặt các khúc cá lóc lên trên mặt, rắc ngò om, ngò gai thái nhỏ, vài lát ớt chỉ thiên và muỗng tỏi phi vàng thơm lừng lên trên."
            }
        ],
        meo_nau_an: "Rau ngổ (ngò om) và tỏi phi vàng ruộm là hai nguyên liệu bắt buộc tạo nên hương vị canh chua cá lóc đặc trưng chuẩn vị miền Tây; thiếu hai thứ này canh sẽ mất đi 50% độ thơm ngon.",
        dinh_duong: { calo: 280, protein: "32g", chat_beo: "8g", carb: "18g" },
        tags: ["Canh thanh nhiệt", "Đặc sản Nam Bộ", "Chua ngọt hài hòa", "Giàu dinh dưỡng"]
    },

    25: {
        mo_ta: "Bát canh ngọt mát lành thanh khiết với vị bùi bùi đặc trưng của rau ngót non tươi hòa quyện cùng vị ngọt thanh của thịt nạc băm, giải nhiệt tuyệt vời cho ngày hè.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 10,
        nguyen_lieu_chi_tiet: [
            { ten: "Rau ngót non tươi", so_luong: 1, don_vi: "bó (~300g)", ghi_chu: "tuốt lá non, vò nhẹ cho mềm" },
            { ten: "Thịt heo nạc xay", so_luong: 150, don_vi: "g", ghi_chu: "thịt tươi dẻo ướp chút gia vị" },
            { ten: "Hành tím khô", so_luong: 1, don_vi: "củ", ghi_chu: "băm nhỏ phi thơm" },
            { ten: "Nước mắm & Hạt nêm", so_luong: 1, don_vi: "muỗng canh", ghi_chu: "nêm vừa thanh mát" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Tuốt lá & Kỹ thuật vò rau ngót mềm mọng",
                thoi_gian: "5 phút",
                noi_dung: "Tuốt lấy các lá ngót non và búp ngọn, bỏ cuống cứng. Rửa sạch rau với 2 lần nước muối loãng rồi vớt ra để ráo. Dùng hai lòng bàn tay vò nhẹ các nắm lá rau ngót cho hơi dập thớ gân (vò dập nhẹ giúp rau khi nấu nhanh chín mềm mướt, tiết trọn vị ngọt bùi và không bị rơm rác khi nuốt)."
            },
            {
                buoc: 2,
                tieu_de: "Xào săn thịt băm đậm đà",
                thoi_gian: "3 phút",
                noi_dung: "Đặt nồi lên bếp với 1 thìa dầu ăn, phi thơm hành tím băm đến khi dậy mùi thơm. Trút thịt xay vào xào đảo nhanh tay trên lửa vừa cùng 1 thìa cà phê nước mắm cho thịt săn chắc và dậy mùi thơm nức."
            },
            {
                buoc: 3,
                tieu_de: "Đun sôi nước dùng trong veo",
                thoi_gian: "4 phút",
                noi_dung: "Đổ 1 lít nước lọc vào nồi thịt băm, bật lửa lớn đun sôi bùng lên. Dùng muôi vớt sạch lớp bọt trắng nổi bên trên để nước canh được trong veo và thanh vị."
            },
            {
                buoc: 4,
                tieu_de: "Nấu chín rau ngót & Hoàn thành",
                thoi_gian: "3 phút",
                noi_dung: "Thả toàn bộ rau ngót đã vò vào nồi nước canh đang sôi sùng sục. Dùng đũa nhấn chìm rau xuống nước. Nêm thêm 1 thìa hạt nêm và chút muối cho vừa miệng. Đun sôi tiếp trong 2 - 3 phút cho rau chín mềm mượt mà vẫn giữ màu xanh mát rồi tắt bếp múc ra tô lớn."
            }
        ],
        meo_nau_an: "Vò nhẹ rau ngót trước khi nấu giúp rau mềm mượt và tiết ra trọn vẹn vị ngọt thanh mát, không bị dai cứng rơm rác khi ăn.",
        dinh_duong: { calo: 140, protein: "14g", chat_beo: "6g", carb: "8g" },
        tags: ["Thanh nhiệt", "Giải độc", "Món canh quốc dân", "Bổ máu lợi sữa"]
    },

    26: {
        mo_ta: "Canh cua đồng đóng tảng gạch vàng ươm thơm ngậy quyện cùng vị ngọt nhớt mát lành của rau đay, mồng tơi và mướp hương, ăn kèm cà pháo giòn tan chuẩn vị mâm cơm Bắc.",
        do_kho: "Trung bình",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Cua đồng tươi giã lọc lấy nước", so_luong: 400, don_vi: "g", ghi_chu: "lọc kỹ lấy 1 lít nước cua không cặn cát" },
            { ten: "Rau đay & Mồng tơi tươi", so_luong: 1, don_vi: "mớ mỗi loại", ghi_chu: "nhặt lá non rửa sạch thái nhỏ 1cm" },
            { ten: "Mướp hương non", so_luong: 1, don_vi: "quả", ghi_chu: "gọt vỏ thái vát xéo" },
            { ten: "Gạch cua khêu từ mai", so_luong: 1, don_vi: "thìa canh", ghi_chu: "chưng hành khô tạo màu vàng ngậy" },
            { ten: "Muối hạt tinh khiết", so_luong: 1, don_vi: "thìa cà phê", ghi_chu: "giúp thịt cua kết tảng lớn" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Lọc nước cua & Kỹ thuật kết tảng thịt cua",
                thoi_gian: "10 phút",
                noi_dung: "Hòa 1 thìa cà phê muối hạt vào 1 lít nước lọc cua, dùng đũa khuấy đều (muối giúp protein cua kết tủa đóng tảng lớn đẹp mắt). Đặt nồi lên bếp bật lửa vừa. Trong 3 phút đầu khi nước còn ấm, dùng muôi khuấy nhẹ nhàng theo hình tròn sát đáy nồi để thịt cua không bị lắng bén cháy đáy nồi. Khi nước bắt đầu bốc hơi nóng và mảng thịt cua bắt đầu nổi lên mặt thì NGỪNG khuấy hoàn toàn."
            },
            {
                buoc: 2,
                tieu_de: "Hạ lửa nhỏ & Vớt tảng thịt cua",
                thoi_gian: "5 phút",
                noi_dung: "Khi nước canh sôi lăn tăn, hạ ngay lửa xuống mức nhỏ nhất để thịt cua kết thành một tảng lớn vàng ươm nổi bồng bềnh trên mặt nước mà không bị vỡ vụn. Dùng muôi thủng khéo léo gạt nhẹ tảng thịt cua dồn về một góc hoặc múc riêng ra bát (giữ nguyên tảng thịt cua không bị nát khi cho rau vào nấu)."
            },
            {
                buoc: 3,
                tieu_de: "Chưng gạch cua vàng ngậy",
                thoi_gian: "3 phút",
                noi_dung: "Đặt chảo nhỏ lên bếp với 1 thìa dầu ăn, phi thơm hành tím băm nhuyễn. Trút phần gạch cua khêu từ mai vào chưng đều tay trên lửa nhỏ trong 1 phút cho gạch cua dậy màu vàng cam thơm ngậy nức mũi."
            },
            {
                buoc: 4,
                tieu_de: "Nấu rau mướp & Rưới gạch cua hoàn tất",
                thoi_gian: "4 phút",
                noi_dung: "Bật lửa lớn cho nồi nước canh sôi lại, thả mướp hương vào trước, sau đó thả rau đay và mồng tơi thái nhỏ vào. Nhấn nhẹ rau xuống nước, nêm hạt nêm và chút nước mắm cho vừa miệng. Đun sôi trong 2 phút cho rau vừa chín tới. Thả lại tảng thịt cua và rưới phần gạch cua chưng vàng cam lên trên mặt nồi canh, đun sôi bùng 20 giây rồi múc ra tô lớn thưởng thức cùng cà pháo giòn."
            }
        ],
        meo_nau_an: "Khi đun nước cua: Cho muối hạt vào từ đầu và khuấy nhẹ đáy nồi lúc nước còn lạnh; khi thịt cua nổi lên thì lập tức ngừng khuấy và hạ lửa nhỏ liu riu để tảng thịt cua đóng bánh dày cộp tuyệt đẹp.",
        dinh_duong: { calo: 190, protein: "20g", chat_beo: "7g", carb: "12g" },
        tags: ["Canh mùa hè", "Đặc sản miền Bắc", "Giàu canxi", "Ăn kèm cà pháo"]
    },

    27: {
        mo_ta: "Bí đao mềm ngọt thanh mát nấu cùng thịt heo băm đậm đà rắc chút hành hoa tiêu sọ, món canh thanh nhiệt nhẹ nhàng giải độc cơ thể.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 10,
        thoi_gian_nau: 12,
        nguyen_lieu_chi_tiet: [
            { ten: "Bí đao non (bí xanh)", so_luong: 500, don_vi: "g", ghi_chu: "gọt vỏ, bỏ ruột chua, thái lát dày 1cm" },
            { ten: "Thịt heo nạc xay", so_luong: 150, don_vi: "g", ghi_chu: "ướp chút hạt nêm tiêu" },
            { ten: "Hành lá & Mùi tàu (ngò gai)", so_luong: 3, don_vi: "nhánh", ghi_chu: "thái nhỏ" },
            { ten: "Hành khô phi thơm", so_luong: 1, don_vi: "củ", ghi_chu: "băm nhỏ" },
            { ten: "Gia vị mắm muối tiêu", so_luong: 1, don_vi: "set", ghi_chu: "nêm vừa thanh" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế bí đao không bị chua",
                thoi_gian: "5 phút",
                noi_dung: "Bí đao nạo vỏ, bổ làm tư theo chiều dọc. Dùng dao cắt bỏ sạch toàn bộ phần ruột xốp trắng chứa hạt ở giữa (ruột bí là phần gây vị chua làm nước canh mất ngon). Rửa sạch bí rồi thái lát dày khoảng 1cm hoặc cắt khúc vừa ăn."
            },
            {
                buoc: 2,
                tieu_de: "Xào thơm thịt băm",
                thoi_gian: "3 phút",
                noi_dung: "Phi thơm hành tím băm với 1 thìa dầu ăn, cho thịt xay vào đảo đều trên lửa vừa cùng 1 thìa cà phê nước mắm cho thịt săn thơm."
            },
            {
                buoc: 3,
                tieu_de: "Nấu nước sôi & Vớt sạch bọt",
                thoi_gian: "4 phút",
                noi_dung: "Đổ 1 lít nước lọc vào nồi thịt đun sôi bùng lên, dùng muôi hớt sạch bọt nổi bên trên để nước canh trong vắt."
            },
            {
                buoc: 4,
                tieu_de: "Nấu bí đao vừa chín trong veo",
                thoi_gian: "5 phút",
                noi_dung: "Thả toàn bộ bí đao vào nồi nước sôi, nêm hạt nêm và chút muối vừa miệng. Đun ở lửa vừa trong 4 - 5 phút đến khi từng miếng bí vừa chuyển màu trong suốt mềm ngọt thì tắt bếp ngay. Rắc hành hoa, mùi tàu thái nhỏ và tiêu xay rồi múc ra tô."
            }
        ],
        meo_nau_an: "Không nấu bí đao quá lâu trên bếp; chỉ nấu đến khi miếng bí vừa chuyển màu trong veo là tắt bếp ngay để bí giữ trọn độ giòn ngọt mọng nước mà không bị nhũn nát.",
        dinh_duong: { calo: 130, protein: "12g", chat_beo: "5g", carb: "10g" },
        tags: ["Giải nhiệt", "Thanh đạm", "Giảm cân", "Dễ tiêu hóa"]
    },

    28: {
        mo_ta: "Nước canh sườn heo ninh ngọt lịm từ tủy xương, khoai tây bở tơi bùi béo kết hợp màu cam rực rỡ của cà rốt bổ dưỡng, món canh bổ dưỡng cho cả gia đình.",
        do_kho: "Trung bình",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 40,
        nguyen_lieu_chi_tiet: [
            { ten: "Sườn non heo hoặc xương ống", so_luong: 500, don_vi: "g", ghi_chu: "chặt khúc 3.5cm" },
            { ten: "Khoai tây vàng", so_luong: 3, don_vi: "củ (~300g)", ghi_chu: "gọt vỏ cắt khối vuông 3cm" },
            { ten: "Cà rốt tươi", so_luong: 1, don_vi: "củ", ghi_chu: "tỉa hoa cắt khoanh 1.2cm" },
            { ten: "Hành hoa & Rau mùi tươi", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "thái nhỏ rắc canh" },
            { ten: "Gia vị, hạt tiêu sọ xay", so_luong: 1, don_vi: "set", ghi_chu: "nêm nếm vừa vặn" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Chần sườn sạch mùi & Khử bọt bẩn",
                thoi_gian: "8 phút",
                noi_dung: "Sườn chặt khúc 3.5cm, rửa với nước muối. Cho sườn vào nồi nước lạnh có vài lát gừng, đun sôi bùng trong 3 phút để tiết hết bọt bẩn và máu đọng. Vớt sườn ra rửa lại thật sạch dưới vòi nước lạnh."
            },
            {
                buoc: 2,
                tieu_de: "Ninh sườn lấy nước ngọt trong veo",
                thoi_gian: "25 phút",
                noi_dung: "Cho sườn vào nồi cùng 1.2 lít nước lạnh và 1 thìa cà phê muối hạt. Bật lửa lớn đun sôi, liên tục hớt sạch bọt ở những phút đầu tiên. Hạ lửa nhỏ liu riu mở hé nắp nồi ninh trong 25 phút cho sườn mềm nhừ ngọt tủy."
            },
            {
                buoc: 3,
                tieu_de: "Sơ chế khoai tây không thâm & Nấu củ quả",
                thoi_gian: "12 phút",
                noi_dung: "Khoai tây, cà rốt gọt vỏ cắt khối vuông 3cm, ngâm ngay khoai vào bát nước muối loãng 5 phút cho sạch nhựa thâm rồi vớt ráo. Thả cà rốt và khoai tây vào nồi canh sườn đang sôi, đun tiếp lửa vừa trong 10 - 12 phút cho khoai bở bùi mềm ngọt."
            },
            {
                buoc: 4,
                tieu_de: "Nêm nếm chuẩn vị & Bày tô",
                thoi_gian: "2 phút",
                noi_dung: "Nếm thử khoai chín mềm bở tơi, nêm 1 muỗng nước mắm ngon và 1 thìa hạt nêm cho vừa miệng. Tắt bếp, rắc hành hoa, rau mùi thái nhỏ và chút tiêu xay thơm lừng rồi múc ra tô lớn thưởng thức nóng."
            }
        ],
        meo_nau_an: "Khi ninh sườn hãy bắt đầu từ nước lạnh và mở hé vung để liên tục hớt sạch bọt; nước canh hầm xương sẽ trong vắt óng ả ngọt ngào không bị đục cặn.",
        dinh_duong: { calo: 380, protein: "28g", chat_beo: "18g", carb: "26g" },
        tags: ["Bổ dưỡng", "Canh hầm ngon", "Gia đình sum vầy", "Giàu vitamin & khoáng chất"]
    },

    29: {
        mo_ta: "Tôm tươi chắc thịt đỏ au hòa trong nước canh chua me thanh mát, vị chua thanh ngọt hậu đượm hương dứa và cà chua thơm ngát.",
        do_kho: "Dễ",
        khau_phan: "3 - 4 người",
        thoi_gian_chuan_bi: 15,
        thoi_gian_nau: 15,
        nguyen_lieu_chi_tiet: [
            { ten: "Tôm sú tươi sống", so_luong: 300, don_vi: "g", ghi_chu: "bóc vỏ chừa đuôi, rút chỉ lưng" },
            { ten: "Dứa chín & Cà chua", so_luong: 0.5, don_vi: "quả / 2 quả", ghi_chu: "thái lát rẻ quạt và múi cau" },
            { ten: "Đậu bắp & Giá đỗ", so_luong: 100, don_vi: "g", ghi_chu: "rửa sạch" },
            { ten: "Me chua chín", so_luong: 35, don_vi: "g", ghi_chu: "dầm nước sôi lấy cốt chua" },
            { ten: "Ngò om & Ngò gai", so_luong: 1, don_vi: "mớ nhỏ", ghi_chu: "cắt nhỏ dậy mùi thơm" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Sơ chế & Ướp tôm tươi",
                thoi_gian: "8 phút",
                noi_dung: "Tôm lột bỏ vỏ và đầu (chừa lại đuôi cho đẹp), rút sạch sợi chỉ đen trên lưng. Ướp tôm với 1/2 thìa hạt nêm và chút đầu hành lá băm nhỏ trong 5 phút."
            },
            {
                buoc: 2,
                tieu_de: "Xào cà chua tạo màu & Nấu nước dùng me",
                thoi_gian: "5 phút",
                noi_dung: "Phi thơm tỏi băm với 1 thìa dầu ăn, cho một nửa lượng cà chua vào xào nhuyễn lấy màu đỏ cam tự nhiên. Đổ 1 lít nước vào đun sôi bùng, rót nước cốt me dầm vào nồi, nêm 2 muỗng nước mắm, 1.5 muỗng đường tạo vị chua ngọt hài hòa."
            },
            {
                buoc: 3,
                tieu_de: "Nấu chín giòn tôm tươi",
                thoi_gian: "3 phút",
                noi_dung: "Thả tôm vào nồi nước sôi bùng, nấu trong khoảng 2 phút đến khi tôm chuyển màu đỏ cam uốn cong săn chắc ngọt mọng."
            },
            {
                buoc: 4,
                tieu_de: "Thêm dứa, đậu bắp, giá & Hoàn tất",
                thoi_gian: "2 phút",
                noi_dung: "Cho dứa, cà chua còn lại, đậu bắp và giá đỗ vào nồi đun sôi thêm 1 phút cho rau củ vừa chín giòn thì tắt bếp ngay. Múc canh ra tô, rắc ngò om, ngò gai thái nhỏ và tỏi phi giòn lên trên."
            }
        ],
        meo_nau_an: "Tôm nấu canh chua chỉ cần sôi 2 phút là đạt độ ngọt giòn mọng nước tối đa; tuyệt đối không đun tôm quá lâu sẽ làm thịt tôm bị co rút xơ xác.",
        dinh_duong: { calo: 210, protein: "24g", chat_beo: "4g", carb: "19g" },
        tags: ["Canh chua ngọt", "Tôm tươi giòn ngọt", "Thanh nhiệt giải say", "Nam Bộ"]
    },

    30: {
        mo_ta: "Trái khổ qua (mướp đắng) xanh mát nhồi nhân thịt băm mộc nhĩ ngọt béo, vị đắng dịu quyện nước dùng ngọt thanh sâu lắng mang ý nghĩa vượt qua khó khăn đón may mắn.",
        do_kho: "Trung bình",
        khau_phan: "4 người",
        thoi_gian_chuan_bi: 20,
        thoi_gian_nau: 30,
        nguyen_lieu_chi_tiet: [
            { ten: "Khổ qua (mướp đắng)", so_luong: 3, don_vi: "trái (~500g)", ghi_chu: "chọn trái gai to nở đều, màu xanh sáng" },
            { ten: "Thịt heo nạc vai xay", so_luong: 250, don_vi: "g", ghi_chu: "thịt tươi có mỡ nhẹ để nhân mềm" },
            { ten: "Mộc nhĩ ngâm nở", so_luong: 3, don_vi: "tai", ghi_chu: "thái sợi nhuyễn" },
            { ten: "Miến dong ngâm mềm", so_luong: 20, don_vi: "g", ghi_chu: "cắt khúc ngắn 1cm" },
            { ten: "Hành tím & Hành hoa chần buộc", so_luong: 5, don_vi: "cọng", ghi_chu: "buộc trang trí đẹp mắt" },
            { ten: "Nước dùng xương hầm trong", so_luong: 1.2, don_vi: "lít", ghi_chu: "tạo vị ngọt thanh sâu" }
        ],
        cac_buoc_thuc_hien: [
            {
                buoc: 1,
                tieu_de: "Khử đắng khổ qua & Nạo sạch ruột trắng",
                thoi_gian: "10 phút",
                noi_dung: "Khổ qua cắt khúc dài 4 - 5cm (hoặc rạch một đường dọc thân quả). Dùng chuôi thìa nạo thật sạch toàn bộ hạt và lớp màng xốp trắng bên trong ruột (lớp màng trắng này là nơi tập trung 70% vị đắng gắt, nạo sạch sẽ giúp khổ qua ngọt thanh dễ ăn). Ngâm khúc khổ qua vào thau nước muối loãng 10 phút rồi vớt ra để ráo."
            },
            {
                buoc: 2,
                tieu_de: "Trộn nhân thịt dẻo quánh & Nhồi khổ qua",
                thoi_gian: "10 phút",
                noi_dung: "Trộn đều thịt xay, mộc nhĩ thái nhuyễn, miến cắt ngắn, hành tím băm, 1 thìa cà phê nước mắm, 1 thìa hạt nêm và 1/2 thìa tiêu trong 3 phút cho dẻo dính. Nhồi nhân thịt thật chặt vào từng khúc khổ qua, miết phẳng hai đầu. Dùng cọng hành hoa chần sơ qua nước sôi buộc ngang thân từng khúc khổ qua cho đẹp mắt."
            },
            {
                buoc: 3,
                tieu_de: "Nấu nước canh sôi & Thả khổ qua",
                thoi_gian: "5 phút",
                noi_dung: "Đun sôi 1.2 lít nước dùng xương hầm với 1 thìa cà phê muối hạt. Khi nước sôi bùng, nhẹ nhàng thả từng khúc khổ qua nhồi thịt vào nồi. Vớt sạch bọt màng nổi lên để nước canh trong vắt."
            },
            {
                buoc: 4,
                tieu_de: "Ninh lửa nhỏ liu riu mở nắp",
                thoi_gian: "20 phút",
                noi_dung: "Hạ lửa nhỏ vừa, đun liu riu mở nắp trong 20 - 25 phút đến khi dùng tăm xiên nhẹ qua lớp vỏ khổ qua thấy mềm mại dễ dàng. Nêm nếm thêm chút hạt nêm và nước mắm vừa ăn. Tắt bếp, rắc hành hoa mùi tàu thái nhỏ rồi múc ra tô lớn thưởng thức."
            }
        ],
        meo_nau_an: "Nạo thật sạch lớp màng xốp trắng bên trong ruột khổ qua và nấu mở nắp nồi sẽ giúp khử sạch vị đắng gắt, chỉ giữ lại vị đắng dịu ngọt hậu thanh mát đặc trưng.",
        dinh_duong: { calo: 240, protein: "22g", chat_beo: "12g", carb: "11g" },
        tags: ["Món canh ngày Tết", "Giải nhiệt thanh lọc", "Hạ đường huyết", "Ngọt hậu đắng thanh"]
    }
};

module.exports = { PART_2 };
