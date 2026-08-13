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
const { signToken, setAuthCookie } = require('./src/middleware/auth');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const dishRoutes = require('./src/routes/dish.routes');
const orderRoutes = require('./src/routes/order.routes');
const addressRoutes = require('./src/routes/address.routes');
const userRoutes = require('./src/routes/user.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const reviewRoutes = require('./src/routes/review.routes');

const app = express();

// Middleware xử lý cho môi trường Serverless (Cloudflare Workers)
app.use((req, res, next) => {
    if (req.body !== undefined && typeof req.body === 'object') {
        req._body = true;
    }
    next();
});

// Helmet: tự động set các header bảo mật HTTP (X-Frame-Options, CSP, ...)
app.use(helmet({
    contentSecurityPolicy: false // Tắt CSP vì template dùng inline script
}));

// Đọc cookie (phục vụ xác thực)
app.use(cookieParser());

// Body parser (chỉ dùng trên môi trường Node.js local; trên Cloudflare Workers body đã được worker.js parse sẵn)
if (typeof globalThis.WebSocketPair === 'undefined' && !globalThis.env) {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
}

// Ghi log request (chỉ bật trên môi trường Node.js local, tắt ở Cloudflare Workers vì EvalError)
if (typeof globalThis.WebSocketPair === 'undefined' && !globalThis.env) {
    app.use(morgan('dev'));
}

// Ảnh upload được lưu trong be/public/uploads, phục vụ tại /uploads (nếu ở môi trường có filesystem)
if (typeof __dirname !== 'undefined') {
    app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
}


// Cấu hình CORS toàn diện (cho phép Vercel, localhost và mọi origin với credentials)
app.use(cors({
    origin: true, // Tự động echo Origin của request, hỗ trợ credentials = true
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept']
}));
// ================= CHỐNG BRUTE-FORCE (tấn công đoán mật khẩu) =================
if (typeof globalThis.WebSocketPair === 'undefined' && process.env.DB_DRIVER !== 'd1') {
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 phút
        max: 20,                  // tối đa 20 lần đăng nhập/đăng ký mỗi IP
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: 'Quá nhiều lần thử! Vui lòng đợi 15 phút rồi thử lại.' }
    });
    app.use('/api/dang-nhap', authLimiter);
    app.use('/api/dang-ky', authLimiter);
}


// ================= ROUTES =================
app.get('/api/test-db', async (req, res) => {
    try {
        const users = await query('SELECT id, ho_ten, email, vai_tro FROM tai_khoan');
        res.json({ success: true, count: users.length, users });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', dishRoutes);
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', userRoutes);
app.use('/api', uploadRoutes);
app.use('/api', reviewRoutes);

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
        
        // 1. Lấy toàn bộ món ăn từ CSDL
        const allDishesResult = await query('SELECT id, ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon FROM mon_an');
        const allDishes = Array.isArray(allDishesResult) ? (Array.isArray(allDishesResult[0]) ? allDishesResult[0] : allDishesResult) : [];

        if (!allDishes || allDishes.length === 0) {
            return res.json({ success: false, message: "Cơ sở dữ liệu trống món ăn." });
        }

        // 2. Phân loại nghiêm ngặt nhóm món ăn
        const isDessert = (d) => {
            const cat = (d.loai_mon || '').toLowerCase();
            const name = (d.ten_mon || '').toLowerCase();
            return cat.includes('tráng miệng') || name.includes('tráng miệng') || cat.includes('hoa quả') || cat.includes('trái cây');
        };
        const isSoup = (d) => {
            const cat = (d.loai_mon || '').toLowerCase();
            const name = (d.ten_mon || '').toLowerCase();
            return !isDessert(d) && (cat.includes('canh') || name.startsWith('canh'));
        };
        const isStirFry = (d) => {
            const cat = (d.loai_mon || '').toLowerCase();
            const name = (d.ten_mon || '').toLowerCase();
            return !isDessert(d) && !isSoup(d) && (cat.includes('xào') || cat.includes('rau') || name.includes('xào') || cat.includes('chay'));
        };
        const isMainCourse = (d) => !isDessert(d) && !isSoup(d) && !isStirFry(d);

        const globalMan = allDishes.filter(isMainCourse);
        const globalXao = allDishes.filter(isStirFry);
        const globalCanh = allDishes.filter(isSoup);
        const globalTrangMieng = allDishes.filter(isDessert);

        // 3. Khớp các món ăn với danh sách nguyên liệu người dùng đã chọn
        let matchedDishes = [];
        if (ingredients && ingredients.length > 0) {
            const ingArr = Array.isArray(ingredients) ? ingredients.map(Number).filter(Boolean) : [Number(ingredients)].filter(Boolean);
            if (ingArr.length > 0) {
                const placeholders = ingArr.map(() => '?').join(',');
                const ingRows = await query(`SELECT id, ten_nguyen_lieu FROM nguyen_lieu WHERE id IN (${placeholders})`, ingArr);
                const ingNames = (ingRows || []).map(r => r.ten_nguyen_lieu.split('/')[0].split('(')[0].trim().toLowerCase());

                if (ingNames.length > 0) {
                    matchedDishes = allDishes.filter(dish => {
                        const text = `${dish.ten_mon || ''} ${dish.nguyen_lieu_chinh || ''}`.toLowerCase();
                        return ingNames.some(k => text.includes(k));
                    });
                }
            }
        }

        const matchedMan = matchedDishes.filter(isMainCourse);
        const matchedXao = matchedDishes.filter(isStirFry);
        const matchedCanh = matchedDishes.filter(isSoup);
        const matchedTrangMieng = matchedDishes.filter(isDessert);

        // 4. Sinh mâm cơm tự động (không trùng lặp món trong ngày)
        const totalDays = Number(days) || 1;
        const selectedMenu = [];
        const usedOverallIds = new Set();

        for (let day = 1; day <= totalDays; day++) {
            const usedTodayIds = new Set();

            const pickDish = (matchedPool, globalPool) => {
                let pool = matchedPool.filter(d => !usedTodayIds.has(d.id));
                if (pool.length === 0) pool = globalPool.filter(d => !usedTodayIds.has(d.id));
                if (pool.length === 0) pool = globalPool.filter(d => !usedOverallIds.has(d.id));
                if (pool.length === 0) pool = globalPool.length > 0 ? globalPool : (matchedPool.length > 0 ? matchedPool : allDishes);

                const selected = pool[Math.floor(Math.random() * pool.length)];
                if (selected && selected.id) {
                    usedTodayIds.add(selected.id);
                    usedOverallIds.add(selected.id);
                }
                return selected;
            };

            selectedMenu.push({
                ngay: `Ngày ${day}`,
                bua_trua: {
                    ten_bua: "Bữa Trưa",
                    mon_man: pickDish(matchedMan, globalMan),
                    mon_xao_ran: pickDish(matchedXao, globalXao),
                    mon_canh: pickDish(matchedCanh, globalCanh),
                    trang_mieng: pickDish(matchedTrangMieng, globalTrangMieng)
                },
                bua_toi: {
                    ten_bua: "Bữa Tối",
                    mon_man: pickDish(matchedMan, globalMan),
                    mon_xao_ran: pickDish(matchedXao, globalXao),
                    mon_canh: pickDish(matchedCanh, globalCanh),
                    trang_mieng: pickDish(matchedTrangMieng, globalTrangMieng)
                }
            });
        }

        return res.json({ success: true, data: selectedMenu });
    } catch (error) {
        console.error("Lỗi hệ thống lập menu:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
        console.log('====================================================');
        console.log(` Server đang chạy tại: http://localhost:${PORT}`);
        console.log('====================================================');
    });
}

module.exports = app;
