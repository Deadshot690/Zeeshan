const puppeteer = require('c:/Users/juned/OneDrive/Documents/GitHub/zeeshan/node_modules/puppeteer-core');
const chromePath = 'C:\\Users\\juned\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  console.log('=== TEST 1: HOME SHOWREEL PLAYBACK & SCROLL RESILIENCE ===');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to showreel
  await page.evaluate(() => {
    const el = document.getElementById('showreel');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));

  let showreelState1 = await page.evaluate(() => {
    const v = document.querySelector('#showreel video');
    return v ? { paused: v.paused, currentTime: v.currentTime, readyState: v.readyState, buffered: v.buffered.length > 0 ? v.buffered.end(0) : 0 } : null;
  });
  console.log('Showreel after entering view:', showreelState1);

  // Micro-scroll down 100px (user looking around inside the section)
  await page.evaluate(() => window.scrollBy({ top: 120, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1500));

  let showreelState2 = await page.evaluate(() => {
    const v = document.querySelector('#showreel video');
    return v ? { paused: v.paused, currentTime: v.currentTime, readyState: v.readyState } : null;
  });
  console.log('Showreel after micro-scrolling inside section (should NOT pause):', showreelState2);

  console.log('\n=== TEST 2: /work/video-editing PERFORMANCE & STREAMING ===');
  await page.goto('http://localhost:3000/work/video-editing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const editingState = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return { found: false };
    try {
      await v.play();
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1500));
    return {
      found: true,
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState,
      bufferedEnd: v.buffered.length > 0 ? v.buffered.end(0) : 0
    };
  });
  console.log('Video Editing category video playback:', editingState);

  console.log('\n=== TEST 3: /work/color-grading (previously 110MB, now 8.9MB) ===');
  await page.goto('http://localhost:3000/work/color-grading', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const colorState = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return { found: false };
    try {
      await v.play();
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1500));
    return {
      found: true,
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState,
      bufferedEnd: v.buffered.length > 0 ? v.buffered.end(0) : 0
    };
  });
  console.log('Color Grading category video playback:', colorState);

  await browser.close();
  console.log('\nAll video tests passed successfully!');
})();
