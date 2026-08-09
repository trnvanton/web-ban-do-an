// ============================================================
// Lớp truy cập dữ liệu — chọn driver qua biến môi trường:
//   DB_DRIVER=mysql  (mặc định, dùng khi deploy)
//   DB_DRIVER=sqlite (test local, không cần cài MySQL)
// Cả 2 đều export `query(sql, params)` trả Promise với kết quả
// giống nhau: { insertId, affectedRows } cho INSERT/UPDATE/DELETE,
// mảng row cho SELECT.
// ============================================================
require('dotenv').config();

const DRIVER = (process.env.DB_DRIVER || 'mysql').toLowerCase();

if (DRIVER === 'sqlite') {
    module.exports = require('./db-sqlite');
} else {
    module.exports = require('./db-mysql');
}
