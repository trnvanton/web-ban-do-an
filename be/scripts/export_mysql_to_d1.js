const fs = require('fs');
const path = require('path');
const db = require('../src/config/db-mysql');

(async () => {
    try {
        console.log('🔄 Đang đọc dữ liệu từ MySQL (web_ban_do_an)...');
        let sql = 'PRAGMA foreign_keys = OFF;\n\n';
        const tables = ['tai_khoan', 'san_pham', 'mon_an', 'nguyen_lieu', 'don_hang', 'chi_tiet_don_hang', 'danh_gia', 'dia_chi_giao_hang', 'dinh_luong'];

        for (let t of tables) {
            try {
                const rows = await db.query(`SELECT * FROM \`${t}\``);
                if (rows && rows.length > 0) {
                    sql += `-- ================= ${t} (${rows.length} dòng) =================\n`;
                    sql += `DELETE FROM \`${t}\`;\n`;
                    const keys = Object.keys(rows[0]);
                    for (let r of rows) {
                        const vals = keys.map(k => {
                            let v = r[k];
                            if (v === null || v === undefined) return 'NULL';
                            if (typeof v === 'number') return v;
                            if (v instanceof Date) {
                                return "'" + v.toISOString().replace('T', ' ').substring(0, 19) + "'";
                            }
                            return "'" + String(v).replace(/'/g, "''") + "'";
                        });
                        sql += `INSERT INTO \`${t}\` (\`${keys.join('`, `')}\`) VALUES (${vals.join(', ')});\n`;
                    }
                    sql += '\n';
                }
            } catch (e) {
                console.error(`❌ Lỗi lấy dữ liệu bảng ${t}:`, e.message);
            }
        }
        sql += 'PRAGMA foreign_keys = ON;\n';

        const dumpPath = path.join(__dirname, '..', 'mysql_sync.sql');
        fs.writeFileSync(dumpPath, sql, 'utf8');
        console.log(`✅ Đã xuất toàn bộ dữ liệu MySQL ra mysql_sync.sql (${fs.statSync(dumpPath).size} bytes)`);
    } catch (err) {
        console.error('❌ Lỗi export MySQL:', err);
    }
    process.exit(0);
})();
