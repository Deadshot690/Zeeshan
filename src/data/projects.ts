import { ProjectRecord } from '@/types';

export const projects: ProjectRecord[] = [
  {
    slug: 'video-editing',
    identifier: 'WORK 01',
    title: 'VIDEO EDITING — SHORT-FORM & VIRAL REELS',
    category: 'Video Editing',
    year: '2024–2026',
    tagline: 'High-Retention Hooks, Precision Pacing & Viral Audience Retention',
    description:
      'A curated collection of professional short-form edits engineered for maximum watch-time, viral social feeds, and audience retention. From high-altitude alpine hiking and extreme skiing to dynamic travel storytelling, food commercials, and ranking lists, every cut is timed to the millisecond with aggressive hook delivery and layered audio design.',
    editingContribution:
      'Engineered the first 3-second hook structure, performed frame-accurate speed ramping, designed multi-track SFX risers, integrated dynamic kinetic captions, and structured narrative arcs for maximum viewer completion.',
    media: {
      thumbnail: '/assets/projects/video-editing/thumbnail.webp',
      previewVideo: '/assets/videos/video-editing/travel-hook.mp4',
      finalVideo: '/assets/videos/video-editing/travel-hook.mp4',
      aspectRatio: 9 / 16,
      duration: '01:12',
    },
    specs: {
      software: ['Adobe Premiere Pro', 'CapCut'],
      techniques: ['Speed Ramping', 'Hook Engineering', 'Multi-Track SFX Layering', 'Pattern Interrupts', 'Kinetic Captions'],
      timelineTracks: 32,
      colorSpace: 'Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '4K UHD (2160x3840)',
    },
    featured: true,
    order: 1,
    items: [
      {
        id: 'travel-hook',
        title: 'Global Travel — Dynamic Hook & Storytelling',
        videoSrc: '/assets/videos/video-editing/travel-hook.mp4',
        thumbnailSrc: '/assets/videos/video-editing/travel-hook-thumb.webp',
        duration: '01:12',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'Cinematic world travel reel utilizing whip pans, dynamic speed ramping, and ambient environmental audio layering.',
        tag: 'TRAVEL & LIFESTYLE',
      },
      {
        id: 'hiking-hook',
        title: 'Alpine Hiking — Viral Hook Reel',
        videoSrc: '/assets/videos/video-editing/hiking-hook.mp4',
        thumbnailSrc: '/assets/videos/video-editing/hiking-hook-thumb.webp',
        duration: '01:14',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'High-altitude mountain expedition reel engineered with an immediate 3-second retention hook and atmospheric sound.',
        tag: 'OUTDOOR & ADVENTURE',
      },
      {
        id: 'ski-hook',
        title: 'Extreme Skiing — High-Retention Action Reel',
        videoSrc: '/assets/videos/video-editing/ski-hook.mp4',
        thumbnailSrc: '/assets/videos/video-editing/ski-hook-thumb.webp',
        duration: '01:20',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'Fast-paced winter sports cut with frame-accurate motion tracking, rapid cuts, and high-impact audio hits.',
        tag: 'ACTION SPORTS',
      },
      {
        id: 'keya-tortilla',
        title: 'Keya Chicken Tortilla — Food & Lifestyle Commercial',
        videoSrc: '/assets/videos/video-editing/keya-chicken-tortilla.mp4',
        thumbnailSrc: '/assets/videos/video-editing/keya-chicken-tortilla-thumb.webp',
        duration: '00:32',
        isVertical: true,
        resolution: '1080p FHD (1080×1920)',
        description: 'Commercial culinary edit featuring mouth-watering ASMR sizzling sound design, rhythmic cuts, and punchy text reveals.',
        tag: 'COMMERCIAL & FOOD',
      },
      {
        id: 'reel-39',
        title: 'Viral Ranking Format — Edition 39',
        videoSrc: '/assets/videos/video-editing/reel-39.mp4',
        thumbnailSrc: '/assets/videos/video-editing/reel-39-thumb.webp',
        duration: '01:13',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'Audience-tested ranking format with seamless micro-transitions and continuous audio drive to eliminate drop-off.',
        tag: 'RANKING & VIRAL',
      },
      {
        id: 'reel-63',
        title: 'Audience-Driven List Curation — Edition 63',
        videoSrc: '/assets/videos/video-editing/reel-63.mp4',
        thumbnailSrc: '/assets/videos/video-editing/reel-63-thumb.webp',
        duration: '01:00',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'High-retention list video with thematic countdown markers and rapid pacing calibrated for viral YouTube Shorts.',
        tag: 'COUNTDOWN & LISTS',
      },
      {
        id: 'reel-5-03',
        title: 'High-Retention Short-Form Edit — Reel 05',
        videoSrc: '/assets/videos/video-editing/reel-5-03.mp4',
        thumbnailSrc: '/assets/videos/video-editing/reel-5-03-thumb.webp',
        duration: '00:35',
        isVertical: true,
        resolution: '1080p FHD (1080×1920)',
        description: 'Snappy short-form edit demonstrating compact storytelling, quick visual gags, and continuous pacing momentum.',
        tag: 'SHORT-FORM NARRATIVE',
      },
    ],
  },
  {
    slug: 'motion-graphics',
    identifier: 'WORK 02',
    title: 'MOTION GRAPHICS — BRAND & KINETIC TYPOGRAPHY',
    category: 'Motion Graphics',
    year: '2024–2026',
    tagline: 'Dynamic 2D/3D Brand Assets, Kinetic Typography & Fluid Animations',
    description:
      'High-end motion graphics and kinetic typography designed in Adobe After Effects. Featuring commercial brand identity animations for Airbnb, dynamic interface motions, and typographic flow systems that turn static messages into unforgettable visual experiences.',
    editingContribution:
      'Engineered smooth Bézier curve easing, designed custom vector transformations, synchronized kinetic typographic downbeats, and built reusable modular graphics assets.',
    media: {
      thumbnail: '/assets/projects/motion-graphics/thumbnail.webp',
      previewVideo: '/assets/videos/motion-graphics/airbnb.mp4',
      finalVideo: '/assets/videos/motion-graphics/airbnb.mp4',
      aspectRatio: 16 / 9,
      duration: '00:04',
    },
    specs: {
      software: ['Adobe After Effects', 'Adobe Premiere Pro'],
      techniques: ['Bézier Curve Easing', 'Kinetic Typography', 'Brand Motion Systems', 'Vector Morphing', 'Dynamic UI'],
      timelineTracks: 24,
      colorSpace: 'Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '2.5K QHD (2560×1440)',
    },
    featured: true,
    order: 2,
    items: [
      {
        id: 'airbnb',
        title: 'Airbnb Kinetic Motion Graphics',
        videoSrc: '/assets/videos/motion-graphics/airbnb.mp4',
        thumbnailSrc: '/assets/videos/motion-graphics/airbnb-thumb.webp',
        duration: '00:04',
        isVertical: false,
        resolution: '2.5K QHD (2560×1440)',
        description: 'Clean, elegant brand identity animation showcasing geometric morphing, smooth spatial curves, and pristine logo reveal.',
        tag: 'BRAND IDENTITY',
      },
      {
        id: 'animation-2',
        title: 'Kinetic Typography & Dynamic UI',
        videoSrc: '/assets/videos/motion-graphics/animation-2.mp4',
        thumbnailSrc: '/assets/videos/motion-graphics/animation-2-thumb.webp',
        duration: '00:15',
        isVertical: true,
        resolution: '1080p FHD (1080×1920)',
        description: 'Vertical format kinetic typography reel synchronized with punchy sound design and dynamic screen layouts.',
        tag: 'KINETIC TYPE & UI',
      },
    ],
  },
  {
    slug: 'color-grading',
    identifier: 'WORK 03',
    title: 'COLOR GRADING — CINEMATIC TONE & MOOD',
    category: 'Color Grading',
    year: '2024–2026',
    tagline: 'Atmospheric Look Design, Contrast Architecture & Film Emulation',
    description:
      'Professional color grading showcasing the transformation of raw flat camera profiles into rich, cinematic imagery. Focusing on skin tone preservation, highlight compression, shadow rolloff, and mood grading tailored to each scene’s emotional narrative.',
    editingContribution:
      'Look development, tone mapping from flat camera profiles, skin tone isolation and protection, creative curve sculpting, highlight rolloff grading, and filmic grain texturing.',
    media: {
      thumbnail: '/assets/projects/color-grading/thumbnail.webp',
      previewVideo: '/assets/videos/color-grading/colorgrade.mp4',
      finalVideo: '/assets/videos/color-grading/colorgrade.mp4',
      aspectRatio: 9 / 16,
      duration: '00:15',
    },
    specs: {
      software: ['Adobe Premiere Pro', 'Lumetri Color / DaVinci Resolve'],
      techniques: ['Log to Rec.709 Conversion', 'Skin Tone Isolation', 'Shadow/Highlight Rolloff', 'Film Emulation Curves'],
      timelineTracks: 16,
      colorSpace: 'ACES / Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '4K UHD (2160×3840)',
    },
    featured: true,
    order: 3,
    items: [
      {
        id: 'colorgrade-reel',
        title: 'Cinematic Color Grading Showcase Reel',
        videoSrc: '/assets/videos/color-grading/colorgrade.mp4',
        thumbnailSrc: '/assets/videos/color-grading/colorgrade-thumb.webp',
        duration: '00:15',
        isVertical: true,
        resolution: '4K UHD (2160×3840)',
        description: 'Comprehensive color grading demonstration highlighting side-by-side tonal density, highlight protection, and film emulation.',
        tag: 'COLOR LOOK DEVELOPMENT',
      },
    ],
  },
  {
    slug: 'visual-effects',
    identifier: 'WORK 04',
    title: 'VISUAL EFFECTS — VELOCITY MONTAGES & COMPOSITING',
    category: 'Visual Effects',
    year: '2024–2026',
    tagline: 'High-Velocity Beat Sync, Custom Compositing & Impact VFX',
    description:
      'High-velocity video editing and visual effects montages synced to music beats. Features custom speed curve ramping, optical flow motion blur, impact shakes, chromatic aberration, and seamless transition illusions crafted for competitive gaming highlights and music video aesthetics.',
    editingContribution:
      'Sub-frame musical beat synchronization, custom velocity curve re-timing, optical flow motion blur, impact shake compositing, RGB split chromatic aberration, and audio riser design.',
    media: {
      thumbnail: '/assets/projects/visual-effects/thumbnail.webp',
      previewVideo: '/assets/videos/visual-effects/elley-duhe-velocity-montage.mp4',
      finalVideo: '/assets/videos/visual-effects/elley-duhe-velocity-montage.mp4',
      aspectRatio: 16 / 9,
      duration: '00:55',
    },
    specs: {
      software: ['Adobe After Effects', 'Adobe Premiere Pro'],
      techniques: ['Velocity Curve Re-timing', 'Beat-Synced Transitions', 'Optical Flow Blur', 'Chromatic Aberration', 'Impact Shakes'],
      timelineTracks: 28,
      colorSpace: 'Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '720p HD (1280×720)',
    },
    featured: true,
    order: 4,
    items: [
      {
        id: 'elley-duhe-velocity',
        title: 'BGMI / PUBG Velocity Montage — Elley Duhé',
        videoSrc: '/assets/videos/visual-effects/elley-duhe-velocity-montage.mp4',
        thumbnailSrc: '/assets/videos/visual-effects/elley-duhe-velocity-thumb.webp',
        duration: '00:55',
        isVertical: false,
        resolution: '720p HD (1280×720)',
        description: 'High-energy velocity montage synchronized to "Middle of the Night" with aggressive speed ramps and optical motion blur.',
        tag: 'VELOCITY MONTAGE',
      },
      {
        id: 'xxxtentacion-velocity',
        title: 'Free Fire Velocity Montage — XXXTENTACION SAD',
        videoSrc: '/assets/videos/visual-effects/xxxtentacion-velocity-montage.mp4',
        thumbnailSrc: '/assets/videos/visual-effects/xxxtentacion-velocity-thumb.webp',
        duration: '01:19',
        isVertical: false,
        resolution: '720p HD (1280×720)',
        description: 'Stylized montage with dramatic velocity shifts, atmospheric dark color styling, and precise combat downbeat sync.',
        tag: 'BEAT-SYNCED VFX',
      },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(currentSlug: string): {
  prev: ProjectRecord;
  next: ProjectRecord;
} {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;

  return {
    prev: projects[prevIndex]!,
    next: projects[nextIndex]!,
  };
}
