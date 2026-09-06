const express = require('express');
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ok, fail } = require('../utils/response');
const { sanitize, isRequired } = require('../middleware/validate');

const router = express.Router();

// ================= MÓN ĂN & GỢI Ý THỰC ĐƠN =================

function formatDish(dish) {
    if (!dish) return dish;
    const parseJSON = (val, fallback) => {
        if (!val) return fallback;
        if (typeof val === 'object') return val;
        try {
            return JSON.parse(val);
        } catch (e) {
            return fallback;
        }
    };

    return {
        ...dish,
        thoi_gian_chuan_bi: dish.thoi_gian_chuan_bi !== null && dish.thoi_gian_chuan_bi !== undefined ? Number(dish.thoi_gian_chuan_bi) : 10,
        thoi_gian_nau: dish.thoi_gian_nau !== null && dish.thoi_gian_nau !== undefined ? Number(dish.thoi_gian_nau) : 15,
        nguyen_lieu_chi_tiet: parseJSON(dish.nguyen_lieu_chi_tiet, []),
        cac_buoc_thuc_hien: parseJSON(dish.cac_buoc_thuc_hien, []),
        dinh_duong: parseJSON(dish.dinh_duong, null),
        tags: parseJSON(dish.tags, [])
    };
}

// Lấy danh sách món ăn (công khai)
router.get('/mon-an', async (req, res) => {
    try {
        const results = await query('SELECT * FROM mon_an ORDER BY id DESC');
        ok(res, '', (results || []).map(formatDish));
    } catch (err) {
        console.error('❌ Lỗi lấy món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Lấy chi tiết 1 món ăn theo ID (công khai)
router.get('/mon-an/:id', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM mon_an WHERE id = ?', [req.params.id]);
        if (!rows || rows.length === 0) {
            return fail(res, 404, 'Không tìm thấy món ăn!');
        }
        ok(res, '', formatDish(rows[0]));
    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết món ăn:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Gợi ý món ăn theo từ khóa & nguyên liệu chọn (công khai)
router.get('/goi-y-mon-an', async (req, res) => {
    const keyword = sanitize(req.query.keyword || '', 100);
    const ingredients = req.query.ingredients || '';

    try {
        let sql = 'SELECT * FROM mon_an';
        const params = [];

        // 1. Lọc theo từ khóa ô tìm kiếm
        if (keyword) {
            sql += ' WHERE (ten_mon LIKE ? OR nguyen_lieu_chinh LIKE ? OR cong_thuc LIKE ? OR mo_ta LIKE ? OR tags LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        sql += ' ORDER BY id DESC';

        let results = await query(sql, params);

        // 2. Lọc theo danh sách nguyên liệu đã chọn (tag/checkbox)
        if (ingredients) {
            const ingList = String(ingredients).split(',').map(s => s.trim()).filter(Boolean);
            const ingIds = ingList.map(Number).filter(n => !isNaN(n) && n > 0);

            let targetIngNames = [];
            if (ingIds.length > 0) {
                const placeholders = ingIds.map(() => '?').join(',');
                const rows = await query(`SELECT id, ten_nguyen_lieu FROM nguyen_lieu WHERE id IN (${placeholders})`, ingIds);
                targetIngNames = (rows || []).map(r => r.ten_nguyen_lieu);
            }

            ingList.forEach(item => {
                if (isNaN(Number(item)) && !targetIngNames.includes(item)) {
                    targetIngNames.push(item);
                }
            });

            if (targetIngNames.length > 0) {
                const searchKeys = targetIngNames.map(n => n.split('/')[0].split('(')[0].trim().toLowerCase());
                results = results.filter(dish => {
                    const text = `${dish.ten_mon || ''} ${dish.nguyen_lieu_chinh || ''}`.toLowerCase();
                    return searchKeys.some(k => text.includes(k));
                });
            }
        }

        ok(res, '', (results || []).map(formatDish));
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
    const mo_ta = sanitize(req.body.mo_ta || '', 1000);
    const do_kho = sanitize(req.body.do_kho || 'Dễ', 50);
    const khau_phan = sanitize(req.body.khau_phan || '2 - 3 người', 50);
    const thoi_gian_chuan_bi = parseInt(req.body.thoi_gian_chuan_bi, 10) || 10;
    const thoi_gian_nau = parseInt(req.body.thoi_gian_nau, 10) || 15;
    const meo_nau_an = sanitize(req.body.meo_nau_an || '', 1000);

    const nguyen_lieu_chi_tiet = req.body.nguyen_lieu_chi_tiet ? (typeof req.body.nguyen_lieu_chi_tiet === 'string' ? req.body.nguyen_lieu_chi_tiet : JSON.stringify(req.body.nguyen_lieu_chi_tiet)) : '[]';
    const cac_buoc_thuc_hien = req.body.cac_buoc_thuc_hien ? (typeof req.body.cac_buoc_thuc_hien === 'string' ? req.body.cac_buoc_thuc_hien : JSON.stringify(req.body.cac_buoc_thuc_hien)) : '[]';
    const dinh_duong = req.body.dinh_duong ? (typeof req.body.dinh_duong === 'string' ? req.body.dinh_duong : JSON.stringify(req.body.dinh_duong)) : null;
    const tags = req.body.tags ? (typeof req.body.tags === 'string' ? req.body.tags : JSON.stringify(req.body.tags)) : '[]';

    const hinh_anh = req.file ? req.file.filename : 'fruite-item-1.jpg';

    if (!isRequired(ten_mon)) return fail(res, 400, 'Tên món ăn không được để trống!');

    try {
        const result = await query(
            `INSERT INTO mon_an (
                ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon,
                mo_ta, do_kho, khau_phan, thoi_gian_chuan_bi, thoi_gian_nau,
                nguyen_lieu_chi_tiet, cac_buoc_thuc_hien, meo_nau_an, dinh_duong, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon || 'Món mặn',
                mo_ta, do_kho, khau_phan, thoi_gian_chuan_bi, thoi_gian_nau,
                nguyen_lieu_chi_tiet, cac_buoc_thuc_hien, meo_nau_an, dinh_duong, tags
            ]
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
    const mo_ta = sanitize(req.body.mo_ta || '', 1000);
    const do_kho = sanitize(req.body.do_kho || 'Dễ', 50);
    const khau_phan = sanitize(req.body.khau_phan || '2 - 3 người', 50);
    const thoi_gian_chuan_bi = parseInt(req.body.thoi_gian_chuan_bi, 10) || 10;
    const thoi_gian_nau = parseInt(req.body.thoi_gian_nau, 10) || 15;
    const meo_nau_an = sanitize(req.body.meo_nau_an || '', 1000);

    if (!isRequired(ten_mon)) return fail(res, 400, 'Tên món ăn không được để trống!');

    try {
        let sql = `
            UPDATE mon_an SET
                ten_mon = ?, nguyen_lieu_chinh = ?, cong_thuc = ?, loai_mon = ?,
                mo_ta = ?, do_kho = ?, khau_phan = ?, thoi_gian_chuan_bi = ?, thoi_gian_nau = ?, meo_nau_an = ?
        `;
        const params = [
            ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon || 'Món mặn',
            mo_ta, do_kho, khau_phan, thoi_gian_chuan_bi, thoi_gian_nau, meo_nau_an
        ];

        if (req.body.nguyen_lieu_chi_tiet) {
            sql += ', nguyen_lieu_chi_tiet = ?';
            params.push(typeof req.body.nguyen_lieu_chi_tiet === 'string' ? req.body.nguyen_lieu_chi_tiet : JSON.stringify(req.body.nguyen_lieu_chi_tiet));
        }
        if (req.body.cac_buoc_thuc_hien) {
            sql += ', cac_buoc_thuc_hien = ?';
            params.push(typeof req.body.cac_buoc_thuc_hien === 'string' ? req.body.cac_buoc_thuc_hien : JSON.stringify(req.body.cac_buoc_thuc_hien));
        }
        if (req.body.dinh_duong) {
            sql += ', dinh_duong = ?';
            params.push(typeof req.body.dinh_duong === 'string' ? req.body.dinh_duong : JSON.stringify(req.body.dinh_duong));
        }
        if (req.body.tags) {
            sql += ', tags = ?';
            params.push(typeof req.body.tags === 'string' ? req.body.tags : JSON.stringify(req.body.tags));
        }
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
