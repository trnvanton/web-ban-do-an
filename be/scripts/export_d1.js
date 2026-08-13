const fs = require('fs');
const path = require('path');
const db = require('../src/config/db-sqlite');

(async () => {
    try {
        let sql = 'PRAGMA foreign_keys = OFF;\n\n';
        const tables = ['tai_khoan', 'san_pham', 'mon_an', 'nguyen_lieu', 'don_hang', 'chi_tiet_don_hang', 'danh_gia', 'dia_chi_giao_hang', 'dinh_luong'];

        for (let t of tables) {
            try {
                const rows = await db.query('SELECT * FROM ' + t);
                if (rows && rows.length > 0) {
                    sql += `-- Bảng ${t}\n`;
                    sql += `DELETE FROM ${t};\n`;
                    const keys = Object.keys(rows[0]);
                    for (let r of rows) {
                        const vals = keys.map(k => {
                            const v = r[k];
                            if (v === null || v === undefined) return 'NULL';
                            if (typeof v === 'number') return v;
                            return "'" + String(v).replace(/'/g, "''") + "'";
                        });
                        sql += `INSERT INTO ${t} (${keys.join(', ')}) VALUES (${vals.join(', ')});\n`;
                    }
                    sql += '\n';
                }
            } catch (e) {
                console.error('Lỗi lấy dữ liệu bảng ' + t + ':', e.message);
            }
        }
        sql += 'PRAGMA foreign_keys = ON;\n';
        
        const dumpPath = path.join(__dirname, '..', 'd1_sync.sql');
        fs.writeFileSync(dumpPath, sql, 'utf8');
        console.log('✅ Đã tạo file d1_sync.sql thành công! Dung lượng:', fs.statSync(dumpPath).size, 'bytes');
    } catch (err) {
        console.error('Lỗi export:', err);
    }
    process.exit(0);
})();
