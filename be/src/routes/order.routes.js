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
    const tokenUser = await getAuthUser(req);
    const user_id = tokenUser ? tokenUser.id : null;

    const phuong_thuc_thanh_toan = sanitize(req.body.phuong_thuc_thanh_toan) || 'COD';
    const trang_thai_thanh_toan = phuong_thuc_thanh_toan === 'BANK_QR' ? 'Chờ xác nhận chuyển khoản' : 'Chưa thanh toán (COD)';

    try {
        // Kiểm tra tồn kho từng sản phẩm trước khi cho đặt hàng
        for (const item of chi_tiet) {
            const pId = Number(item.id);
            const qty = Number(item.quantity);
            if (pId > 0 && qty > 0) {
                const prods = await query('SELECT ten_san_pham, so_luong_ton FROM san_pham WHERE id = ?', [pId]);
                if (prods && prods.length > 0) {
                    const currentStock = Number(prods[0].so_luong_ton) || 0;
                    if (qty > currentStock) {
                        return fail(res, 400, `Sản phẩm "${prods[0].ten_san_pham}" chỉ còn ${currentStock} trong kho (bạn đặt ${qty})!`);
                    }
                }
            }
        }

        const orderResult = await query(
            "INSERT INTO don_hang (user_id, ten_khach_hang, so_dien_thoai, dia_chi, tong_tien, trang_thai, phuong_thuc_thanh_toan, trang_thai_thanh_toan, ngay_dat) VALUES (?, ?, ?, ?, ?, 'Chờ xử lý', ?, ?, CURRENT_TIMESTAMP)",
            [user_id, ho_ten, sdt, dia_chi, isPositiveNumber(tong_tien) ? tong_tien : 0, phuong_thuc_thanh_toan, trang_thai_thanh_toan]
        );

        const donHangId = orderResult.insertId;
        const detailsValues = chi_tiet
            .filter(item => item && isPositiveNumber(item.price || item.gia) && Number(item.quantity || item.so_luong) > 0)
            .map(item => [
                donHangId,
                item.id || null,
                sanitize(item.name || item.ten_san_pham),
                item.price || item.gia,
                item.quantity || item.so_luong,
                sanitize(item.image || item.hinh_anh) || 'fruite-item-1.jpg'
            ]);

        if (detailsValues.length === 0) {
            await query('DELETE FROM don_hang WHERE id = ?', [donHangId]);
            return fail(res, 400, 'Giỏ hàng trống!');
        }

        for (const row of detailsValues) {
            await query(
                'INSERT INTO chi_tiet_don_hang (don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES (?, ?, ?, ?, ?, ?)',
                row
            );
        }

        // TRỪ SỐ LƯỢNG TỒN KHO TRONG CSDL MỖI KHI ĐẶT HÀNG THÀNH CÔNG
        for (const item of chi_tiet) {
            const pId = Number(item.id);
            const qty = Number(item.quantity || item.so_luong);
            if (pId > 0 && qty > 0) {
                await query(
                    'UPDATE san_pham SET so_luong_ton = MAX(0, CAST(so_luong_ton AS INTEGER) - ?) WHERE id = ?',
                    [qty, pId]
                );
            }
        }

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

// Cập nhật trạng thái đơn hàng - Tuân thủ quy trình chuyển trạng thái hợp lệ
const TRANG_THAI_HOP_LE = ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'];
const ALLOWED_TRANSITIONS = {
    'Chờ xử lý': ['Chờ xử lý', 'Đang giao', 'Đã hủy'],
    'Đang giao': ['Đang giao', 'Đã giao', 'Đã hoàn thành', 'Đã hủy'],
    'Đã giao': ['Đã giao', 'Đã hoàn thành'],
    'Đã hoàn thành': ['Đã hoàn thành'],
    'Đã hủy': ['Đã hủy']
};

router.put('/admin/don-hang/:id', requireAdmin, async (req, res) => {
    const { trang_thai } = req.body;
    if (!TRANG_THAI_HOP_LE.includes(trang_thai)) {
        return fail(res, 400, 'Trạng thái đơn hàng không hợp lệ!');
    }
    try {
        const oldOrders = await query('SELECT trang_thai FROM don_hang WHERE id = ?', [req.params.id]);
        if (!oldOrders || oldOrders.length === 0) {
            return fail(res, 404, 'Không tìm thấy đơn hàng!');
        }

        const currentStatus = oldOrders[0].trang_thai || 'Chờ xử lý';
        const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || TRANG_THAI_HOP_LE;

        if (!allowedNext.includes(trang_thai)) {
            return fail(res, 400, `Không thể chuyển trực tiếp từ "${currentStatus}" sang "${trang_thai}". Quy trình: Chờ xử lý ➜ Đang giao ➜ Đã giao / Đã hoàn thành.`);
        }

        // Nếu chuyển sang trạng thái "Đã hủy" -> Hoàn trả tồn kho cho sản phẩm
        if (currentStatus !== 'Đã hủy' && trang_thai === 'Đã hủy') {
            const details = await query('SELECT product_id, so_luong FROM chi_tiet_don_hang WHERE don_hang_id = ?', [req.params.id]);
            for (const d of details) {
                if (d.product_id && Number(d.so_luong) > 0) {
                    await query(
                        'UPDATE san_pham SET so_luong_ton = so_luong_ton + ? WHERE id = ?',
                        [Number(d.so_luong), d.product_id]
                    );
                }
            }
        }

        await query('UPDATE don_hang SET trang_thai = ? WHERE id = ?', [trang_thai, req.params.id]);
        ok(res, `Đã cập nhật trạng thái đơn hàng thành "${trang_thai}"!`);
    } catch (err) {
        console.error('❌ Lỗi cập nhật đơn hàng:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// Admin xác nhận đã nhận tiền chuyển khoản
router.put('/admin/don-hang/:id/xac-nhan-thanh-toan', requireAdmin, async (req, res) => {
    try {
        await query("UPDATE don_hang SET trang_thai_thanh_toan = 'Đã thanh toán (QR)' WHERE id = ?", [req.params.id]);
        ok(res, 'Đã xác nhận thanh toán tiền chuyển khoản thành công!');
    } catch (err) {
        console.error('❌ Lỗi xác nhận thanh toán:', err);
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

// Khách hàng xác nhận đã nhận được hàng
router.put('/user/don-hang/:id/xac-nhan-da-nhan', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await query('SELECT * FROM don_hang WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (!orders || orders.length === 0) {
            return fail(res, 404, 'Không tìm thấy đơn hàng của bạn!');
        }
        if (orders[0].trang_thai !== 'Đã giao') {
            return fail(res, 400, 'Đơn hàng phải ở trạng thái "Đã giao" mới có thể xác nhận đã nhận hàng!');
        }

        await query("UPDATE don_hang SET trang_thai = 'Đã hoàn thành' WHERE id = ?", [id]);
        ok(res, '🎉 Cảm ơn bạn đã xác nhận nhận hàng thành công! Đơn hàng đã chuyển sang trạng thái Đã hoàn thành.');
    } catch (err) {
        console.error('❌ Lỗi xác nhận nhận hàng:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= CHI TIẾT ĐƠN HÀNG =================
// Admin xem mọi đơn; user chỉ xem đơn của chính mình
router.get('/don-hang/:id/chi-tiet', async (req, res) => {
    const { id } = req.params;
    const tokenUser = await getAuthUser(req);

    try {
        if (tokenUser && tokenUser.vai_tro === 'admin') {
            const results = await query('SELECT * FROM chi_tiet_don_hang WHERE don_hang_id = ?', [id]);
            return ok(res, '', results);
        }
        if (tokenUser) {
            const orders = await query('SELECT id FROM don_hang WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, tokenUser.id]);
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
