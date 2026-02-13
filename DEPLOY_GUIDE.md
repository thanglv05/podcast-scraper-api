# 📋 Hướng dẫn Deploy lên Render - Chi tiết từng bước

## 🎯 Chuẩn bị

### 1. Tạo GitHub Repository

1. Truy cập https://github.com/new
2. Tên repository: `podcast-scraper-api` (hoặc tên bạn muốn)
3. Chọn **Public** hoặc **Private**
4. Click "Create repository"

### 2. Upload code lên GitHub

**Cách 1: Dùng GitHub Web Interface (Dễ nhất)**
1. Vào repository vừa tạo
2. Click "uploading an existing file"
3. Kéo thả tất cả files vào (server.js, package.json, detector.js, thư mục scrapers/, v.v.)
4. Click "Commit changes"

**Cách 2: Dùng Git Command Line**
```bash
# Trong thư mục project của bạn
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/podcast-scraper-api.git
git push -u origin main
```

---

## 🚀 Deploy lên Render

### Bước 1: Tạo tài khoản Render
1. Truy cập https://render.com
2. Click "Get Started for Free"
3. Đăng ký bằng GitHub (khuyên dùng) hoặc email

### Bước 2: Kết nối GitHub
1. Sau khi đăng nhập, Render sẽ yêu cầu kết nối với GitHub
2. Click "Connect GitHub"
3. Cho phép Render truy cập repositories của bạn

### Bước 3: Tạo Web Service mới
1. Từ Dashboard, click "New +" (góc trên bên phải)
2. Chọn "Web Service"

### Bước 4: Chọn Repository
1. Tìm repository `podcast-scraper-api` trong danh sách
2. Click "Connect" bên cạnh repository đó

### Bước 5: Cấu hình Service

⚠️ **QUAN TRỌNG:** Vì dùng Playwright, bạn PHẢI chọn **Docker** environment.

**Basic Settings:**
- **Name**: `podcast-scraper-api` (hoặc tên khác, sẽ là phần đầu của URL)
- **Region**: Singapore (gần Việt Nam nhất)
- **Branch**: `main` (hoặc `master`)
- **Root Directory**: để trống
- **Environment**: **Docker** (Render sẽ auto-detect Dockerfile)

**Plan:**
- Chọn **Free** (đủ cho sử dụng cá nhân)

### Bước 6: Advanced Settings (Tùy chọn)

Cuộn xuống "Advanced", có thể thêm Environment Variables nếu cần:
- Hiện tại không cần thêm gì

### Bước 7: Deploy!

1. Click "Create Web Service"
2. Render sẽ bắt đầu build Docker image:
   - Pulling base image... (5-10 phút) ← Pull Playwright Docker image ~1GB
   - Installing dependencies... (2-3 phút)
   - Building image... (2-3 phút)
   - Starting container... (30 giây)
3. Đợi đến khi thấy "Live" màu xanh ở góc trên

**⚠️ LƯU Ý QUAN TRỌNG:**
- Lần deploy đầu tiên sẽ mất **15-20 phút** vì phải pull Docker base image (~1GB)
- Các lần deploy sau sẽ nhanh hơn (5-10 phút) vì Docker cache layers
- Đừng lo nếu thấy build chậm, Docker image lớn nên bình thường!

---

## ✅ Kiểm tra API hoạt động

### 1. Lấy URL của API
Sau khi deploy thành công, bạn sẽ thấy URL dạng:
```
https://podcast-scraper-api.onrender.com
```

### 2. Test Health Check
Mở trình duyệt và truy cập:
```
https://podcast-scraper-api.onrender.com
```

Bạn sẽ thấy response:
```json
{
  "status": "ok",
  "message": "Podcast Scraper API is running",
  "version": "1.0.0"
}
```

### 3. Test Scraping Endpoint

**Dùng cURL (Terminal/CMD):**
```bash
curl -X POST https://podcast-scraper-api.onrender.com/scrape \
  -H "Content-Type: application/json" \
  -d "{\"urls\":[\"https://open.spotify.com/show/xxxx\"]}"
```

**Dùng Postman:**
1. Tạo request mới: POST
2. URL: `https://podcast-scraper-api.onrender.com/scrape`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "urls": [
    "https://open.spotify.com/show/xxxx"
  ]
}
```

**Dùng JavaScript (trong website/app của bạn):**
```javascript
async function scrapePodcast(urls) {
  const response = await fetch('https://podcast-scraper-api.onrender.com/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ urls })
  });
  
  const data = await response.json();
  return data;
}

// Sử dụng
const result = await scrapePodcast([
  'https://open.spotify.com/show/xxxx'
]);
console.log(result);
```

---

## 📊 Giám sát API trên Render

### Xem Logs
1. Vào Dashboard Render
2. Click vào service "podcast-scraper-api"
3. Tab "Logs" - xem real-time logs
4. Tab "Events" - xem lịch sử deploy

### Metrics
- Tab "Metrics" - xem CPU, Memory usage
- Theo dõi số request, response time

---

## ⚠️ Lưu ý về Free Plan

### Sleep Mode
- API sẽ **tự động ngủ** sau 15 phút không có request
- Khi có request mới, API sẽ **tỉnh dậy** (~30 giây)
- Request đầu tiên sau khi ngủ sẽ chậm, các request tiếp theo sẽ nhanh

### Giải pháp giữ API thức:
**Cách 1: Ping định kỳ** (không khuyến khích vì tốn resource)
```javascript
// Tạo cron job ping mỗi 10 phút
setInterval(() => {
  fetch('https://podcast-scraper-api.onrender.com/health');
}, 10 * 60 * 1000);
```

**Cách 2: Chấp nhận sleep** (khuyên dùng)
- Cho phép API ngủ khi không dùng
- Request đầu tiên sẽ chậm nhưng không sao
- Tiết kiệm 750 giờ/tháng của free plan

---

## 🔄 Update code sau khi deploy

### Cách 1: Push lên GitHub
```bash
# Sửa code
git add .
git commit -m "Update scraper logic"
git push
```
→ Render sẽ tự động deploy lại

### Cách 2: Manual Deploy
1. Vào Dashboard Render
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: Build failed
- **Nguyên nhân**: Thiếu dependencies hoặc lỗi syntax
- **Giải pháp**: Kiểm tra logs, sửa lỗi và push lại

### Lỗi: Service Unavailable
- **Nguyên nhân**: API đang sleep
- **Giải pháp**: Đợi 30 giây để API thức dậy

### Lỗi: Scrapers not found
- **Nguyên nhân**: Thiếu thư mục scrapers/ hoặc file bên trong
- **Giải pháp**: Đảm bảo tất cả files scrapers/ đã được push lên GitHub

---

## 💡 Tips

1. **Bookmark URL API** của bạn để dễ truy cập
2. **Test thường xuyên** để đảm bảo API hoạt động
3. **Xem logs** khi có lỗi để debug
4. **Backup code** trên GitHub thường xuyên

---

## 📞 Cần trợ giúp?

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
