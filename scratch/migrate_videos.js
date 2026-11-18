const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const srcProjects = path.join(rootDir, 'src', 'projects');
const publicVideos = path.join(rootDir, 'public', 'assets', 'videos');
const publicProjects = path.join(rootDir, 'public', 'assets', 'projects');

// Mapping of source files to target destination
const videoMap = [
  // Color Grading
  {
    category: 'color-grading',
    srcDir: 'Color Grading',
    srcFile: 'colorgrade.mp4',
    destFile: 'colorgrade.mp4',
    thumbFile: 'colorgrade-thumb.webp',
    seekTime: 3.5,
    title: 'Cinematic Color Grading Reel',
    durationFormatted: '00:15',
    isVertical: true
  },
  // Motion Graphics
  {
    category: 'motion-graphics',
    srcDir: 'Motion Graphics',
    srcFile: 'Airbnb.mp4',
    destFile: 'airbnb.mp4',
    thumbFile: 'airbnb-thumb.webp',
    seekTime: 1.5,
    title: 'Airbnb Kinetic Motion Graphics',
    durationFormatted: '00:04',
    isVertical: false
  },
  {
    category: 'motion-graphics',
    srcDir: 'Motion Graphics',
    srcFile: 'animation 2.mp4',
    destFile: 'animation-2.mp4',
    thumbFile: 'animation-2-thumb.webp',
    seekTime: 2.0,
    title: 'Kinetic Typography & Dynamic UI',
    durationFormatted: '00:15',
    isVertical: true
  },
  // Video Editing
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: 'hiking hook 3 ending A (43).mp4',
    destFile: 'hiking-hook.mp4',
    thumbFile: 'hiking-hook-thumb.webp',
    seekTime: 3.0,
    title: 'Alpine Hiking — Viral Hook Reel',
    durationFormatted: '01:14',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: 'ski hook 3 ending B (56).mp4',
    destFile: 'ski-hook.mp4',
    thumbFile: 'ski-hook-thumb.webp',
    seekTime: 3.0,
    title: 'Extreme Skiing — High-Retention Action Reel',
    durationFormatted: '01:20',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: 'travel hook 1 ending A (45).mp4',
    destFile: 'travel-hook.mp4',
    thumbFile: 'travel-hook-thumb.webp',
    seekTime: 2.5,
    title: 'Global Travel — Dynamic Hook & Storytelling',
    durationFormatted: '01:12',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: 'keya - chicken tortilla reel.mp4',
    destFile: 'keya-chicken-tortilla.mp4',
    thumbFile: 'keya-chicken-tortilla-thumb.webp',
    seekTime: 3.0,
    title: 'Keya Chicken Tortilla — Food & Lifestyle Commercial',
    durationFormatted: '00:32',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: '39.mp4',
    destFile: 'reel-39.mp4',
    thumbFile: 'reel-39-thumb.webp',
    seekTime: 4.0,
    title: 'Viral Ranking Format — Edition 39',
    durationFormatted: '01:13',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: '63.mp4',
    destFile: 'reel-63.mp4',
    thumbFile: 'reel-63-thumb.webp',
    seekTime: 4.0,
    title: 'Audience-Driven List Curation — Edition 63',
    durationFormatted: '01:00',
    isVertical: true
  },
  {
    category: 'video-editing',
    srcDir: 'Video Editing',
    srcFile: '5_03.mp4',
    destFile: 'reel-5-03.mp4',
    thumbFile: 'reel-5-03-thumb.webp',
    seekTime: 3.0,
    title: 'High-Retention Short-Form Edit — Reel 05',
    durationFormatted: '00:35',
    isVertical: true
  },
  // Visual Effects
  {
    category: 'visual-effects',
    srcDir: 'Visual Effects',
    srcFile: 'Elley Duhé - MIDDLE OF THE NIGHT _ BGMI_PUBG Velocity Montage _ Infinite FF.mp4',
    destFile: 'elley-duhe-velocity-montage.mp4',
    thumbFile: 'elley-duhe-velocity-thumb.webp',
    seekTime: 4.0,
    title: 'BGMI/PUBG Velocity Montage — Elley Duhé',
    durationFormatted: '00:55',
    isVertical: false
  },
  {
    category: 'visual-effects',
    srcDir: 'Visual Effects',
    srcFile: 'XXXTENTACION SAD - Free Fire Velocity Montage _ Infinite FF.mp4',
    destFile: 'xxxtentacion-velocity-montage.mp4',
    thumbFile: 'xxxtentacion-velocity-thumb.webp',
    seekTime: 4.0,
    title: 'Free Fire Velocity Montage — XXXTENTACION SAD',
    durationFormatted: '01:19',
    isVertical: false
  }
];

// Ensure public/assets/videos directories exist
['video-editing', 'motion-graphics', 'color-grading', 'visual-effects'].forEach(cat => {
  const dir = path.join(publicVideos, cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('--- Starting Video Migration & Thumbnail Generation ---');

for (const item of videoMap) {
  const src = path.join(srcProjects, item.srcDir, item.srcFile);
  const destVideo = path.join(publicVideos, item.category, item.destFile);
  const destThumb = path.join(publicVideos, item.category, item.thumbFile);

  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src);
    continue;
  }

  // Copy video if not already present or different size
  if (!fs.existsSync(destVideo) || fs.statSync(destVideo).size !== fs.statSync(src).size) {
    console.log(`Copying ${item.srcFile} -> ${item.destFile}...`);
    fs.copyFileSync(src, destVideo);
  } else {
    console.log(`Video ${item.destFile} already exists.`);
  }

  // Generate thumbnail using ffmpeg
  if (!fs.existsSync(destThumb)) {
    console.log(`Generating thumbnail for ${item.destFile} at ${item.seekTime}s...`);
    try {
      execSync(`ffmpeg -ss ${item.seekTime} -i "${destVideo}" -vframes 1 -q:v 2 -vf "scale='min(1920,iw)':-2" -y "${destThumb}"`, { stdio: 'pipe' });
      console.log(`Saved ${destThumb}`);
    } catch (e) {
      console.error(`Error generating thumb for ${item.destFile}:`, e.message);
    }
  } else {
    console.log(`Thumbnail ${item.thumbFile} already exists.`);
  }
}

// Generate the 4 master category thumbnails for Selected Works
console.log('--- Generating Category Master Thumbnails ---');
const categoryCards = [
  {
    slug: 'video-editing',
    sourceVideo: path.join(publicVideos, 'video-editing', 'travel-hook.mp4'),
    seekTime: 2.5
  },
  {
    slug: 'motion-graphics',
    sourceVideo: path.join(publicVideos, 'motion-graphics', 'airbnb.mp4'),
    seekTime: 1.5
  },
  {
    slug: 'color-grading',
    sourceVideo: path.join(publicVideos, 'color-grading', 'colorgrade.mp4'),
    seekTime: 3.5
  },
  {
    slug: 'visual-effects',
    sourceVideo: path.join(publicVideos, 'visual-effects', 'elley-duhe-velocity-montage.mp4'),
    seekTime: 4.0
  }
];

categoryCards.forEach(cat => {
  const targetDir = path.join(publicProjects, cat.slug);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const targetThumb = path.join(targetDir, 'thumbnail.webp');
  try {
    execSync(`ffmpeg -ss ${cat.seekTime} -i "${cat.sourceVideo}" -vframes 1 -q:v 2 -vf "scale='min(1920,iw)':-2" -y "${targetThumb}"`, { stdio: 'pipe' });
    console.log(`Generated master category thumbnail for ${cat.slug}`);
  } catch (e) {
    console.error(`Failed to generate category thumb for ${cat.slug}:`, e.message);
  }
});

// Remove old mock projects (project-01, project-02, project-03)
['project-01', 'project-02', 'project-03'].forEach(p => {
  const pDir = path.join(publicProjects, p);
  if (fs.existsSync(pDir)) {
    console.log(`Removing old mock directory: ${p}`);
    fs.rmSync(pDir, { recursive: true, force: true });
  }
});

console.log('--- Migration & Generation Complete! ---');
