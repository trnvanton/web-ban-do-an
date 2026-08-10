require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const { query } = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const dishRoutes = require('./src/routes/dish.routes');
const orderRoutes = require('./src/routes/order.routes');
const addressRoutes = require('./src/routes/address.routes');
const userRoutes = require('./src/routes/user.routes');
const uploadRoutes = require('./src/routes/upload.routes');

const app = express();

// ================= CẤU HÌNH AN TOÀN CƠ BẢN =================
// Helmet: tự động set các header bảo mật HTTP (X-Frame-Options, CSP, ...)
app.use(helmet({
    contentSecurityPolicy: false // Tắt CSP vì template dùng inline script
}));

// Đọc cookie (phục vụ xác thực)
app.use(cookieParser());

// Body parser (giới hạn payload 1MB - chống request khổng lồ)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ghi log mọi request
app.use(morgan('dev'));

// Ảnh upload được lưu trong be/public/uploads, phục vụ tại /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use(cors({
    origin: 'http://localhost:5173', // Cho phép Frontend truy cập
    credentials: true
}));
// ================= CHỐNG BRUTE-FORCE (tấn công đoán mật khẩu) =================
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 20,                  // tối đa 20 lần đăng nhập/đăng ký mỗi IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Quá nhiều lần thử! Vui lòng đợi 15 phút rồi thử lại.' }
});
app.use('/api/dang-nhap', authLimiter);
app.use('/api/dang-ky', authLimiter);

// ================= ROUTES =================
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', dishRoutes);
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', userRoutes);
app.use('/api', uploadRoutes);

// ================= API BỔ SUNG (NGUYÊN LIỆU & MENU) =================

// Lấy danh sách nguyên liệu
app.get('/api/nguyen-lieu', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM nguyen_lieu'); // Dùng biến 'query' đã import
        const grouped = rows.reduce((acc, item) => {
            const category = item.loai || 'Khác';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {});
        res.json({ success: true, data: grouped });
    } catch (error) {
        console.error("Lỗi lấy nguyên liệu:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

app.post('/api/menu/generate', async (req, res) => {
    try {
        const { ingredients, days } = req.body;
        let dishes = [];

        try {
            if (ingredients && ingredients.length > 0) {
                const sql = `SELECT DISTINCT MA.id, MA.ten_mon, MA.cong_thuc, MA.hinh_anh, MA.loai_mon 
                             FROM mon_an MA 
                             JOIN dinh_luong DL ON MA.id = DL.id_mon 
                             WHERE DL.id_nguyen_lieu IN (?)`;
                const [rows] = await query(sql, [ingredients]);
                if (rows && rows.length > 0) dishes = rows;
            }
        } catch (dbErr) {
            console.error("Lỗi truy vấn:", dbErr.message);
        }

        // Nếu chưa có định lượng, lấy toàn bộ món ăn
        if (!dishes || dishes.length === 0) {
            const result = await query('SELECT id, ten_mon, cong_thuc, hinh_anh, loai_mon FROM mon_an');
            dishes = Array.isArray(result[0]) ? result[0] : result;
        }

        if (!dishes || dishes.length === 0) {
            return res.json({ success: false, message: "Cơ sở dữ liệu trống món ăn." });
        }

        // Phân loại món ăn theo đúng 4 nhóm yêu cầu: Canh, Mặn, Xào/Rán, Tráng miệng
        const poolMan = dishes.filter(d => (d.loai_mon || '').toLowerCase().includes('mặn') || (d.loai_mon || '').toLowerCase().includes('kho') || (d.loai_mon || '').toLowerCase().includes('rán') || (d.loai_mon || '').toLowerCase().includes('chiên'));
        const poolXaoRau = dishes.filter(d => (d.loai_mon || '').toLowerCase().includes('xào') || (d.loai_mon || '').toLowerCase().includes('rau'));
        const poolCanh = dishes.filter(d => (d.loai_mon || '').toLowerCase().includes('canh'));
        const poolTrangMieng = dishes.filter(d => (d.loai_mon || '').toLowerCase().includes('tráng miệng') || (d.loai_mon || '').toLowerCase().includes('hoa quả') || (d.loai_mon || '').toLowerCase().includes('trái cây'));

        // Hàm lấy ngẫu nhiên 1 món từ pool (nếu nhóm nào trống thì lấy tạm món bất kỳ trong danh sách)
        const getRandomDish = (pool) => {
            const target = pool.length > 0 ? pool : dishes;
            return target[Math.floor(Math.random() * target.length)];
        };

        let selectedMenu = [];
        let totalDays = Number(days) || 3;

        for (let day = 1; day <= totalDays; day++) {
            // Mỗi ngày có 2 bữa: Bữa Trưa và Bữa Tối, mỗi bữa đủ 4 món
            selectedMenu.push({
                ngay: `Ngày ${day}`,
                bua_trua: {
                    ten_bua: "Bữa Trưa",
                    mon_man: getRandomDish(poolMan),
                    mon_xao_ran: getRandomDish(poolXaoRau),
                    mon_canh: getRandomDish(poolCanh),
                    trang_mieng: getRandomDish(poolTrangMieng)
                },
                bua_toi: {
                    ten_bua: "Bữa Tối",
                    mon_man: getRandomDish(poolMan),
                    mon_xao_ran: getRandomDish(poolXaoRau),
                    mon_canh: getRandomDish(poolCanh),
                    trang_mieng: getRandomDish(poolTrangMieng)
                }
            });
        }

        return res.json({ success: true, data: selectedMenu });
    } catch (error) {
        console.error("Lỗi hệ thống lập menu:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
});

// ================= KHỞI ĐỘNG SERVER (DUY NHẤT 1 LẦN) =================
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log('====================================================');
    console.log(` Server đang chạy tại: http://localhost:${PORT}`);
    console.log('====================================================');
});