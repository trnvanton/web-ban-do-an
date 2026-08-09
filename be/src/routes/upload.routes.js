const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ok, fail } = require('../utils/response');

const router = express.Router();

// Upload ảnh dùng chung - chỉ admin
router.post('/admin/upload-image', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return fail(res, 400, 'Chưa chọn file ảnh!');
    }
    ok(res, 'Upload ảnh thành công!', { filename: req.file.filename });
});

module.exports = router;
