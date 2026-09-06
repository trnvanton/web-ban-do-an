// ============================================================
// Dữ liệu làm giàu chi tiết cho toàn bộ 52 món ăn
// Hợp nhất từ 4 phần chuyên biệt (Món Mặn, Kho/Hầm, Canh/Xào, Ăn Kèm/Tráng Miệng)
// Chuẩn hóa: Thông tin cơ bản, Nguyên liệu định lượng, Các bước nấu chuẩn đầu bếp,
// Mẹo nhà bếp, Dinh dưỡng và Tags khẩu vị
// ============================================================

const { PART_1 } = require('./data_part1');
const { PART_2 } = require('./data_part2');
const { PART_3 } = require('./data_part3');
const { PART_4 } = require('./data_part4');

const DISHES_DATA = {
    ...PART_1,
    ...PART_2,
    ...PART_3,
    ...PART_4
};

module.exports = { DISHES_DATA };
