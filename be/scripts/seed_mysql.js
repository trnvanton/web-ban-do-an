require('dotenv').config();
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { DISHES_DATA } = require('./dishes_data');
const { PRODUCTS } = require('./seed_products');

/**
 * Format chuỗi công thức đầy đủ từ các bước thực hiện chuyên nghiệp và mẹo nấu ăn
 */
function formatCongThuc(dish) {
    if (!dish.cac_buoc_thuc_hien || !Array.isArray(dish.cac_buoc_thuc_hien)) {
        return '';
    }
    const stepsText = dish.cac_buoc_thuc_hien.map(s => {
        const timeBadge = s.thoi_gian ? ` - ⏱️ ${s.thoi_gian}` : '';
        return `[Bước ${s.buoc}: ${s.tieu_de}${timeBadge}]\n${s.noi_dung}`;
    }).join('\n\n');

    const tip = dish.meo_nau_an ? `\n\n💡 Mẹo đầu bếp: ${dish.meo_nau_an}` : '';
    return stepsText + tip;
}

/**
 * Format chuỗi nguyên liệu chính chi tiết
 */
function formatNguyenLieuChinh(dish) {
    if (!dish.nguyen_lieu_chi_tiet || !Array.isArray(dish.nguyen_lieu_chi_tiet)) {
        return '';
    }
    return dish.nguyen_lieu_chi_tiet.map(n => {
        if (n.so_luong && n.don_vi) {
            return `${n.ten} (${n.so_luong} ${n.don_vi})`;
        }
        return n.ten;
    }).join(', ');
}

async function seedMySQL() {
    console.log('====================================================');
    console.log('🚀 BẮT ĐẦU SEED DỮ LIỆU MÓN ĂN CHUYÊN NGHIỆP VÀO MYSQL');
    console.log('====================================================');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'web_ban_do_an',
        charset: 'utf8mb4'
    });

    console.log('✅ Đã kết nối MySQL thành công.');

    // 1. Đảm bảo bảng mon_an có đầy đủ các cột mới
    const columns = [
        { name: 'mo_ta', type: 'TEXT' },
        { name: 'do_kho', type: 'VARCHAR(50) DEFAULT "Dễ"' },
        { name: 'khau_phan', type: 'VARCHAR(50) DEFAULT "2 - 3 người"' },
        { name: 'thoi_gian_chuan_bi', type: 'INT DEFAULT 10' },
        { name: 'thoi_gian_nau', type: 'INT DEFAULT 15' },
        { name: 'nguyen_lieu_chi_tiet', type: 'LONGTEXT' },
        { name: 'cac_buoc_thuc_hien', type: 'LONGTEXT' },
        { name: 'meo_nau_an', type: 'TEXT' },
        { name: 'dinh_duong', type: 'LONGTEXT' },
        { name: 'tags', type: 'LONGTEXT' }
    ];

    const [existingCols] = await connection.query('SHOW COLUMNS FROM mon_an');
    const existingColNames = existingCols.map(c => c.Field);

    for (const col of columns) {
        if (!existingColNames.includes(col.name)) {
            await connection.query(`ALTER TABLE mon_an ADD COLUMN ${col.name} ${col.type}`);
            console.log(`➕ Đã thêm cột '${col.name}' vào bảng mon_an (MySQL)`);
        }
    }

    // Đảm bảo cột cong_thuc và cac_buoc_thuc_hien là LONGTEXT để chứa đủ các bước chi tiết
    await connection.query('ALTER TABLE mon_an MODIFY COLUMN cong_thuc LONGTEXT');
    await connection.query('ALTER TABLE mon_an MODIFY COLUMN nguyen_lieu_chinh TEXT');

    // 2. Cập nhật toàn bộ 52 món ăn
    let updatedCount = 0;
    const dishIds = Object.keys(DISHES_DATA);

    for (const idStr of dishIds) {
        const id = parseInt(idStr, 10);
        const dish = DISHES_DATA[idStr];
        const fullCongThuc = formatCongThuc(dish);
        const fullNguyenLieu = formatNguyenLieuChinh(dish);

        const [res] = await connection.query(`
            UPDATE mon_an SET
                nguyen_lieu_chinh = ?,
                cong_thuc = ?,
                mo_ta = ?,
                do_kho = ?,
                khau_phan = ?,
                thoi_gian_chuan_bi = ?,
                thoi_gian_nau = ?,
                nguyen_lieu_chi_tiet = ?,
                cac_buoc_thuc_hien = ?,
                meo_nau_an = ?,
                dinh_duong = ?,
                tags = ?
            WHERE id = ?
        `, [
            fullNguyenLieu,
            fullCongThuc,
            dish.mo_ta,
            dish.do_kho,
            dish.khau_phan,
            dish.thoi_gian_chuan_bi,
            dish.thoi_gian_nau,
            JSON.stringify(dish.nguyen_lieu_chi_tiet),
            JSON.stringify(dish.cac_buoc_thuc_hien),
            dish.meo_nau_an,
            JSON.stringify(dish.dinh_duong),
            JSON.stringify(dish.tags),
            id
        ]);

        if (res.affectedRows > 0) {
            updatedCount++;
        }
    }

    console.log(`✅ CẬP NHẬT MÓN ĂN MYSQL HOÀN TẤT: ${updatedCount}/${dishIds.length} món ăn.`);

    // 3. Cập nhật 16 sản phẩm (Món ăn chế biến sẵn + Meal-kit + Đồ uống)
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
    console.log(`✅ CẬP NHẬT SẢN PHẨM MYSQL HOÀN TẤT: ${PRODUCTS.length} sản phẩm.`);

    await connection.end();
}

function syncSQLite() {
    console.log('\n----------------------------------------------------');
    console.log('🔄 ĐỒNG BỘ DỮ LIỆU SANG SQLITE (data/app.db)');
    console.log('----------------------------------------------------');

    const dbPath = path.join(__dirname, '..', 'data', process.env.DB_FILE || 'app.db');
    if (!fs.existsSync(dbPath)) {
        console.log('⚠️ Không tìm thấy file SQLite tại:', dbPath);
        return;
    }

    try {
        const db = new Database(dbPath);
        const tableInfo = db.prepare('PRAGMA table_info(mon_an)').all();
        const existingColNames = tableInfo.map(c => c.name);

        const columns = [
            { name: 'mo_ta', type: 'TEXT' },
            { name: 'do_kho', type: 'TEXT DEFAULT "Dễ"' },
            { name: 'khau_phan', type: 'TEXT DEFAULT "2 - 3 người"' },
            { name: 'thoi_gian_chuan_bi', type: 'INTEGER DEFAULT 10' },
            { name: 'thoi_gian_nau', type: 'INTEGER DEFAULT 15' },
            { name: 'nguyen_lieu_chi_tiet', type: 'TEXT' },
            { name: 'cac_buoc_thuc_hien', type: 'TEXT' },
            { name: 'meo_nau_an', type: 'TEXT' },
            { name: 'dinh_duong', type: 'TEXT' },
            { name: 'tags', type: 'TEXT' }
        ];

        for (const col of columns) {
            if (!existingColNames.includes(col.name)) {
                db.exec(`ALTER TABLE mon_an ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        const updateStmt = db.prepare(`
            UPDATE mon_an SET
                nguyen_lieu_chinh = ?,
                cong_thuc = ?,
                mo_ta = ?,
                do_kho = ?,
                khau_phan = ?,
                thoi_gian_chuan_bi = ?,
                thoi_gian_nau = ?,
                nguyen_lieu_chi_tiet = ?,
                cac_buoc_thuc_hien = ?,
                meo_nau_an = ?,
                dinh_duong = ?,
                tags = ?
            WHERE id = ?
        `);

        let updatedCount = 0;
        const transaction = db.transaction(() => {
            for (const [idStr, dish] of Object.entries(DISHES_DATA)) {
                const id = parseInt(idStr, 10);
                const fullCongThuc = formatCongThuc(dish);
                const fullNguyenLieu = formatNguyenLieuChinh(dish);

                const res = updateStmt.run(
                    fullNguyenLieu,
                    fullCongThuc,
                    dish.mo_ta,
                    dish.do_kho,
                    dish.khau_phan,
                    dish.thoi_gian_chuan_bi,
                    dish.thoi_gian_nau,
                    JSON.stringify(dish.nguyen_lieu_chi_tiet),
                    JSON.stringify(dish.cac_buoc_thuc_hien),
                    dish.meo_nau_an,
                    JSON.stringify(dish.dinh_duong),
                    JSON.stringify(dish.tags),
                    id
                );
                if (res.changes > 0) updatedCount++;
            }
        });

        transaction();
        console.log(`✅ CẬP NHẬT MÓN ĂN SQLITE HOÀN TẤT: ${updatedCount}/${Object.keys(DISHES_DATA).length} món ăn.`);

        // Seed sản phẩm vào SQLite
        const checkProdStmt = db.prepare('SELECT id FROM san_pham WHERE id = ?');
        const updateProdStmt = db.prepare(`
            UPDATE san_pham SET
                ten_san_pham = ?,
                danh_muc = ?,
                gia = ?,
                so_luong_ton = ?,
                hinh_anh = ?,
                mo_ta = ?
            WHERE id = ?
        `);
        const insertProdStmt = db.prepare(`
            INSERT INTO san_pham (id, ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        db.transaction(() => {
            for (const p of PRODUCTS) {
                const row = checkProdStmt.get(p.id);
                if (row) {
                    updateProdStmt.run(p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta, p.id);
                } else {
                    insertProdStmt.run(p.id, p.ten_san_pham, p.danh_muc, p.gia, p.so_luong_ton, p.hinh_anh, p.mo_ta);
                }
            }
        })();

        console.log(`✅ CẬP NHẬT SẢN PHẨM SQLITE HOÀN TẤT: ${PRODUCTS.length} sản phẩm.`);
        db.close();
    } catch (err) {
        console.error('❌ Lỗi SQLite:', err.message);
    }
}

async function exportDumps() {
    console.log('\n----------------------------------------------------');
    console.log('📦 XUẤT FILE MYSQL_SYNC.SQL VÀ CLOUDFLARE D1');
    console.log('----------------------------------------------------');
    const { execSync } = require('child_process');
    try {
        const scriptPath = path.join(__dirname, 'export_mysql_to_d1.js');
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error('⚠️ Không thể tự động chạy export_mysql_to_d1:', e.message);
    }
}

async function main() {
    try {
        await seedMySQL();
        syncSQLite();
        await exportDumps();
        console.log('\n🎉 HOÀN THÀNH 100% NÂNG CẤP TOÀN BỘ CƠ SỞ DỮ LIỆU MÓN ĂN!\n');
    } catch (err) {
        console.error('❌ Thất bại:', err);
    }
}

main();
