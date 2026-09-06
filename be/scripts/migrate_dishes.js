require('dotenv').config();
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { DISHES_DATA } = require('./dishes_data');

async function migrateMySQL() {
    console.log('\n--- 1. BẮT ĐẦU MIGRATION MYSQL ---');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'web_ban_do_an',
            charset: 'utf8mb4'
        });

        console.log('✅ Đã kết nối MySQL thành công.');

        // Kiểm tra và thêm các cột mới vào mon_an nếu chưa có
        const newColumns = [
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

        // Lấy danh sách cột hiện tại của mon_an
        const [existingCols] = await connection.query('SHOW COLUMNS FROM mon_an');
        const existingColNames = existingCols.map(c => c.Field);

        for (const col of newColumns) {
            if (!existingColNames.includes(col.name)) {
                await connection.query(`ALTER TABLE mon_an ADD COLUMN ${col.name} ${col.type}`);
                console.log(`➕ Đã thêm cột '${col.name}' vào bảng mon_an (MySQL)`);
            }
        }

        // Cập nhật dữ liệu cho tất cả món ăn
        let updatedCount = 0;
        for (const [idStr, data] of Object.entries(DISHES_DATA)) {
            const id = parseInt(idStr, 10);
            
            // Format công thức chi tiết dạng text
            const stepsText = data.cac_buoc_thuc_hien ? data.cac_buoc_thuc_hien.map(s => {
                const timeBadge = s.thoi_gian ? ` - ⏱️ ${s.thoi_gian}` : '';
                return `[Bước ${s.buoc}: ${s.tieu_de}${timeBadge}]\n${s.noi_dung}`;
            }).join('\n\n') : '';
            const fullCongThuc = stepsText + (data.meo_nau_an ? `\n\n💡 Mẹo đầu bếp: ${data.meo_nau_an}` : '');

            // Format nguyên liệu chính chi tiết dạng text
            const fullNguyenLieu = data.nguyen_lieu_chi_tiet ? data.nguyen_lieu_chi_tiet.map(n => {
                return (n.so_luong && n.don_vi) ? `${n.ten} (${n.so_luong} ${n.don_vi})` : n.ten;
            }).join(', ') : '';

            const [result] = await connection.query(`
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
                data.mo_ta,
                data.do_kho,
                data.khau_phan,
                data.thoi_gian_chuan_bi,
                data.thoi_gian_nau,
                JSON.stringify(data.nguyen_lieu_chi_tiet),
                JSON.stringify(data.cac_buoc_thuc_hien),
                data.meo_nau_an,
                JSON.stringify(data.dinh_duong),
                JSON.stringify(data.tags),
                id
            ]);

            if (result.affectedRows > 0) {
                updatedCount++;
            }
        }

        console.log(`🎉 Đã cập nhật thành công ${updatedCount}/${Object.keys(DISHES_DATA).length} món ăn vào MySQL.`);
        await connection.end();
    } catch (err) {
        console.error('❌ Lỗi migration MySQL:', err.message);
    }
}

function migrateSQLite() {
    console.log('\n--- 2. BẮT ĐẦU MIGRATION SQLITE (data/app.db) ---');
    const dbPath = path.join(__dirname, '..', 'data', process.env.DB_FILE || 'app.db');
    if (!fs.existsSync(dbPath)) {
        console.log('⚠️ Không tìm thấy file SQLite tại:', dbPath);
        return;
    }

    try {
        const db = new Database(dbPath);
        const tableInfo = db.prepare('PRAGMA table_info(mon_an)').all();
        const existingColNames = tableInfo.map(c => c.name);

        const newColumns = [
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

        for (const col of newColumns) {
            if (!existingColNames.includes(col.name)) {
                db.exec(`ALTER TABLE mon_an ADD COLUMN ${col.name} ${col.type}`);
                console.log(`➕ Đã thêm cột '${col.name}' vào bảng mon_an (SQLite)`);
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
            for (const [idStr, data] of Object.entries(DISHES_DATA)) {
                const id = parseInt(idStr, 10);
                const stepsText = data.cac_buoc_thuc_hien ? data.cac_buoc_thuc_hien.map(s => {
                    const timeBadge = s.thoi_gian ? ` - ⏱️ ${s.thoi_gian}` : '';
                    return `[Bước ${s.buoc}: ${s.tieu_de}${timeBadge}]\n${s.noi_dung}`;
                }).join('\n\n') : '';
                const fullCongThuc = stepsText + (data.meo_nau_an ? `\n\n💡 Mẹo đầu bếp: ${data.meo_nau_an}` : '');

                const fullNguyenLieu = data.nguyen_lieu_chi_tiet ? data.nguyen_lieu_chi_tiet.map(n => {
                    return (n.so_luong && n.don_vi) ? `${n.ten} (${n.so_luong} ${n.don_vi})` : n.ten;
                }).join(', ') : '';

                const result = updateStmt.run(
                    fullNguyenLieu,
                    fullCongThuc,
                    data.mo_ta,
                    data.do_kho,
                    data.khau_phan,
                    data.thoi_gian_chuan_bi,
                    data.thoi_gian_nau,
                    JSON.stringify(data.nguyen_lieu_chi_tiet),
                    JSON.stringify(data.cac_buoc_thuc_hien),
                    data.meo_nau_an,
                    JSON.stringify(data.dinh_duong),
                    JSON.stringify(data.tags),
                    id
                );
                if (result.changes > 0) updatedCount++;
            }
        });

        transaction();
        console.log(`🎉 Đã cập nhật thành công ${updatedCount}/${Object.keys(DISHES_DATA).length} món ăn vào SQLite.`);
        db.close();
    } catch (err) {
        console.error('❌ Lỗi migration SQLite:', err.message);
    }
}

async function run() {
    await migrateMySQL();
    migrateSQLite();
    console.log('\n=== HOÀN TẤT TOÀN BỘ MIGRATION ===\n');
}

run();
