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
    db.pragma('foreign_keys = OFF');

    // 1. Tạo các bảng độc lập (Parent Tables)
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
        CREATE TABLE IF NOT EXISTS nguyen_lieu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ten_nguyen_lieu TEXT NOT NULL,
            loai TEXT DEFAULT 'Khác'
        );
    `);

    // Sửa các ID không hợp lệ trong dinh_luong (nếu có trong dữ liệu SQLite cũ) trước khi kiểm tra FK
    try {
        const nguyenLieuRows = db.prepare('SELECT id FROM nguyen_lieu').all();
        if (nguyenLieuRows.length > 0) {
            const validIds = new Set(nguyenLieuRows.map(r => r.id));
            const dinhLuongs = db.prepare('SELECT * FROM dinh_luong').all();
            const autoMap = { 8: 18, 5: 15, 3: 13, 9: 19 };
            for (const dl of dinhLuongs) {
                if (!validIds.has(dl.id_nguyen_lieu)) {
                    const targetId = (autoMap[dl.id_nguyen_lieu] && validIds.has(autoMap[dl.id_nguyen_lieu]))
                        ? autoMap[dl.id_nguyen_lieu]
                        : nguyenLieuRows[0].id;
                    db.prepare('UPDATE dinh_luong SET id_nguyen_lieu = ? WHERE id = ?').run(targetId, dl.id);
                }
            }
        }
    } catch (e) {
        // Bảng chưa khởi tạo
    }

    // 2. Định nghĩa các bảng con kèm theo ràng buộc KHÓA NGOẠI (Foreign Keys)
    const tablesToUpgrade = [
        {
            name: 'don_hang',
            createSql: `
                CREATE TABLE don_hang (
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
            `,
            columns: ['id', 'user_id', 'ten_khach_hang', 'so_dien_thoai', 'dia_chi', 'tong_tien', 'trang_thai', 'phuong_thuc_thanh_toan', 'trang_thai_thanh_toan', 'ngay_dat']
        },
        {
            name: 'chi_tiet_don_hang',
            createSql: `
                CREATE TABLE chi_tiet_don_hang (
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
            `,
            columns: ['id', 'don_hang_id', 'product_id', 'ten_san_pham', 'gia', 'so_luong', 'hinh_anh']
        },
        {
            name: 'danh_gia',
            createSql: `
                CREATE TABLE danh_gia (
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
            `,
            columns: ['id', 'user_id', 'product_id', 'don_hang_id', 'so_sao', 'noi_dung', 'ten_user', 'ngay_danh_gia']
        },
        {
            name: 'dia_chi_giao_hang',
            createSql: `
                CREATE TABLE dia_chi_giao_hang (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    ho_ten TEXT NOT NULL,
                    sdt TEXT NOT NULL,
                    dia_chi TEXT NOT NULL,
                    mac_dinh INTEGER NOT NULL DEFAULT 0,
                    ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES tai_khoan(id) ON DELETE CASCADE ON UPDATE CASCADE
                );
            `,
            columns: ['id', 'user_id', 'ho_ten', 'sdt', 'dia_chi', 'mac_dinh', 'ngay_tao']
        },
        {
            name: 'dinh_luong',
            createSql: `
                CREATE TABLE dinh_luong (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_mon INTEGER NOT NULL,
                    id_nguyen_lieu INTEGER NOT NULL,
                    ham_luong TEXT DEFAULT '',
                    FOREIGN KEY (id_mon) REFERENCES mon_an(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_nguyen_lieu) REFERENCES nguyen_lieu(id) ON DELETE CASCADE ON UPDATE CASCADE
                );
            `,
            columns: ['id', 'id_mon', 'id_nguyen_lieu', 'ham_luong']
        }
    ];

    for (const table of tablesToUpgrade) {
        const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table.name);
        if (!tableExists) {
            db.exec(table.createSql);
        } else {
            const fkList = db.prepare(`PRAGMA foreign_key_list(${table.name})`).all();
            if (fkList.length === 0) {
                // Nâng cấp bảng cũ sang bảng mới có Khóa Ngoại mà KHÔNG làm mất dữ liệu
                db.transaction(() => {
                    db.exec(`ALTER TABLE ${table.name} RENAME TO ${table.name}_old;`);
                    db.exec(table.createSql);
                    const oldCols = db.prepare(`PRAGMA table_info(${table.name}_old)`).all().map(c => c.name);
                    const commonCols = table.columns.filter(col => oldCols.includes(col));
                    if (commonCols.length > 0) {
                        const colsStr = commonCols.join(', ');
                        db.exec(`INSERT INTO ${table.name} (${colsStr}) SELECT ${colsStr} FROM ${table.name}_old;`);
                    }
                    db.exec(`DROP TABLE ${table.name}_old;`);
                })();
            }
        }
    }

    db.pragma('foreign_keys = ON');

    const fkChecks = db.pragma('foreign_key_check');
    if (fkChecks.length > 0) {
        console.warn('⚠️ Cảnh báo toàn vẹn khóa ngoại:', fkChecks);
    } else {
        console.log('🔗 Tất cả các bảng đã được nâng cấp liên kết qua Khóa ngoại (Foreign Keys) thành công!');
    }
}

// ---------- Seed nguyên liệu & định lượng ----------
function seedIngredients() {
    const count = db.prepare('SELECT COUNT(*) AS c FROM nguyen_lieu').get().c;
    if (count > 0 && count >= 50) return;

    db.exec('DELETE FROM nguyen_lieu; DELETE FROM dinh_luong;');

    const insert = db.transaction(() => {
        const ingredients = [
            // Thịt & Hải sản
            ['Trứng', 'Thịt & Hải sản'],
            ['Thịt bò', 'Thịt & Hải sản'],
            ['Thịt ba chỉ', 'Thịt & Hải sản'],
            ['Trứng cút', 'Thịt & Hải sản'],
            ['Cá lóc (hoặc cá basa)', 'Thịt & Hải sản'],
            ['Thịt gà', 'Thịt & Hải sản'],
            ['Thịt băm', 'Thịt & Hải sản'],
            ['Sườn heo', 'Thịt & Hải sản'],
            ['Tôm tươi', 'Thịt & Hải sản'],
            ['Mực tươi', 'Thịt & Hải sản'],
            ['Cua đồng / Cua biển', 'Thịt & Hải sản'],
            ['Thịt bò nạc', 'Thịt & Hải sản'],
            ['Chả lụa / Giò lụa', 'Thịt & Hải sản'],
            ['Lạp xưởng', 'Thịt & Hải sản'],
            ['Cá hồi', 'Thịt & Hải sản'],
            ['Cá diêu hồng', 'Thịt & Hải sản'],
            ['Nghêu / Nghêu hấp', 'Thịt & Hải sản'],
            ['Bạch tuộc', 'Thịt & Hải sản'],
            ['Trứng vịt', 'Thịt & Hải sản'],
            ['Thịt thăn lợn', 'Thịt & Hải sản'],

            // Rau củ quả
            ['Cà chua', 'Rau củ quả'],
            ['Hành lá', 'Rau củ quả'],
            ['Bông cải xanh', 'Rau củ quả'],
            ['Hành tây', 'Rau củ quả'],
            ['Cần tây', 'Rau củ quả'],
            ['Mộc nhĩ', 'Rau củ quả'],
            ['Ớt chuông', 'Rau củ quả'],
            ['Rau muống', 'Rau củ quả'],
            ['Cà rốt', 'Rau củ quả'],
            ['Khoai tây', 'Rau củ quả'],
            ['Bắp cải', 'Rau củ quả'],
            ['Bí đỏ', 'Rau củ quả'],
            ['Bí đao', 'Rau củ quả'],
            ['Su su', 'Rau củ quả'],
            ['Măng tây', 'Rau củ quả'],
            ['Đậu hà lan', 'Rau củ quả'],
            ['Nấm hương', 'Rau củ quả'],
            ['Nấm kim châm', 'Rau củ quả'],
            ['Dưa leo / Dưa chuột', 'Rau củ quả'],
            ['Giá đỗ', 'Rau củ quả'],
            ['Ngò rí / Rau mùi', 'Rau củ quả'],
            ['Rau tía tô / Rau sống', 'Rau củ quả'],
            ['Cải thìa / Cải ngọt', 'Rau củ quả'],
            ['Dứa / Thơm', 'Rau củ quả'],
            ['Me chua / Bạc hà', 'Rau củ quả'],
            ['Khoai lang', 'Rau củ quả'],
            ['Bắp / Ngô ngọt', 'Rau củ quả'],
            ['Khổ qua / Trái đắng', 'Rau củ quả'],
            ['Xà lách', 'Rau củ quả'],

            // Gia vị
            ['Tỏi', 'Gia vị'],
            ['Đường', 'Gia vị'],
            ['Nước mắm', 'Gia vị'],
            ['Nước hàng', 'Gia vị'],
            ['Ớt', 'Gia vị'],
            ['Giấm', 'Gia vị'],
            ['Hạt nêm', 'Gia vị'],
            ['Muối', 'Gia vị'],
            ['Tiêu xay', 'Gia vị'],
            ['Dầu ăn', 'Gia vị'],
            ['Dầu hào', 'Gia vị'],
            ['Xì dầu / Nước tương', 'Gia vị'],
            ['Mắm tôm', 'Gia vị'],
            ['Mắm nêm', 'Gia vị'],
            ['Gừng', 'Gia vị'],
            ['Sả', 'Gia vị'],
            ['Bột ngọt (Mì chính)', 'Gia vị'],
            ['Ngũ vị hương', 'Gia vị'],
            ['Mật ong', 'Gia vị'],

            // Đậu & Thực vật
            ['Đậu hũ', 'Đậu & Thực vật'],
            ['Đậu xanh', 'Đậu & Thực vật'],
            ['Đậu đỏ', 'Đậu & Thực vật'],
            ['Đậu nành', 'Đậu & Thực vật'],
            ['Đậu cove', 'Đậu & Thực vật'],

            // Khác
            ['Nước dừa', 'Khác'],
            ['Miến', 'Khác'],
            ['Bánh đa nem', 'Khác'],
            ['Gạo / Cơm', 'Khác'],
            ['Bún tươi', 'Khác'],
            ['Bánh mì', 'Khác']
        ];

        const insIng = db.prepare('INSERT INTO nguyen_lieu (ten_nguyen_lieu, loai) VALUES (?, ?)');
        ingredients.forEach(i => insIng.run(...i));

        const getIngIdByName = (name) => {
            const row = db.prepare('SELECT id FROM nguyen_lieu WHERE ten_nguyen_lieu = ? OR ten_nguyen_lieu LIKE ?').get(name, `${name}%`);
            return row ? row.id : null;
        };

        const dinhLuongConfig = [
            [1, 'Sườn heo'], [1, 'Gạo / Cơm'], [1, 'Tỏi'],
            [2, 'Cá lóc (hoặc cá basa)'], [2, 'Cà chua'], [2, 'Me chua / Bạc hà'],
            [3, 'Thịt ba chỉ'], [3, 'Tôm tươi'], [3, 'Cà rốt'],
            [4, 'Nước dừa']
        ];
        const insDL = db.prepare('INSERT INTO dinh_luong (id_mon, id_nguyen_lieu) VALUES (?, ?)');
        for (const [id_mon, name] of dinhLuongConfig) {
            const id_nguyen_lieu = getIngIdByName(name);
            if (id_nguyen_lieu) {
                insDL.run(id_mon, id_nguyen_lieu);
            }
        }
    });

    insert();
    console.log('🥦 Đã khởi tạo 80+ nguyên liệu & định lượng đầy đủ vào cơ sở dữ liệu!');
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
console.log('✅ Đã kết nối cơ sở dữ liệu SQLite thành công!');
const userCount = db.prepare('SELECT COUNT(*) AS c FROM tai_khoan').get().c;
if (userCount === 0) seed();
seedIngredients();

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
