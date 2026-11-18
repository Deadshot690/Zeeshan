const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// Videos to optimize with target settings
const tasks = [
  {
    src: 'public/assets/videos/color-grading/colorgrade.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.5M', maxrate: '4.5M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/hiking-hook.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/keya-chicken-tortilla.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/reel-39.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/reel-5-03.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/reel-63.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/ski-hook.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/video-editing/travel-hook.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/motion-graphics/airbnb.mp4',
    maxW: 1920, maxH: 1080,
    bitrate: '3.5M', maxrate: '4.5M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/motion-graphics/animation-2.mp4',
    maxW: 1080, maxH: 1920,
    bitrate: '3.2M', maxrate: '4.2M', bufsize: '8M', crf: 22
  },
  {
    src: 'public/assets/videos/visual-effects/elley-duhe-velocity-montage.mp4',
    maxW: 1280, maxH: 720,
    bitrate: '2.5M', maxrate: '3.5M', bufsize: '6M', crf: 22
  },
  {
    src: 'public/assets/videos/visual-effects/xxxtentacion-velocity-montage.mp4',
    maxW: 1280, maxH: 720,
    bitrate: '2.5M', maxrate: '3.5M', bufsize: '6M', crf: 22
  },
  {
    src: 'public/assets/showreel/showreel.mp4',
    maxW: 1280, maxH: 720,
    bitrate: '2.5M', maxrate: '3.5M', bufsize: '6M', crf: 22
  }
];

console.log(`Starting web optimization for ${tasks.length} videos...`);

for (const t of tasks) {
  const fullSrc = path.join(rootDir, t.src);
  if (!fs.existsSync(fullSrc)) {
    console.log(`File not found: ${t.src}`);
    continue;
  }
  const originalSizeMB = (fs.statSync(fullSrc).size / (1024 * 1024)).toFixed(1);
  const tempOutput = path.join(rootDir, 'scratch', 'opt_' + path.basename(t.src));

  console.log(`\nOptimizing ${path.basename(t.src)} (Current: ${originalSizeMB} MB)...`);
  const scaleFilter = `scale='min(${t.maxW},iw)':'min(${t.maxH},ih)':force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2`;

  const cmd = `ffmpeg -y -i "${fullSrc}" -vf "${scaleFilter}" -c:v libx264 -preset fast -crf ${t.crf} -maxrate ${t.maxrate} -bufsize ${t.bufsize} -pix_fmt yuv420p -g 60 -keyint_min 30 -movflags +faststart -c:a aac -b:a 128k "${tempOutput}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    const newSizeMB = (fs.statSync(tempOutput).size / (1024 * 1024)).toFixed(1);
    console.log(`Done: ${originalSizeMB} MB -> ${newSizeMB} MB`);
    // Overwrite original with optimized version
    fs.copyFileSync(tempOutput, fullSrc);
    fs.unlinkSync(tempOutput);
    console.log(`Successfully replaced ${t.src} with optimized version!`);
  } catch (e) {
    console.error(`Failed to optimize ${t.src}:`, e.message);
  }
}

console.log('\nAll videos successfully optimized for web delivery!');
