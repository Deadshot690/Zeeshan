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

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4000));

  // Check for any text matching Mohammad on the live page
  const pageText = await page.evaluate(() => document.body.innerText);
  const matches = pageText.match(/mohammad/gi);
  console.log('Matches for "Mohammad" on live page:', matches ? matches.length : 0);

  // Check section elements in DOM
  const sectionIds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section')).map(s => ({
      id: s.id,
      textPreview: s.innerText.slice(0, 100).replace(/\n/g, ' ')
    }));
  });
  console.log('Active rendered sections:', JSON.stringify(sectionIds, null, 2));

  // Screenshot SelectedWork (Section 04)
  await page.evaluate(() => {
    const el = document.getElementById('selected-work');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  const sw = await page.$('#selected-work');
  if (sw) {
    await sw.screenshot({ path: 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/selected_work_restored.png' });
    console.log('Captured selected_work_restored.png');
  }

  await browser.close();
  console.log('Verification completed successfully!');
})();
