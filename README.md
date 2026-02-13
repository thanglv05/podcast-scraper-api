# 🎙️ Podcast Scraper API

API để scrape links từ các nền tảng podcast khác nhau.

## 🚀 Platforms được hỗ trợ

- Podcast Addict (podcastaddict.com)
- Castbox (castbox.fm)
- Spotify Open (open.spotify.com)
- Spotify Creators (creators.spotify.com)
- Firstory (firstory.me)
- Podcasts.com (podcasts.com)
- SoundOn (soundon.fm)

## 📡 API Endpoints

### GET /
Health check và thông tin API

### POST /scrape
Scrape podcast links từ URLs

**Request Body:**
```json
{
  "urls": [
    "https://open.spotify.com/show/xxxxx",
    "https://creators.spotify.com/pod/profile/podcast2468"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "total": 25,
  "links": ["url1", "url2", "..."],
  "processed": [
    {
      "url": "https://...",
      "type": "open_spotify",
      "count": 15
    }
  ],
  "failed": []
}
```

## 🛠️ Cài đặt Local

```bash
npm install
npm start
```

## ☁️ Deploy lên Render

### Bước 1: Chuẩn bị code
1. Upload code lên GitHub repository
2. Đảm bảo có đầy đủ thư mục `scrapers/` với các file scraper

### Bước 2: Deploy trên Render

1. Truy cập https://render.com và đăng ký/đăng nhập
2. Click "New +" → "Web Service"
3. Kết nối với GitHub repository của bạn
4. Cấu hình:
   - **Name**: podcast-scraper-api (hoặc tên bạn muốn)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"

### Bước 3: Đợi deploy (khoảng 5-10 phút)

Render sẽ tự động:
- Cài đặt dependencies
- Build project
- Chạy server
- Cấp cho bạn một URL dạng: `https://your-app-name.onrender.com`

### Lưu ý về Free Plan của Render:
- ✅ Miễn phí hoàn toàn
- ⚠️ Tự động sleep sau 15 phút không hoạt động
- ⏱️ Khởi động lại mất ~30 giây khi có request mới
- 📊 Giới hạn 750 giờ/tháng (đủ cho sử dụng cá nhân)

## 📝 Cách gọi API sau khi deploy

```javascript
// Ví dụ với fetch
const response = await fetch('https://your-app-name.onrender.com/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    urls: [
      'https://open.spotify.com/show/xxxxx'
    ]
  })
});

const data = await response.json();
console.log(data);
```

```bash
# Ví dụ với curl
curl -X POST https://your-app-name.onrender.com/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://open.spotify.com/show/xxxxx"]}'
```

## 📂 Cấu trúc thư mục

```
podcast-api-render/
├── server.js           # Main API server
├── detector.js         # Phát hiện loại platform
├── package.json        # Dependencies
├── scrapers/           # ⚠️ BẠN CẦN THÊM THƯ MỤC NÀY
│   ├── podcastaddictcom.js
│   ├── castboxfm.js
│   ├── openspotifycom.js
│   ├── creatorsspotifycom.js
│   ├── openfirstoryme.js
│   ├── podcastscom.js
│   └── soundonfm.js
└── README.md
```

## ✅ Đã sẵn sàng sử dụng

Tất cả scrapers đã được cài đặt đầy đủ và sẵn sàng hoạt động. Mỗi scraper sử dụng Playwright để scrape dynamic content từ các nền tảng podcast khác nhau.
