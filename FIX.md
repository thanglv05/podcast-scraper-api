# 🔧 SỬA LỖI PLAYWRIGHT TRÊN RENDER

## ❌ Lỗi bạn gặp phải

```
Executable doesn't exist at /opt/render/.cache/ms-playwright/chromium...
Please run: npx playwright install
```

## ✅ GIẢI PHÁP

### Cách 1: Cập nhật Build Command trên Render (KHUYÊN DÙNG)

1. Vào Render Dashboard
2. Chọn service "podcast-scraper-api"
3. Vào **Settings**
4. Tìm section **Build & Deploy**
5. Sửa **Build Command** thành:
   ```
   npm install && npx playwright install --with-deps chromium
   ```
6. Click **Save Changes**
7. Click **Manual Deploy** → **Deploy latest commit**

### Cách 2: Dùng file render.yaml (TỰ ĐỘNG)

File `render.yaml` đã được tạo sẵn trong project. Nó sẽ tự động cấu hình đúng.

**Cách sử dụng:**
1. Push file `render.yaml` lên GitHub
2. Render sẽ tự động phát hiện và dùng cấu hình này
3. Hoặc khi tạo service mới, chọn "Blueprint" thay vì "Web Service"

### Cách 3: Manual (Không khuyên dùng)

Nếu 2 cách trên không work, bạn có thể:

1. SSH vào Render (chỉ có ở paid plans)
2. Hoặc thêm script vào `server.js` để tự động cài (rủi ro cao)

---

## 🎯 SAU KHI SỬA

Redeploy sẽ mất **15-20 phút** vì phải:
1. Cài npm packages (2-3 phút)
2. **Cài Playwright browsers** (10-15 phút) ← MỚI
3. Start server (30 giây)

**Lưu ý:** Build lần đầu sẽ rất lâu, nhưng các lần sau Render sẽ cache browsers nên nhanh hơn.

---

## ✅ KIỂM TRA ĐÃ HOẠT ĐỘNG

Test API với curl:

```bash
curl -X POST https://your-app-name.onrender.com/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://open.spotify.com/show/1AIfK6aucq6H8yk1jcZu6R"]}'
```

Nếu thành công, bạn sẽ thấy:
```json
{
  "success": true,
  "total": 50,
  "links": ["..."],
  "processed": [...]
}
```

---

## 📊 TẠI SAO LỖI NÀY XẢY RA?

Playwright cần **download browsers** (Chromium ~200MB) trước khi sử dụng.

**Trên local:**
- Khi chạy `npm install`, Playwright tự động download browsers
- Hoặc bạn đã chạy `npx playwright install` trước đó

**Trên Render:**
- `npm install` không tự động download browsers
- Cần chạy thêm lệnh `npx playwright install --with-deps chromium`
- Flag `--with-deps` cài thêm system dependencies (fonts, libs...)

---

## 💡 GỢI Ý TỐI ƯU

### 1. Chỉ cài Chromium (đã làm)
```bash
npx playwright install --with-deps chromium
```
Thay vì cài tất cả browsers (Chromium + Firefox + WebKit), chỉ cài Chromium để:
- ✅ Tiết kiệm thời gian build (~50%)
- ✅ Tiết kiệm disk space
- ✅ Scrapers của bạn chỉ dùng Chromium

### 2. Cache browsers (Render tự động)
Sau lần build đầu tiên, Render sẽ cache browsers. Build lần sau chỉ mất 3-5 phút.

### 3. Monitor build logs
Trong lúc build, xem logs để biết tiến trình:
```
Installing Playwright browsers...
Downloading Chromium...
[=====     ] 50%
```

---

## 🆘 NẾU VẪN LỖI

### Lỗi: Out of memory during build
**Nguyên nhân:** Free plan có giới hạn RAM khi build  
**Giải pháp:**
- Thử deploy lại (có thể do build server bận)
- Nâng cấp lên Starter plan ($7/tháng)

### Lỗi: Build timeout
**Nguyên nhân:** Download browsers quá lâu  
**Giải pháp:**
- Đợi và thử lại
- Render có thể đang chậm

### Lỗi khác
- Check logs chi tiết trên Render
- Google error message
- Hoặc hỏi tôi với log đầy đủ

---

## ✨ KẾT LUẬN

Sau khi sửa Build Command, API sẽ hoạt động bình thường. 

**Tổng thời gian từ deploy đến hoạt động:** ~20 phút lần đầu, ~5 phút các lần sau.
