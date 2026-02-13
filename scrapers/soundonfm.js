const { chromium } = require('playwright');

module.exports = async function scrapeSoundOn(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 🔽 CUỘN ĐẾN KHI KHÔNG CUỘN ĐƯỢC NỮA
  let lastHeight = 0;
  let stableRounds = 0;

  while (true) {
    const height = await page.evaluate(
      () => document.body.scrollHeight
    );

    if (height === lastHeight) {
      stableRounds++;
    } else {
      stableRounds = 0;
      lastHeight = height;
    }

    // ❌ chiều cao không tăng nữa → dừng
    if (stableRounds >= 2) break;

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(1200);
  }

  // 🔗 LẤY TOÀN BỘ EPISODE LINK
  const links = await page.$$eval(
    'a[href*="/episodes/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
