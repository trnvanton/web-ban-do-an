require('dotenv').config();

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

// ============ SQLite (dành cho chạy test local, không cần cài MySQL) ============

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, process.env.DB_FILE || 'app.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ---------- Schema ----------
function initSchema() {
    db.exec(`
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
        CREATE TABLE IF NOT EXISTS don_hang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            ten_khach_hang TEXT NOT NULL,
            so_dien_thoai TEXT NOT NULL,
            dia_chi TEXT NOT NULL,
            tong_tien REAL NOT NULL DEFAULT 0,
            trang_thai TEXT DEFAULT 'Chờ xử lý',
            ngay_dat TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS chi_tiet_don_hang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            don_hang_id INTEGER NOT NULL,
            product_id INTEGER,
            ten_san_pham TEXT NOT NULL,
            gia REAL NOT NULL DEFAULT 0,
            so_luong INTEGER NOT NULL DEFAULT 1,
            hinh_anh TEXT DEFAULT 'fruite-item-1.jpg'
        );
        CREATE TABLE IF NOT EXISTS dia_chi_giao_hang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            ho_ten TEXT NOT NULL,
            sdt TEXT NOT NULL,
            dia_chi TEXT NOT NULL,
            mac_dinh INTEGER NOT NULL DEFAULT 0
        );
    `);
}

// ---------- Seed dữ liệu demo (chỉ chạy khi bảng rỗng) ----------
function seed() {
    const hash = (s) => bcrypt.hashSync(s, 10);

    const insert = db.transaction(() => {
        // Tài khoản demo: admin@gmail.com / admin123, khach@gmail.com / khach123
        db.prepare('INSERT INTO tai_khoan (ho_ten, email, mat_khau, vai_tro) VALUES (?, ?, ?, ?)')
            .run('Admin Fruitables', 'admin@gmail.com', hash('admin123'), 'admin');
        db.prepare('INSERT INTO tai_khoan (ho_ten, email, mat_khau, vai_tro) VALUES (?, ?, ?, ?)')
            .run('Khách Hàng Demo', 'khach@gmail.com', hash('khach123'), 'khach');

        // Sản phẩm demo
        const products = [
            ['Cà chua hữu cơ', 'Rau Củ', 45000, 50, 'fruite-item-1.jpg', 'Cà chua tươi sạch trồng theo tiêu chuẩn VietGAP.'],
            ['Táo đỏ nhập khẩu', 'Trái Cây', 120000, 30, 'fruite-item-2.jpg', 'Táo đỏ giòn ngọt, giàu vitamin.'],
            ['Cam sành miền Tây', 'Trái Cây', 65000, 40, 'fruite-item-3.jpg', 'Cam sành mọng nước, ngọt thanh.'],
            ['Xà lách xoong', 'Rau Củ', 25000, 60, 'fruite-item-4.jpg', 'Xà lách xoong tươi non, sạch bệnh.'],
            ['Bánh mì ngàn lớp bơ sữa', 'Thực Phẩm', 35000, 20, 'banh-mi-ngan-lop-vi-bo-sua-handy-goi-80g_202606241240042766.webp', 'Bánh mì ngàn lớp thơm giòn vị bơ sữa.'],
            ['Chả lụa bì ớt xiêm xanh', 'Thực Phẩm', 90000, 25, 'cha-lua-bi-ot-xiem-xanh-meatdeli-cay-300g-clone_202509161340134561.webp', 'Chả lụa MeatDeli vị cay nhẹ, dai ngon.'],
            ['Nước ép trái cây tự nhiên', 'Đồ Uống', 40000, 35, 'nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg', 'Nước ép trái cây nguyên chất, không đường.'],
            ['Rau muống sạch', 'Rau Củ', 20000, 80, '1786007443212.webp', 'Rau muống tươi sạch, không hóa chất.']
        ];
        const insProduct = db.prepare('INSERT INTO san_pham (ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (?, ?, ?, ?, ?, ?)');
        products.forEach(p => insProduct.run(...p));

        // Món ăn demo
        const dishes = [
            ['Cơm tấm sườn nướng', 'Sườn, gạo tấm, hành phi, đồ chua', 'Nướng sườn với tỏi mật ong, ăn kèm cơm tấm, bì, chả và rau sống.', 'Món mặn', '1786007443212.webp'],
            ['Canh chua cá lóc', 'Cá lóc, me, cà chua, bạc hà', 'Nấu cá với nước me, thêm cà chua và rau thơm, nêm vừa ăn.', 'Món mặn', '1786007478565.webp'],
            ['Rau củ luộc chấm kho quẹt', 'Rau củ tổng hợp, tôm khô, thịt ba chỉ', 'Luộc rau củ, làm kho quẹt từ tôm khô và thịt ba chỉ.', 'Món chay', '1786007637594.webp'],
            ['Sinh tố bơ dừa', 'Bơ chín, nước cốt dừa, sữa đặc', 'Xay nhuyễn bơ với nước cốt dừa, thêm đá bào.', 'Đồ uống', '1786007648383.webp']
        ];
        const insDish = db.prepare('INSERT INTO mon_an (ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon, hinh_anh) VALUES (?, ?, ?, ?, ?)');
        dishes.forEach(d => insDish.run(...d));

        // Một đơn hàng mẫu của khách hàng demo (user_id = 2)
        const order = db.prepare("INSERT INTO don_hang (user_id, ten_khach_hang, so_dien_thoai, dia_chi, tong_tien, trang_thai) VALUES (?, ?, ?, ?, ?, ?)")
            .run(2, 'Khách Hàng Demo', '0987654321', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 165000, 'Chờ xử lý');
        const orderId = order.lastInsertRowid;
        const insDetail = db.prepare('INSERT INTO chi_tiet_don_hang (don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES (?, ?, ?, ?, ?, ?)');
        insDetail.run(orderId, 1, 'Cà chua hữu cơ', 45000, 1, 'fruite-item-1.jpg');
        insDetail.run(orderId, 2, 'Táo đỏ nhập khẩu', 120000, 1, 'fruite-item-2.jpg');

        // Địa chỉ mẫu
        db.prepare('INSERT INTO dia_chi_giao_hang (user_id, ho_ten, sdt, dia_chi, mac_dinh) VALUES (?, ?, ?, ?, ?)')
            .run(2, 'Khách Hàng Demo', '0987654321', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 1);
    });

    insert();
    console.log('🌱 Đã seed dữ liệu demo vào SQLite (admin@gmail.com/admin123, khach@gmail.com/khach123)');
}

initSchema();
const userCount = db.prepare('SELECT COUNT(*) AS c FROM tai_khoan').get().c;
if (userCount === 0) seed();

// ---------- query(): mô phỏng API của mysql2 (Promise) ----------
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            // NOW() (MySQL) -> CURRENT_TIMESTAMP (SQLite)
            sql = sql.replace(/\bNOW\(\)/gi, 'CURRENT_TIMESTAMP');

            // Cú pháp bulk insert kiểu MySQL: "INSERT ... VALUES ?" với mảng 2 chiều
            if (/VALUES\s+\?/i.test(sql) && Array.isArray(params) && params.length === 1 && Array.isArray(params[0])) {
                const rows = params[0];
                const placeholders = rows.map(r => '(' + r.map(() => '?').join(', ') + ')').join(', ');
                const newSql = sql.replace(/VALUES\s+\?/i, 'VALUES ' + placeholders);
                const info = db.prepare(newSql).run(...rows.flat());
                return resolve({ insertId: Number(info.lastInsertRowid), affectedRows: info.changes });
            }

            const isWrite = /^\s*(INSERT|UPDATE|DELETE|REPLACE)/i.test(sql);
            if (isWrite) {
                const info = db.prepare(sql).run(...params);
                resolve({ insertId: Number(info.lastInsertRowid), affectedRows: info.changes });
            } else {
                resolve(db.prepare(sql).all(...params));
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { query, db };
