const express = require('express');
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const { ok, fail } = require('../utils/response');

const router = express.Router();

// Danh sách tài khoản - chỉ admin
// KHÔNG trả mat_khau ra ngoài (dù đã hash vẫn không nên lộ)
router.get('/admin/tai-khoan', requireAdmin, async (req, res) => {
    try {
        const results = await query(
            'SELECT id, ho_ten, email, vai_tro, ngay_tao FROM tai_khoan ORDER BY id DESC'
        );
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy danh sách tài khoản:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
