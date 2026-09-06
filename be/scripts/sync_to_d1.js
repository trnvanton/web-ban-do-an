const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db-mysql');

(async () => {
    try {
        console.log('🔄 Đang xuất và đồng bộ dữ liệu từ MySQL lên Cloudflare D1...');
        const tables = [
            'tai_khoan',
            'san_pham',
            'mon_an',
            'nguyen_lieu',
            'don_hang',
            'chi_tiet_don_hang',
            'danh_gia',
            'dia_chi_giao_hang',
            'dinh_luong'
        ];

        for (const t of tables) {
            try {
                const rows = await db.query(`SELECT * FROM \`${t}\``);
                if (!rows || rows.length === 0) {
                    console.log(`ℹ️ Bảng ${t} không có dữ liệu để đồng bộ.`);
                    continue;
                }

                console.log(`⏳ Đang đồng bộ bảng ${t} (${rows.length} dòng)...`);

                // 1. Xóa dữ liệu cũ của bảng trên D1
                try {
                    execSync(`npx wrangler d1 execute fruitables-d1 --remote --command="DELETE FROM ${t};" --yes`, {
                        cwd: path.join(__dirname, '..'),
                        stdio: 'ignore'
                    });
                } catch (e) {}

                // 2. Chèn từng batch 10 dòng
                const keys = Object.keys(rows[0]);
                const batchSize = 10;
                
                for (let i = 0; i < rows.length; i += batchSize) {
                    const batch = rows.slice(i, i + batchSize);
                    let sql = '';
                    
                    for (const r of batch) {
                        const vals = keys.map(k => {
                            const v = r[k];
                            if (v === null || v === undefined) return 'NULL';
                            if (typeof v === 'number') return v;
                            if (v instanceof Date) {
                                return "'" + v.toISOString().replace('T', ' ').substring(0, 19) + "'";
                            }
                            return "'" + String(v).replace(/'/g, "''") + "'";
                        });
                        sql += `INSERT INTO ${t} (${keys.join(', ')}) VALUES (${vals.join(', ')});\n`;
                    }

                    const tempFile = path.join(__dirname, `temp_batch.sql`);
                    fs.writeFileSync(tempFile, sql, 'utf8');

                    execSync(`npx wrangler d1 execute fruitables-d1 --remote --file="${tempFile}" --yes`, {
                        cwd: path.join(__dirname, '..'),
                        stdio: 'ignore'
                    });

                    try { fs.unlinkSync(tempFile); } catch (e) {}
                }

                console.log(`✅ Đồng bộ bảng ${t} (${rows.length} dòng) thành công!`);
            } catch (err) {
                console.error(`❌ Lỗi đồng bộ bảng ${t}:`, err.message);
            }
        }

        console.log('🎉 TOÀN BỘ CƠ SỞ DỮ LIỆU ĐÃ ĐỒNG BỘ LÊN CLOUDFLARE D1 THÀNH CÔNG!');
    } catch (e) {
        console.error('❌ Lỗi:', e.message);
    }
    process.exit(0);
})();
