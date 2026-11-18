const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  
  // Forward browser console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

  console.log('Opening http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  await page.evaluate(() => {
    const el = document.getElementById('showreel');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  await page.evaluate(() => {
    const v = document.querySelector('#showreel video');
    if (!v) return;
    const events = ['waiting', 'stalled', 'pause', 'play', 'playing', 'error', 'seeking', 'seeked', 'suspend'];
    events.forEach(name => {
      v.addEventListener(name, () => {
        console.log(`[VIDEO EVENT] ${name} at currentTime=${v.currentTime.toFixed(2)}s, readyState=${v.readyState}, networkState=${v.networkState}`);
      });
    });
  });

  console.log('Observing video events for 15 seconds...');
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await page.evaluate(() => {
      const v = document.querySelector('#showreel video');
      if (!v) return null;
      return {
        currentTime: v.currentTime.toFixed(2),
        paused: v.paused,
        readyState: v.readyState,
        bufferedRanges: v.buffered.length > 0 ? `${v.buffered.start(0).toFixed(1)} - ${v.buffered.end(0).toFixed(1)}` : 'none'
      };
    });
    console.log(`Second ${i + 1}:`, status);
  }

  await browser.close();
})();
