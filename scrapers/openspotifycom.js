const { chromium } = require('playwright');

module.exports = async function scrapeOpenSpotify(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  while (true) {
    const btn = page.locator('button:has-text("Load more")');
    if (await btn.count() === 0) break;
    await btn.first().click().catch(() => null);
    await page.waitForTimeout(1200);
  }

  const links = await page.$$eval(
    'a[href*="/episode/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
