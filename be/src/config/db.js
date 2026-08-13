// ============================================================
// Lớp truy cập dữ liệu — chọn driver qua biến môi trường:
//   DB_DRIVER=d1     (Cloudflare Workers D1)
//   DB_DRIVER=sqlite (test local)
//   DB_DRIVER=mysql  (MySQL server)
// ============================================================
require('dotenv').config();

const isCloudflareEnv = typeof globalThis.WebSocketPair !== 'undefined' || typeof globalThis.env !== 'undefined' || (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Cloudflare-Workers'));

const DRIVER = isCloudflareEnv ? 'd1' : (process.env.DB_DRIVER || 'sqlite').toLowerCase();

if (isCloudflareEnv || DRIVER === 'd1' || process.env.CF_PAGES || process.env.CLOUDFLARE_WORKERS) {
    module.exports = require('./db-d1');
} else if (DRIVER === 'sqlite') {
    module.exports = require('./db-sqlite');
} else {
    module.exports = require('./db-mysql');
}

