// ===============================================
// VÍ DỤ GỌI API - SAU KHI DEPLOY
// ===============================================

// Thay YOUR_API_URL bằng URL Render của bạn
const API_URL = 'https://your-app-name.onrender.com';

// ===============================================
// 1. Test Health Check
// ===============================================
async function testHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ===============================================
// 2. Scrape một URL
// ===============================================
async function scrapeSingleUrl() {
  try {
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [
          'https://open.spotify.com/show/xxxx'
        ]
      })
    });
    
    const data = await response.json();
    console.log('✅ Scrape Result:', data);
    console.log('📊 Total links:', data.total);
    console.log('🔗 Links:', data.links);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ===============================================
// 3. Scrape nhiều URLs
// ===============================================
async function scrapeMultipleUrls() {
  try {
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [
          'https://open.spotify.com/show/xxxx',
          'https://creators.spotify.com/pod/profile/podcast2468',
          'https://podcastaddict.com/podcast/xxxx'
        ]
      })
    });
    
    const data = await response.json();
    console.log('✅ Scrape Result:', data);
    
    // Xử lý kết quả
    data.processed.forEach(item => {
      console.log(`✓ ${item.type}: ${item.count} links from ${item.url}`);
    });
    
    data.failed.forEach(item => {
      console.log(`✗ Failed: ${item.url} - ${item.reason}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ===============================================
// 4. Sử dụng trong React/Vue/Angular
// ===============================================
async function usageInReact() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const handleScrape = async (urls) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
        console.log('Success! Got', data.total, 'links');
      } else {
        console.error('Failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { handleScrape, loading, results };
}

// ===============================================
// 5. Sử dụng với Axios
// ===============================================
async function usageWithAxios() {
  try {
    const response = await axios.post(`${API_URL}/scrape`, {
      urls: [
        'https://open.spotify.com/show/xxxx'
      ]
    });
    
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// ===============================================
// 6. Xử lý lỗi đầy đủ
// ===============================================
async function scrapeWithErrorHandling(urls) {
  try {
    // Kiểm tra input
    if (!urls || urls.length === 0) {
      throw new Error('URLs array is empty');
    }
    
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls })
    });
    
    // Kiểm tra HTTP status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Kiểm tra response
    if (!data.success) {
      throw new Error(data.error || 'Scraping failed');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    
    // Xử lý các loại lỗi khác nhau
    if (error.message.includes('Failed to fetch')) {
      console.error('⚠️ API might be sleeping (Render free plan)');
      console.error('💡 Wait 30s and try again');
    }
    
    throw error;
  }
}

// ===============================================
// CHẠY THỬ
// ===============================================

// Uncomment để chạy
// testHealth();
// scrapeSingleUrl();
// scrapeMultipleUrls();
