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
  await new Promise(r => setTimeout(r, 4000));

  // Take screenshot of navbar
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/navbar_selected_works.png' });
    console.log('Saved navbar_selected_works.png');
  }

  // Click on "SELECTED WORKS" nav link
  console.log('Clicking SELECTED WORKS nav link...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('header nav a'));
    const swLink = links.find(l => l.textContent.includes('SELECTED WORKS'));
    if (swLink) swLink.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('Scrolled to Y position:', scrollY);

  await browser.close();
})();
