# 📦 Scrapers Documentation

## Tổng quan

Tất cả scrapers đã được cài đặt đầy đủ và sẵn sàng sử dụng. Mỗi scraper sử dụng **Playwright** để scrape dynamic content (JavaScript-rendered) từ các nền tảng podcast.

## ✅ Danh sách Scrapers

### 1. openspotifycom.js
**Platform:** open.spotify.com  
**Phương pháp:** Click button "Load more" cho đến khi hết  
**Selector:** `a[href*="/episode/"]`

### 2. creatorsspotifycom.js
**Platform:** creators.spotify.com  
**Phương pháp:** Scroll xuống liên tục (infinite scroll)  
**Selector:** `a[href*="/episode"]` hoặc `a[href*="/episodes/"]`

### 3. podcastaddictcom.js
**Platform:** podcastaddict.com  
**Phương pháp:** 
- Xóa cookie consent popup
- Click button "More" cho đến khi hết
**Selector:** `a[href*="/episode/"]`  
**Đặc biệt:** Có xử lý popup GDPR/cookie consent

### 4. castboxfm.js
**Platform:** castbox.fm  
**Phương pháp:** 
- Scroll xuống đáy
- Theo dõi số lượng episodes, dừng khi không tăng
- Tự động click button "Load more" nếu có
**Selector:** `a[href*="/episode/"]`

### 5. openfirstoryme.js
**Platform:** firstory.me  
**Phương pháp:** Click button "Load More" cho đến khi hết  
**Selector:** `a[href*="/story/"]`

### 6. podcastscom.js
**Platform:** podcasts.com  
**Phương pháp:** 
- Click pagination (trang kế tiếp)
- Tự động phát hiện active page và click next
**Selector:** `a[href*="/episode/"]`  
**Đặc biệt:** Xử lý pagination thay vì infinite scroll

### 7. soundonfm.js
**Platform:** soundon.fm  
**Phương pháp:** Scroll xuống cho đến khi không cuộn được nữa  
**Selector:** `a[href*="/episodes/"]`

## 🔧 Cách hoạt động chung

Tất cả scrapers đều:
1. Launch Playwright browser (headless mode)
2. Navigate đến URL
3. Chờ content load
4. Scroll/Click để load thêm episodes
5. Extract tất cả episode links
6. Loại bỏ duplicates
7. Đóng browser
8. Trả về array of unique links

## ⚙️ Cấu hình

### Timeouts
- Page load: 60 seconds
- Wait between actions: 800-2500ms tùy platform
- Stable rounds: 2-3 rounds không tăng thì dừng

### User Agents
Một số scrapers (podcastaddict, podcasts.com) sử dụng custom user agent để tránh bị block.

## 🐛 Error Handling

Tất cả scrapers đều:
- Return empty array nếu có lỗi (không crash server)
- Log errors ra console
- Đóng browser trong mọi trường hợp (try/catch)

## 💡 Lưu ý khi deploy

### Render Free Plan
Playwright yêu cầu system dependencies. Render sẽ tự động cài đặt khi build.

### Memory Usage
Playwright tốn nhiều memory hơn axios+cheerio. Free plan Render (512MB RAM) có thể hơi chật khi scrape nhiều URLs cùng lúc.

**Khuyến nghị:**
- Scrape <= 3 URLs mỗi request
- Hoặc nâng cấp lên Starter plan ($7/tháng, 2GB RAM)

### Build Time
First deploy sẽ lâu (~10 phút) vì phải cài Playwright browsers.

## 🔄 Cải tiến có thể (tùy chọn)

1. **Thêm retry logic:** Tự động retry nếu scrape fail
2. **Queue system:** Xử lý nhiều URLs tuần tự thay vì parallel
3. **Cache:** Cache kết quả trong một thời gian
4. **Rate limiting:** Giới hạn số request để tránh bị block
5. **Proxy support:** Rotate proxies nếu bị rate limit

Tuy nhiên, code hiện tại đã đủ tốt để sử dụng trong production!
