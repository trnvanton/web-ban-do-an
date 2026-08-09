const express = require('express');
const { query } = require('../config/db');
const { requireAuth, requireAdmin, getAuthUser } = require('../middleware/auth');
const { ok, fail } = require('../utils/response');
const { sanitize, isRequired, isPositiveNumber } = require('../middleware/validate');

const router = express.Router();

// ================= ĐẶT HÀNG (thanh toán) =================
// Cho phép khách vãng lai đặt hàng (user_id = null).
// Nếu đã đăng nhập: user_id LUÔN lấy từ token, không tin client truyền lên.
router.post('/don-hang', async (req, res) => {
    const ho_ten = sanitize(req.body.ho_ten);
    const sdt = sanitize(req.body.sdt, 20);
    const dia_chi = sanitize(req.body.dia_chi, 500);
    const tong_tien = req.body.tong_tien;
    const chi_tiet = req.body.chi_tiet;

    if (!isRequired(ho_ten)) return fail(res, 400, 'Vui lòng nhập họ tên người nhận!');
    if (!isRequired(sdt)) return fail(res, 400, 'Vui lòng nhập số điện thoại!');
    if (!isRequired(dia_chi)) return fail(res, 400, 'Vui lòng nhập địa chỉ giao hàng!');
    if (!Array.isArray(chi_tiet) || chi_tiet.length === 0) {
        return fail(res, 400, 'Giỏ hàng trống!');
    }

    // Lấy user từ token nếu có (khách chưa đăng nhập vẫn đặt hàng được)
    const tokenUser = getAuthUser(req);
    const user_id = tokenUser ? tokenUser.id : null;

    try {
        const orderResult = await query(
            "INSERT INTO don_hang (user_id, ten_khach_hang, so_dien_thoai, dia_chi, tong_tien, trang_thai, ngay_dat) VALUES (?, ?, ?, ?, ?, 'Chờ xử lý', NOW())",
            [user_id, ho_ten, sdt, dia_chi, isPositiveNumber(tong_tien) ? tong_tien : 0]
        );

        const donHangId = orderResult.insertId;
        const detailsValues = chi_tiet
            .filter(item => item && isPositiveNumber(item.price) && Number(item.quantity) > 0)
            .map(item => [
                donHangId,
                item.id || null,
                sanitize(item.name),
                item.price,
                item.quantity,
                sanitize(item.image || item.hinh_anh) || 'fruite-item-1.jpg'
            ]);

        if (detailsValues.length === 0) {
            await query('DELETE FROM don_hang WHERE id = ?', [donHangId]);
            return fail(res, 400, 'Giỏ hàng trống!');
        }

        await query(
            'INSERT INTO chi_tiet_don_hang (don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES ?',
            [detailsValues]
        );

        ok(res, 'Đặt hàng thành công!', { donHangId });
    } catch (err) {
        console.error('❌ Lỗi tạo đơn hàng:', err);
        fail(res, 500, 'Lỗi máy chủ! Vui lòng thử lại.');
    }
});

// ================= QUẢN LÝ ĐƠN HÀNG - ADMIN =================

router.get('/admin/don-hang', requireAdmin, async (req, res) => {
    try {
        const results = await query('SELECT * FROM don_hang ORDER BY id DESC');
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy đơn hàng admin:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Cập nhật trạng thái đơn hàng - CHỈ cho phép các trạng thái cố định
const TRANG_THAI_HOP_LE = ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'];

router.put('/admin/don-hang/:id', requireAdmin, async (req, res) => {
    const { trang_thai } = req.body;
    if (!TRANG_THAI_HOP_LE.includes(trang_thai)) {
        return fail(res, 400, 'Trạng thái đơn hàng không hợp lệ!');
    }
    try {
        await query('UPDATE don_hang SET trang_thai = ? WHERE id = ?', [trang_thai, req.params.id]);
        ok(res, 'Cập nhật trạng thái thành công!');
    } catch (err) {
        console.error('❌ Lỗi cập nhật trạng thái:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= LỊCH SỬ ĐƠN HÀNG - NGƯỜI DÙNG =================
// user_id luôn lấy từ token - không tin tham số client gửi lên
router.get('/user/don-hang', requireAuth, async (req, res) => {
    const keyword = sanitize(req.query.keyword || '', 100);
    try {
        let sql = 'SELECT * FROM don_hang WHERE user_id = ?';
        const params = [req.user.id];
        if (keyword) {
            sql += ' AND (ten_khach_hang LIKE ? OR so_dien_thoai LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        sql += ' ORDER BY id DESC';
        const results = await query(sql, params);
        ok(res, '', results);
    } catch (err) {
        console.error('❌ Lỗi lấy đơn hàng user:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= CHI TIẾT ĐƠN HÀNG =================
// Admin xem mọi đơn; user chỉ xem đơn của chính mình
router.get('/don-hang/:id/chi-tiet', async (req, res) => {
    const { id } = req.params;
    const tokenUser = getAuthUser(req);

    try {
        if (tokenUser && tokenUser.vai_tro === 'admin') {
            const results = await query('SELECT * FROM chi_tiet_don_hang WHERE don_hang_id = ?', [id]);
            return ok(res, '', results);
        }
        if (tokenUser) {
            const orders = await query('SELECT id FROM don_hang WHERE id = ? AND user_id = ?', [id, tokenUser.id]);
            if (orders.length === 0) return fail(res, 403, 'Không có quyền xem đơn hàng này!');
            const results = await query('SELECT * FROM chi_tiet_don_hang WHERE don_hang_id = ?', [id]);
            return ok(res, '', results);
        }
        fail(res, 401, 'Vui lòng đăng nhập!');
    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết đơn hàng:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
