# Midterm CDN Demo

Trang web tĩnh này được chuẩn bị để demo nội dung CDN và cache hit/miss bằng GitHub Pages + Cloudflare.

## Mục đích

- `index.html` cung cấp giao diện thử nghiệm nhanh.
- `script.js` đo thời gian tải ảnh và hiển thị kết quả.
- `README.md` chứa hướng dẫn kiểm tra thực tế với GitHub Pages và Cloudflare.

> Lưu ý: trang này hiện tại chỉ mô phỏng so sánh nhanh/chậm giữa hai trạng thái. Để đúng bài tập CDN, bạn cần deploy lên GitHub Pages và thực hiện kiểm tra thật sự với Cloudflare, quan sát header `CF-Cache-Status`.

## Cấu trúc file

- `index.html`: giao diện demo bật/tắt CDN.
- `styles.css`: style cho trang.
- `script.js`: logic kiểm tra và hiển thị thời gian.
- `images/`: chứa ảnh lớn dùng để đo tốc độ.
- `generate_images.py`: script tạo ảnh nếu cần.

## Hướng dẫn deploy lên GitHub Pages

### Bước 1: Tạo repository GitHub

1. Đăng nhập GitHub.
2. Nhấn nút **New repository**.
3. Đặt tên repo, ví dụ: `midterm-cdn-demo`.
4. Chọn **Public** (miễn phí).
5. Không chọn **Add a README file** hoặc **.gitignore**.
6. Nhấn **Create repository**.

### Bước 2: Push code lên GitHub

1. Mở Command Prompt hoặc Git Bash trong thư mục `C:\xampp\htdocs\Midterm`.
2. Khởi tạo Git repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Thêm remote repository:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/midterm-cdn-demo.git
   ```
4. Push lên:

   ```bash
   git push -u origin main
   ```

### Bước 3: Bật GitHub Pages

1. Vào repo trên GitHub.
2. Nhấn **Settings** > **Pages**.
3. Chọn **Source**: **Deploy from a branch**.
4. Chọn **Branch**: `main` và folder `/ (root)`.
5. Nhấn **Save**.
6. Chờ vài phút, URL sẽ xuất hiện: `https://YOUR_USERNAME.github.io/midterm-cdn-demo/`.

## Hướng dẫn kiểm tra thực tế

### 1. Đo tốc độ trước khi dùng Cloudflare

- Mở Chrome DevTools > Tab `Network`.
- Tải lại trang demo.
- Chọn một ảnh trong danh sách.
- Xem `Response Headers`.
- Nếu chưa dùng Cloudflare, header `CF-Cache-Status` có thể không xuất hiện hoặc trả về `MISS`.

### 2. Kết nối Cloudflare

1. Đăng ký tài khoản Cloudflare (miễn phí).
2. Thêm site: nhập URL GitHub Pages (ví dụ: `YOUR_USERNAME.github.io`).
3. Cloudflare sẽ scan DNS records.
4. Thay đổi nameservers theo hướng dẫn Cloudflare.
5. Chờ DNS propagate (có thể mất 24h).
6. Vào Cloudflare Dashboard > DNS.
7. Bật proxy (icon màu cam) cho bản ghi CNAME hoặc A.

### 3. Đo lại sau khi dùng CDN

- Tải lại trang demo.
- Vào Chrome DevTools > Network.
- Chọn ảnh và kiểm tra `CF-Cache-Status`.
- `HIT` nghĩa ảnh được phục vụ từ cache edge, `MISS` nghĩa lần đầu hoặc cache chưa có.

### 4. Minh họa vô hiệu hóa cache

- Trong Cloudflare, vào **Caching** > **Purge Everything**.
- Tải lại trang.
- Quan sát `CF-Cache-Status` thay đổi thành `MISS` / `EXPIRED`.
- Tải lại lần tiếp theo để thấy `HIT`.

## Ghi chú

- `index.html` là trang demo để so sánh nhanh/chậm. Thực tế nhất vẫn là kiểm tra bằng Chrome DevTools và header `CF-Cache-Status`.
- Khi deploy lên GitHub Pages và gắn Cloudflare, trang sẽ hiển thị `CF-Cache-Status` thật trong kết quả kiểm tra.
- Nếu muốn dùng ảnh khác, hãy bỏ ảnh vào thư mục `images/` và đặt tên như `large-photo-1.jpg`, `large-photo-2.jpg`, `large-photo-3.jpg`.

## Tạo lại ảnh lớn

Nếu cần ảnh mới, chạy:

```bash
python generate_images.py
```

Ảnh sẽ được lưu trong thư mục `images/`.
