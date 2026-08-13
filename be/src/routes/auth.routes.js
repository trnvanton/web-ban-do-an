const express = require('express');
const bcrypt = require('bcryptjs');

const { query } = require('../config/db');
const { signToken, setAuthCookie, clearAuthCookie, requireAuth } = require('../middleware/auth');
const { ok, fail } = require('../utils/response');
const { isEmail, isRequired, isLength, isPassword, sanitize } = require('../middleware/validate');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ================= ĐĂNG NHẬP =================
router.post('/dang-nhap', async (req, res) => {
    const rawEmail = req.body ? req.body.email : '';
    const email = sanitize(rawEmail).toLowerCase();
    const mat_khau = (req.body ? req.body.mat_khau : '') || '';

    if (!isEmail(email)) return fail(res, 400, 'Email không hợp lệ!');
    if (!isRequired(mat_khau)) return fail(res, 400, 'Vui lòng nhập mật khẩu!');

    try {
        const results = await query(
            'SELECT id, ho_ten, email, mat_khau, vai_tro FROM tai_khoan WHERE LOWER(email) = ? LIMIT 1',
            [email]
        );

        if (!results || results.length === 0) {
            return fail(res, 400, 'Email hoặc mật khẩu không chính xác!');
        }

        const user = results[0];
        const inputPass = String(mat_khau).trim();
        const dbPass = String(user.mat_khau || '').trim();

        let valid = false;

        // 1. Kiểm tra nếu DB lưu dạng bcrypt hash ($2a$, $2b$)
        if (dbPass.startsWith('$2')) {
            try {
                valid = bcrypt.compareSync(inputPass, dbPass) || bcrypt.compareSync(mat_khau, dbPass);
            } catch (e) {
                valid = false;
            }
        }

        // 2. Kiểm tra nếu DB lưu dạng plain text (mật khẩu trần)
        if (!valid && (dbPass === inputPass || dbPass === mat_khau)) {
            valid = true;
        }

        if (!valid) {
            return fail(res, 400, 'Email hoặc mật khẩu không chính xác!');
        }

        const token = await signToken(user);
        setAuthCookie(res, token);

        ok(res, 'Đăng nhập thành công!', {
            user: { id: user.id, ho_ten: user.ho_ten, email: user.email, vai_tro: user.vai_tro },
            redirectUrl: user.vai_tro === 'admin' ? '/admin.html' : '/index.html'
        });
    } catch (err) {
        console.error('❌ [LOGIN] Lỗi đăng nhập:', err);
        fail(res, 500, 'Lỗi máy chủ! Vui lòng thử lại.');
    }
});

// ================= ĐĂNG KÝ =================
router.post('/dang-ky', async (req, res) => {
    const ho_ten = sanitize(req.body ? req.body.ho_ten : '');
    const rawEmail = req.body ? req.body.email : '';
    const email = sanitize(rawEmail).toLowerCase();
    const mat_khau = (req.body ? req.body.mat_khau : '') || '';

    if (!isRequired(ho_ten)) return fail(res, 400, 'Vui lòng nhập họ và tên!');
    if (!isEmail(email)) return fail(res, 400, 'Email không hợp lệ!');
    if (!isPassword(mat_khau)) return fail(res, 400, 'Mật khẩu phải có ít nhất 6 ký tự!');

    try {
        // Kiểm tra email đã tồn tại chưa
        const dup = await query('SELECT id FROM tai_khoan WHERE LOWER(email) = ? LIMIT 1', [email]);
        if (dup.length > 0) return fail(res, 409, 'Email này đã được đăng ký!');

        const isCloudflare = typeof globalThis.WebSocketPair !== 'undefined' || !!globalThis.env;
        const hash = isCloudflare ? mat_khau : bcrypt.hashSync(mat_khau, 10);
        // Không cho đăng ký tài khoản admin từ form
        const result = await query(
            'INSERT INTO tai_khoan (ho_ten, email, mat_khau, vai_tro) VALUES (?, ?, ?, ?)',
            [ho_ten, email, hash, 'khach']
        );

        const user = { id: result.insertId, ho_ten, email, vai_tro: 'khach' };
        const token = await signToken(user);
        setAuthCookie(res, token);

        ok(res, 'Đăng ký thành công!', {
            user,
            redirectUrl: '/index.html'
        });
    } catch (err) {
        console.error('❌ Lỗi đăng ký:', err);
        fail(res, 500, 'Lỗi máy chủ! Vui lòng thử lại.');
    }
});

// ================= LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI (từ cookie) =================
router.get('/me', async (req, res) => {
    const { getAuthUser } = require('../middleware/auth');
    const tokenUser = await getAuthUser(req);
    if (!tokenUser) return fail(res, 401, 'Chưa đăng nhập!');

    try {
        const results = await query(
            'SELECT id, ho_ten, email, vai_tro, ngay_tao FROM tai_khoan WHERE id = ? LIMIT 1',
            [tokenUser.id]
        );
        if (results.length === 0) return fail(res, 401, 'Tài khoản không tồn tại!');
        ok(res, '', { user: results[0] });
    } catch (err) {
        console.error('❌ Lỗi lấy thông tin user:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= ĐĂNG XUẤT =================
router.post('/dang-xuat', (req, res) => {
    clearAuthCookie(res);
    ok(res, 'Đã đăng xuất!');
});

// ================= ĐỔI THÔNG TIN / MẬT KHẨU (yêu cầu đăng nhập) =================
router.put('/user/cap-nhat', requireAuth, async (req, res) => {
    const ho_ten = sanitize(req.body.ho_ten);
    const mat_khau_moi = req.body.mat_khau_moi;

    if (!isRequired(ho_ten)) return fail(res, 400, 'Họ tên không được để trống!');

    try {
        if (mat_khau_moi) {
            if (!isPassword(mat_khau_moi)) {
                return fail(res, 400, 'Mật khẩu mới phải có ít nhất 6 ký tự!');
            }
            const hash = bcrypt.hashSync(mat_khau_moi, 10);
            await query('UPDATE tai_khoan SET ho_ten = ?, mat_khau = ? WHERE id = ?', [ho_ten, hash, req.user.id]);
        } else {
            await query('UPDATE tai_khoan SET ho_ten = ? WHERE id = ?', [ho_ten, req.user.id]);
        }
        ok(res, 'Cập nhật thông tin thành công!');
    } catch (err) {
        console.error('❌ Lỗi cập nhật tài khoản:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
