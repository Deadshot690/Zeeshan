const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.mp4')) {
      results.push(full);
    }
  });
  return results;
}

const vids = getFiles('public/assets');
vids.forEach(v => {
  try {
    const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name,bit_rate -show_entries format=duration,bit_rate -of json "${v}"`, { encoding: 'utf8' });
    const info = JSON.parse(out);
    const s = info.streams[0] || {};
    const f = info.format || {};
    const sizeMB = (fs.statSync(v).size / (1024*1024)).toFixed(1);
    const kbps = Math.round((f.bit_rate || s.bit_rate || 0) / 1000);
    console.log(`${path.basename(v).padEnd(35)} => Size: ${sizeMB.padStart(6)} MB | Res: ${(s.width + 'x' + s.height).padEnd(10)} | Bitrate: ${String(kbps).padStart(6)} kbps | Dur: ${Math.round(f.duration)}s`);
  } catch(e) {
    console.log(v, e.message);
  }
});
