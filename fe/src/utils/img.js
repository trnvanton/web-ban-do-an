// ============================================================
// Hiển thị ảnh sản phẩm/món ăn:
// - Tên file bắt đầu bằng chữ số -> ảnh do user upload (lưu ở backend /uploads)
// - Còn lại -> ảnh mặc định của template (nằm trong fe/public/img)
// ============================================================
export function imgUrl(name) {
    if (!name) return '/img/fruite-item-1.jpg';
    const s = String(name);
    if (/^\d/.test(s)) return (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/uploads/' + s;
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
