import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { imgUrl, esc, fmtVND } from '../utils/img';
import { api } from '../api';
import { useCart } from '../contexts/CartContext';
import './RecipeDetailModal.css';

// Danh mục sản phẩm dự phòng để đảm bảo 100% luôn có nút thêm vào giỏ hàng tức thì
const DEFAULT_PRODUCTS = [
    { id: 14, ten_san_pham: "Cà Chua Bi Hữu Cơ VietGAP (Hộp 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 25000, so_luong_ton: 50, hinh_anh: "1786008268041.jpg" },
    { id: 15, ten_san_pham: "Khoai Tây Đà Lạt Tươi Sạch (Túi 1kg)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 35000, so_luong_ton: 50, hinh_anh: "1786008327361.jpg" },
    { id: 16, ten_san_pham: "Bông Cải Xanh Đà Lạt (Cây 400g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 30000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 17, ten_san_pham: "Tôm Sú Tươi Sống Nam Bộ (Khay 300g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 65000, so_luong_ton: 50, hinh_anh: "1786037230275.webp" },
    { id: 18, ten_san_pham: "Thịt Thăn Bò Tươi VietGAP (Khay 300g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 75000, so_luong_ton: 50, hinh_anh: "1786036482174.webp" },
    { id: 19, ten_san_pham: "Thịt Ba Chỉ Heo Tươi Sạch (Khay 400g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 58000, so_luong_ton: 50, hinh_anh: "1786036788088.webp" },
    { id: 20, ten_san_pham: "Sườn Non Heo Tươi Chọn Lọc (Khay 500g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 72000, so_luong_ton: 50, hinh_anh: "1786036904867.webp" },
    { id: 21, ten_san_pham: "Thịt Gà Ta Thả Vườn Sơ Chế (Nửa Con 700g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 68000, so_luong_ton: 50, hinh_anh: "1786036842355.webp" },
    { id: 22, ten_san_pham: "Cá Lóc Tươi Cắt Khúc Sạch (Khay 450g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 48000, so_luong_ton: 50, hinh_anh: "1786007478565.webp" },
    { id: 23, ten_san_pham: "Mực Ống Tươi Cấp Đông Biển (Khay 350g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 62000, so_luong_ton: 50, hinh_anh: "1786036920587.webp" },
    { id: 24, ten_san_pham: "Trứng Gà Ta Tươi Mới (Hộp 10 quả)", danh_muc: "Thịt & Hải Sản Tươi", gia: 35000, so_luong_ton: 50, hinh_anh: "1786037340314.webp" },
    { id: 25, ten_san_pham: "Trứng Cút Tươi Chọn Lọc (Hộp 30 quả)", danh_muc: "Thịt & Hải Sản Tươi", gia: 22000, so_luong_ton: 50, hinh_anh: "1786036788088.webp" },
    { id: 26, ten_san_pham: "Đậu Hũ Trắng Tươi Mới (Hộp 4 miếng)", danh_muc: "Thịt & Hải Sản Tươi", gia: 15000, so_luong_ton: 50, hinh_anh: "1786036870851.webp" },
    { id: 27, ten_san_pham: "Dứa (Thơm) Chín Mật Gọt Sẵn (Hộp 1 quả)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 20000, so_luong_ton: 50, hinh_anh: "vegetable-item-4.jpg" },
    { id: 28, ten_san_pham: "Đậu Bắp Xanh Tươi Non (Túi 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 15000, so_luong_ton: 50, hinh_anh: "vegetable-item-5.jpg" },
    { id: 29, ten_san_pham: "Giá Đỗ Sạch Hữu Cơ Tươi Giòn (Túi 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 12000, so_luong_ton: 50, hinh_anh: "vegetable-item-1.jpg" },
    { id: 30, ten_san_pham: "Cà Rốt Đà Lạt Tươi Giòn (Túi 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 18000, so_luong_ton: 50, hinh_anh: "vegetable-item-2.jpg" },
    { id: 31, ten_san_pham: "Cần Tây Tươi Giòn Đà Lạt (Túi 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 16000, so_luong_ton: 50, hinh_anh: "vegetable-item-3.png" },
    { id: 32, ten_san_pham: "Combo Hành Lá, Ngò Om & Ngò Gai (Gói 150g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 10000, so_luong_ton: 50, hinh_anh: "1786007443212.webp" },
    { id: 33, ten_san_pham: "Cốt Me Chua Tự Nhiên (Hộp 200g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 15000, so_luong_ton: 50, hinh_anh: "1786007743217.jpg" },
    { id: 34, ten_san_pham: "Mộc Nhĩ & Nấm Hương Khô Rừng (Gói 100g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 28000, so_luong_ton: 50, hinh_anh: "1786008422050.webp" },
    { id: 35, ten_san_pham: "Nấm Kim Châm Tươi (Gói 150g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 14000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 36, ten_san_pham: "Bí Đỏ Hồ Lô Dẻo Ngọt (Quả 800g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 22000, so_luong_ton: 50, hinh_anh: "vegetable-item-5.jpg" },
    { id: 37, ten_san_pham: "Dẻ Sườn & Nạm Bắp Bò Úc (Khay 400g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 85000, so_luong_ton: 50, hinh_anh: "raw_beef_ribs.jpg" },
    { id: 38, ten_san_pham: "Cua Đồng Tươi Xay Sạch (Túi 400g kèm gạch)", danh_muc: "Thịt & Hải Sản Tươi", gia: 45000, so_luong_ton: 50, hinh_anh: "1786007637594.webp" },
    { id: 39, ten_san_pham: "Chả Lụa Bì Ớt Xiêm Xanh (Cây 300g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 45000, so_luong_ton: 50, hinh_anh: "cha-lua-bi-ot-xiem-xanh-meatdeli-cay-300g-clone_202509161340134561.webp" },
    { id: 40, ten_san_pham: "Cá Hồi Tươi Phi Lê Na Uy (Khay 300g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 125000, so_luong_ton: 50, hinh_anh: "1786037065573.webp" },
    { id: 41, ten_san_pham: "Cá Diêu Hồng Tươi Sạch (Con 800g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 55000, so_luong_ton: 50, hinh_anh: "1786007478565.webp" },
    { id: 42, ten_san_pham: "Nghêu Sống Bến Tre (Túi 1kg)", danh_muc: "Thịt & Hải Sản Tươi", gia: 38000, so_luong_ton: 50, hinh_anh: "1786037166093.webp" },
    { id: 43, ten_san_pham: "Bạch Tuộc Tươi Biển Sạch (Khay 400g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 65000, so_luong_ton: 50, hinh_anh: "1786036920587.webp" },
    { id: 44, ten_san_pham: "Thịt Heo Xay Nạc Vai Tươi (Khay 300g)", danh_muc: "Thịt & Hải Sản Tươi", gia: 42000, so_luong_ton: 50, hinh_anh: "1786036870851.webp" },
    { id: 46, ten_san_pham: "Bắp Cải Trắng Đà Lạt (Bắp 800g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 20000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 47, ten_san_pham: "Bí Đao Xanh Thơm (Quả 700g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 18000, so_luong_ton: 50, hinh_anh: "vegetable-item-5.jpg" },
    { id: 48, ten_san_pham: "Su Su & Cà Rốt Tươi Đà Lạt (Túi 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 16000, so_luong_ton: 50, hinh_anh: "vegetable-item-2.jpg" },
    { id: 49, ten_san_pham: "Măng Tây Xanh Loại 1 (Bó 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 35000, so_luong_ton: 50, hinh_anh: "vegetable-item-3.png" },
    { id: 50, ten_san_pham: "Đậu Hà Lan Tươi Giòn (Túi 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 25000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 51, ten_san_pham: "Dưa Leo / Dưa Chuột Nếp Giòn (Túi 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 15000, so_luong_ton: 50, hinh_anh: "vegetable-item-4.jpg" },
    { id: 52, ten_san_pham: "Rau Muống Sạch Nước Ngọt (Bó 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 14000, so_luong_ton: 50, hinh_anh: "1786007443212.webp" },
    { id: 53, ten_san_pham: "Cải Thìa & Cải Ngọt VietGAP (Bó 400g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 16000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 54, ten_san_pham: "Xà Lách Mỡ & Rau Thơm Tổng Hợp (Gói 300g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 15000, so_luong_ton: 50, hinh_anh: "fruite-item-4.jpg" },
    { id: 55, ten_san_pham: "Khoai Lang Mật Đà Lạt (Túi 1kg)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 30000, so_luong_ton: 50, hinh_anh: "vegetable-item-5.jpg" },
    { id: 56, ten_san_pham: "Bắp / Ngô Ngọt Mỹ Tươi (Set 2 bắp)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 18000, so_luong_ton: 50, hinh_anh: "vegetable-item-4.jpg" },
    { id: 57, ten_san_pham: "Khổ Qua / Mướp Đắng Rừng (Túi 400g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 22000, so_luong_ton: 50, hinh_anh: "vegetable-item-6.jpg" },
    { id: 58, ten_san_pham: "Ớt Chuông Đà Lạt Ba Màu (Túi 400g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 28000, so_luong_ton: 50, hinh_anh: "vegetable-item-1.jpg" },
    { id: 59, ten_san_pham: "Combo Khoai Tây & Cà Rốt Tươi Cắt Sẵn (Khay 500g)", danh_muc: "Rau Củ & Nông Sản Tươi", gia: 22000, so_luong_ton: 50, hinh_anh: "potatoes_carrots_prep.jpg" },
    { id: 60, ten_san_pham: "Rượu Vang Đỏ Nấu Ăn & Sốt Vang (Chai 375ml)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 45000, so_luong_ton: 50, hinh_anh: "red_wine_cooking.jpg" },
    { id: 61, ten_san_pham: "Bơ Lạt Nấu Ăn & Tỏi Băm Tiện Lợi (Hộp 150g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 25000, so_luong_ton: 50, hinh_anh: "butter_garlic.jpg" },
    { id: 62, ten_san_pham: "Sốt Cà Chua Paste Đậm Đặc (Hũ 200g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 22000, so_luong_ton: 50, hinh_anh: "tomato_paste.jpg" },
    { id: 63, ten_san_pham: "Combo Thảo Mộc Gia Vị (Quế, Hoa Hồi, Thảo Quả) (Gói 50g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 18000, so_luong_ton: 50, hinh_anh: "spices_cinnamon_anise.jpg" },
    { id: 64, ten_san_pham: "Bột Bắp / Bột Năng Cao Cấp (Gói 250g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 12000, so_luong_ton: 50, hinh_anh: "cornstarch_pack.jpg" },
    { id: 65, ten_san_pham: "Nước Dừa Xiêm Tươi Bến Tre (Hộp 330ml)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 18000, so_luong_ton: 50, hinh_anh: "nuoc_ep_trai_cay_co_thuc_su_tot-3.jpg" },
    { id: 66, ten_san_pham: "Tỏi Cô Đơn & Hành Tím Lý Sơn (Túi 300g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 25000, so_luong_ton: 50, hinh_anh: "vegetable-item-5.jpg" },
    { id: 67, ten_san_pham: "Gừng Tươi & Sả Cây Tươi Sạch (Gói 250g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 12000, so_luong_ton: 50, hinh_anh: "vegetable-item-2.jpg" },
    { id: 68, ten_san_pham: "Ớt Hiểm & Tiêu Sọ Phú Quốc (Combo 100g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 20000, so_luong_ton: 50, hinh_anh: "1786007743217.jpg" },
    { id: 69, ten_san_pham: "Dầu Hào Thượng Hạng Maggi (Chai 350g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 24000, so_luong_ton: 50, hinh_anh: "1786036482174.webp" },
    { id: 70, ten_san_pham: "Dầu Mè Thơm Tinh Khiết (Chai 150ml)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 28000, so_luong_ton: 50, hinh_anh: "1786036870851.webp" },
    { id: 71, ten_san_pham: "Nước Mắm Cá Cơm Phú Quốc 40 Độ Đạm (Chai 500ml)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 48000, so_luong_ton: 50, hinh_anh: "1786007443212.webp" },
    { id: 72, ten_san_pham: "Mắm Tôm & Mắm Nêm Truyền Thống (Hũ 200g)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 18000, so_luong_ton: 50, hinh_anh: "1786007637594.webp" },
    { id: 73, ten_san_pham: "Mật Ong Rừng Tự Nhiên (Hũ 250ml)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 65000, so_luong_ton: 50, hinh_anh: "fruite-item-3.jpg" },
    { id: 74, ten_san_pham: "Giấm Gạo & Nước Tương Đậm Đặc (Combo 2 chai)", danh_muc: "Gia Vị & Nông Sản Bếp", gia: 26000, so_luong_ton: 50, hinh_anh: "1786007743217.jpg" }
];

// Chuẩn hóa chuỗi tiếng Việt không dấu (dùng cho so sánh dự phòng)
function normalizeText(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Hàm tạo biểu thức chính quy (Regex) với ranh giới từ chuẩn Unicode Tiếng Việt
 * Tránh lỗi \b trong Javascript khi gặp các ký tự tiếng Việt có dấu
 */
function makeVnRegex(words) {
    const list = Array.isArray(words) ? words : [words];
    const escaped = list.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return new RegExp(`(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, 'iu');
}

// Danh sách các nhóm định danh nguyên liệu ẩm thực chuẩn xác (Canonical Mapping)
const INGREDIENT_CANONICAL_RULES = [
    // 1. Thịt gia cầm & Các bộ phận
    {
        canonical: 'thịt gà',
        match: makeVnRegex(['thịt gà', 'gà', 'gà ta', 'gà thả vườn', 'cánh gà', 'đùi gà', 'tỏi gà', 'đùi tỏi', 'đùi tỏi gà', 'ức gà', 'chân gà', 'mề gà', 'lòng gà', 'gà công nghiệp'])
    },
    {
        canonical: 'thịt vịt',
        match: makeVnRegex(['thịt vịt', 'vịt', 'vịt cỏ', 'ức vịt', 'đùi vịt'])
    },

    // 2. Thịt heo & Sườn
    {
        canonical: 'thịt ba chỉ',
        match: makeVnRegex(['thịt ba chỉ', 'ba chỉ', 'ba rọi', 'thịt ba rọi', 'thịt ba chỉ heo'])
    },
    {
        canonical: 'thịt băm',
        match: makeVnRegex(['thịt băm', 'thịt xay', 'thịt heo xay', 'nạc vai xay', 'nạc xay', 'thịt nạc xay'])
    },
    {
        canonical: 'thịt thăn lợn',
        match: makeVnRegex(['thịt thăn lợn', 'thịt thăn heo', 'thịt nạc thăn', 'thịt lợn nạc', 'thịt heo nạc'])
    },
    {
        canonical: 'sườn heo',
        match: makeVnRegex(['sườn heo', 'sườn non', 'sườn sụn', 'sườn lợn', 'sườn']),
        exclude: makeVnRegex(['sườn bò', 'dẻ sườn bò'])
    },
    {
        canonical: 'thịt heo',
        match: makeVnRegex(['thịt heo', 'thịt lợn', 'tai heo', 'chân giò', 'móng giò'])
    },

    // 3. Thịt bò
    {
        canonical: 'thịt bò',
        match: makeVnRegex(['thịt bò', 'bò', 'bắp bò', 'nạm bò', 'dẻ sườn bò', 'thăn bò', 'gầu bò', 'bò úc', 'bò nạc', 'thịt thăn bò']),
        exclude: makeVnRegex(['bơ', 'bột', 'bọ', 'bồ câu'])
    },

    // 4. Thủy hải sản
    {
        canonical: 'tôm tươi',
        match: makeVnRegex(['tôm', 'tôm sú', 'tôm tươi', 'tôm nõn', 'tôm thẻ', 'tôm lột', 'tôm đồng'])
    },
    {
        canonical: 'mực tươi',
        match: makeVnRegex(['mực', 'mực tươi', 'mực ống', 'mực lá', 'mực mai', 'mực trứng'])
    },
    {
        canonical: 'cá lóc (hoặc cá basa)',
        match: makeVnRegex(['cá lóc', 'cá basa', 'cá quả', 'cá tràu', 'cá diêu hồng', 'cá hồi', 'cá rô', 'cá chép', 'cá thu', 'cá nục', 'cá bớp', 'cá phi lê', 'phi lê cá', 'cá']),
        exclude: makeVnRegex(['nước mắm', 'mắm cá', 'nước mắm ngon', 'cà chua', 'cà rốt'])
    },
    {
        canonical: 'cua đồng / cua biển',
        match: makeVnRegex(['cua đồng', 'cua biển', 'cua xay', 'gạch cua', 'cua', 'ghẹ'])
    },
    {
        canonical: 'nghêu / nghêu hấp',
        match: makeVnRegex(['nghêu', 'ngao', 'ngao biển', 'nghêu biển', 'ngao hoa'])
    },
    {
        canonical: 'bạch tuộc',
        match: makeVnRegex(['bạch tuộc', 'râu bạch tuộc'])
    },
    {
        canonical: 'chả lụa / giò lụa',
        match: makeVnRegex(['chả lụa', 'giò lụa', 'giò bì', 'chả bì'])
    },
    {
        canonical: 'lạp xưởng',
        match: makeVnRegex(['lạp xưởng', 'lạp sườn'])
    },

    // 5. Trứng
    {
        canonical: 'trứng cút',
        match: makeVnRegex(['trứng cút', 'trứng chim cút'])
    },
    {
        canonical: 'trứng',
        match: makeVnRegex(['trứng gà', 'trứng vịt', 'trứng ta', 'trứng']),
        exclude: makeVnRegex(['trứng cút', 'trứng cá'])
    },

    // 6. Đậu & Nấm
    {
        canonical: 'đậu hũ',
        match: makeVnRegex(['đậu hũ', 'đậu phụ', 'tàu hũ', 'đậu non', 'đậu trắng'])
    },
    {
        canonical: 'mộc nhĩ',
        match: makeVnRegex(['mộc nhĩ', 'nấm mèo'])
    },
    {
        canonical: 'nấm hương',
        match: makeVnRegex(['nấm hương', 'nấm đông cô'])
    },
    {
        canonical: 'nấm kim châm',
        match: makeVnRegex(['nấm kim châm'])
    },

    // 7. Rau củ quả
    {
        canonical: 'bông cải xanh',
        match: makeVnRegex(['bông cải', 'súp lơ', 'bông cải xanh', 'súp lơ xanh'])
    },
    {
        canonical: 'cà chua',
        match: makeVnRegex(['cà chua', 'cà chua bi', 'cà chua hữu cơ']),
        exclude: makeVnRegex(['sốt cà chua', 'tương cà', 'cà chua paste', 'cà chua cô đặc'])
    },
    {
        canonical: 'khoai tây',
        match: makeVnRegex(['khoai tây'])
    },
    {
        canonical: 'cà rốt',
        match: makeVnRegex(['cà rốt'])
    },
    {
        canonical: 'bắp cải',
        match: makeVnRegex(['bắp cải', 'bắp cải trắng', 'bắp cải tím'])
    },
    {
        canonical: 'bắp / ngô ngọt',
        match: makeVnRegex(['bắp ngọt', 'ngô ngọt', 'ngô mỹ', 'bắp mỹ', 'ngô nếp', 'bắp nếp']),
        exclude: makeVnRegex(['bột bắp', 'bột ngô', 'bắp bò', 'bắp cải'])
    },
    {
        canonical: 'ớt chuông',
        match: makeVnRegex(['ớt chuông', 'ớt đà lạt', 'ớt ngọt'])
    },
    {
        canonical: 'rau muống',
        match: makeVnRegex(['rau muống'])
    },
    {
        canonical: 'cải thìa / cải ngọt',
        match: makeVnRegex(['cải thìa', 'cải ngọt', 'rau cải', 'cải bẹ'])
    },
    {
        canonical: 'bí đỏ',
        match: makeVnRegex(['bí đỏ', 'hồ lô', 'bí ngô'])
    },
    {
        canonical: 'bí đao',
        match: makeVnRegex(['bí đao', 'bí xanh'])
    },
    {
        canonical: 'su su',
        match: makeVnRegex(['su su'])
    },
    {
        canonical: 'măng tây',
        match: makeVnRegex(['măng tây'])
    },
    {
        canonical: 'đậu hà lan',
        match: makeVnRegex(['đậu hà lan', 'đậu cô ve', 'đậu cove'])
    },
    {
        canonical: 'khổ qua / trái đắng',
        match: makeVnRegex(['khổ qua', 'mướp đắng'])
    },
    {
        canonical: 'dưa leo / dưa chuột',
        match: makeVnRegex(['dưa leo', 'dưa chuột'])
    },
    {
        canonical: 'giá đỗ',
        match: makeVnRegex(['giá đỗ', 'giá sống', 'giá sạch'])
    },
    {
        canonical: 'dứa / thơm',
        match: makeVnRegex(['dứa', 'thơm', 'khóm'])
    },
    {
        canonical: 'me chua / bạc hà',
        match: makeVnRegex(['me chua', 'cốt me', 'me', 'dọc mùng', 'bạc hà'])
    },
    {
        canonical: 'khoai lang',
        match: makeVnRegex(['khoai lang', 'khoai lang mật'])
    },
    {
        canonical: 'xà lách',
        match: makeVnRegex(['xà lách', 'rau sống', 'tía tô', 'rau thơm'])
    },
    {
        canonical: 'cần tây',
        match: makeVnRegex(['cần tây', 'rau cần', 'tỏi tây', 'boa-rô'])
    },
    {
        canonical: 'hành lá',
        match: makeVnRegex(['hành lá', 'hành hoa', 'ngò gai', 'ngò om', 'mùi tàu', 'ngò rí', 'rau mùi'])
    },
    {
        canonical: 'hành tím',
        match: makeVnRegex(['hành tím', 'hành khô', 'hành củ'])
    },
    {
        canonical: 'hành tây',
        match: makeVnRegex(['hành tây'])
    },

    // 8. Gia vị & Phụ gia
    {
        canonical: 'tỏi',
        match: makeVnRegex(['tỏi', 'tỏi khô', 'tỏi ta', 'tỏi băm', 'tỏi phi', 'củ tỏi', 'tỏi cô đơn', 'tỏi lý sơn']),
        exclude: makeVnRegex(['tỏi gà', 'đùi tỏi', 'đùi tỏi gà', 'tỏi tây', 'boa-rô'])
    },
    {
        canonical: 'ớt',
        match: makeVnRegex(['ớt', 'ớt hiểm', 'ớt tươi', 'ớt sừng', 'ớt đỏ', 'ớt chỉ thiên', 'ớt băm', 'ớt khô', 'ớt bột', 'ớt xanh', 'ớt xiêm']),
        exclude: makeVnRegex(['tương ớt', 'dầu ớt', 'sa tế', 'ớt chuông'])
    },
    {
        canonical: 'tương ớt',
        match: makeVnRegex(['tương ớt', 'tương ớt chin-su', 'tương ớt chua ngọt'])
    },
    {
        canonical: 'nước mắm',
        match: makeVnRegex(['nước mắm', 'mắm cá cơm', 'nước mắm ngon', 'nước mắm truyền thống'])
    },
    {
        canonical: 'đường',
        match: makeVnRegex(['đường', 'đường cát', 'đường phèn', 'đường trắng'])
    },
    {
        canonical: 'nước hàng',
        match: makeVnRegex(['nước hàng', 'nước màu', 'kẹo đắng'])
    },
    {
        canonical: 'muối',
        match: makeVnRegex(['muối', 'muối hạt', 'muối tinh', 'muối iot'])
    },
    {
        canonical: 'tiêu xay',
        match: makeVnRegex(['tiêu', 'tiêu xay', 'tiêu sọ', 'tiêu đen', 'tiêu phú quốc'])
    },
    {
        canonical: 'giấm',
        match: makeVnRegex(['giấm', 'giấm gạo', 'giấm táo'])
    },
    {
        canonical: 'gừng',
        match: makeVnRegex(['gừng', 'gừng tươi', 'gừng già', 'gừng củ'])
    },
    {
        canonical: 'sả',
        match: makeVnRegex(['sả', 'củ sả', 'sả cây', 'sả băm'])
    },
    {
        canonical: 'dầu hào',
        match: makeVnRegex(['dầu hào'])
    },
    {
        canonical: 'xì dầu / nước tương',
        match: makeVnRegex(['xì dầu', 'nước tương', 'maggi'])
    },
    {
        canonical: 'mắm tôm',
        match: makeVnRegex(['mắm tôm'])
    },
    {
        canonical: 'mắm nêm',
        match: makeVnRegex(['mắm nêm'])
    },
    {
        canonical: 'mật ong',
        match: makeVnRegex(['mật ong'])
    },
    {
        canonical: 'dầu ăn',
        match: makeVnRegex(['dầu ăn', 'dầu thực vật'])
    },
    {
        canonical: 'bột bắp / bột năng',
        match: makeVnRegex(['bột bắp', 'bột năng', 'bột đao', 'bột chiên giòn', 'bột chiên'])
    },
    {
        canonical: 'nước dừa',
        match: makeVnRegex(['nước dừa', 'dừa xiêm', 'nước dừa tươi'])
    }
];

// Trích xuất danh sách Canonical Keys chuẩn của một nguyên liệu
function getCanonicalKeys(rawName) {
    if (!rawName || typeof rawName !== 'string') return [];
    const text = rawName.toLowerCase().trim();
    if (!text) return [];

    const result = new Set();

    for (const rule of INGREDIENT_CANONICAL_RULES) {
        if (rule.match.test(text)) {
            const hasExclude = rule.exclude && rule.exclude.test(text);
            if (!hasExclude) {
                result.add(rule.canonical);
            }
        }
    }

    if (result.size === 0) {
        result.add(text);
    }

    return [...result];
}

// Kiểm tra xem nguyên liệu trong công thức có trùng khớp với nguyên liệu người dùng đã chọn / có sẵn
function checkIsMatched(ingItem, userIngredients = []) {
    const rawName = typeof ingItem === 'string' ? ingItem : (ingItem?.ten || '');
    if (!rawName) return false;

    const itemKeys = getCanonicalKeys(rawName);

    if (Array.isArray(userIngredients) && userIngredients.length > 0) {
        for (const u of userIngredients) {
            const uName = typeof u === 'string' ? u : (u?.ten_nguyen_lieu || u?.ten || '');
            const uKeys = getCanonicalKeys(uName);
            if (itemKeys.some(ik => uKeys.includes(ik))) {
                return true;
            }
        }
    }

    return false;
}

// Bảng quy tắc so khớp chính xác nguyên liệu công thức với sản phẩm trong kho cửa hàng
const STORE_MAPPING = [
    // 1. Gia vị chuyên dụng & Thực phẩm đặc thù (Ưu tiên kiểm tra trước để không nhầm vào thịt/rau)
    { match: /\b(tương ớt|chin-su|sa tế)\b/i, targetId: 68, nameMatch: 'ớt hiểm' },
    { match: /\b(rượu vang|sốt vang|vang đỏ)\b/i, targetId: 60, nameMatch: 'rượu vang' },
    { match: /\b(bơ lạt|bơ thực vật|bơ anchor|bơ nhạt)\b/i, targetId: 61, nameMatch: 'bơ lạt' },
    { match: /\b(sốt cà chua|cà chua paste|paste|cà chua cô đặc)\b/i, targetId: 62, nameMatch: 'sốt cà chua' },
    { match: /\b(quế|hoa hồi|hồi|thảo quả|thảo mộc)\b/i, targetId: 63, nameMatch: 'thảo mộc' },
    { match: /\b(bột bắp|bột năng|bột đao|bột ngô|bột chiên|bột chiên giòn)\b/i, targetId: 64, nameMatch: 'bột bắp' },
    { match: /\b(khoai tây.*cà rốt|cà rốt.*khoai tây)\b/i, targetId: 59, nameMatch: 'combo khoai tây' },
    { match: /\b(dầu hào)\b/i, targetId: 69, nameMatch: 'dầu hào' },
    { match: /\b(dầu mè|dầu vừng)\b/i, targetId: 70, nameMatch: 'dầu mè' },
    { match: /\b(nước mắm|mắm cá cơm)\b/i, targetId: 71, nameMatch: 'nước mắm' },
    { match: /\b(mắm tôm|mắm nêm)\b/i, targetId: 72, nameMatch: 'mắm tôm' },
    { match: /\b(mật ong)\b/i, targetId: 73, nameMatch: 'mật ong' },
    { match: /\b(giấm|nước tương|xì dầu|maggi)\b/i, targetId: 74, nameMatch: 'giấm gạo' },
    { match: /\b(nước dừa|dừa xiêm)\b/i, targetId: 65, nameMatch: 'nước dừa' },

    // 2. Rau củ & Nông sản tươi
    { match: /\b(giá đỗ|giá sạch|giá đỗ sạch|giá đỗ tươi|giá sống)\b/i, targetId: 29, nameMatch: 'giá đỗ' },
    { match: /\b(me chua|cốt me|nước cốt me|trái me)\b/i, targetId: 33, nameMatch: 'cốt me' },
    { match: /\b(ngò om|ngò gai|mùi tàu|ngổ hương|rau ngổ|rau thơm)\b/i, targetId: 32, nameMatch: 'ngò om' },
    { match: /\b(dọc mùng|bạc hà|đậu bắp)\b/i, targetId: 28, nameMatch: 'đậu bắp' },
    { match: /\b(dứa|thơm|khóm)\b/i, targetId: 27, nameMatch: 'dứa' },
    { match: /\b(cà chua bi|cà chua)\b/i, targetId: 14, nameMatch: 'cà chua bi' },
    { match: /\b(khoai tây)\b/i, targetId: 15, nameMatch: 'khoai tây' },
    { match: /\b(cà rốt)\b/i, targetId: 30, nameMatch: 'cà rốt' },
    { match: /\b(bông cải|súp lơ)\b/i, targetId: 16, nameMatch: 'bông cải' },
    { match: /\b(cần tây|tỏi tây|boa-rô)\b/i, targetId: 31, nameMatch: 'cần tây' },
    { match: /\b(mộc nhĩ|nấm hương|nấm đông cô|nấm mèo)\b/i, targetId: 34, nameMatch: 'mộc nhĩ' },
    { match: /\b(nấm kim châm)\b/i, targetId: 35, nameMatch: 'nấm kim châm' },
    { match: /\b(bí đỏ|hồ lô)\b/i, targetId: 36, nameMatch: 'bí đỏ' },
    { match: /\b(bắp cải)\b/i, targetId: 46, nameMatch: 'bắp cải' },
    { match: /\b(bí đao|bí xanh)\b/i, targetId: 47, nameMatch: 'bí đao' },
    { match: /\b(su su)\b/i, targetId: 48, nameMatch: 'su su' },
    { match: /\b(măng tây)\b/i, targetId: 49, nameMatch: 'măng tây' },
    { match: /\b(đậu hà lan)\b/i, targetId: 50, nameMatch: 'đậu hà lan' },
    { match: /\b(dưa leo|dưa chuột)\b/i, targetId: 51, nameMatch: 'dưa leo' },
    { match: /\b(rau muống)\b/i, targetId: 52, nameMatch: 'rau muống' },
    { match: /\b(cải thìa|cải ngọt)\b/i, targetId: 53, nameMatch: 'cải thìa' },
    { match: /\b(xà lách|rau sống|tía tô)\b/i, targetId: 54, nameMatch: 'xà lách' },
    { match: /\b(khoai lang)\b/i, targetId: 55, nameMatch: 'khoai lang' },
    { match: /\b(bắp ngọt|ngô ngọt|ngô mỹ|bắp mỹ)\b/i, targetId: 56, nameMatch: 'bắp / ngô ngọt' },
    { match: /\b(khổ qua|mướp đắng)\b/i, targetId: 57, nameMatch: 'khổ qua' },
    { match: /\b(ớt chuông)\b/i, targetId: 58, nameMatch: 'ớt chuông' },
    { match: /\b(tỏi|hành tím|tỏi phi|hành khô|tỏi ta|tỏi khô)\b/i, targetId: 66, nameMatch: 'tỏi cô đơn' },
    { match: /\b(gừng|sả|củ sả)\b/i, targetId: 67, nameMatch: 'gừng tươi' },
    { match: /\b(ớt tươi|tiêu|tiêu sọ|ớt hiểm|ớt bột|ớt sừng|ớt)\b/i, targetId: 68, nameMatch: 'ớt hiểm' },
    { match: /\b(hành lá|hành hoa)\b/i, targetId: 32, nameMatch: 'hành lá' },

    // 3. Thịt & Hải sản tươi sống
    { match: /\b(dẻ sườn|nạm bắp|nạm bò|bắp bò)\b/i, targetId: 37, nameMatch: 'dẻ sườn' },
    { match: /\b(thăn bò|thịt bò|bò phi lê|bò úc|bò)\b/i, targetId: 18, nameMatch: 'thịt thăn bò' },
    { match: /\b(cua đồng|cua xay|gạch cua)\b/i, targetId: 38, nameMatch: 'cua đồng' },
    { match: /\b(chả lụa|giò lụa|giò bì)\b/i, targetId: 39, nameMatch: 'chả lụa' },
    { match: /\b(cá hồi)\b/i, targetId: 40, nameMatch: 'cá hồi' },
    { match: /\b(cá diêu hồng)\b/i, targetId: 41, nameMatch: 'cá diêu hồng' },
    { match: /\b(cá lóc|cá basa|cá quả|cá tràu)\b/i, targetId: 22, nameMatch: 'cá lóc' },
    { match: /\b(cá phi lê|cá tươi|cá)\b/i, targetId: 22, nameMatch: 'cá lóc' },
    { match: /\b(nghêu|ngao)\b/i, targetId: 42, nameMatch: 'nghêu' },
    { match: /\b(bạch tuộc)\b/i, targetId: 43, nameMatch: 'bạch tuộc' },
    { match: /\b(thịt heo xay|thịt xay|thịt băm|nạc vai xay)\b/i, targetId: 44, nameMatch: 'thịt heo xay' },
    { match: /\b(ba chỉ|ba rọi|thịt ba chỉ|thịt heo|thịt lợn)\b/i, targetId: 19, nameMatch: 'thịt ba chỉ' },
    { match: /\b(sườn non|sườn heo|sườn sụn|sườn)\b/i, targetId: 20, nameMatch: 'sườn non' },
    { match: /\b(thịt gà|gà ta|gà thả vườn|đùi gà|cánh gà|tỏi gà|đùi tỏi|ức gà|gà)\b/i, targetId: 21, nameMatch: 'thịt gà' },
    { match: /\b(tôm sú|tôm tươi|tôm nõn|tôm)\b/i, targetId: 17, nameMatch: 'tôm sú' },
    { match: /\b(mực ống|mực tươi|mực lá|mực)\b/i, targetId: 23, nameMatch: 'mực ống' },
    { match: /\b(trứng cút)\b/i, targetId: 25, nameMatch: 'trứng cút' },
    { match: /\b(trứng gà|trứng vịt|trứng ta|trứng)\b/i, targetId: 24, nameMatch: 'trứng gà' },
    { match: /\b(đậu hũ|đậu phụ|tàu hũ|đậu non)\b/i, targetId: 26, nameMatch: 'đậu hũ' }
];

// Tìm sản phẩm trong cửa hàng tương ứng với nguyên liệu món ăn (Chuẩn xác 100%)
function findStoreProduct(ingItem, products = []) {
    const list = (Array.isArray(products) && products.length > 0) ? products : DEFAULT_PRODUCTS;
    const rawName = typeof ingItem === 'string' ? ingItem : (ingItem?.ten || '');
    const text = String(rawName).trim();
    if (!text) return list[0];

    // 1. So khớp theo bảng từ khóa chuyên dụng STORE_MAPPING
    for (const rule of STORE_MAPPING) {
        if (rule.match.test(text)) {
            const byId = list.find(p => Number(p.id) === Number(rule.targetId));
            if (byId) return byId;

            if (rule.nameMatch) {
                const normNameMatch = normalizeText(rule.nameMatch);
                const byName = list.find(p => normalizeText(p.ten_san_pham).includes(normNameMatch));
                if (byName) return byName;
            }
        }
    }

    // 2. Token matching fallback an toàn
    const norm = normalizeText(text);
    const stopWords = ['tuoi', 'chin', 'sach', 'ngon', 'khay', 'hop', 'tui', 'goi', 'khoi', 'luoc', 'mon', 'va', 'hoac', 'kem', 'gion', 'phi'];
    const tokens = norm.split(' ').filter(t => t.length >= 3 && !stopWords.includes(t));
    for (const token of tokens) {
        const found = list.find(p => normalizeText(p.ten_san_pham).includes(token));
        if (found) return found;
    }

    return list.find(p => p.danh_muc === 'Rau Củ & Nông Sản Tươi') || list[0];
}

export default function RecipeDetailModal({ dish, isOpen = true, onClose, userIngredients = [] }) {
    const navigate = useNavigate();
    const { addItem, count } = useCart();
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const [addedItems, setAddedItems] = useState({});
    const [storeProducts, setStoreProducts] = useState(DEFAULT_PRODUCTS);
    const [toastMessage, setToastMessage] = useState(null);
    const toastTimeoutRef = useRef(null);
    const backdropRef = useRef(null);
    const dialogRef = useRef(null);

    // Tải danh sách sản phẩm từ cửa hàng
    useEffect(() => {
        let mounted = true;
        api.get('/api/san-pham')
            .then(data => {
                if (mounted && Array.isArray(data) && data.length > 0) {
                    setStoreProducts(data);
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Chuẩn bị danh sách nguyên liệu của món ăn
    const ingredients = useMemo(() => {
        if (!dish) return [];
        if (Array.isArray(dish.nguyen_lieu_chi_tiet) && dish.nguyen_lieu_chi_tiet.length > 0) {
            return dish.nguyen_lieu_chi_tiet;
        } else if (dish.nguyen_lieu_chinh) {
            return dish.nguyen_lieu_chinh.split(',').map(item => ({
                ten: item.trim(),
                so_luong: '',
                don_vi: '',
                ghi_chu: ''
            }));
        }
        return [];
    }, [dish]);

    // Tự động đánh dấu tích sẵn cho các nguyên liệu trùng khớp khi mở Modal
    useEffect(() => {
        if (!dish || ingredients.length === 0) {
            setCheckedIngredients({});
            setAddedItems({});
            return;
        }

        const initialChecked = {};

        ingredients.forEach((item, idx) => {
            const matched = checkIsMatched(item, userIngredients);
            if (matched) {
                initialChecked[idx] = true;
            }
        });

        setCheckedIngredients(initialChecked);
        setAddedItems({});
    }, [dish?.id, ingredients, userIngredients, dish?.analysis]);

    // Lock body scroll khi mở Modal
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            if (backdropRef.current) backdropRef.current.scrollTop = 0;
            if (dialogRef.current) dialogRef.current.scrollTop = 0;

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen, dish?.id]);

    // Lắng nghe phím ESC để đóng modal
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const showToast = (msg) => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToastMessage(msg);
        toastTimeoutRef.current = setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    if (!isOpen || !dish) return null;

    const toggleIngredient = (idx) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    // Thêm 1 sản phẩm nguyên liệu vào giỏ hàng
    const handleAddToCart = (product, itemTen, idx, e) => {
        if (e) e.stopPropagation();
        if (!product) return;
        addItem(product, 1);
        setAddedItems(prev => ({ ...prev, [idx]: true }));
        showToast(`🛒 Đã thêm "${product.ten_san_pham}" vào giỏ hàng!`);
    };

    // Mua tất cả nguyên liệu còn thiếu
    const handleAddAllMissing = () => {
        let addedCount = 0;
        const newAdded = { ...addedItems };
        ingredients.forEach((item, idx) => {
            if (!checkedIngredients[idx]) {
                const prod = findStoreProduct(item, storeProducts);
                if (prod) {
                    addItem(prod, 1);
                    newAdded[idx] = true;
                    addedCount++;
                }
            }
        });

        setAddedItems(newAdded);
        if (addedCount > 0) {
            showToast(`🎉 Đã thêm ${addedCount} nguyên liệu còn thiếu vào giỏ hàng!`);
        } else {
            showToast(`ℹ️ Tất cả nguyên liệu đã được chuẩn bị sẵn.`);
        }
    };

    // Chuẩn bị danh sách các bước nấu
    let steps = [];
    if (Array.isArray(dish.cac_buoc_thuc_hien) && dish.cac_buoc_thuc_hien.length > 0) {
        steps = dish.cac_buoc_thuc_hien;
    } else if (dish.cong_thuc) {
        steps = [{
            buoc: 1,
            tieu_de: 'Hướng dẫn chế biến',
            noi_dung: dish.cong_thuc
        }];
    }

    // Màu sắc độ khó
    const difficultyColors = {
        'Dễ': { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
        'Trung bình': { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
        'Khó': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
    };
    const diffStyle = difficultyColors[dish.do_kho] || difficultyColors['Dễ'];

    const matchedDishIngredients = dish.analysis?.matchedDishIngredients || [];
    const matchedUserIngredients = dish.analysis?.matchedIngredients || [];
    const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
    
    // Tìm các nguyên liệu thiếu có sản phẩm trong cửa hàng
    const missingProducts = ingredients
        .map((item, idx) => ({ item, idx, prod: findStoreProduct(item, storeProducts), isChecked: !!checkedIngredients[idx] }))
        .filter(x => !x.isChecked && x.prod);

    const missingTotalCost = missingProducts.reduce((sum, x) => sum + (Number(x.prod.gia) || 0), 0);

    return (
        <div className="recipe-modal-backdrop" ref={backdropRef} onClick={onClose}>
            <div className="recipe-modal-dialog" ref={dialogRef} onClick={e => e.stopPropagation()}>
                {/* Toast thông báo nhanh với nút Xem giỏ hàng tức thì */}
                {toastMessage && (
                    <div className="recipe-modal-toast">
                        <i className="fas fa-check-circle text-success me-1"></i>
                        <span>{toastMessage}</span>
                        <button
                            type="button"
                            className="btn-toast-view-cart"
                            onClick={() => {
                                onClose();
                                navigate('/gio-hang');
                            }}
                            title="Đến trang giỏ hàng ngay"
                        >
                            <span>Xem giỏ hàng</span>
                            <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                )}

                {/* Hero Header */}
                <div className="recipe-modal-hero">
                    <img src={imgUrl(dish.hinh_anh)} alt={esc(dish.ten_mon)} />
                    <button
                        type="button"
                        className="recipe-modal-close"
                        onClick={onClose}
                        title="Đóng (Esc)"
                        aria-label="Đóng"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="recipe-modal-hero-overlay">
                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <span className="badge rounded-pill bg-success px-3 py-1 text-white shadow-sm">
                                <i className="fas fa-utensils me-1"></i> {dish.loai_mon || 'Món ăn'}
                            </span>
                            {dish.do_kho && (
                                <span
                                    className="badge rounded-pill px-3 py-1"
                                    style={{
                                        background: diffStyle.bg,
                                        color: diffStyle.text,
                                        border: `1px solid ${diffStyle.border}`
                                    }}
                                >
                                    Độ khó: {dish.do_kho}
                                </span>
                            )}
                            {(matchedUserIngredients.length > 0 || matchedDishIngredients.length > 0) && (
                                <span className="badge rounded-pill bg-warning text-dark px-3 py-1 shadow-sm fw-bold">
                                    🌱 Khớp {matchedUserIngredients.length || matchedDishIngredients.length} nguyên liệu
                                </span>
                            )}
                        </div>
                        <h2 className="text-white fw-bold mb-1">{esc(dish.ten_mon)}</h2>
                        {dish.mo_ta && (
                            <p className="text-white-50 small mb-0" style={{ maxWidth: '650px' }}>
                                {dish.mo_ta}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Metrics Bar */}
                <div className="recipe-metrics-grid">
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-primary">
                            <i className="fas fa-users"></i>
                        </span>
                        <span className="recipe-metric-label">Khẩu phần</span>
                        <span className="recipe-metric-value">{dish.khau_phan || '2 - 3 người'}</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-info">
                            <i className="fas fa-clock"></i>
                        </span>
                        <span className="recipe-metric-label">Chuẩn bị</span>
                        <span className="recipe-metric-value">{dish.thoi_gian_chuan_bi || 10} phút</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-danger">
                            <i className="fas fa-fire-alt"></i>
                        </span>
                        <span className="recipe-metric-label">Nấu chín</span>
                        <span className="recipe-metric-value">{dish.thoi_gian_nau || 15} phút</span>
                    </div>
                    <div className="recipe-metric-card">
                        <span className="recipe-metric-icon text-warning">
                            <i className="fas fa-award"></i>
                        </span>
                        <span className="recipe-metric-label">Độ khó</span>
                        <span className="recipe-metric-value">{dish.do_kho || 'Dễ'}</span>
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="recipe-modal-content">
                    {/* NGUYÊN LIỆU CHI TIẾT (Checklist & Add-to-cart) */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <div>
                                <h5 className="recipe-section-title mb-0">
                                    <i className="fas fa-carrot"></i> Nguyên Liệu &amp; Định Lượng
                                </h5>
                                <div className="text-muted small mt-1">
                                    {checkedCount === ingredients.length ? (
                                        <span className="text-success fw-bold">
                                            <i className="fas fa-check-double me-1"></i> Đã chuẩn bị đủ {ingredients.length}/{ingredients.length} nguyên liệu!
                                        </span>
                                    ) : (
                                        <span>
                                            Đã có: <strong className="text-success">{checkedCount}/{ingredients.length}</strong> nguyên liệu (tự động tích xanh món đã có trong bếp).
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                {/* Nút Kiểm tra giỏ hàng tiện lợi */}
                                <button
                                    type="button"
                                    className="btn-view-cart-main shadow-sm"
                                    onClick={() => {
                                        onClose();
                                        navigate('/gio-hang');
                                    }}
                                    title="Kiểm tra các món ăn & nguyên liệu trong giỏ hàng của bạn"
                                >
                                    <i className="fas fa-shopping-cart text-success"></i>
                                    <span>Kiểm tra giỏ hàng</span>
                                    {count > 0 && <span className="cart-badge-num">{count}</span>}
                                </button>

                                {/* Nút thêm nhanh tất cả nguyên liệu còn thiếu */}
                                {missingProducts.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2 fw-bold rounded-pill px-3 py-1.5 shadow-sm"
                                        onClick={handleAddAllMissing}
                                        title="Thêm tất cả các nguyên liệu chưa chuẩn bị vào giỏ hàng"
                                    >
                                        <i className="fas fa-cart-plus"></i>
                                        <span>Mua {missingProducts.length} món còn thiếu ({fmtVND(missingTotalCost)})</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Danh sách nguyên liệu */}
                        <div className="ingredient-list">
                            {ingredients.map((item, idx) => {
                                const isChecked = !!checkedIngredients[idx];
                                const isInitiallyMatched = checkIsMatched(item, userIngredients);
                                const storeProduct = findStoreProduct(item, storeProducts);
                                const isAdded = !!addedItems[idx];

                                return (
                                    <div
                                        key={idx}
                                        className={`ingredient-item ${isChecked ? 'checked' : ''} ${isInitiallyMatched ? 'matched-initial' : ''}`}
                                        onClick={() => toggleIngredient(idx)}
                                    >
                                        {/* Dòng 1: Checkbox + Tên nguyên liệu + Badge */}
                                        <div className="ingredient-top-row">
                                            <div className="ingredient-checkbox-wrap">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    aria-label={item.ten}
                                                />
                                            </div>
                                            <div className="ingredient-header-content">
                                                <div className="ingredient-name">{item.ten}</div>
                                                {isInitiallyMatched && (
                                                    <span className="badge-ing-matched" title="Nguyên liệu khớp với danh sách bạn đã chọn từ tủ lạnh">
                                                        <i className="fas fa-seedling me-1"></i> Đã có sẵn
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dòng 2: Định lượng & Ghi chú */}
                                        <div className="ingredient-body-row">
                                            {(item.so_luong || item.don_vi) && (
                                                <span className="ingredient-amount">
                                                    {item.so_luong} {item.don_vi}
                                                </span>
                                            )}
                                            {item.ghi_chu && (
                                                <span className="ingredient-note">
                                                    ({item.ghi_chu})
                                                </span>
                                            )}
                                        </div>

                                        {/* Dòng 3 (Dòng cuối cùng): Nút thêm giỏ hàng / Trạng thái sẵn sàng */}
                                        <div className="ingredient-action-row" onClick={(e) => e.stopPropagation()}>
                                            {isChecked ? (
                                                <span className="badge-ing-ready">
                                                    <i className="fas fa-check-circle text-success"></i> Đã chuẩn bị sẵn
                                                </span>
                                            ) : storeProduct ? (
                                                <button
                                                    type="button"
                                                    className={`btn-add-ing-cart ${isAdded ? 'added' : ''}`}
                                                    onClick={(e) => handleAddToCart(storeProduct, item.ten, idx, e)}
                                                    title={`Thêm ${storeProduct.ten_san_pham} vào giỏ hàng (${fmtVND(storeProduct.gia)})`}
                                                >
                                                    <i className={`fas ${isAdded ? 'fa-check' : 'fa-cart-plus'}`}></i>
                                                    <span>{isAdded ? '✓ Đã thêm vào giỏ' : `Thêm vào giỏ ${fmtVND(storeProduct.gia)}`}</span>
                                                </button>
                                            ) : (
                                                <span className="text-muted small">Chưa chuẩn bị</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CÁC BƯỚC THỰC HIỆN */}
                    <div className="mb-4">
                        <h5 className="recipe-section-title">
                            <i className="fas fa-list-ol"></i> Các Bước Nấu Chuẩn Đầu Bếp
                        </h5>
                        <div className="step-timeline">
                            {steps.map((s, idx) => (
                                <div className="step-item" key={idx}>
                                    <div className="step-badge">{s.buoc || (idx + 1)}</div>
                                    <div className="step-card">
                                        <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                                            {s.tieu_de && (
                                                <div className="step-title mb-0">{s.tieu_de}</div>
                                            )}
                                            {s.thoi_gian && (
                                                <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill small">
                                                    <i className="fas fa-stopwatch text-success me-1"></i> {s.thoi_gian}
                                                </span>
                                            )}
                                        </div>
                                        <p className="step-desc">{s.noi_dung}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MẸO NHÀ BẾP (NẾU CÓ) */}
                    {dish.meo_nau_an && (
                        <div className="chef-tips-box">
                            <div className="chef-tips-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <div className="chef-tips-content">
                                <h6>Mẹo Bí Truyền Của Đầu Bếp:</h6>
                                <p>{dish.meo_nau_an}</p>
                            </div>
                        </div>
                    )}

                    {/* THÔNG TIN DINH DƯỠNG (NẾU CÓ) */}
                    {dish.dinh_duong && (
                        <div className="mt-4">
                            <h5 className="recipe-section-title">
                                <i className="fas fa-heartbeat text-danger"></i> Giá Trị Dinh Dưỡng Ước Tính (1 Khẩu Phần)
                            </h5>
                            <div className="nutrition-grid">
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Năng lượng</div>
                                    <div className="nutrition-val">{dish.dinh_duong.calo || 0} kcal</div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Chất đạm (Protein)</div>
                                    <div className="nutrition-val">{dish.dinh_duong.protein || '0g'}</div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Chất béo (Lipid)</div>
                                    <div className="nutrition-val">{dish.dinh_duong.chat_beo || '0g'}</div>
                                </div>
                                <div className="nutrition-pill">
                                    <div className="nutrition-label">Tinh bột (Carb)</div>
                                    <div className="nutrition-val">{dish.dinh_duong.carb || '0g'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAGS */}
                    {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                        <div className="recipe-tags-list">
                            {dish.tags.map((t, idx) => (
                                <span key={idx} className="recipe-tag">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
