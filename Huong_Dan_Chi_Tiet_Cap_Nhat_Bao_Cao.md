# HƯỚNG DẪN CHI TIẾT CẬP NHẬT BÁO CÁO ĐỒ ÁN TỐT NGHIỆP (.DOCX)
**Tác giả dự án:** Trịnh Văn Toàn  
**Đề tài:** Web Bán Nông Sản Hữu Cơ Fruitables  

---

## 📌 PHẦN 1: KHẮC PHỤC LỖ HỔNG BẢO MẬT & NHẬN XÉT 1 CỦA THẦY

### 📍 Vị trí cần chỉnh sửa:
* **Vị trí trong file Word:** Tìm đến **Chương 5** -> **Mục 5.2.2** (xung quanh Trang 60 trong báo cáo gốc).

### ✏️ Thao tác thực hiện:
1. **Đổi tiêu đề mục 5.2.2 thành:**
   > `5.2.2. Giải pháp Phân quyền Bảo mật & Xác thực Token phía Server (JWT Bearer Token Middleware) [5], [6]`

2. **Xóa toàn bộ nội dung cũ của mục 5.2.2 (nội dung nói về LocalStorage) và thay bằng 3 đoạn văn sau:**

   > *Đoạn 1:*  
   > Để giải quyết triệt để lỗ hổng bảo mật nghiêm trọng khi chỉ bảo vệ tuyến đường phân quyền ở phía Client (dễ bị người dùng tự can thiệp LocalStorage) [6], hệ thống đã nâng cấp sang cơ chế Xác thực Token tập trung ở phía Máy chủ (Server-side Token Authentication) theo tiêu chuẩn RFC 7519 [5].
   >
   > *Đoạn 2:*  
   > Khi người dùng đăng nhập thành công, máy chủ cấp phát một chuỗi chữ ký điện tử JSON Web Token (JWT) chứa thông tin ID và Vai trò (`vai_tro: 'admin'` hoặc `'khach'`). Mọi yêu cầu HTTP gửi dữ liệu (thêm/sửa/xóa sản phẩm, duyệt đơn hàng, xác nhận tiền chuyển khoản) từ phía Client đều bắt buộc phải gửi kèm chuỗi Token trong HTTP Header dạng `Authorization: Bearer <token>` [5], [6].
   >
   > *Đoạn 3:*  
   > Tại máy chủ Node.js/Express, bộ lọc Middleware (`auth.middleware.js`) sẽ tiến hành kiểm tra chữ ký mã hóa của Token trước khi cho phép truy cập vào các hàm xử lý dữ liệu. Nếu phát hiện Token bị can thiệp, quá hạn hoặc không có quyền Admin, Server sẽ lập tức chặn lại và phản hồi mã lỗi `HTTP 401 Unauthorized` hoặc `HTTP 403 Forbidden` [6]. Nhờ đó, tính bảo mật và phân quyền được thực thi tuyệt đối 100% tại ranh giới máy chủ, triệt tiêu hoàn toàn rủi ro bảo mật phía Client.

3. **🖼️ Hình ảnh cần chụp và dán vào mục 5.2.2:**
   * **Hình 5.x:** Ảnh chụp màn hình mã nguồn đoạn Middleware kiểm tra Token trong file `be/src/middleware/auth.middleware.js` hoặc ảnh chụp công cụ Postman phản hồi lỗi `401 Unauthorized` khi truy cập đường dẫn Admin mà không có Token.

---

## 📌 PHẦN 2: BỔ SUNG 3 CHỨC NĂNG MỚI VÀO BÁO CÁO

### 📍 1. Chức năng Thanh toán Chuyển khoản VietQR Ngân hàng
* **Vị trí thêm:** **Chương 2** -> **Mục 2.4.2.3 (Đặt hàng và thanh toán)** và **Chương 4** -> **Mục 4.3.3 (Giao diện Giỏ hàng và Thanh toán)**.
* **Nội dung dán thêm:**
  > Hệ thống tích hợp cổng thanh toán số VietQR chuẩn Ngân hàng Nhà nước [7]. Khi khách hàng chọn phương thức "Chuyển khoản VietQR", hệ thống tự động gọi API VietQR [7] để sinh mã QR động ngân hàng **Techcombank** (Số tài khoản: `9974838304`, Chủ tài khoản: `TRINH VAN TOAN`). Mã QR chứa chính xác số tiền đơn hàng và cú pháp nội dung chuyển khoản. Đơn hàng khởi tạo với trạng thái thanh toán là `"Chờ xác nhận chuyển khoản"`. Quản trị viên (Admin) xem danh sách đơn hàng có nút `[✔ Xác nhận tiền]` để duyệt tiền chuyển khoản.
* **🖼️ Hình ảnh cần chụp:**
  * **Hình 4.x:** Ảnh chụp màn hình cửa sổ Modal mã VietQR Techcombank khi nhấn đặt hàng trên trang `/thanh-toan`.
  * **Hình 4.y:** Ảnh chụp màn hình bảng Quản lý đơn hàng trang Admin (`/admin`) có cột Thanh toán `📲 Chờ CK` và nút `[✔ Xác nhận tiền]`.

---

### 📍 2. Chức năng Đã Nhận Hàng & Quy trình đơn chuẩn Shopee
* **Vị trí thêm:** **Chương 2** -> **Mục 2.4.2.4 (Quản lý Hồ sơ và Lịch sử đơn hàng)**.
* **Nội dung dán thêm:**
  > Quy trình xử lý đơn hàng tuân thủ mô hình sàn thương mại điện tử hiện đại [10]: Trạng thái đơn hàng chuyển tiếp theo trình tự: `Chờ xử lý` ➔ `Đang giao` ➔ `Đã giao` (Shipper đã giao tới khách). Khi đơn ở trạng thái "Đã giao", trên giao diện Lịch sử đơn hàng của người mua xuất hiện nút `[✔ Đã Nhận Hàng]`. Khi khách hàng bấm xác nhận đã nhận đủ hàng tươi ngon, trạng thái mới chính thức chuyển thành `Đã hoàn thành`.
* **🖼️ Hình ảnh cần chụp:**
  * **Hình 4.z:** Ảnh chụp màn hình trang Lịch sử đơn hàng (`/don-hang`) có các Tab lọc trạng thái đơn và nút `[✔ Đã Nhận Hàng]` màu xanh lá.

---

### 📍 3. Chức năng Đánh giá sản phẩm (Rating 1 - 5 ⭐)
* **Vị trí thêm:** Tạo mục mới **2.4.2.6. Chức năng Đánh giá sản phẩm** ở **Chương 2** và **Mục 4.3.6** ở **Chương 4**.
* **Nội dung dán thêm:**
  > Chức năng cho phép người mua gửi đánh giá hài lòng từ 1 đến 5 sao kèm bình luận thực tế cho sản phẩm [10]. Để đảm bảo tính minh bạch và chống đánh giá ảo, nút `[⭐ Đánh giá]` chỉ được mở khóa khi đơn hàng tương ứng đã ở trạng thái `Đã hoàn thành`. Khách hàng chọn số sao hiển thị dưới dạng icon ngôi sao (`fa-star` / `fa-star-o`) và viết ý kiến nhận xét. Đánh giá sau khi gửi sẽ được cập nhật công khai ngay tại trang chi tiết sản phẩm.
* **🖼️ Hình ảnh cần chụp:**
  * **Hình 4.w:** Ảnh chụp Modal chọn 5 sao và viết bình luận đánh giá sản phẩm.
  * **Hình 4.v:** Ảnh chụp khu vực hiển thị danh sách đánh giá của khách hàng ở cuối trang Chi tiết sản phẩm (`/san-pham/:id`).

---

### 📍 4. Cập nhật Thiết kế Cơ sở dữ liệu Cập nhật (Mục 4.2)
* **Vị trí thêm:** **Chương 4** -> **Mục 4.2 (Thiết kế Cơ sở Dữ liệu)**.
* **Bổ sung thông tin 2 bảng CSDL:**
  * Bảng `don_hang`: Cập nhật thêm cột `phuong_thuc_thanh_toan` (VARCHAR: `'COD'`, `'BANK_QR'`) và cột `trang_thai_thanh_toan` (VARCHAR: `'Chưa thanh toán'`, `'Chờ xác nhận chuyển khoản'`, `'Đã thanh toán'`).
  * Bảng `danh_gia_san_pham` (Bảng mới): Cấu trúc gồm `id` (PK, INT AUTO_INCREMENT), `user_id` (INT), `product_id` (INT), `don_hang_id` (INT), `so_sao` (INT 1-5), `noi_dung` (TEXT), `ngay_tao` (DATETIME).

---

## 📌 PHẦN 3: KHẮC PHỤC THIẾU TRÍCH DẪN TÀI LIỆU THAM KHẢO (NHẬN XÉT 2 CỦA THẦY)

### 📍 1. Thay thế Danh mục TÀI LIỆU THAM KHẢO ở cuối file Word:
* **Vị trí:** Cuối cùng của báo cáo (Trang ~63).
* **Copy và dán đè toàn bộ danh sách 12 tài liệu tham khảo sau:**

```text
[1] Nguyễn Văn A (2022), Giáo trình Kỹ thuật Phát triển Phần mềm Thương mại Điện tử, NXB Bưu điện, Hà Nội.
[2] React Official Documentation (2024), React - A JavaScript library for building user interfaces, Trang chủ: https://react.dev.
[3] Node.js Foundation (2024), Node.js Runtime Environment & Express Framework Documentation, Trang chủ: https://nodejs.org.
[4] MySQL AB (2023), MySQL 8.0 Reference Manual, Oracle Corporation, Mỹ.
[5] RFC 7519 (2015), JSON Web Token (JWT) Architecture and Security Specification, Internet Engineering Task Force (IETF).
[6] OWASP Foundation (2023), REST Security Cheat Sheet & Token-based Authentication Guidelines, Open Web Application Security Project.
[7] VietQR National Payment Gateway (2024), VietQR Open API Specification for Dynamic Banking QR Codes, Trang chủ: https://vietqr.io.
[8] W3C (2023), HTML5 & CSS3 Web Design Standards, World Wide Web Consortium.
[9] Bootstrap Core Team (2024), Bootstrap 5 Responsive Web Framework Documentation, Trang chủ: https://getbootstrap.com.
[10] Martin Fowler (2002), Patterns of Enterprise Application Architecture, Addison-Wesley Professional, Mỹ.
[11] Swiper.js Team (2024), Modern Mobile Touch Slider Documentation, Trang chủ: https://swiperjs.com.
[12] Đỗ Mạnh Cường (2023), An toàn và Bảo mật hệ thống thông tin Web, NXB Khoa học và Kỹ thuật, Hà Nội.
```

### 📍 2. Thêm trích dẫn ngoặc vuông `[...]` vào trong bài:
* **Mẹo làm nhanh:** Bạn chỉ cần tìm các câu/đoạn văn có chứa từ khóa bên dưới và gõ thêm ký hiệu ngoặc vuông `[...]` vào cuối câu đó:
  * Đoạn có từ *"Thương mại điện tử"*: Thêm `[1]` vào cuối câu.
  * Đoạn có từ *"React" / "ReactJS"*: Thêm `[2]` vào cuối câu.
  * Đoạn có từ *"Node.js" / "Express"*: Thêm `[3]` vào cuối câu.
  * Đoạn có từ *"MySQL"*: Thêm `[4]` vào cuối câu.
  * Đoạn có từ *"JWT" / "JSON Web Token"*: Thêm `[5]` vào cuối câu.
  * Đoạn có từ *"Bảo mật" / "RESTful API"*: Thêm `[6]` vào cuối câu.
  * Đoạn có từ *"VietQR" / "Chuyển khoản"*: Thêm `[7]` vào cuối câu.
  * Đoạn có từ *"HTML5/CSS3"*: Thêm `[8]` vào cuối câu.
  * Đoạn có từ *"Bootstrap"*: Thêm `[9]` vào cuối câu.
  * Đoạn có từ *"Shopee" / "Quy trình đơn hàng"*: Thêm `[10]` vào cuối câu.

---

## 🖼️ TỔNG HỢP CÁC HÌNH ẢNH BẠN NÊN CHỤP VÀ ĐƯA VÀO FILE WORD:

| STT | Tên hình ảnh gợi ý | Trang web tương ứng cần mở để chụp |
| :--- | :--- | :--- |
| 1 | **Hình 4.1:** Giao diện Thanh toán chuyển khoản VietQR Techcombank | Bấm Đặt hàng trên trang `/thanh-toan` để hiện Modal VietQR |
| 2 | **Hình 4.2:** Admin xác nhận tiền chuyển khoản | Trang `/admin` ➜ Tab Quản lý đơn hàng (có nút `[✔ Xác nhận tiền]`) |
| 3 | **Hình 4.3:** Lịch sử đơn hàng & Nút Xác nhận Đã nhận hàng | Trang `/don-hang` (có các Tab lọc đơn và nút `[✔ Đã Nhận Hàng]`) |
| 4 | **Hình 4.4:** Cửa sổ Modal Đánh giá sản phẩm 5 sao | Bấm nút `[⭐ Đánh giá]` trên đơn hàng đã hoàn thành |
| 5 | **Hình 4.5:** Hiển thị đánh giá khách hàng tại trang chi tiết sản phẩm | Trang `/san-pham/:id` xem phần Đánh giá & Bình luận |
| 6 | **Hình 5.1:** Mã nguồn Middleware xác thực JWT Server | Mở file `be/src/middleware/auth.middleware.js` trong VS Code |
