require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const { query } = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const dishRoutes = require('./src/routes/dish.routes');
const orderRoutes = require('./src/routes/order.routes');
const addressRoutes = require('./src/routes/address.routes');
const userRoutes = require('./src/routes/user.routes');
const uploadRoutes = require('./src/routes/upload.routes');

const app = express();

// ================= CẤU HÌNH AN TOÀN CƠ BẢN =================
// Helmet: tự động set các header bảo mật HTTP (X-Frame-Options, CSP, ...)
app.use(helmet({
    contentSecurityPolicy: false // Tắt CSP vì template dùng inline script
}));

// Đọc cookie (phục vụ xác thực)
app.use(cookieParser());

// Body parser (giới hạn payload 1MB - chống request khổng lồ)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ghi log mọi request
app.use(morgan('dev'));

// Ảnh upload được lưu trong be/public/uploads, phục vụ tại /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ================= CHỐNG BRUTE-FORCE (tấn công đoán mật khẩu) =================
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 20,                  // tối đa 20 lần đăng nhập/đăng ký mỗi IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Quá nhiều lần thử! Vui lòng đợi 15 phút rồi thử lại.' }
});
app.use('/api/dang-nhap', authLimiter);
app.use('/api/dang-ky', authLimiter);

// ================= ROUTES =================
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', dishRoutes);
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', userRoutes);
app.use('/api', uploadRoutes);

// API không tồn tại -> trả JSON lỗi (không trả HTML)
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API không tồn tại!' });
});

// ================= XỬ LÝ LỖI TẬP TRUNG =================
// Lỗi từ Multer (upload ảnh) -> trả tiếng Việt rõ ràng
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE'
            ? 'Ảnh quá lớn! Tối đa 5MB.'
            : 'Lỗi upload ảnh: ' + err.message;
        return res.status(400).json({ success: false, message: msg });
    }
    if (err.status === 400 && err.message) {
        return res.status(400).json({ success: false, message: err.message });
    }
    console.error('❌ Lỗi không mong muốn:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ! Vui lòng thử lại sau.' });
});

// ================= KHỞI ĐỘNG SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('====================================================');
    console.log(` Server đang chạy tại: http://localhost:${PORT}`);
    console.log('====================================================');
});
