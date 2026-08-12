require('dotenv').config();
const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'fruitables-default-secret-key-at-least-32-chars-long';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  CẢNH BÁO: JWT_SECRET chưa được đặt hoặc quá ngắn trong .env! Đang sử dụng khóa mặc định.');
}

// Tạo token + ghi vào cookie httpOnly (JS ở trình duyệt không đọc được -> chống đánh cắp token)
function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, vai_tro: user.vai_tro },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        path: '/'
    });
}

function clearAuthCookie(res) {
    res.clearCookie('token', { path: '/' });
}

// Đọc user từ cookie token (không trả lỗi nếu chưa đăng nhập - trả null)
function getAuthUser(req) {
    const token = req.cookies && req.cookies.token;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null; // Token hết hạn hoặc giả mạo
    }
}

// Middleware: bắt buộc phải đăng nhập
function requireAuth(req, res, next) {
    const user = getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }
    req.user = user;
    next();
}

// Middleware: bắt buộc là admin (dùng cho mọi API /api/admin/*)
function requireAdmin(req, res, next) {
    const user = getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }
    if (user.vai_tro !== 'admin') {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập tính năng này!' });
    }
    req.user = user;
    next();
}

module.exports = { signToken, setAuthCookie, clearAuthCookie, getAuthUser, requireAuth, requireAdmin };
