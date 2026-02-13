const { chromium } = require('playwright');

module.exports = async function scrapeCreatorsSpotify(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  let lastHeight = 0;

  for (let i = 0; i < 10; i++) {
    const newHeight = await page.evaluate(
      () => document.body.scrollHeight
    );

    if (newHeight === lastHeight) break;
    lastHeight = newHeight;

    // ⚠️ KHÔNG dùng biến ngoài scope
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(800);
  }

  const links = await page.$$eval(
    'a[href*="/episode"], a[href*="/episodes/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
