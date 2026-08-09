// Tiện ích trả response với format thống nhất:
//   Thành công: { success: true, message, data }
//   Thất bại:   { success: false, message }

function ok(res, message = 'Thành công!', data = null) {
    return res.json(data === null ? { success: true, message } : { success: true, message, data });
}

function fail(res, status = 400, message = 'Đã có lỗi xảy ra!') {
    return res.status(status).json({ success: false, message });
}

module.exports = { ok, fail };
