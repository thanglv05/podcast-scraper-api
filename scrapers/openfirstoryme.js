const { chromium } = require('playwright');

module.exports = async function scrapeFirstory(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  while (true) {
    const btn = page.locator('button:has-text("Load More")');
    if (await btn.count() === 0) break;
    await btn.first().click().catch(() => null);
    await page.waitForTimeout(800);
  }

  const links = await page.$$eval(
    'a[href*="/story/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
