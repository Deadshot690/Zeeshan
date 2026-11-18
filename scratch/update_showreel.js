const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const srcVideo = path.join(rootDir, 'src', 'projects', 'Visual Effects', 'Elley Duhé - MIDDLE OF THE NIGHT _ BGMI_PUBG Velocity Montage _ Infinite FF.mp4');
const destVideo = path.join(rootDir, 'public', 'assets', 'showreel', 'showreel.mp4');
const destPoster = path.join(rootDir, 'public', 'assets', 'showreel', 'showreel-poster.webp');

console.log('Copying visual effects velocity montage to showreel.mp4...');
fs.copyFileSync(srcVideo, destVideo);
console.log('Copied showreel.mp4 successfully! Size:', fs.statSync(destVideo).size);

console.log('Generating high-res poster from showreel video at 4.0s...');
try {
  execSync(`ffmpeg -ss 4.0 -i "${destVideo}" -vframes 1 -q:v 2 -vf "scale='min(1920,iw)':-2" -y "${destPoster}"`, { stdio: 'inherit' });
  console.log('Generated showreel-poster.webp successfully!');
} catch (e) {
  console.error('Failed to generate poster:', e.message);
}
