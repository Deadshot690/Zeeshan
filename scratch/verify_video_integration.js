const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1000']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  console.log('1. Testing homepage Selected Works...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3800));

  await page.evaluate(() => {
    const el = document.getElementById('selected-work');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const sw = await page.$('#selected-work');
  if (sw) {
    await sw.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/selected_works_4_categories.png' });
    console.log('Saved selected_works_4_categories.png');
  }

  console.log('2. Testing /work/video-editing...');
  await page.goto('http://localhost:3000/work/video-editing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/work_video_editing_top.png' });
  console.log('Saved work_video_editing_top.png');

  // Scroll down to see the catalog of 7 videos
  await page.evaluate(() => {
    window.scrollBy(0, 700);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/work_video_editing_catalog.png' });
  console.log('Saved work_video_editing_catalog.png');

  console.log('3. Testing /work/motion-graphics...');
  await page.goto('http://localhost:3000/work/motion-graphics', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/work_motion_graphics.png' });
  console.log('Saved work_motion_graphics.png');

  console.log('4. Testing /work/visual-effects...');
  await page.goto('http://localhost:3000/work/visual-effects', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/work_visual_effects.png' });
  console.log('Saved work_visual_effects.png');

  await browser.close();
  console.log('All verification screenshots captured!');
})();
