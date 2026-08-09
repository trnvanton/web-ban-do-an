const express = require('express');
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ok, fail } = require('../utils/response');
const { sanitize, isRequired } = require('../middleware/validate');

const router = express.Router();

// ================= MÓN ĂN & GỢI Ý THỰC ĐƠN =================

// Lấy danh sách món ăn (công khai)
router.get('/mon-an', async (req, res) => {
    try {
        const results = await query('SELECT * FROM mon_an ORDER BY id DESC');
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Gợi ý món ăn theo từ khóa (công khai)
router.get('/goi-y-mon-an', async (req, res) => {
    const keyword = sanitize(req.query.keyword || '', 100);
    try {
        let sql = 'SELECT * FROM mon_an';
        const params = [];
        if (keyword) {
            sql += ' WHERE ten_mon LIKE ? OR nguyen_lieu_chinh LIKE ? OR cong_thuc LIKE ?';
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }
        const results = await query(sql, params);
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi gợi ý món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= MÓN ĂN - ADMIN =================

router.post('/admin/them-mon-an', requireAdmin, upload.single('hinh_anh'), async (req, res) => {
    const ten_mon = sanitize(req.body.ten_mon);
    const nguyen_lieu_chinh = sanitize(req.body.nguyen_lieu_chinh);
    const cong_thuc = sanitize(req.body.cong_thuc, 2000);
    const loai_mon = sanitize(req.body.loai_mon);
    const hinh_anh = req.file ? req.file.filename : 'fruite-item-1.jpg';

    if (!isRequired(ten_mon)) return fail(res, 400, 'Tên món ăn không được để trống!');

    try {
        const result = await query(
            'INSERT INTO mon_an (ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (?, ?, ?, ?, ?)',
            [ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon || 'Món mặn']
        );
        ok(res, 'Thêm món ăn thành công!', { id: result.insertId });
    } catch (err) {
        console.error('❌ Lỗi thêm món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

router.put('/admin/sua-mon-an/:id', requireAdmin, upload.single('hinh_anh'), async (req, res) => {
    const { id } = req.params;
    const ten_mon = sanitize(req.body.ten_mon);
    const nguyen_lieu_chinh = sanitize(req.body.nguyen_lieu_chinh);
    const cong_thuc = sanitize(req.body.cong_thuc, 2000);
    const loai_mon = sanitize(req.body.loai_mon);

    if (!isRequired(ten_mon)) return fail(res, 400, 'Tên món ăn không được để trống!');

    try {
        let sql = 'UPDATE mon_an SET ten_mon = ?, nguyen_lieu_chinh = ?, cong_thuc = ?, loai_mon = ?';
        const params = [ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon || 'Món mặn'];
        if (req.file) {
            sql += ', hinh_anh = ?';
            params.push(req.file.filename);
        }
        sql += ' WHERE id = ?';
        params.push(id);

        await query(sql, params);
        ok(res, 'Cập nhật món ăn thành công!');
    } catch (err) {
        console.error('❌ Lỗi sửa món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

router.delete('/admin/xoa-mon-an/:id', requireAdmin, async (req, res) => {
    try {
        await query('DELETE FROM mon_an WHERE id = ?', [req.params.id]);
        ok(res, 'Xóa món ăn thành công!');
    } catch (err) {
        console.error('❌ Lỗi xóa món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
