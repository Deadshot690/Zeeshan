const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  
  const warnings = [];
  page.on('console', msg => {
    if (msg.type() === 'warn' || msg.type() === 'error') {
      warnings.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  console.log('Testing http://localhost:3001 (fresh dev server)...');
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  await page.evaluate(() => {
    const el = document.getElementById('showreel');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  // Observe playback for 6 seconds
  for (let i = 0; i < 6; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await page.evaluate(() => {
      const v = document.querySelector('#showreel video');
      if (!v) return null;
      return {
        currentTime: v.currentTime.toFixed(2),
        paused: v.paused,
        readyState: v.readyState,
        buffered: v.buffered.length > 0 ? `${v.buffered.start(0).toFixed(1)} - ${v.buffered.end(0).toFixed(1)}s` : 'none'
      };
    });
    console.log(`Playback second ${i + 1}:`, status);
  }

  console.log('\nLogged warnings & errors count:', warnings.length);
  if (warnings.length > 0) {
    console.log('Warnings/Errors found:');
    warnings.forEach(w => console.log('  ', w));
  } else {
    console.log('Zero warnings or errors logged!');
  }

  await browser.close();
})();
