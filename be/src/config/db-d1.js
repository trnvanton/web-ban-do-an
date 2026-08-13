// ============================================================
// Driver CSDL cho Cloudflare D1 (Serverless SQLite)
// ============================================================

let currentEnvDb = null;

function setD1Database(envDb) {
    currentEnvDb = envDb;
}

function query(sql, params = []) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = currentEnvDb || (globalThis.env && globalThis.env.DB);
            if (!db) {
                if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Cloudflare-Workers')) {
                    console.error('❌ Cloudflare D1 binding "env.DB" chưa được khởi tạo!');
                    return resolve([]);
                }
                const sqliteDriver = require('./db-sqlite');
                return resolve(await sqliteDriver.query(sql, params));
            }

            // NOW() (MySQL) -> CURRENT_TIMESTAMP (SQLite)
            sql = sql.replace(/\bNOW\(\)/gi, 'CURRENT_TIMESTAMP');

            const isWrite = /^\s*(INSERT|UPDATE|DELETE|REPLACE)/i.test(sql);

            // Cú pháp bulk insert: "INSERT ... VALUES ?" với mảng 2 chiều
            if (/VALUES\s+\?/i.test(sql) && Array.isArray(params) && params.length === 1 && Array.isArray(params[0])) {
                const rows = params[0];
                const placeholders = rows.map(r => '(' + r.map(() => '?').join(', ') + ')').join(', ');
                const newSql = sql.replace(/VALUES\s+\?/i, 'VALUES ' + placeholders);
                const stmt = db.prepare(newSql).bind(...rows.flat());
                const info = await stmt.run();
                return resolve({ insertId: info.meta ? info.meta.last_row_id : 0, affectedRows: info.meta ? info.meta.changes : 0 });
            }

            let stmt = db.prepare(sql);
            if (Array.isArray(params) && params.length > 0) {
                stmt = stmt.bind(...params);
            }

            if (isWrite) {
                const info = await stmt.run();
                resolve({ insertId: info.meta ? info.meta.last_row_id : 0, affectedRows: info.meta ? info.meta.changes : 0 });
            } else {
                const res = await stmt.all();
                resolve((res && res.results) ? res.results : []);
            }
        } catch (err) {
            console.error('Lỗi D1 query:', err);
            reject(err);
        }
    });
}

module.exports = { query, setD1Database };
