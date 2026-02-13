const express = require("express");
const detect = require("./detector");

// Import scrapers (bạn cần có các file này trong thư mục scrapers/)
const scrapers = {
  podcastaddict: require("./scrapers/podcastaddictcom"),
  castbox: require("./scrapers/castboxfm"),
  open_spotify: require("./scrapers/openspotifycom"),
  creators_spotify: require("./scrapers/creatorsspotifycom"),
  firstory: require("./scrapers/openfirstoryme"),
  podcastscom: require("./scrapers/podcastscom"),
  soundon: require("./scrapers/soundonfm"),
};

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Health check endpoint (quan trọng cho Render)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Podcast Scraper API is running",
    version: "1.0.0",
    endpoints: {
      health: "GET /",
      scrape: "POST /scrape"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// API endpoint chính
app.post("/scrape", async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        error: "urls array is required"
      });
    }

    let allLinks = new Set();
    let processedUrls = [];
    let failedUrls = [];

    for (const url of urls) {
      try {
        const type = detect(url);
        
        if (!type || !scrapers[type]) {
          failedUrls.push({ url, reason: "Unsupported platform" });
          continue;
        }

        console.log(`▶ Scraping: ${type} - ${url}`);
        const links = await scrapers[type](url);
        links.forEach((l) => allLinks.add(l));
        
        processedUrls.push({ url, type, count: links.length });
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        failedUrls.push({ url, reason: error.message });
      }
    }

    res.json({
      success: true,
      total: allLinks.size,
      links: [...allLinks],
      processed: processedUrls,
      failed: failedUrls
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: POST /scrape`);
});
