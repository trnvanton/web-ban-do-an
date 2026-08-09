const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');

const app = express();

// ================= 1. CẤU HÌNH MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình Multer để upload ảnh vào thư mục public/img/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});
const upload = multer({ storage: storage });

// ================= 2. KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_ban_do_an'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        return;
    }
    console.log('✅ Đã kết nối thành công tới Database MySQL (web_ban_do_an)!');
});


// ================= 3. API XÁC THỰC TÀI KHOẢN (ĐĂNG NHẬP) =================
app.post('/api/dang-nhap', (req, res) => {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
        return res.json({ success: false, message: 'Vui lòng điền đầy đủ email và mật khẩu!' });
    }

    const sql = 'SELECT id, ho_ten, email, vai_tro FROM tai_khoan WHERE email = ? AND mat_khau = ?';
    db.query(sql, [email, mat_khau], (err, results) => {
        if (err) {
            console.error('❌ Lỗi SQL:', err);
            return res.status(500).json({ success: false, message: 'Lỗi CSDL!' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({
                success: true,
                user: user,
                redirectUrl: user.vai_tro === 'admin' ? '/admin.html' : '/index.html'
            });
        } else {
            res.json({ success: false, message: 'Email hoặc mật khẩu không chính xác!' });
        }
    });
});


// ================= 4. API QUẢN LÝ SẢN PHẨM BÁN HÀNG =================
// Lấy danh sách sản phẩm
app.get('/api/san-pham', (req, res) => {
    db.query('SELECT * FROM san_pham ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin Thêm sản phẩm mới (Có upload ảnh)
app.post('/api/admin/them-san-pham', upload.single('hinh_anh'), (req, res) => {
    const { ten_san_pham, danh_muc, gia, so_luong_ton, mo_ta } = req.body;
    const hinh_anh = req.file ? req.file.filename : 'fruite-item-1.jpg';

    const sql = 'INSERT INTO san_pham (ten_san_pham, danh_muc, gia, so_luong_ton, hinh_anh, mo_ta) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [ten_san_pham, danh_muc, gia, so_luong_ton || 10, hinh_anh, mo_ta], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// Admin Sửa sản phẩm (Có hỗ trợ cập nhật ảnh mới)
app.put('/api/admin/sua-san-pham/:id', upload.single('hinh_anh'), (req, res) => {
    const { id } = req.params;
    const { ten_san_pham, danh_muc, gia, so_luong_ton, mo_ta } = req.body;

    let sql = `UPDATE san_pham SET ten_san_pham = ?, danh_muc = ?, gia = ?, so_luong_ton = ?, mo_ta = ?`;
    let params = [ten_san_pham, danh_muc, gia, so_luong_ton, mo_ta];

    if (req.file) {
        sql += `, hinh_anh = ?`;
        params.push(req.file.filename);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Lỗi MySQL Cập Nhật Sản Phẩm:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Cập nhật sản phẩm thành công!" });
    });
});

// Admin Xóa sản phẩm
app.delete('/api/admin/xoa-san-pham/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM san_pham WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});


// ================= 5. API QUẢN LÝ MÓN ĂN & GỢI Ý THỰC ĐƠN =================
// Lấy danh sách toàn bộ món ăn
app.get('/api/mon-an', (req, res) => {
    const sql = 'SELECT * FROM mon_an ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin Thêm món ăn mới (Có upload ảnh & phân loại)
app.post('/api/admin/them-mon-an', upload.single('hinh_anh'), (req, res) => {
    const { ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon } = req.body;
    const hinh_anh = req.file ? req.file.filename : 'fruite-item-1.jpg';

    const sql = 'INSERT INTO mon_an (ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [ten_mon, nguyen_lieu_chinh, cong_thuc, hinh_anh, loai_mon || 'Món mặn'], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

// Admin Sửa thông tin món ăn (Có hỗ trợ cập nhật ảnh mới & phân loại)
app.put('/api/admin/sua-mon-an/:id', upload.single('hinh_anh'), (req, res) => {
    const { id } = req.params;
    const { ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon } = req.body;

    let sql = 'UPDATE mon_an SET ten_mon = ?, nguyen_lieu_chinh = ?, cong_thuc = ?, loai_mon = ?';
    let params = [ten_mon, nguyen_lieu_chinh, cong_thuc, loai_mon || 'Món mặn'];

    if (req.file) {
        sql += ', hinh_anh = ?';
        params.push(req.file.filename);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Lỗi sửa món ăn:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Cập nhật món ăn thành công!" });
    });
});

// Admin Xóa món ăn
app.delete('/api/admin/xoa-mon-an/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM mon_an WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// API Gợi ý món ăn thông minh theo từ khóa/nguyên liệu
app.get('/api/goi-y-mon-an', (req, res) => {
    const { keyword } = req.query;
    let sql = `SELECT * FROM mon_an`;
    let queryParams = [];

    if (keyword) {
        sql += ` WHERE ten_mon LIKE ? OR nguyen_lieu_chinh LIKE ? OR cong_thuc LIKE ?`;
        queryParams = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
    }

    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error("Lỗi gợi ý món ăn:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});


// ================= 6. API UPLOAD ẢNH (DÙNG CHUNG) =================
app.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Chưa chọn file ảnh!' });
    }
    res.json({ success: true, filename: req.file.filename });
});


// ================= 7. API QUẢN LÝ ĐƠN HÀNG =================
// Tạo đơn hàng mới từ trang thanh toán (Checkout)
app.post('/api/don-hang', (req, res) => {
    const { user_id, ho_ten, sdt, dia_chi, tong_tien, chi_tiet } = req.body;

    if (!chi_tiet || chi_tiet.length === 0) {
        return res.status(400).json({ success: false, error: "Giỏ hàng trống!" });
    }

    const sqlOrder = `INSERT INTO don_hang (user_id, ten_khach_hang, so_dien_thoai, dia_chi, tong_tien, trang_thai, ngay_dat) VALUES (?, ?, ?, ?, ?, 'Chờ xử lý', NOW())`;
    
    db.query(sqlOrder, [user_id || null, ho_ten, sdt, dia_chi, tong_tien], (err, result) => {
        if (err) {
            console.error("Lỗi tạo đơn hàng:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const donHangId = result.insertId;
        const sqlDetails = `INSERT INTO chi_tiet_don_hang (don_hang_id, product_id, ten_san_pham, gia, so_luong, hinh_anh) VALUES ?`;
        
        const detailsValues = chi_tiet.map(item => [
            donHangId, 
            item.id, 
            item.name, 
            item.price, 
            item.quantity,
            item.image || item.hinh_anh || 'fruite-item-1.jpg'
        ]);

        db.query(sqlDetails, [detailsValues], (err2) => {
            if (err2) {
                console.error("Lỗi lưu chi tiết đơn hàng:", err2);
                return res.status(500).json({ success: false, error: err2.message });
            }
            res.json({ success: true, message: "Đặt hàng thành công!", donHangId });
        });
    });
});

// Admin lấy danh sách toàn bộ đơn hàng
app.get('/api/admin/don-hang', (req, res) => {
    const sql = `SELECT * FROM don_hang ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi lấy danh sách đơn hàng Admin:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});

// Admin cập nhật trạng thái đơn hàng
app.put('/api/admin/don-hang/:id', (req, res) => {
    const { id } = req.params;
    const { trang_thai } = req.body;

    const sql = `UPDATE don_hang SET trang_thai = ? WHERE id = ?`;
    db.query(sql, [trang_thai, id], (err, result) => {
        if (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Cập nhật trạng thái thành công!" });
    });
});

// User lấy lịch sử đơn hàng của mình
app.get('/api/user/don-hang', (req, res) => {
    const { user_id, keyword } = req.query;
    
    let sql = `SELECT * FROM don_hang WHERE `;
    let queryParams = [];

    if (user_id) {
        sql += `user_id = ? `;
        queryParams.push(user_id);
    } else if (keyword) {
        sql += `ten_khach_hang LIKE ? OR so_dien_thoai LIKE ? `;
        queryParams.push(`%${keyword}%`, `%${keyword}%`);
    } else {
        sql += `1 = 0`;
    }

    sql += ` ORDER BY id DESC`;

    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error("Lỗi lấy đơn hàng của user:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});

// Lấy chi tiết sản phẩm của một đơn hàng
app.get('/api/don-hang/:id/chi-tiet', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM chi_tiet_don_hang WHERE don_hang_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Lỗi lấy chi tiết đơn hàng:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});


// ================= 8. API SỔ ĐỊA CHỈ GIAO HÀNG =================
// Lấy danh sách địa chỉ của user
app.get('/api/user/dia-chi/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT * FROM dia_chi_giao_hang WHERE user_id = ? ORDER BY mac_dinh DESC, id DESC`;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});

// Thêm địa chỉ mới
app.post('/api/user/dia-chi', (req, res) => {
    const { user_id, ho_ten, sdt, dia_chi, mac_dinh } = req.body;

    if (mac_dinh) {
        db.query(`UPDATE dia_chi_giao_hang SET mac_dinh = 0 WHERE user_id = ?`, [user_id], (err) => {
            if (err) console.error("Lỗi update mặc định:", err);
        });
    }

    const sql = `INSERT INTO dia_chi_giao_hang (user_id, ho_ten, sdt, dia_chi, mac_dinh) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [user_id, ho_ten, sdt, dia_chi, mac_dinh ? 1 : 0], (err, result) => {
        if (err) {
            console.error("Lỗi lưu địa chỉ vào CSDL:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Thêm địa chỉ thành công!", id: result.insertId });
    });
});

// Xóa địa chỉ
app.delete('/api/user/dia-chi/:id', (req, res) => {
    const { id } = req.params;
    db.query(`DELETE FROM dia_chi_giao_hang WHERE id = ?`, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Đã xóa địa chỉ thành công!" });
    });
});


// ================= 9. API QUẢN LÝ TÀI KHOẢN (ADMIN) =================
app.get('/api/admin/tai-khoan', (req, res) => {
    const sql = 'SELECT id, ho_ten, email, vai_tro, ngay_tao FROM tai_khoan ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// ================= 10. KHỞI ĐỘNG SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('====================================================');
    console.log(` Server đang chạy tại: http://localhost:${PORT}`);
    console.log('====================================================');
});