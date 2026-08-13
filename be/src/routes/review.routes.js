const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { getAuthUser } = require('../middleware/auth');
const { sanitize } = require('../middleware/validate');

// POST /api/danh-gia - Gửi đánh giá cho sản phẩm
router.post('/danh-gia', async (req, res) => {
    const user = await getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để gửi đánh giá!' });
    }

    const { product_id, don_hang_id, so_sao, noi_dung } = req.body;
    const pId = Number(product_id);
    const dId = Number(don_hang_id);
    const stars = Math.min(5, Math.max(1, Number(so_sao) || 5));
    const content = sanitize(noi_dung || '');

    if (!pId || !dId) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm hoặc đơn hàng!' });
    }

    try {
        // Kiểm tra xem đơn hàng có tồn tại, thuộc về user này và có trạng thái "Đã hoàn thành" không
        const orders = await query(
            "SELECT * FROM don_hang WHERE id = ? AND user_id = ? AND trang_thai = 'Đã hoàn thành'",
            [dId, user.id]
        );

        if (!orders || orders.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Bạn cần bấm "Đã nhận được hàng" để hoàn tất đơn hàng trước khi đánh giá!' 
            });
        }

        // Kiểm tra sản phẩm có trong đơn hàng không
        const items = await query(
            "SELECT * FROM chi_tiet_don_hang WHERE don_hang_id = ? AND product_id = ?",
            [dId, pId]
        );

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Sản phẩm này không nằm trong đơn hàng đã chọn!' });
        }

        const userName = user.ho_ten || user.email || 'Khách hàng';

        // Kiểm tra xem đã đánh giá chưa, nếu đã đánh giá thì Cập nhật, chưa thì Thêm mới
        const existing = await query(
            "SELECT * FROM danh_gia WHERE user_id = ? AND product_id = ? AND don_hang_id = ?",
            [user.id, pId, dId]
        );

        if (existing && existing.length > 0) {
            await query(
                "UPDATE danh_gia SET so_sao = ?, noi_dung = ?, ngay_danh_gia = CURRENT_TIMESTAMP WHERE id = ?",
                [stars, content, existing[0].id]
            );
            return res.json({ success: true, message: 'Đã cập nhật đánh giá thành công!' });
        } else {
            await query(
                "INSERT INTO danh_gia (user_id, product_id, don_hang_id, so_sao, noi_dung, ten_user, ngay_danh_gia) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                [user.id, pId, dId, stars, content, userName]
            );
            return res.json({ success: true, message: 'Đã gửi đánh giá thành công! Cảm ơn bạn.' });
        }
    } catch (err) {
        console.error('Lỗi gửi đánh giá:', err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gửi đánh giá.' });
    }
});

// GET /api/danh-gia/san-pham/:productId - Lấy danh sách đánh giá & trung bình sao của sản phẩm
router.get('/danh-gia/san-pham/:productId', async (req, res) => {
    const pId = Number(req.params.productId);
    if (!pId) {
        return res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ' });
    }

    try {
        const reviews = await query(
            "SELECT id, user_id, product_id, don_hang_id, so_sao, noi_dung, ten_user, ngay_danh_gia FROM danh_gia WHERE product_id = ? ORDER BY ngay_danh_gia DESC",
            [pId]
        );

        const totalReviews = reviews.length;
        let avgRating = 0;
        if (totalReviews > 0) {
            const sum = reviews.reduce((acc, cur) => acc + Number(cur.so_sao), 0);
            avgRating = Math.round((sum / totalReviews) * 10) / 10;
        }

        return res.json({
            success: true,
            data: {
                total_reviews: totalReviews,
                rating_average: avgRating,
                reviews: reviews
            }
        });
    } catch (err) {
        console.error('Lỗi lấy danh giá sản phẩm:', err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy đánh giá.' });
    }
});

// GET /api/user/danh-gia - Lấy danh sách đánh giá của user
router.get('/user/danh-gia', async (req, res) => {
    const user = await getAuthUser(req);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập' });
    }

    try {
        const reviews = await query(
            "SELECT * FROM danh_gia WHERE user_id = ? ORDER BY ngay_danh_gia DESC",
            [user.id]
        );
        return res.json({ success: true, data: reviews });
    } catch (err) {
        console.error('Lỗi lấy đánh giá user:', err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
