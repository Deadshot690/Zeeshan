const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  // Wait for preloader to finish its 2.8s sequence
  await new Promise(r => setTimeout(r, 4000));

  await page.evaluate(() => {
    const el = document.getElementById('capabilities');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const el = await page.$('#capabilities');
  if (el) {
    await el.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/cap_sec05_clean.png' });
    console.log('Saved cap_sec05_clean.png');
  }

  await browser.close();
})();
