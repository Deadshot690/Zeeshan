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

  // Find the CapCut card and hover over it
  const capcutFound = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h4'));
    const target = headings.find(h => h.textContent.includes('CAPCUT') || h.textContent.includes('CapCut'));
    if (target) {
      const card = target.closest('.group');
      if (card) {
        card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return true;
      }
    }
    return false;
  });

  console.log('CapCut hovered:', capcutFound);
  await new Promise(r => setTimeout(r, 500));

  const about = await page.$('#about');
  if (about) {
    await about.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_software_hover.png' });
    console.log('Saved about_software_hover.png');
  }

  await browser.close();
})();
