# Fruitables - Web bán đồ ăn (React + Node.js)

Cửa hàng nông sản hữu cơ trực tuyến. Frontend **React (Vite)**, backend **Node.js (Express)**,
cấu trúc 2 thư mục `fe/` (frontend) và `be/` (backend).

## Cấu trúc

```
web-ban-do-an/
├── be/                # Backend: Express + MySQL/SQLite
│   ├── server.js      # Entry point
│   ├── src/config/    # Kết nối DB (chọn driver MySQL hoặc SQLite)
│   ├── src/middleware/# Xác thực JWT, validate, upload an toàn
│   ├── src/routes/    # API: auth, sản phẩm, món ăn, đơn hàng, địa chỉ...
│   ├── src/utils/     # Response chuẩn, logger
│   ├── public/uploads/# Ảnh admin upload (phục vụ tại /uploads)
│   └── data/          # File SQLite khi chạy DB_DRIVER=sqlite (tự tạo)
├── fe/                # Frontend: React + Vite + React Router
│   ├── public/        # CSS/ảnh/lib của template
│   └── src/
│       ├── pages/     # Home, Shop, ShopDetail, Cart, Checkout, Login,
│       │              # Profile, Address, MyOrders, Recipes, Testimonial,
│       │              # Contact, Admin, NotFound
│       ├── components/# Navbar, Footer, ProductCard
│       ├── contexts/  # AuthContext (đăng nhập), CartContext (giỏ hàng)
│       └── api.js     # Fetch wrapper (tự gửi cookie phiên)
```

## Chạy local (2 terminal)

Yêu cầu: Node.js >= 18.

### 1. Backend (`be/`) — port 3000

```bash
cd be
npm install
npm start        # hoặc npm run dev (tự reload khi sửa code)
```

Mặc định dùng **SQLite** (không cần cài MySQL) và tự **seed dữ liệu demo** lần đầu.
Đổi sang MySQL khi deploy: sửa `be/.env` → `DB_DRIVER=mysql` và khai báo `DB_*`.

### 2. Frontend (`fe/`) — port 5173

```bash
cd fe
npm install
npm run dev      # mở http://localhost:5173
```

Vite tự proxy `/api` và `/uploads` sang backend (cấu hình trong `fe/vite.config.js`).

## Tài khoản demo (SQLite)

| Vai trò | Email            | Mật khẩu |
|---------|------------------|----------|
| Admin   | admin@gmail.com  | admin123 |
| Khách   | khach@gmail.com  | khach123 |

## Tính năng bảo mật

- Mật khẩu hash **bcrypt** (mật khẩu cũ lưu trần tự nâng cấp khi đăng nhập)
- Phiên đăng nhập bằng **JWT trong cookie httpOnly** — JS client không đọc được,
  không thể tự sửa localStorage thành admin như trước
- Toàn bộ API `/api/admin/*` được bảo vệ (kiểm tra vai trò phía server)
- Địa chỉ/đơn hàng của user được lấy từ token, không tin dữ liệu client gửi lên
- Chống brute-force đăng nhập (rate limit), header an toàn (helmet), giới hạn
  payload, upload chỉ nhận ảnh (tối đa 5MB), validate & escape XSS mọi dữ liệu
- Lỗi server trả thông báo chung, không lộ chi tiết kỹ thuật

## Build sản phẩm

```bash
cd fe && npm run build   # xuất ra fe/dist (HTML tĩnh + JS)
```

Để deploy: đưa `fe/dist` lên web server (VPS/Nginx/Vercel...), chạy `be` trên
máy chủ Node, proxy `/api` + `/uploads` về backend, đổi `JWT_SECRET` trong `be/.env`.
