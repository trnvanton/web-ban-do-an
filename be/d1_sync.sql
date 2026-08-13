PRAGMA foreign_keys = OFF;

-- Bảng tai_khoan
DELETE FROM tai_khoan;
INSERT INTO tai_khoan (id, ho_ten, email, mat_khau, vai_tro, ngay_tao) VALUES (1, 'Admin Fruitables', 'admin@gmail.com', '$2a$10$Il3ci.yiZRYNDpBfKwvNgOlwRcDwwLHjX4h2vqh6s1gsfqbPqTirS', 'admin', '2026-08-10 14:28:14');
INSERT INTO tai_khoan (id, ho_ten, email, mat_khau, vai_tro, ngay_tao) VALUES (2, 'Khách Hàng Demo', 'khach@gmail.com', '$2a$10$3fLTGRcxgxWk/LdmEwQCpO23r7opIIgYRqRxCrKYO6uzafZeU5wjm', 'khach', '2026-08-10 14:28:14');

-- Bảng san_pham
DELETE FROM san_pham;
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (1, 'Cà chua hữu cơ', 'Rau Củ', 45000, 50, 'fruite-item-1.jpg', 'Cà chua tươi sạch trồng theo tiêu chuẩn VietGAP.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (2, 'Táo đỏ nhập khẩu', 'Trái Cây', 120000, 30, 'fruite-item-2.jpg', 'Táo đỏ giòn ngọt, giàu vitamin.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (3, 'Cam sành miền Tây', 'Trái Cây', 65000, 40, 'fruite-item-3.jpg', 'Cam sành mọng nước, ngọt thanh.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (4, 'Xà lách xoong', 'Rau Củ', 25000, 60, 'fruite-item-4.jpg', 'Xà lách xoong tươi non, sạch bệnh.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (5, 'Bánh mì ngàn lớp bơ sữa', 'Thực Phẩm', 35000, 20, 'banh-mi-ngan-lop-vi-bo-sua-handy-goi-80g_202606241240042766.webp', 'Bánh mì ngàn lớp thơm giòn vị bơ sữa.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (6, 'Chả lụa bì ớt xiêm xanh', 'Thực Phẩm', 90000, 25, 'cha-lua-bi-ot-xiem-xanh-meatdeli-cay-300g-clone_202509161340134561.webp', 'Chả lụa MeatDeli vị cay nhẹ, dai ngon.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (7, 'Nước ép trái cây tự nhiên', 'Đồ Uống', 40000, 35, 'nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg', 'Nước ép trái cây nguyên chất, không đường.');
INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (8, 'Rau muống sạch', 'Rau Củ', 20000, 80, '1786007443212.webp', 'Rau muống tươi sạch, không hóa chất.');

-- Bảng mon_an
DELETE FROM mon_an;
INSERT INTO mon_an (id, ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (1, 'Cơm tấm sườn nướng', 'Sườn, gạo tấm, hành phi, đồ chua', 'Nướng sườn với tỏi mật ong, ăn kèm cơm tấm, bì, chả và rau sống.', '1786007443212.webp', 'Món mặn');
INSERT INTO mon_an (id, ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (2, 'Canh chua cá lóc', 'Cá lóc, me, cà chua, bạc hà', 'Nấu cá với nước me, thêm cà chua và rau thơm, nêm vừa ăn.', '1786007478565.webp', 'Món mặn');
INSERT INTO mon_an (id, ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (3, 'Rau củ luộc chấm kho quẹt', 'Rau củ tổng hợp, tôm khô, thịt ba chỉ', 'Luộc rau củ, làm kho quẹt từ tôm khô và thịt ba chỉ.', '1786007637594.webp', 'Món chay');
INSERT INTO mon_an (id, ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (4, 'Sinh tố bơ dừa', 'Bơ chín, nước cốt dừa, sữa đặc', 'Xay nhuyễn bơ với nước cốt dừa, thêm đá bào.', '1786007648383.webp', 'Đồ uống');

-- Bảng nguyen_lieu
DELETE FROM nguyen_lieu;
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (11, 'Trứng', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (12, 'Thịt bò', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (13, 'Thịt ba chỉ', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (14, 'Trứng cút', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (15, 'Cá lóc (hoặc cá basa)', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (16, 'Thịt gà', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (17, 'Thịt băm', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (18, 'Sườn heo', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (19, 'Tôm tươi', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (20, 'Mực tươi', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (21, 'Cua đồng / Cua biển', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (22, 'Thịt bò nạc', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (23, 'Chả lụa / Giò lụa', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (24, 'Lạp xưởng', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (25, 'Cá hồi', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (26, 'Cá diêu hồng', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (27, 'Nghêu / Nghêu hấp', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (28, 'Bạch tuộc', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (29, 'Trứng vịt', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (30, 'Thịt thăn lợn', 'Thịt & Hải sản');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (31, 'Cà chua', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (32, 'Hành lá', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (33, 'Bông cải xanh', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (34, 'Hành tây', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (35, 'Cần tây', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (36, 'Mộc nhĩ', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (37, 'Ớt chuông', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (38, 'Rau muống', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (39, 'Cà rốt', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (40, 'Khoai tây', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (41, 'Bắp cải', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (42, 'Bí đỏ', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (43, 'Bí đao', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (44, 'Su su', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (45, 'Măng tây', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (46, 'Đậu hà lan', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (47, 'Nấm hương', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (48, 'Nấm kim châm', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (49, 'Dưa leo / Dưa chuột', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (50, 'Giá đỗ', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (51, 'Ngò rí / Rau mùi', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (52, 'Rau tía tô / Rau sống', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (53, 'Cải thìa / Cải ngọt', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (54, 'Dứa / Thơm', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (55, 'Me chua / Bạc hà', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (56, 'Khoai lang', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (57, 'Bắp / Ngô ngọt', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (58, 'Khổ qua / Trái đắng', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (59, 'Xà lách', 'Rau củ quả');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (60, 'Tỏi', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (61, 'Đường', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (62, 'Nước mắm', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (63, 'Nước hàng', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (64, 'Ớt', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (65, 'Giấm', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (66, 'Hạt nêm', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (67, 'Muối', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (68, 'Tiêu xay', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (69, 'Dầu ăn', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (70, 'Dầu hào', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (71, 'Xì dầu / Nước tương', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (72, 'Mắm tôm', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (73, 'Mắm nêm', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (74, 'Gừng', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (75, 'Sả', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (76, 'Bột ngọt (Mì chính)', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (77, 'Ngũ vị hương', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (78, 'Mật ong', 'Gia vị');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (79, 'Đậu hũ', 'Đậu & Thực vật');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (80, 'Đậu xanh', 'Đậu & Thực vật');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (81, 'Đậu đỏ', 'Đậu & Thực vật');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (82, 'Đậu nành', 'Đậu & Thực vật');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (83, 'Đậu cove', 'Đậu & Thực vật');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (84, 'Nước dừa', 'Khác');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (85, 'Miến', 'Khác');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (86, 'Bánh đa nem', 'Khác');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (87, 'Gạo / Cơm', 'Khác');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (88, 'Bún tươi', 'Khác');
INSERT INTO nguyen_lieu (id, ten_nguyen_lieu, loai) VALUES (89, 'Bánh mì', 'Khác');

-- Bảng don_hang
DELETE FROM don_hang;
INSERT INTO don_hang (id, user_id, ten_khach_hang, so_dien_thoai, dia_chi, tong_tien, trang_thai, phuong_thuc_thanh_toan, trang_thai_thanh_toan, ngay_dat) VALUES (1, 2, 'Khách Hàng Demo', '0987654321', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 165000, 'Chờ xử lý', 'COD', 'Chưa thanh toán', '2026-08-10 14:28:14');

-- Bảng chi_tiet_don_hang
DELETE FROM chi_tiet_don_hang;
INSERT INTO chi_tiet_don_hang (id, don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES (1, 1, 1, 'Cà chua hữu cơ', 45000, 1, 'fruite-item-1.jpg');
INSERT INTO chi_tiet_don_hang (id, don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES (2, 1, 2, 'Táo đỏ nhập khẩu', 120000, 1, 'fruite-item-2.jpg');

-- Bảng dia_chi_giao_hang
DELETE FROM dia_chi_giao_hang;
INSERT INTO dia_chi_giao_hang (id, user_id, ho_ten, sdt, dia_chi, mac_dinh) VALUES (1, 2, 'Khách Hàng Demo', '0987654321', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 1);

-- Bảng dinh_luong
DELETE FROM dinh_luong;
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (10, 1, 18);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (11, 1, 78);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (12, 1, 50);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (13, 2, 15);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (14, 2, 21);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (15, 2, 45);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (16, 3, 13);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (17, 3, 19);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (18, 3, 28);
INSERT INTO dinh_luong (id, id_mon, id_nguyen_lieu) VALUES (19, 4, 75);

PRAGMA foreign_keys = ON;
