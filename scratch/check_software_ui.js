const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));

  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const about = await page.$('#about');
  if (about) {
    await about.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_software_showcase.png' });
    console.log('Saved about_software_showcase.png');
  }

  // Also hover over the CapCut card to capture its active hover state
  const capcutCard = await page.$('div[class*="group"]:has(h4:text-is("CapCut")), div:has(> div > h4)');
  // We can hover by selector
  const cards = await page.$$('h4');
  for (const h of cards) {
    const text = await page.evaluate(el => el.textContent, h);
    if (text && text.includes('CapCut')) {
      const card = await page.evaluateHandle(el => el.closest('.group'), h);
      if (card) {
        await card.hover();
        await new Promise(r => setTimeout(r, 500));
        await about.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_software_hover.png' });
        console.log('Saved about_software_hover.png');
        break;
      }
    }
  }

  await browser.close();
  console.log('Done!');
})();
