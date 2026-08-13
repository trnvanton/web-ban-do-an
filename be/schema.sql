-- Schema khởi tạo cho Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS tai_khoan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ho_ten TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mat_khau TEXT NOT NULL,
    vai_tro TEXT NOT NULL DEFAULT 'khach',
    ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS san_pham (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_san_pham TEXT NOT NULL,
    danh_muc TEXT DEFAULT 'Nông sản',
    gia REAL NOT NULL DEFAULT 0,
    so_luong_ton INTEGER NOT NULL DEFAULT 10,
    hinh_anh TEXT DEFAULT 'fruite-item-1.jpg',
    mo_ta TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS mon_an (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_mon TEXT NOT NULL,
    nguyen_lieu_chinh TEXT DEFAULT '',
    cong_thuc TEXT DEFAULT '',
    hinh_anh TEXT DEFAULT 'fruite-item-1.jpg',
    loai_mon TEXT DEFAULT 'Món mặn'
);

CREATE TABLE IF NOT EXISTS nguyen_lieu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_nguyen_lieu TEXT NOT NULL,
    loai TEXT DEFAULT 'Khác'
);

CREATE TABLE IF NOT EXISTS don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ten_khach_hang TEXT NOT NULL,
    so_dien_thoai TEXT NOT NULL,
    dia_chi TEXT NOT NULL,
    tong_tien REAL NOT NULL DEFAULT 0,
    trang_thai TEXT DEFAULT 'Chờ xử lý',
    phuong_thuc_thanh_toan TEXT DEFAULT 'COD',
    trang_thai_thanh_toan TEXT DEFAULT 'Chưa thanh toán',
    ngay_dat TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tai_khoan(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    don_hang_id INTEGER NOT NULL,
    product_id INTEGER,
    ten_san_pham TEXT NOT NULL,
    gia REAL NOT NULL DEFAULT 0,
    so_luong INTEGER NOT NULL DEFAULT 1,
    hinh_anh TEXT DEFAULT 'fruite-item-1.jpg',
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES san_pham(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS danh_gia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    don_hang_id INTEGER NOT NULL,
    so_sao INTEGER NOT NULL DEFAULT 5,
    noi_dung TEXT,
    ten_user TEXT,
    ngay_danh_gia TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tai_khoan(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES san_pham(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS dia_chi_giao_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ho_ten TEXT NOT NULL,
    sdt TEXT NOT NULL,
    dia_chi TEXT NOT NULL,
    mac_dinh INTEGER NOT NULL DEFAULT 0,
    ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tai_khoan(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS dinh_luong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_mon INTEGER NOT NULL,
    id_nguyen_lieu INTEGER NOT NULL,
    ham_luong TEXT DEFAULT '',
    FOREIGN KEY (id_mon) REFERENCES mon_an(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed tài khoản demo: admin@gmail.com / admin123, khach@gmail.com / khach123
-- Hash bcrypt tương ứng:
-- admin123 -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- khach123 -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT OR IGNORE INTO tai_khoan (id, ho_ten, email, mat_khau, vai_tro) VALUES 
(1, 'Admin Fruitables', 'admin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
(2, 'Khách Hàng Demo', 'khach@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'khach');

-- Seed sản phẩm demo
INSERT OR IGNORE INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES 
(1, 'Cà chua hữu cơ', 'Rau Củ', 45000, 50, 'fruite-item-1.jpg', 'Cà chua tươi sạch trồng theo tiêu chuẩn VietGAP.'),
(2, 'Táo đỏ nhập khẩu', 'Trái Cây', 120000, 30, 'fruite-item-2.jpg', 'Táo đỏ giòn ngọt, giàu vitamin.'),
(3, 'Cam sành miền Tây', 'Trái Cây', 65000, 40, 'fruite-item-3.jpg', 'Cam sành mọng nước, ngọt thanh.'),
(4, 'Xà lách xoong', 'Rau Củ', 25000, 60, 'fruite-item-4.jpg', 'Xà lách xoong tươi non, sạch bệnh.'),
(5, 'Bánh mì ngàn lớp bơ sữa', 'Thực Phẩm', 35000, 20, 'banh-mi-ngan-lop-vi-bo-sua-handy-goi-80g_202606241240042766.webp', 'Bánh mì ngàn lớp thơm giòn vị bơ sữa.'),
(6, 'Chả lụa bì ớt xiêm xanh', 'Thực Phẩm', 90000, 25, 'cha-lua-bi-ot-xiem-xanh-meatdeli-cay-300g-clone_202509161340134561.webp', 'Chả lụa MeatDeli vị cay nhẹ, dai ngon.'),
(7, 'Nước ép trái cây tự nhiên', 'Đồ Uống', 40000, 35, 'nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg', 'Nước ép trái cây nguyên chất, không đường.'),
(8, 'Rau muống sạch', 'Rau Củ', 20000, 80, '1786007443212.webp', 'Rau muống tươi sạch, không hóa chất.');

-- Seed món ăn demo
INSERT OR IGNORE INTO mon_an (id, ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon, hinh_anh) VALUES 
(1, 'Cơm tấm sườn nướng', 'Sườn, gạo tấm, hành phi, đồ chua', 'Nướng sườn với tỏi mật ong, ăn kèm cơm tấm, bì, chả và rau sống.', 'Món mặn', '1786007443212.webp'),
(2, 'Canh chua cá lóc', 'Cá lóc, me, cà chua, bạc hà', 'Nấu cá với nước me, thêm cà chua và rau thơm, nêm vừa ăn.', 'Món mặn', '1786007478565.webp'),
(3, 'Rau củ luộc chấm kho quẹt', 'Rau củ tổng hợp, tôm khô, thịt ba chỉ', 'Luộc rau củ, làm kho quẹt từ tôm khô và thịt ba chỉ.', 'Món chay', '1786007637594.webp'),
(4, 'Sinh tố bơ dừa', 'Bơ chín, nước cốt dừa, sữa đặc', 'Xay nhuyễn bơ với nước cốt dừa, thêm đá bào.', 'Đồ uống', '1786007648383.webp');
