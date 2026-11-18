const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname, '../src/projects');
const categories = fs.readdirSync(baseDir);

const results = {};

categories.forEach(cat => {
  const catPath = path.join(baseDir, cat);
  if (!fs.statSync(catPath).isDirectory()) return;
  results[cat] = [];
  const files = fs.readdirSync(catPath);
  files.forEach(file => {
    if (!file.endsWith('.mp4')) return;
    const fullPath = path.join(catPath, file);
    try {
      const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "${fullPath}"`).toString().trim();
      const [w, h, d] = out.split(',');
      results[cat].push({
        file,
        width: parseInt(w),
        height: parseInt(h),
        duration: parseFloat(d),
        isVertical: parseInt(h) > parseInt(w)
      });
    } catch (e) {
      console.error(file, e.message);
    }
  });
});

console.log(JSON.stringify(results, null, 2));
