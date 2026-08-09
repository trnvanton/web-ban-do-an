const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { ok, fail } = require('../utils/response');
const { sanitize, isRequired } = require('../middleware/validate');

const router = express.Router();

// Tất cả API sổ địa chỉ yêu cầu đăng nhập.
// user_id LUÔN lấy từ token - không tin id client truyền lên
// (trước đây ai cũng có thể đọc/sửa địa chỉ của người khác).

router.get('/user/dia-chi', requireAuth, async (req, res) => {
    try {
        const results = await query(
            'SELECT * FROM dia_chi_giao_hang WHERE user_id = ? ORDER BY mac_dinh DESC, id DESC',
            [req.user.id]
        );
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy địa chỉ:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

router.post('/user/dia-chi', requireAuth, async (req, res) => {
    const ho_ten = sanitize(req.body.ho_ten);
    const sdt = sanitize(req.body.sdt, 20);
    const dia_chi = sanitize(req.body.dia_chi, 500);
    const mac_dinh = req.body.mac_dinh ? 1 : 0;

    if (!isRequired(ho_ten)) return fail(res, 400, 'Vui lòng nhập tên người nhận!');
    if (!isRequired(sdt)) return fail(res, 400, 'Vui lòng nhập số điện thoại!');
    if (!isRequired(dia_chi)) return fail(res, 400, 'Vui lòng nhập địa chỉ!');

    try {
        if (mac_dinh) {
            await query('UPDATE dia_chi_giao_hang SET mac_dinh = 0 WHERE user_id = ?', [req.user.id]);
        }
        const result = await query(
            'INSERT INTO dia_chi_giao_hang (user_id, ho_ten, sdt, dia_chi, mac_dinh) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, ho_ten, sdt, dia_chi, mac_dinh]
        );
        ok(res, 'Thêm địa chỉ thành công!', { id: result.insertId });
    } catch (err) {
        console.error('❌ Lỗi thêm địa chỉ:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Xóa địa chỉ - chỉ được xóa địa chỉ của chính mình
router.delete('/user/dia-chi/:id', requireAuth, async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM dia_chi_giao_hang WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return fail(res, 404, 'Không tìm thấy địa chỉ để xóa!');
        }
        ok(res, 'Xóa địa chỉ thành công!');
    } catch (err) {
        console.error('❌ Lỗi xóa địa chỉ:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
