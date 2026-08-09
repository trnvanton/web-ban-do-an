require('dotenv').config();

const mysql = require('mysql2');

// ============ MySQL (dành cho môi trường production/deploy) ============
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'web_ban_do_an',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

pool.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Không kết nối được MySQL:', err.message);
        console.error('   Kiểm tra lại cấu hình .env hoặc chuyển DB_DRIVER=sqlite để test local.');
        return;
    }
    console.log('✅ Đã kết nối MySQL (pool):', process.env.DB_NAME || 'web_ban_do_an');
    conn.release();
});

module.exports = { query, pool };
