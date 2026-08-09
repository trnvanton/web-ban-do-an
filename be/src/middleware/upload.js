const path = require('path');
const multer = require('multer');
const { fail } = require('../utils/response');

// Chỉ cho phép đúng các định dạng ảnh - chặn upload file độc hại (.php, .exe, ...)
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Lưu vào be/public/uploads (phục vụ tại đường dẫn /uploads)
        cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        // Tên file duy nhất theo timestamp - tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    if (ALLOWED_EXT.includes(ext) && isImage) {
        cb(null, true);
    } else {
        const err = new Error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)!');
        err.status = 400;
        cb(err);
    }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = { upload };
