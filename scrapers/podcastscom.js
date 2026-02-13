const { chromium } = require('playwright');

module.exports = async function scrapePodcastsCom(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36'
  });

  const page = await context.newPage();
  const results = new Set();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForTimeout(2000);

  let lastCount = 0;
  let stableRounds = 0;

  while (true) {
    // ✅ lấy episode
    const links = await page.$$eval(
      'a[href*="/episode/"]',
      els => els.map(e => e.href)
    );

    links.forEach(l => results.add(l));

    const currentCount = results.size;

    // ❌ không tăng nữa → chuẩn bị dừng
    if (currentCount === lastCount) {
      stableRounds++;
    } else {
      stableRounds = 0;
      lastCount = currentCount;
    }

    if (stableRounds >= 2) break;

    // 🔘 click trang kế tiếp (số hoặc next)
    const clicked = await page.evaluate(() => {
      const pagination = document.querySelector('.pagination');
      if (!pagination) return false;

      const active = pagination.querySelector(
        '.active, .selected'
      );

      let next =
        active?.nextElementSibling ||
        pagination.querySelector('a[rel="next"]');

      if (next && next.tagName === 'A') {
        next.click();
        return true;
      }

      return false;
    });

    if (!clicked) break;

    // ⏳ chờ episode page mới render
    await page.waitForTimeout(2500);
  }

  await browser.close();
  return [...results];
};
