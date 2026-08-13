PRAGMA foreign_keys = OFF;

-- ================= tai_khoan (2 dòng) =================
DELETE FROM `tai_khoan`;
INSERT INTO `tai_khoan` (`id`, `ho_ten`, `email`, `mat_khau`, `vai_tro`, `ngay_tao`) VALUES (1, 'Quản Trị Viên', 'admin@gmail.com', 'admin123', 'admin', '2026-08-04 10:25:33');
INSERT INTO `tai_khoan` (`id`, `ho_ten`, `email`, `mat_khau`, `vai_tro`, `ngay_tao`) VALUES (2, 'Nguyễn Văn A', 'khach@gmail.com', 'khach123', 'khach_hang', '2026-08-04 10:25:33');

-- ================= san_pham (8 dòng) =================
DELETE FROM `san_pham`;
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (1, 'Rau Củ Quả Hữu Cơ', 'Trái cây', '45000.00', 10, '1786007756435.png', 'Rau củ tươi ngon đạt chuẩn VietGAP...');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (2, 'Táo Đỏ Mỹ Tươi', 'Trái cây', '85000.00', 10, '1786007743217.jpg', 'Táo giòn ngọt, giàu dinh dưỡng...');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (3, 'Nước Ép Trái Cây Nguyên Chất', 'Trái cây', '35000.00', 10, '1786007731098.webp', 'Nước ép nguyên chất không đường...');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (4, 'Cà chua bi', 'Rau củ', '20000.00', 20, '1786008268041.jpg', 'Cà chua bi tươi ngon, thuộc loại cà chua có trái nhỏ nhưng căng, tròn và ngọt. Cà chua không bị hư, thối hay dập.
Cà chua bi được trồng tại Lâm Đồng, bảo đảm nguồn gốc xuất xứ rõ ràng.
Đặt giao hàng nhanh');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (5, 'Củ khoai tây', 'Rau củ', '15000.00', 27, '1786008327361.jpg', 'Khoai tây thuộc họ cà, là một loại củ đa năng có hàm lượng chất dinh dưỡng cao, vì vậy nhiều hộ gia đình tại Việt Nam đã lựa chọn khoai tây như một món ăn chính trong các bữa ăn hàng ngày. Sở hữu nguồn vitamin và khoáng chất phong phú, khoai tây mang lại nhiều lợi ích cho sức khỏe như kháng viêm, giảm đau, tăng cường hệ miễn dịch, kích thích tiêu hóa,...');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (6, 'Bánh mì nghìn lớp', 'Bánh mì', '20000.00', 14, '1786008422050.webp', 'Bánh mì ngàn lớp vị bơ sữa Handy Tràng An 80g là dòng bánh mì ngọt cao cấp đầu tay của Tràng An. Sản phẩm mang hương vị bơ sữa đậm đà chuẩn Pháp với kết cấu nhiều lớp mỏng xốp mềm. Đây là giải pháp dinh dưỡng tiện lợi, thích hợp cho bữa sáng nhanh gọn hoặc bữa xế của học sinh, sinh viên và dân văn phòng');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (7, 'Chả lụa chuẩn ngon MEATDeli gói 300g', 'Thực phẩm tươi', '40000.00', 9, '1786008488695.webp', 'Chả lụa chuẩn ngon MEATDeli gói 300g thương hiệu chả lụa MEATDeli từ nguồn thịt sạch, ngon chất lượng. Chả lụa món ăn khai vị truyền thống của người Việt, thơm mềm dai nhẹ ngon chuẩn vị khó cưỡng. Dùng ngay tiện dụng, tiết kiệm thời gian, cho bữa ăn chất lượng, dinh dưỡng.');
INSERT INTO `san_pham` (`id`, `ten_san_pham`, `danh_muc`, `gia`, `so_luong_ton`, `hinh_anh`, `mo_ta`) VALUES (8, 'Xúc xích Funny Vissan gói 500g', 'Thực phẩm tươi', '54500.00', 8, '1786008552373.webp', 'Xúc xích Vissan với thành phần chính như nạc heo, nạc gà, mỡ heo, ruột collagen kết hợp cùng với các gia vị khác tạo nên hương vị xúc xích tươi thơm ngon, kích thích vị giác. Xúc xích Funny Vissan gói 500g giúp cung cấp đầy đủ dinh dưỡng cũng như năng lượng cần thiết cho bữa ăn.');

-- ================= mon_an (52 dòng) =================
DELETE FROM `mon_an`;
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (1, 'Trứng chiên cà chua', 'Trứng, Cà chua, Hành lá', 'Đánh trứng, xào cà chua rồi cho trứng vào chiên chín.', '1786034640636.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (3, 'Bò xào bông cải xanh', 'Thịt bò, Bông cải xanh, Tỏi', 'Ướp thịt bò. Xào bông cải chín tới rồi cho thịt bò vào đảo nhanh.', '1786036482174.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (4, 'Thịt heo kho tàu', 'Thịt ba chỉ, Trứng cút, Nước dừa', 'Ướp thịt với nước mắm, hành tỏi. Phi thơm hành, cho thịt vào xào săn rồi đổ nước dừa tươi ngập thịt. Kho lửa nhỏ đến khi thịt mềm nhừ, cho trứng cút vào đun thêm 15 phút.', '1786036788088.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (5, 'Thịt ba chỉ rang cháy cạnh', 'Thịt ba chỉ, Hành lá, Nước mắm, Đường', 'Thái mỏng thịt ba chỉ, cho vào chảo đảo đều cho ra bớt mỡ đến khi xém vàng cạnh. Thêm nước mắm, đường, hành khô, đảo đều lửa lớn cho ngấm gia vị.', '1786036806028.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (6, 'Cá kho tộ', 'Cá lóc (hoặc cá basa), Thịt ba chỉ, Nước hàng', 'Cá ướp nước mắm, tiêu, ớt, nước hàng. Xếp một lớp thịt ba chỉ dưới đáy tộ, đặt cá lên trên, thêm nước dừa rồi kho liu riu lửa nhỏ đến khi cạn sệt.', '1786036823083.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (7, 'Gà chiên nước mắm', 'Thịt gà, Nước mắm, Tỏi, Đường, Ớt', 'Luộc sơ gà rồi để ráo, đem chiên vàng giòn các mặt. Phi thơm tỏi ớt, làm hỗn hợp nước mắm đường sền sệt rồi cho gà vào xóc đều lửa nhỏ.', '1786036842355.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (8, 'Thịt bò xào hành tây', 'Thịt bò, Hành tây, Cần tây, Tỏi', 'Thịt bò thái mỏng ướp tỏi, dầu hào, tiêu. Xào tái thịt bò với lửa lớn rồi múc ra đĩa. Tiếp tục xào hành tây rồi cho thịt bò vào đảo nhanh tay tắt bếp.', '1786036856696.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (9, 'Đậu hũ nhồi thịt sốt cà chua', 'Đậu hũ, Thịt băm, Cà chua, Hành lá', 'Nhồi thịt băm đã ướp gia vị vào miếng đậu hũ đã khoét lỗ. Đem rán vàng các mặt. Phi hành, xào nhuyễn cà chua làm sốt rồi cho đậu vào rim nhỏ lửa.', '1786036870851.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (10, 'Chả giò (Nem rán)', 'Thịt băm, Miến, Mộc nhĩ, Bánh đa nem, Trứng', 'Trộn đều thịt băm, miến ngâm mềm thái nhỏ, mộc nhĩ, nấm hương, trứng và gia vị. Cuốn vào bánh đa nem rồi đem chiên ngập dầu đến khi vàng giòn.', '1786036888180.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (11, 'Sườn xào chua ngọt', 'Sườn heo, Cà chua, Ớt chuông, Giấm, Đường', 'Sườn chặt miếng vừa ăn, trần qua nước sôi rồi rán vàng. Làm nước sốt gồm cà chua băm, giấm, đường, nước mắm. Đổ sườn vào rim đến khi sốt sánh lại.', '1786036904867.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (12, 'Mực xào dứa (thơm)', 'Mực tươi, Dứa, Cần tây, Hành tây', 'Mực làm sạch, khía vẩy rồng, trần sơ nước gừng để khử mùi tanh. Xào sơ dứa và hành tây, sau đó cho mực vào xào nhanh tay trên lửa lớn để mực giòn ngọt.', '1786036920587.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (13, 'Gà kho gừng', 'Thịt gà, Gừng tươi, Nước mắm, Đường', 'Gà chặt miếng vừa ăn. Gừng thái sợi. Phi thơm gừng, cho gà vào xào săn, nêm nước mắm, đường, thêm chút nước lọc rồi kho đến khi cạn nước, thịt ngấm vị.', '1786036934209.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (14, 'Trứng cút kho thịt', 'Trứng cút, Thịt ba chỉ, Nước mắm', 'Luộc chín trứng cút, bóc vỏ. Thịt ba chỉ thái con chì xào săn. Cho thịt và trứng vào nồi, thêm nước mắm, đường, nước màu rồi kho nhừ.', '1786036955700.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (15, 'Tôm rim mặn ngọt', 'Tôm tươi, Tỏi, Nước mắm, Đường', 'Tôm cắt bỏ râu, rửa sạch. Phi thơm tỏi, cho tôm vào đảo đều đến khi cạn nước thì thêm nước mắm, đường, chút tiêu để tạo lớp vỏ rim mặn ngọt đậm đà.', '1786036969926.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (16, 'Chả cá chiên', 'Chả cá thác lác (hoặc chả cá thu), Thì lá', 'Quết chả cá thật nhuyễn với thì là và gia vị. Tạo hình thành các miếng tròn dẹt rồi chiên vàng đều trong chảo dầu.', '1786036988521.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (17, 'Bò sốt vang', 'Thịt bò dẻ sườn, Khoai tây, Cà rốt, Rượu vang đỏ', 'Thịt bò cắt khối vuông, ướp gia vị và rượu vang đỏ. Xào săn thịt rồi hầm nhừ cùng khoai tây, cà rốt, hành tây và quế hồi cho thơm.', '1786037002591.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (18, 'Gà luộc lá chanh', 'Thịt gà ta, Lá chanh, Gừng', 'Luộc gà với vài lát gừng và hành tím đến khi chín tới. Vớt ra ngâm nước đá cho da giòn, khi ăn chặt miếng và rắc lá chanh thái chỉ lên trên.', '1786037018198.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (19, 'Thịt bò áp chảo', 'Thịt thăn bò, Tỏi, Bơ lạt, Thảo mộc', 'Ướp thăn bò với muối tiêu. Cho bơ và tỏi vào chảo nóng, áp chảo nhanh tay hai mặt thịt bò để giữ độ mọng nước.', '1786037034911.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (20, 'Cá sốt cà chua', 'Cá phi lê (hoặc cá cắt khúc), Cà chua, Hành lá', 'Rán vàng đều cá. Làm sốt cà chua riêng với hành tỏi băm. Cho cá vào nồi sốt cà, thêm chút nước và gia vị, rim nhỏ lửa cho thấm.', '1786037051142.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (21, 'Vịt nấu chao', 'Thịt vịt, Chao trắng, Khoai môn, Nước dừa', 'Vịt chặt miếng, ướp chao, tỏi, hành, sả và gia vị. Xào săn thịt vịt rồi đổ nước dừa và khoai môn vào hầm nhừ tới khi sánh đặc.', '1786037065573.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (22, 'Giò lụa kho tiêu', 'Giò lụa, Tiêu xanh, Nước mắm', 'Thái giò lụa thành các thanh dày vừa ăn. Phi thơm hành, cho giò vào đảo đều, thêm nước mắm, nước hàng và hạt tiêu giã đập dập rồi kho sệt.', '1786037078146.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (23, 'Thịt băm viên sốt cà chua', 'Thịt băm, Cà chua, Hành hoa', 'Thịt băm trộn hành tỏi, tiêu, nặn thành các viên tròn nhỏ rồi đem rán sơ. Sốt cà chua nhuyễn rồi thả thịt viên vào rim lửa nhỏ.', '1786037093221.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (24, 'Canh chua cá lóc', 'Cá lóc, Dứa, Cà chua, Đậu bắp, Giá đỗ, Me chua', 'Phi thơm hành tỏi, cho cà chua và dứa vào xào lấy màu. Thêm nước sôi và nước cốt me. Cho cá lóc vào nấu chín, sau đó thêm đậu bắp, giá đỗ và rau thơm.', '1786037110667.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (25, 'Canh rau ngót thịt băm', 'Rau ngót, Thịt heo băm', 'Thịt băm xào sơ với hành tím cho thơm rồi đổ nước lọc vào đun sôi. Vò nát rau ngót cho vào nồi, nêm gia vị vừa ăn rồi đun chín tới.', '1786037126752.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (26, 'Canh cua rau đay mồng tơi', 'Cua đồng giã, Rau đay, Mồng tơi, Mướp', 'Lọc nước cua đồng đun lửa vừa để gạch cua đóng bánh, vớt gạch ra. Cho rau đay, mồng tơi thái nhỏ và mướp vào nấu chín mềm, thả gạch cua lên trên.', '1786037152327.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (27, 'Canh bí đao nấu thịt băm', 'Bí đao, Thịt heo băm, Hành lá', 'Xào thịt băm với hành khô cho thơm, đổ nước vào đun sôi. Gọt vỏ bí đao, thái miếng vừa ăn rồi cho vào nồi nấu đến khi bí trong và chín mềm.', '1786037166093.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (28, 'Canh sườn nấu khoai tây cà rốt', 'Sườn heo, Khoai tây, Cà rốt, Hành ngò', 'Sườn ninh nhừ lấy nước ngọt. Cho khoai tây và cà rốt cắt khối vuông vào ninh cùng đến khi mềm nhừ, nêm nếm gia vị vừa miệng, rắc hành ngò.', '1786037183354.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (29, 'Canh chua tôm', 'Tôm tươi, Cà chua, Thơm, Me', 'Xào cà chua và thơm, đổ nước đun sôi rồi cho tôm vào. Nêm nước cốt me, đường, nước mắm tạo vị chua ngọt thanh mát.', '1786037230275.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (30, 'Canh khổ qua nhồi thịt', 'Khổ qua (mướp đắng), Thịt băm, Nấm mèo', 'Khổ qua bỏ ruột, nhồi thịt băm trộn mộc nhĩ vào bên trong. Đem ninh nhừ trong nồi nước dùng xương hoặc nước lọc cho ra vị ngọt thanh đặc trưng.', '1786037247932.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (31, 'Canh trứng cà chua', 'Trứng gà, Cà chua, Hành lá', 'Xào nhuyễn cà chua với hành mỡ, đổ nước sôi vào đun. Đánh tan trứng gà rồi vừa đổ từ từ vào nồi vừa khuấy nhẹ để tạo vân trứng đẹp mắt.', '1786037266641.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (32, 'Canh ngao nấu chua', 'Nghao (tu hài/ngêu), Dứa, Cà chua, Sấu', 'Luộc ngao lấy nước ngọt, lọc bỏ cặn cát, gỡ lấy thịt ngao. Phi hành mỡ xào thịt ngao rồi cho nước luộc, sấu/dứa/cà chua vào đun sôi.', '1786037279600.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (33, 'Canh đậu hũ rong biển', 'Đậu hũ non, Rong biển khô, Thịt băm', 'Đun sôi nước dùng, cho thịt băm và rong biển vào. Cắt đậu hũ non thành khối nhỏ thả vào cuối cùng để đậu không bị nát.', '1786037293536.webp', 'Canh');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (34, 'Rau muống xào tỏi', 'Rau muống, Tỏi khô, Dầu ăn', 'Nhặt rau muống rửa sạch, trần qua nước sôi rồi vớt ra nước lạnh để giữ màu xanh giòn. Phi thơm ngập tỏi rồi cho rau muống vào xào lửa lớn thật nhanh tay.', '1786037313574.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (35, 'Ngọn su su xào tỏi', 'Ngọn su su, Tỏi, Dầu ăn', 'Ngọn su su tước xơ, bẻ khúc vừa ăn. Phi thơm tỏi, cho ngọn su su vào xào chín tới, nêm gia vị vừa miệng.', '1786037326995.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (36, 'Bắp cải xào thịt heo', 'Bắp cải, Thịt ba chỉ thái mỏng', 'Thái nhỏ bắp cải. Xào săn thịt ba chỉ trước rồi cho bắp cải vào đảo đều với lửa lớn để bắp cải chín giòn mà không ra nhiều nước.', '1786037340314.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (37, 'Mướp xào lòng gà', 'Mướp hương, Lòng mề gà', 'Lòng gà xào chín tới với hành gừng rồi múc ra. Tiếp tục cho mướp thái vát vào xào gần chín thì trút lòng gà vào đảo chung.', '1786037352718.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (38, 'Đậu cove xào thịt bò', 'Đậu cove, Thịt bò', 'Thịt bò xào tái để riêng. Xào đậu cove gần chín thì trút thịt bò vào đảo nhanh tay cùng chút tỏi băm.', '1786036772485.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (39, 'Bông cải xanh xào tôm', 'Bông cải xanh (súp lơ), Tôm tươi', 'Tôm bóc vỏ xào săn. Súp lơ cắt miếng vừa ăn trần sơ. Cho súp lơ và tôm vào chảo xào chung với chút nước dùng.', '1786036757571.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (40, 'Rau lang xào tỏi', 'Rau lang, Tỏi', 'Rau lang nhặt lấy ngọn non, rửa sạch. Phi thơm tỏi băm rồi xào chín mềm rau lang với lửa lớn.', '1786036745728.webp', 'Món xào');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (41, 'Rau luộc thập cẩm', 'Bắp cải, Cà rốt, Su hào, Đậu cove', 'Đun sôi một nồi nước có thêm chút muối. Cho các loại củ quả cứng vào trước, sau đó cho bắp cải vào luộc chín tới để chấm kèm kho quẹt hoặc muối vừng.', '1786036732528.webp', 'Rau');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (42, 'Dưa leo trộn chua ngọt', 'Dưa leo (dưa chuột), Tỏi, Đường, Giấm', 'Dưa chuột bỏ ruột thái lát mỏng, trộn đều với đường, giấm, tỏi ớt băm nhuyễn để tủ lạnh 15 phút cho ngấm gia vị.', '1786036718732.webp', 'Rau');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (43, 'Kim chi cải thảo', 'Cải thảo, Củ cải, Ớt bột Hàn Quốc', 'Cải thảo muối sơ qua nước muối rồi xả sạch. Trộn đều với hỗn hợp bột ớt, tỏi, gừng, nước mắm, đường rồi ủ chua.', '1786036705786.webp', 'Rau');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (44, 'Đậu hũ chiên giòn', 'Đậu hũ trắng, Mắm tôm hoặc nước mắm tỏi ớt', 'Đậu hũ cắt miếng vuông nhỏ, rán ngập dầu trong chảo đến khi lớp vỏ vàng giòn rụm.', '1786036689705.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (45, 'Trứng chiên hành lá', 'Trứng gà, Hành lá, Nước mắm', 'Đánh tan trứng gà với hành lá thái nhỏ và chút nước mắm. Rán chín vàng đều hai mặt trên chảo dầu nóng.', '1786036674608.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (46, 'Trứng ốp la', 'Trứng gà, Dầu ăn, Tiêu', 'Đập trứng trực tiếp vào chảo chống dính có một chút dầu ăn, rán đến khi lòng trắng chín đông còn lòng đào vừa tới.', '1786036610673.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (47, 'Dưa giá đỗ muối chua', 'Giá đỗ, Hẹ, Muối, Đường', 'Trộn giá đỗ và hẹ rửa sạch với nước muối đường pha loãng, nén chặt và để 1 ngày là ăn được.', '1786036596750.webp', 'Rau');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (48, 'Cà muối xổi', 'Cà pháo, Riềng, Tỏi, Ớt, Mắm, Đường', 'Cà pháo thái mỏng ngâm nước muối loãng cho đỡ thâm. Trộn đều với tỏi, ớt, riềng giã nhỏ, đường và nước mắm.', '1786036578552.webp', 'Rau');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (49, 'Chả lụa thái lát', 'Chả lụa (giò lụa)', 'Cắt giò lụa thành khoanh tròn rồi thái miếng tam giác vừa ăn, bày ra đĩa chấm kèm muối tiêu chanh hoặc tương ớt.', '1786036544401.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (50, 'Lạc rang muối', 'Lạc (đậu phộng), Muối, Dầu ăn', 'Rang lạc trên chảo nhỏ lửa với chút dầu ăn hoặc muối hạt đến khi vỏ thơm giòn, bắc ra đảo đều đến nguội.', '1786036533983.webp', 'Món mặn');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (51, 'Dưa hấu tráng miệng', 'Dưa hấu tươi', 'Gọt vỏ dưa hấu, cắt thành các miếng tam giác vừa ăn, bảo quản lạnh trước khi dùng.', '1786036522570.webp', 'Tráng miệng');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (52, 'Xoài chín tráng miệng', 'Xoài cát chín', 'Gọt vỏ xoài chín ngọt, thái miếng vừa ăn bày ra đĩa làm món tráng miệng sau bữa cơm.', '1786036513550.webp', 'Tráng miệng');
INSERT INTO `mon_an` (`id`, `ten_mon`, `nguyen_lieu_chinh`, `cong_thuc`, `hinh_anh`, `loai_mon`) VALUES (53, 'Thanh long tráng miệng', 'Thanh long ruột đỏ hoặc trắng', 'Lột vỏ quả thanh long, cắt khối vuông hoặc khoanh tròn để ăn làm mát cơ thể sau bữa ăn.', '1786036502298.webp', 'Tráng miệng');

-- ================= nguyen_lieu (77 dòng) =================
DELETE FROM `nguyen_lieu`;
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (1, 'Trứng', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (2, 'Cà chua', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (3, 'Hành lá', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (4, 'Thịt bò', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (5, 'Bông cải xanh', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (6, 'Tỏi', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (7, 'Thịt ba chỉ', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (8, 'Trứng cút', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (9, 'Nước dừa', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (10, 'Đường', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (11, 'Nước mắm', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (12, 'Cá lóc (hoặc cá basa)', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (13, 'Nước hàng', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (14, 'Thịt gà', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (15, 'Ớt', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (16, 'Hành tây', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (17, 'Cần tây', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (18, 'Đậu hũ', 'Đậu & Thực vật');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (19, 'Thịt băm', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (20, 'Miến', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (21, 'Mộc nhĩ', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (22, 'Bánh đa nem', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (23, 'Sườn heo', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (24, 'Ớt chuông', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (25, 'Giấm', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (26, 'Mực tươi', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (27, 'Dứa', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (28, 'Gừng tươi', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (29, 'Tôm tươi', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (30, 'Chả cá thác lác (hoặc chả cá thu)', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (31, 'Thì lá', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (32, 'Thịt bò dẻ sườn', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (33, 'Khoai tây', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (34, 'Cà rốt', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (35, 'Rượu vang đỏ', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (36, 'Thịt gà ta', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (37, 'Lá chanh', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (38, 'Thịt thăn bò', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (39, 'Bơ lạt', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (40, 'Thảo mộc', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (41, 'Cá phi lê (hoặc cá cắt khúc)', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (42, 'Thịt vịt', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (43, 'Chao trắng', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (44, 'Khoai môn', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (45, 'Giò lụa', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (46, 'Tiêu xanh', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (47, 'Đậu bắp', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (48, 'Giá đỗ', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (49, 'Me chua', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (50, 'Rau ngót', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (51, 'Cua đồng giã', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (52, 'Rau đay', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (53, 'Mồng tơi', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (54, 'Mướp', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (55, 'Bí đao', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (56, 'Nghao (tu hài/ngêu)', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (57, 'Sấu', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (58, 'Đậu hũ non', 'Đậu & Thực vật');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (59, 'Rong biển khô', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (60, 'Rau muống', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (61, 'Ngọn su su', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (62, 'Mướp hương', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (63, 'Lòng mề gà', 'Thịt & Hải sản');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (64, 'Đậu cove', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (65, 'Rau lang', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (66, 'Su hào', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (67, 'Dưa leo (dưa chuột)', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (68, 'Cải thảo', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (69, 'Củ cải', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (70, 'Ớt bột Hàn Quốc', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (71, 'Hẹ', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (72, 'Cà pháo', 'Rau củ quả');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (73, 'Riềng', 'Gia vị');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (74, 'Lạc (đậu phộng)', 'Khác');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (75, 'Dưa hấu tươi', 'Tráng miệng');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (76, 'Xoài cát chín', 'Tráng miệng');
INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `loai`) VALUES (77, 'Thanh long ruột đỏ hoặc trắng', 'Tráng miệng');

-- ================= don_hang (9 dòng) =================
DELETE FROM `don_hang`;
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (1, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '20000.00', 'Đã hủy', '2026-08-06 14:56:25', 1, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (2, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '40000.00', 'Chờ xử lý', '2026-08-06 15:45:34', 1, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (3, 'Nguyễn Văn A', '0987654321', 'Yết Kiêu - Hải Phòng', '70000.00', 'Đã hoàn thành', '2026-08-10 15:24:47', 2, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (4, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '85000.00', 'Đang giao', '2026-08-10 15:26:23', 1, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (5, 'Test Customer', '0912345678', 'Hanoi', '30000.00', 'Chờ xử lý', '2026-08-10 15:28:26', NULL, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (6, 'Nguyen Van A', '0987654321', '123 Le Loi', '54500.00', 'Đang giao', '2026-08-10 15:29:03', NULL, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (7, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '40000.00', 'Đã hoàn thành', '2026-08-10 15:30:11', 1, 'COD', 'Chưa thanh toán');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (8, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '20000.00', 'Chờ xử lý', '2026-08-10 16:02:33', 1, 'BANK_QR', 'Đã thanh toán (Chờ xác nhận)');
INSERT INTO `don_hang` (`id`, `ten_khach_hang`, `so_dien_thoai`, `dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `user_id`, `phuong_thuc_thanh_toan`, `trang_thai_thanh_toan`) VALUES (9, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', '15000.00', 'Đã hoàn thành', '2026-08-10 16:11:45', 1, 'BANK_QR', 'Đã thanh toán (QR)');

-- ================= chi_tiet_don_hang (8 dòng) =================
DELETE FROM `chi_tiet_don_hang`;
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (1, 2, 7, 'Chả lụa chuẩn ngon MEATDeli gói 300g', '40000.00', 1, 'fruite-item-1.jpg');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (2, 3, 3, 'Nước Ép Trái Cây Nguyên Chất', '35000.00', 2, '1786007731098.webp');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (3, 4, 2, 'Táo Đỏ Mỹ Tươi', '85000.00', 1, '1786007743217.jpg');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (4, 5, 5, 'Củ khoai tây', '15000.00', 2, '1786008327361.jpg');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (5, 6, 8, 'Xúc xích Funny Vissan gói 500g', '54500.00', 1, '1786008552373.webp');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (6, 7, 7, 'Chả lụa chuẩn ngon MEATDeli gói 300g', '40000.00', 1, '1786008488695.webp');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (7, 8, 6, 'Bánh mì nghìn lớp', '20000.00', 1, '1786008422050.webp');
INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `product_id`, `ten_san_pham`, `gia`, `so_luong`, `hinh_anh`) VALUES (8, 9, 5, 'Củ khoai tây', '15000.00', 1, '1786008327361.jpg');

-- ================= danh_gia (2 dòng) =================
DELETE FROM `danh_gia`;
INSERT INTO `danh_gia` (`id`, `user_id`, `product_id`, `don_hang_id`, `so_sao`, `noi_dung`, `ten_user`, `ngay_danh_gia`) VALUES (1, 1, 1, 1, 5, 'Nông sản siêu tươi ngon, giao hàng thần tốc trong 30 phút!', 'Khách Hàng Thân Thiết', '2026-08-10 15:53:00');
INSERT INTO `danh_gia` (`id`, `user_id`, `product_id`, `don_hang_id`, `so_sao`, `noi_dung`, `ten_user`, `ngay_danh_gia`) VALUES (2, 1, 7, 7, 4, 'Khá ngon', 'admin@gmail.com', '2026-08-10 15:55:25');

-- ================= dia_chi_giao_hang (2 dòng) =================
DELETE FROM `dia_chi_giao_hang`;
INSERT INTO `dia_chi_giao_hang` (`id`, `user_id`, `ho_ten`, `sdt`, `dia_chi`, `mac_dinh`, `ngay_tao`) VALUES (1, 2, 'Nguyễn Văn A', '0987654321', 'Yết Kiêu - Hải Phòng', 1, '2026-08-06 12:03:45');
INSERT INTO `dia_chi_giao_hang` (`id`, `user_id`, `ho_ten`, `sdt`, `dia_chi`, `mac_dinh`, `ngay_tao`) VALUES (2, 1, 'Quản Trị Viên', '0987654321', 'Yết Kiêu', 0, '2026-08-10 15:26:23');

PRAGMA foreign_keys = ON;
