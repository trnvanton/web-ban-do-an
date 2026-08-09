const express = require('express');
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ok, fail } = require('../utils/response');
const { sanitize, isRequired, isPositiveNumber } = require('../middleware/validate');

const router = express.Router();

// ================= SẢN PHẨM (công khai) =================
router.get('/san-pham', async (req, res) => {
    try {
        const results = await query('SELECT * FROM san_pham ORDER BY id DESC');
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy sản phẩm:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Chi tiết một sản phẩm (công khai)
router.get('/san-pham/:id', async (req, res) => {
    try {
        const results = await query('SELECT * FROM san_pham WHERE id = ? LIMIT 1', [req.params.id]);
        if (results.length === 0) return fail(res, 404, 'Không tìm thấy sản phẩm!');
        ok(res, '', results[0]);
    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết sản phẩm:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= SẢN PHẨM - ADMIN =================

// Thêm sản phẩm
router.post('/admin/them-san-pham', requireAdmin, upload.single('hinh_anh'), async (req, res) => {
    const ten_san_pham = sanitize(req.body.ten_san_pham);
    const danh_muc = sanitize(req.body.danh_muc);
    const gia = req.body.gia;
    const so_luong_ton = req.body.so_luong_ton;
    const mo_ta = sanitize(req.body.mo_ta, 1000);
    const hinh_anh = req.file ? req.file.filename : 'fruite-item-1.jpg';

    if (!isRequired(ten_san_pham)) return fail(res, 400, 'Tên sản phẩm không được để trống!');
    if (!isPositiveNumber(gia)) return fail(res, 400, 'Giá sản phẩm không hợp lệ!');

    try {
        const result = await query(
            'INSERT INTO san_pham (ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (?, ?, ?, ?, ?, ?)',
            [ten_san_pham, danh_muc, gia, isPositiveNumber(so_luong_ton) ? so_luong_ton : 10, hinh_anh, mo_ta]
        );
        ok(res, 'Thêm sản phẩm thành công!', { id: result.insertId });
    } catch (err) {
        console.error('❌ Lỗi thêm sản phẩm:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Sửa sản phẩm
router.put('/admin/sua-san-pham/:id', requireAdmin, upload.single('hinh_anh'), async (req, res) => {
    const { id } = req.params;
    const ten_san_pham = sanitize(req.body.ten_san_pham);
    const danh_muc = sanitize(req.body.danh_muc);
    const gia = req.body.gia;
    const so_luong_ton = req.body.so_luong_ton;
    const mo_ta = sanitize(req.body.mo_ta, 1000);

    if (!isRequired(ten_san_pham)) return fail(res, 400, 'Tên sản phẩm không được để trống!');
    if (!isPositiveNumber(gia)) return fail(res, 400, 'Giá sản phẩm không hợp lệ!');

    try {
        let sql = 'UPDATE san_pham SET ten_san_pham = ?, danh_muc = ?, gia = ?, so_luong_ton = ?, mo_ta = ?';
        const params = [ten_san_pham, danh_muc, gia, isPositiveNumber(so_luong_ton) ? so_luong_ton : 10, mo_ta];

        if (req.file) {
            sql += ', hinh_anh = ?';
            params.push(req.file.filename);
        }
        sql += ' WHERE id = ?';
        params.push(id);

        await query(sql, params);
        ok(res, 'Cập nhật sản phẩm thành công!');
    } catch (err) {
        console.error('❌ Lỗi sửa sản phẩm:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Xóa sản phẩm
router.delete('/admin/xoa-san-pham/:id', requireAdmin, async (req, res) => {
    try {
        await query('DELETE FROM san_pham WHERE id = ?', [req.params.id]);
        ok(res, 'Xóa sản phẩm thành công!');
    } catch (err) {
        console.error('❌ Lỗi xóa sản phẩm:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
