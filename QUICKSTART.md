# 🚀 HƯỚNG DẪN BẮT ĐẦU NHANH

## 📦 Bạn đã có gì?

Một API hoàn chỉnh sẵn sàng deploy lên Render (miễn phí 24/7).

## ⚡ 3 BƯỚC ĐỂ DEPLOY

### BƯỚC 1: Kiểm tra scrapers ✅

**Tất cả scrapers đã sẵn sàng!**

Các file trong `scrapers/` đã được cài đặt đầy đủ với logic scraping thực tế sử dụng Playwright. Bạn có thể deploy ngay mà không cần chỉnh sửa gì thêm.

### BƯỚC 2: Upload lên GitHub

**Cách 1 - Dùng GitHub Web (Dễ nhất):**
1. Vào https://github.com/new
2. Tạo repo mới: `podcast-scraper-api`
3. Sau khi tạo, click "uploading an existing file"
4. Kéo thả TẤT CẢ files và folders vào
5. Click "Commit changes"

**Cách 2 - Dùng Git Command:**
```bash
cd podcast-api-render
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/podcast-scraper-api.git
git push -u origin main
```

### BƯỚC 3: Deploy lên Render

⚠️ **QUAN TRỌNG:** Playwright cần system dependencies, nên phải dùng **Docker** thay vì Node.

1. Vào https://render.com → Đăng ký/Đăng nhập
2. Click "New +" → "Web Service"
3. Kết nối GitHub repo vừa tạo
4. Cấu hình:
   - Name: `podcast-scraper-api`
   - Environment: **Docker** (Render sẽ auto-detect Dockerfile)
   - Plan: **Free**
5. Click "Create Web Service"
6. Đợi **15-20 phút** (Docker build lần đầu lâu vì pull base image 1GB)

✅ XONG! API của bạn sẽ có URL: `https://podcast-scraper-api.onrender.com`

**📖 Chi tiết về Docker:** Xem file `DOCKER_SOLUTION.md`

---

## 🧪 TEST API

### Test trong browser:
```
https://your-app-name.onrender.com
```

### Test với cURL:
```bash
curl -X POST https://your-app-name.onrender.com/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://open.spotify.com/show/xxxx"]}'
```

### Test với JavaScript:
```javascript
const response = await fetch('https://your-app-name.onrender.com/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    urls: ['https://open.spotify.com/show/xxxx']
  })
});

const data = await response.json();
console.log(data);
```

---

## 📚 TÀI LIỆU

- `README.md` - Tổng quan về API
- `DEPLOY_GUIDE.md` - Hướng dẫn deploy chi tiết từng bước
- `example-usage.js` - Ví dụ code sử dụng API
- `scrapers/README.md` - Hướng dẫn viết scrapers

---

## 💡 LƯU Ý VỀ FREE PLAN RENDER

✅ **Miễn phí hoàn toàn**
✅ **Chạy 24/7** (với giới hạn 750 giờ/tháng)
⚠️ **Tự động sleep** sau 15 phút không dùng
⏱️ **Khởi động lại** ~30 giây khi có request mới

Request đầu tiên sau khi ngủ sẽ chậm, các request tiếp theo sẽ nhanh.

---

## 🆘 GẶP VẤN ĐỀ?

1. **Build failed**: Kiểm tra logs trên Render Dashboard
2. **Scrapers not found**: Đảm bảo thư mục `scrapers/` đã push lên GitHub
3. **API chậm**: Bình thường! API đang thức dậy từ sleep mode
4. **404 error**: Kiểm tra URL endpoint (`/scrape` chứ không phải `/run`)

---

## 🎯 BƯỚC TIẾP THEO

Sau khi deploy thành công:
1. ✅ Bookmark URL API
2. ✅ Test với data thật
3. ✅ Tích hợp vào app/website của bạn
4. ✅ Monitor logs trên Render khi cần debug

**Chúc bạn thành công! 🎉**
