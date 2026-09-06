// ============================================================
// Hiển thị ảnh sản phẩm/món ăn:
// - Tên file bắt đầu bằng chữ số -> ảnh do user upload (lưu ở backend /uploads)
// - Còn lại -> ảnh mặc định của template (nằm trong fe/public/img)
// ============================================================
export function imgUrl(name) {
    if (!name) return '/img/fruite-item-1.jpg';
    const s = String(name).trim();
    if (!s) return '/img/fruite-item-1.jpg';
    if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('blob:') || s.startsWith('data:')) return s;
    if (s.startsWith('/uploads/') || s.startsWith('uploads/')) return '/' + s.replace(/^\/+/, '');
    if (s.startsWith('/img/') || s.startsWith('img/')) return '/' + s.replace(/^\/+/, '');
    // Tên file bắt đầu bằng chữ số (timestamp của upload) -> phục vụ tại /uploads
    if (/^\d/.test(s)) return '/uploads/' + s;
    return '/img/' + s;
}

// Escape HTML - chống XSS khi đưa dữ liệu từ API vào JSX/HTML
export function esc(s) {
    return String(s == null ? '' : s)
        .replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// Định dạng giá tiền theo chuẩn Việt Nam: 250000 -> 250.000 đ
export function fmtVND(n) {
    return Number(n || 0).toLocaleString('vi-VN') + ' đ';
}
