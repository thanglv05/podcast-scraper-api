const { chromium } = require('playwright');

module.exports = async function scrapeCastbox(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // ⏳ Đợi JS hydrate
  await page.waitForTimeout(3000);

  let lastCount = 0;
  let stableRounds = 0;

  while (true) {
    // 🔽 Scroll xuống đáy
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // ⏳ đợi lazy load
    await page.waitForTimeout(1200);

    // 🎯 đếm episode hiện tại
    const count = await page.$$eval(
      'a[href*="/episode/"]',
      els => els.length
    );

    // 🧠 nếu không tăng → tăng counter
    if (count === lastCount) {
      stableRounds++;
    } else {
      stableRounds = 0;
      lastCount = count;
    }

    // ❌ không tăng sau 3 lần → DỪNG
    if (stableRounds >= 3) break;

    // 🧪 bonus: thử click "More" nếu tồn tại
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')]
        .find(b =>
          /load|more/i.test(b.innerText)
        );
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(1000);
    }
  }

  // ✅ LẤY LINK DUY NHẤT
  const links = await page.$$eval(
    'a[href*="/episode/"]',
    els => [...new Set(els.map(e => e.href))]
  );

  await browser.close();
  return links;
};
