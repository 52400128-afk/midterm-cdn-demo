# Midterm CDN Demo

Trang web tĩnh này được chuẩn bị để demo nội dung CDN và cache hit/miss bằng GitHub Pages + Cloudflare.

## Mục đích

- `index.html` cung cấp giao diện thử nghiệm nhanh.
- `script.js` đo thời gian tải ảnh và hiển thị kết quả.
- `README.md` chứa hướng dẫn kiểm tra thực tế với GitHub Pages và Cloudflare.

> Lưu ý: hiện tại `script.js` đã hỗ trợ so sánh hai URL thật. Bạn cần đổi `BASE_NO_CDN` và `BASE_CDN` trong `script.js` thành URL GitHub Pages và Cloudflare thật để so sánh hiệu suất trước/sau đúng yêu cầu.

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

### Bước 4: Cập nhật URL thật trong `script.js`

1. Mở file `script.js`.
2. Thay `BASE_NO_CDN` bằng URL GitHub Pages thật của bạn, ví dụ:

   ```js
   const BASE_NO_CDN = "https://52400128-afk.github.io/midterm-cdn-demo";
   ```

3. Thay `BASE_CDN` bằng tên miền Cloudflare Pages thật của bạn, ví dụ:

   ```js
   const BASE_CDN = "https://midterm-demo.pages.dev";
   ```

> Bạn không cần mua domain. Cloudflare Pages cung cấp subdomain miễn phí `*.pages.dev`, đủ để chứng minh:
> - không CDN → GitHub Pages
> - có CDN → Cloudflare Pages

> Quan trọng: nếu không thay 2 URL này, tính năng bật/tắt CDN sẽ chưa so sánh được dữ liệu thật.

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
