// ===== Helper kiểm tra dữ liệu đầu vào (validation) =====

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cắt khoảng trắng thừa + giới hạn độ dài (chống payload quá khổ)
function sanitize(value, maxLen = 255) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
}

function isRequired(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isEmail(value) {
    return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

function isPassword(value) {
    return typeof value === 'string' && value.length >= 6;
}

// Chuỗi hoặc số dương hợp lệ (giá tiền, số lượng)
function isPositiveNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0;
}

module.exports = { sanitize, isRequired, isEmail, isPassword, isPositiveNumber };
