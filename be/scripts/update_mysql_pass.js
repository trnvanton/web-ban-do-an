const db = require('../src/config/db-mysql');
(async () => {
    try {
        await db.query("UPDATE tai_khoan SET mat_khau = 'admin123' WHERE email = 'admin@gmail.com'");
        await db.query("UPDATE tai_khoan SET mat_khau = 'khach123' WHERE email = 'khach@gmail.com'");
        console.log('✅ Đã cập nhật mật khẩu MySQL thành admin123 và khach123');
    } catch (e) {
        console.error('Lỗi:', e.message);
    }
    process.exit(0);
})();
