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
        danh_muc: "Nông Sản & Nguyên Liệu",
        gia: 25000,
        so_luong_ton: 50,
        hinh_anh: "1786008268041.jpg",
        mo_ta: "Cà chua bi tươi giòn, ngọt thanh, quả tròn đều chín mọng trồng theo tiêu chuẩn hữu cơ tại nông trường Đà Lạt Lâm Đồng."
    },
    {
        id: 15,
        ten_san_pham: "Khoai Tây Đà Lạt Tươi Sạch (Túi 1kg)",
        danh_muc: "Nông Sản & Nguyên Liệu",
        gia: 35000,
        so_luong_ton: 45,
        hinh_anh: "1786008327361.jpg",
        mo_ta: "Khoai tây vàng ruột dẻo thơm, không mọc mầm, giàu vitamin C và khoáng chất, thích hợp làm các món xào, súp hầm hoặc chiên giòn."
    },
    {
        id: 16,
        ten_san_pham: "Bông Cải Xanh Đà Lạt (Cây 400g)",
        danh_muc: "Nông Sản & Nguyên Liệu",
        gia: 30000,
        so_luong_ton: 35,
        hinh_anh: "vegetable-item-6.jpg",
        mo_ta: "Bông cải xanh (súp lơ xanh) bông to chắc, búp xanh mướt giòn ngọt tự nhiên, giàu chất xơ, vitamin K và chất chống oxy hóa."
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
