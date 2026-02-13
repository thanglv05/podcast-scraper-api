const { chromium } = require('playwright');

module.exports = async function scrapePodcastAddict(url) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
  });

  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  await page.evaluate(() => {
    ['onetrust-consent-sdk', 'onetrust-policy']
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .forEach(e => e.remove());

    document
      .querySelectorAll('.ot-fade-in, .ot-sdk-container')
      .forEach(e => e.remove());

    document.body.style.overflow = 'auto';
  });

  let last = 0;
  while (true) {
    const count = await page.$$eval('a[href*="/episode/"]', e => e.length);
    if (count === last) break;
    last = count;

    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')]
        .find(b => b.innerText.toLowerCase().includes('more'));
      if (btn) btn.click();
    });

    await page.waitForTimeout(2500);
  }

  const links = await page.$$eval(
    'a[href*="/episode/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
