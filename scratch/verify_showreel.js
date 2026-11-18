const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  // Wait for preloader to finish (approx 3.8s)
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Scrolling to #showreel section...');
  await page.evaluate(() => {
    const el = document.getElementById('showreel');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  // Give ScrollTrigger and video play time to trigger
  await new Promise(r => setTimeout(r, 3000));

  const videoState = await page.evaluate(() => {
    const section = document.getElementById('showreel');
    const video = section ? section.querySelector('video') : null;
    if (!video) return { found: false };
    return {
      found: true,
      src: video.src,
      currentSrc: video.currentSrc,
      paused: video.paused,
      loop: video.loop,
      muted: video.muted,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
    };
  });

  console.log('Showreel video state:', JSON.stringify(videoState, null, 2));

  // Take screenshot of showreel
  const showreelEl = await page.$('#showreel');
  const screenshotPath = 'C:/Users/juned/.gemini/antigravity/brain/0f60bbde-f4cb-49ee-b5e0-b1bd55872b91/showreel_autoplay_verified.png';
  if (showreelEl) {
    await showreelEl.screenshot({ path: screenshotPath });
    console.log('Showreel screenshot saved to:', screenshotPath);
  }

  await browser.close();
})();
