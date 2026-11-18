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
  await new Promise(r => setTimeout(r, 1500)); // wait for hydration & preloader

  // Scroll to #about
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of #about
  const aboutEl = await page.$('#about');
  if (aboutEl) {
    await aboutEl.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_desktop_1440.png' });
    console.log('Saved about_desktop_1440.png');
  }

  // Click the top-right arrow button to test modal
  await page.click('.about-arrow-btn');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_modal_open.png' });
  console.log('Saved about_modal_open.png');

  // Close modal via ESC
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Test 1920x1080
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  const aboutEl1920 = await page.$('#about');
  if (aboutEl1920) {
    await aboutEl1920.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_desktop_1920.png' });
    console.log('Saved about_desktop_1920.png');
  }

  // Test Tablet 768x1024
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  const aboutElTablet = await page.$('#about');
  if (aboutElTablet) {
    await aboutElTablet.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_tablet_768.png' });
    console.log('Saved about_tablet_768.png');
  }

  // Test Mobile 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  const aboutElMobile = await page.$('#about');
  if (aboutElMobile) {
    await aboutElMobile.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/about_mobile_390.png' });
    console.log('Saved about_mobile_390.png');
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
})();
