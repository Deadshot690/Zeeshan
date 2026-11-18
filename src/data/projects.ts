import { ProjectRecord } from '@/types';

export const projects: ProjectRecord[] = [
  {
    slug: 'project-01',
    identifier: 'PROJECT 01',
    title: 'PROJECT 01 — SHORT-FORM ENGAGEMENT EDIT',
    category: 'Short-form content',
    tagline: 'High-Retention Short-Form Narrative & Dynamic Motion',
    description:
      'An illustrative showcase of short-form editing techniques built for modern audience retention. Designed with rapid hook delivery, custom motion graphics callouts, aggressive sound layering, and seamless pattern interrupts to maximize watch-time across viral social feeds.',
    editingContribution:
      'Engineered the first 3-second hook structure, executed frame-accurate speed ramping, designed multi-track SFX risers, integrated dynamic kinetic captions, and shaped the pacing arc for high completion rate.',
    media: {
      thumbnail: '/assets/projects/project-01/thumbnail.webp',
      previewVideo: '/assets/projects/project-01/preview.mp4',
      finalVideo: '/assets/projects/project-01/final-video.mp4',
      aspectRatio: 16 / 9,
      duration: '00:45',
    },
    specs: {
      software: ['Adobe Premiere Pro', 'Adobe After Effects'],
      techniques: ['Speed Ramps', 'Sound Design Layering', 'Pattern Interrupts', 'Kinetic Typography'],
      timelineTracks: 24,
      colorSpace: 'Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '4K UHD / 1080p',
    },
    featured: true,
    order: 1,
  },
  {
    slug: 'project-02',
    identifier: 'PROJECT 02',
    title: 'PROJECT 02 — RANKING & CURATION EDIT',
    category: 'Ranking videos',
    tagline: 'Audience-Driven List Curation with Micro-Transitions',
    description:
      'A demonstration of pacing and structural storytelling in ranking and countdown video formats. Focuses on maintaining viewer momentum across successive items through thematic transitions, graphic chapter markers, and continuous audio drive.',
    editingContribution:
      'Devised chapter hierarchy, cut rhythm to musical downbeats, created custom motion graphics badges for ranking milestones, and eliminated dead air through tight dialogue compression.',
    media: {
      thumbnail: '/assets/projects/project-02/thumbnail.webp',
      previewVideo: '/assets/projects/project-02/preview.mp4',
      finalVideo: '/assets/projects/project-02/final-video.mp4',
      aspectRatio: 16 / 9,
      duration: '01:15',
    },
    specs: {
      software: ['Adobe Premiere Pro', 'CapCut'],
      techniques: ['Rhythmic Assembly', 'Chapter Graphics', 'Audio Bed Mixing', 'Micro-Transitions'],
      timelineTracks: 18,
      colorSpace: 'Rec.709',
      audioMix: 'Stereo -14 LUFS',
      resolution: '1080p Full HD',
    },
    featured: true,
    order: 2,
  },
  {
    slug: 'project-03',
    identifier: 'PROJECT 03',
    title: 'PROJECT 03 — PROMOTIONAL ADVERTISEMENT',
    category: 'Promotional advertisements',
    tagline: 'Cinematic Commercial Cut with Precision Sound Design',
    description:
      'A commercial edit demonstration exploring high-impact visual delivery, commercial color grading, atmospheric sound effects, and succinct call-to-action framing designed to communicate brand value within seconds.',
    editingContribution:
      'Handled complete assembly, custom color grading curve, impact sound synchronization, motion blur matching, and brand typographic reveals.',
    media: {
      thumbnail: '/assets/projects/project-03/thumbnail.webp',
      previewVideo: '/assets/projects/project-03/preview.mp4',
      finalVideo: '/assets/projects/project-03/final-video.mp4',
      aspectRatio: 16 / 9,
      duration: '00:30',
    },
    specs: {
      software: ['Adobe Premiere Pro', 'Adobe After Effects'],
      techniques: ['Color Grading', 'Impact Foley Sound', 'Graphic Overlays', 'Match Cuts'],
      timelineTracks: 32,
      colorSpace: 'ACES / Rec.709',
      audioMix: 'Stereo -12 LUFS',
      resolution: '4K DCI',
    },
    featured: true,
    order: 3,
  },
];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(currentSlug: string): {
  prev: ProjectRecord;
  next: ProjectRecord;
} {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  const safeIndex = index === -1 ? 0 : index;
  const prevIndex = (safeIndex - 1 + projects.length) % projects.length;
  const nextIndex = (safeIndex + 1) % projects.length;
  return {
    prev: projects[prevIndex]!,
    next: projects[nextIndex]!,
  };
}
