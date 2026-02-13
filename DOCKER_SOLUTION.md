# 🐳 GIẢI PHÁP: DÙNG DOCKER

## ❌ Vấn đề

Render Free plan **KHÔNG** cho phép cài system dependencies cần cho Playwright:
- Không có root access
- Không cài được Chrome dependencies (fonts, libs...)
- Build sẽ fail với lỗi `su: Authentication failure`

## ✅ GIẢI PHÁP: Docker

Thay vì dùng Node environment, chúng ta dùng **Docker** với Playwright image có sẵn tất cả dependencies.

---

## 🚀 CÁCH DEPLOY VỚI DOCKER

### Option 1: Render Dashboard (Dễ nhất)

1. Vào Render Dashboard → Service của bạn
2. Click **Settings**
3. Tìm **Environment** → Chọn **Docker** (thay vì Node)
4. Click **Save Changes**
5. Render sẽ tự động phát hiện `Dockerfile` và build
6. Đợi 15-20 phút

### Option 2: Tạo service mới

1. **Delete service cũ** (vì không thể convert Node → Docker)
2. Push code mới lên GitHub (bao gồm `Dockerfile`)
3. Render → New + → **Web Service**
4. Connect GitHub repo
5. Render tự động detect Dockerfile
6. Cấu hình:
   - Name: `podcast-scraper-api`
   - Environment: **Docker** (auto-detected)
   - Plan: **Free**
7. Click **Create Web Service**

---

## 📁 Files đã thêm

### 1. Dockerfile
```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-jammy
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
ENV PORT=4000
CMD ["npm", "start"]
```

**Giải thích:**
- Base image: Microsoft Playwright image (đã có Chrome + dependencies)
- Không cần cài Playwright browsers vì image đã có sẵn
- Size: ~1GB (lớn nhưng có đầy đủ)

### 2. .dockerignore
Loại bỏ files không cần thiết khi build Docker image.

### 3. render.yaml (updated)
```yaml
env: docker
dockerfilePath: ./Dockerfile
```

---

## ⏱️ Thời gian Build

**Docker build:**
- Lần đầu: **15-20 phút** (pull base image ~1GB)
- Lần sau: **5-10 phút** (Docker cache layers)

**Lâu hơn Node build nhưng:**
- ✅ Có đầy đủ dependencies
- ✅ Không bị lỗi permissions
- ✅ Stable hơn

---

## 💾 Docker vs Node trên Render

| | Node Environment | Docker |
|---|---|---|
| **Setup** | Đơn giản | Cần Dockerfile |
| **Build time** | 5-10 phút | 15-20 phút |
| **Dependencies** | ❌ Thiếu system deps | ✅ Đầy đủ |
| **Playwright** | ❌ Không chạy được | ✅ Hoạt động 100% |
| **Free plan** | ✅ Có | ✅ Có |
| **Recommendation** | ❌ Không dùng cho Playwright | ✅✅✅ Khuyên dùng |

---

## 🎯 BƯỚC TIẾP THEO

### Đã có code mới?

1. **Download** package mới: `podcast-api-render-DOCKER.tar.gz`
2. **Giải nén** và push lên GitHub
3. **Deploy** lên Render với environment = Docker

### Hoặc update code cũ?

1. **Copy** 3 files: `Dockerfile`, `.dockerignore`, `render.yaml` (updated)
2. **Push** lên GitHub
3. **Chuyển** service sang Docker trong Settings
4. **Redeploy**

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Render Free Plan với Docker

Render Free plan **HỖ TRỢ** Docker nhưng có giới hạn:
- ✅ Chạy được
- ⚠️ Build lâu hơn
- ⚠️ 512MB RAM vẫn áp dụng (scrape 1-2 URLs/request)

### 2. Alternative: Railway

Nếu Render Free vẫn không đủ RAM, bạn có thể thử:
- **Railway.app** (Free: $5 credit/tháng, không cần card)
- **Fly.io** (Free: 3 VMs nhỏ)
- Cả hai đều support Docker tốt

### 3. Port Configuration

Docker container phải listen trên `PORT` environment variable:
```javascript
const PORT = process.env.PORT || 4000;
```
Code của bạn đã đúng rồi ✅

---

## 🐛 Troubleshooting

### Lỗi: Cannot find Dockerfile
- Đảm bảo `Dockerfile` ở root directory
- Push lên GitHub đúng branch

### Lỗi: Build timeout
- Bình thường với lần đầu (pull 1GB image)
- Thử lại hoặc đợi server Render bớt tải

### Lỗi: Out of memory
- Giảm số URLs/request xuống 1-2
- Hoặc nâng cấp plan

---

## ✨ KẾT LUẬN

**Docker là giải pháp duy nhất** để chạy Playwright trên Render Free plan.

Mặc dù setup phức tạp hơn, nhưng đây là cách **ổn định và chính thống** nhất.

**Sau khi deploy thành công với Docker, API sẽ hoạt động 100%!** 🎉
