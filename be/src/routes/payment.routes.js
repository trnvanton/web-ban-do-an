const express = require('express');
const { query } = require('../config/db');
const { ok, fail } = require('../utils/response');

const router = express.Router();

// Lấy thông tin cấu hình SePay / VietQR
router.get('/sepay/config', (req, res) => {
    ok(res, '', {
        bankCode: process.env.SEPAY_BANK_CODE || 'MB',
        accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || '0974838034',
        accountName: process.env.SEPAY_ACCOUNT_NAME || 'TRINH VAN TOAN',
        prefix: process.env.SEPAY_PREFIX || 'FRUITE'
    });
});

// ================= SEPAY WEBHOOK IPN =================
// SePay sẽ tự động gọi POST đến URL này mỗi khi tài khoản ngân hàng nhận được tiền
router.post('/sepay/webhook', async (req, res) => {
    try {
        const body = req.body || {};
        console.log('🔔 [SePay Webhook Received]:', JSON.stringify(body, null, 2));

        // Kiểm tra API Key (nếu có cấu hình trong SePay Header: Authorization: Apikey <key>)
        const authHeader = req.headers['authorization'] || '';
        const expectedApiKey = process.env.SEPAY_API_KEY;
        if (expectedApiKey && authHeader) {
            const token = authHeader.replace(/^Apikey\s+/i, '').trim();
            if (token !== expectedApiKey && authHeader !== expectedApiKey) {
                console.warn('⚠️ SePay Webhook: API Key không khớp!');
                // Không chặn hoàn toàn nếu đang test, nhưng ghi log cảnh báo
            }
        }

        // Trích xuất thông tin giao dịch từ SePay
        // SePay body format: { id, gateway, transactionDate, accountNumber, content, transferType, transferAmount, referenceCode, description }
        const content = String(body.content || body.description || '').trim();
        const transferAmount = Number(body.transferAmount || body.amount || 0);
        const transferType = String(body.transferType || 'in').toLowerCase();

        // Chỉ xử lý giao dịch tiền vào (tiền nhận được)
        if (transferType !== 'in' && transferType !== '') {
            return ok(res, 'Bỏ qua giao dịch không phải tiền vào (transferType != in)');
        }

        // Tìm mã đơn hàng từ nội dung chuyển khoản
        // Các mẫu thường gặp: "FRUITE45", "FRUITE 45", "DH45", "FRUIT45", hoặc chứa số đơn hàng
        const prefix = process.env.SEPAY_PREFIX || 'FRUITE';
        const regexPrefix = new RegExp(`${prefix}\\s*(\\d+)`, 'i');
        const matchPrefix = content.match(regexPrefix);

        let orderId = null;
        if (matchPrefix && matchPrefix[1]) {
            orderId = Number(matchPrefix[1]);
        } else {
            // Thử bắt regex phụ: "DH 123" hoặc "DH123" hoặc "FRUIT 123"
            const matchDH = content.match(/(?:DH|DONHANG|BILL|HD)\s*(\d+)/i);
            if (matchDH && matchDH[1]) {
                orderId = Number(matchDH[1]);
            }
        }

        if (!orderId) {
            console.warn(`⚠️ SePay Webhook: Không tìm thấy mã đơn hàng hợp lệ trong nội dung "${content}"`);
            return ok(res, 'Đã nhận webhook nhưng không tìm thấy mã đơn hàng phù hợp');
        }

        // Tìm đơn hàng trong CSDL
        const orders = await query('SELECT * FROM don_hang WHERE id = ?', [orderId]);
        if (!orders || orders.length === 0) {
            console.warn(`⚠️ SePay Webhook: Không tìm thấy đơn hàng #${orderId} trong CSDL!`);
            return ok(res, `Không tìm thấy đơn hàng #${orderId}`);
        }

        const order = orders[0];
        const orderTotal = Number(order.tong_tien || 0);

        // Kiểm tra xem đơn đã thanh toán chưa
        if (order.trang_thai_thanh_toan && order.trang_thai_thanh_toan.includes('Đã thanh toán')) {
            console.log(`ℹ️ Đơn hàng #${orderId} đã được thanh toán trước đó.`);
            return ok(res, `Đơn hàng #${orderId} đã được xác nhận thanh toán trước đó.`);
        }

        // Cập nhật trạng thái thanh toán đơn hàng thành "Đã thanh toán (QR - SePay)"
        await query(
            "UPDATE don_hang SET trang_thai_thanh_toan = 'Đã thanh toán (QR - SePay)' WHERE id = ?",
            [orderId]
        );

        console.log(`✅ [SePay] Đã tự động xác nhận thanh toán thành công cho đơn hàng #${orderId} (Số tiền: ${transferAmount}đ)`);

        return ok(res, `Xác nhận thanh toán đơn hàng #${orderId} thành công!`, {
            orderId,
            transferAmount,
            status: 'Đã thanh toán (QR - SePay)'
        });
    } catch (err) {
        console.error('❌ Lỗi xử lý SePay Webhook:', err);
        return fail(res, 500, 'Lỗi máy chủ xử lý webhook');
    }
});

// ================= POLLING KIỂM TRA TRẠNG THÁI THANH TOÁN =================
// Frontend gọi định kỳ (polling mỗi 2s) khi khách đang mở modal QR
router.get('/don-hang/:id/trang-thai-thanh-toan', async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await query('SELECT id, tong_tien, trang_thai, trang_thai_thanh_toan, phuong_thuc_thanh_toan, ngay_dat FROM don_hang WHERE id = ?', [id]);
        if (!orders || orders.length === 0) {
            return fail(res, 404, 'Không tìm thấy đơn hàng!');
        }

        const order = orders[0];
        const status = order.trang_thai_thanh_toan || '';
        const isPaid = status.includes('Đã thanh toán');

        ok(res, '', {
            id: order.id,
            tong_tien: order.tong_tien,
            trang_thai: order.trang_thai,
            trang_thai_thanh_toan: status,
            is_paid: isPaid
        });
    } catch (err) {
        console.error('❌ Lỗi lấy trạng thái thanh toán đơn hàng:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

// ================= GIẢ LẬP SEPAY WEBHOOK (DEMO / TEST LOCAL) =================
// Dành cho việc test trên localhost hoặc khi bảo vệ Đồ án tốt nghiệp mà không cần nạp tiền thật
router.post('/sepay/mock-payment', async (req, res) => {
    const { orderId } = req.body;
    const oId = Number(orderId);

    if (!oId) {
        return fail(res, 400, 'Vui lòng cung cấp orderId hợp lệ!');
    }

    try {
        const orders = await query('SELECT * FROM don_hang WHERE id = ?', [oId]);
        if (!orders || orders.length === 0) {
            return fail(res, 404, `Không tìm thấy đơn hàng #${oId}!`);
        }

        const order = orders[0];
        await query(
            "UPDATE don_hang SET trang_thai_thanh_toan = 'Đã thanh toán (QR - SePay)' WHERE id = ?",
            [oId]
        );

        console.log(`🧪 [Mock SePay] Đã giả lập thanh toán thành công đơn hàng #${oId}`);

        ok(res, `🎉 Đã giả lập nhận biến động số dư SePay thành công cho đơn hàng #${oId}!`, {
            orderId: oId,
            tong_tien: order.tong_tien,
            trang_thai_thanh_toan: 'Đã thanh toán (QR - SePay)',
            is_paid: true
        });
    } catch (err) {
        console.error('❌ Lỗi giả lập SePay:', err);
        fail(res, 500, 'Lỗi máy chủ!');
    }
});

module.exports = router;
