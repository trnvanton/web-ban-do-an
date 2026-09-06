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
const { filterAndAnalyzeDishes, filterDishesByPreferences, analyzeDishMatch } = require('./src/utils/ingredientMatcher');

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
        const { mode, ingredients, days, preferences } = req.body;
        const totalDays = Math.min(7, Math.max(1, Number(days) || 1));
        
        // 1. Lấy toàn bộ món ăn từ CSDL (đầy đủ thông tin chi tiết)
        const allDishesResult = await query('SELECT * FROM mon_an');
        const rawDishes = Array.isArray(allDishesResult) ? (Array.isArray(allDishesResult[0]) ? allDishesResult[0] : allDishesResult) : [];
        const parseJSON = (v, fb) => { if (!v) return fb; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return fb; } };
        const allDishes = (rawDishes || []).map(d => ({
            ...d,
            thoi_gian_chuan_bi: d.thoi_gian_chuan_bi ? Number(d.thoi_gian_chuan_bi) : 10,
            thoi_gian_nau: d.thoi_gian_nau ? Number(d.thoi_gian_nau) : 15,
            nguyen_lieu_chi_tiet: parseJSON(d.nguyen_lieu_chi_tiet, []),
            cac_buoc_thuc_hien: parseJSON(d.cac_buoc_thuc_hien, []),
            dinh_duong: parseJSON(d.dinh_duong, null),
            tags: parseJSON(d.tags, [])
        }));

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

        let activeMode = mode;
        let targetIngNames = [];

        // Xử lý danh sách nguyên liệu nếu có
        if (ingredients && ingredients.length > 0) {
            const ingArr = Array.isArray(ingredients) ? ingredients.map(Number).filter(Boolean) : [Number(ingredients)].filter(Boolean);
            if (ingArr.length > 0) {
                const placeholders = ingArr.map(() => '?').join(',');
                const ingRows = await query(`SELECT id, ten_nguyen_lieu FROM nguyen_lieu WHERE id IN (${placeholders})`, ingArr);
                targetIngNames = (ingRows || []).map(r => r.ten_nguyen_lieu);
            }
        }

        // Tự động suy luận mode nếu không chỉ định rõ
        if (!activeMode) {
            if (targetIngNames.length >= 2) activeMode = 'ingredients'; // Chế độ 1
            else if (targetIngNames.length === 1) activeMode = 'few_ingredients'; // Chế độ 2
            else activeMode = 'preferences'; // Chế độ 3
        }

        let basePool = allDishes;
        let modeLabel = '';

        if (activeMode === 'preferences') {
            modeLabel = '🔵 Chế độ 3 — Lập thực đơn theo Sở thích & Nhu cầu';
            // Lọc theo các tiêu chí sở thích nếu có
            if (preferences && typeof preferences === 'object') {
                const filtered = filterDishesByPreferences(allDishes, preferences);
                if (filtered.length >= 4) {
                    basePool = filtered;
                }
            }
        } else if (activeMode === 'few_ingredients') {
            modeLabel = `🟡 Chế độ 2 — Có ít nguyên liệu (${targetIngNames.join(', ')}) & Đề xuất đi chợ mua bổ sung`;
        } else {
            modeLabel = `🟢 Chế độ 1 — Gợi ý thực đơn tối ưu theo nguyên liệu có sẵn (${targetIngNames.join(', ')})`;
        }

        // Gắn phân tích nguyên liệu cho từng món
        const analyzedDishes = basePool.map(d => ({
            ...d,
            analysis: analyzeDishMatch(d, targetIngNames)
        }));

        // Phân tách pool theo loại món
        const poolMan = analyzedDishes.filter(isMainCourse);
        const poolXao = analyzedDishes.filter(isStirFry);
        const poolCanh = analyzedDishes.filter(isSoup);
        const poolTrangMieng = analyzedDishes.filter(isDessert);

        // Sinh mâm cơm tự động thông minh
        const usedOverallIds = new Set();
        const selectedMenu = [];
        const aggregatedShoppingMap = new Map();

        const pickSmartDish = (categoryPool, globalPool, usedToday) => {
            const available = categoryPool.filter(d => !usedToday.has(d.id));
            let candidates = available.filter(d => !usedOverallIds.has(d.id));
            if (candidates.length === 0) candidates = available;
            if (candidates.length === 0) candidates = globalPool.filter(d => !usedToday.has(d.id));
            if (candidates.length === 0) candidates = globalPool;

            // Sắp xếp ưu tiên: món khớp nguyên liệu của user trước, hoặc thiếu ít đồ nhất
            const sorted = [...candidates].sort((a, b) => {
                const aScore = a.analysis?.matchScore || 0;
                const bScore = b.analysis?.matchScore || 0;
                if (bScore !== aScore) return bScore - aScore;
                const aMiss = a.analysis?.missingCount || 0;
                const bMiss = b.analysis?.missingCount || 0;
                return aMiss - bMiss;
            });

            const topSlice = sorted.slice(0, Math.min(3, sorted.length));
            const picked = topSlice[Math.floor(Math.random() * topSlice.length)] || sorted[0] || allDishes[0];

            if (picked && picked.id) {
                usedToday.add(picked.id);
                usedOverallIds.add(picked.id);

                // Tổng hợp nguyên liệu cần mua bổ sung vào Shopping List
                if (picked.analysis && Array.isArray(picked.analysis.missingIngredients)) {
                    for (const m of picked.analysis.missingIngredients) {
                        if (!m.isBasicPantry && m.ten) {
                            const key = m.ten.toLowerCase().trim();
                            if (aggregatedShoppingMap.has(key)) {
                                const exist = aggregatedShoppingMap.get(key);
                                exist.count++;
                                if (!exist.dishes.includes(picked.ten_mon)) {
                                    exist.dishes.push(picked.ten_mon);
                                }
                            } else {
                                aggregatedShoppingMap.set(key, {
                                    ten: m.ten,
                                    don_vi: m.don_vi || '',
                                    so_luong: m.so_luong || '',
                                    count: 1,
                                    dishes: [picked.ten_mon]
                                });
                            }
                        }
                    }
                }
            }
            return picked;
        };

        for (let day = 1; day <= totalDays; day++) {
            const usedTodayIds = new Set();
            selectedMenu.push({
                ngay: `Ngày ${day}`,
                bua_trua: {
                    ten_bua: "Bữa Trưa",
                    mon_man: pickSmartDish(poolMan, allDishes.filter(isMainCourse), usedTodayIds),
                    mon_xao_ran: pickSmartDish(poolXao, allDishes.filter(isStirFry), usedTodayIds),
                    mon_canh: pickSmartDish(poolCanh, allDishes.filter(isSoup), usedTodayIds),
                    trang_mieng: pickSmartDish(poolTrangMieng, allDishes.filter(isDessert), usedTodayIds)
                },
                bua_toi: {
                    ten_bua: "Bữa Tối",
                    mon_man: pickSmartDish(poolMan, allDishes.filter(isMainCourse), usedTodayIds),
                    mon_xao_ran: pickSmartDish(poolXao, allDishes.filter(isStirFry), usedTodayIds),
                    mon_canh: pickSmartDish(poolCanh, allDishes.filter(isSoup), usedTodayIds),
                    trang_mieng: pickSmartDish(poolTrangMieng, allDishes.filter(isDessert), usedTodayIds)
                }
            });
        }

        const shoppingList = Array.from(aggregatedShoppingMap.values()).sort((a, b) => b.count - a.count);

        return res.json({
            success: true,
            mode: activeMode,
            modeLabel,
            summary: {
                totalDays,
                totalMeals: totalDays * 2,
                userIngredients: targetIngNames,
                shoppingList
            },
            data: selectedMenu
        });
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
