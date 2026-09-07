const path = require('path');
const multer = require('multer');

const isCloudflare = typeof globalThis.WebSocketPair !== 'undefined' || typeof globalThis.env !== 'undefined' || (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Cloudflare-Workers'));

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

let multerUpload = null;
if (!isCloudflare) {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
            },
            filename: function (req, file, cb) {
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

        multerUpload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });
    } catch (e) {
        multerUpload = null;
    }
}

const safeUpload = {
    single: (fieldName) => {
        return (req, res, next) => {
            const cType = (req.headers && (req.headers['content-type'] || '')) || '';
            if (isCloudflare || !cType.includes('multipart/form-data') || !multerUpload) {
                return next();
            }
            return multerUpload.single(fieldName)(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ success: false, message: err.message || 'Lỗi tải file ảnh!' });
                }
                next();
            });
        };
    }
};

module.exports = { upload: safeUpload };

