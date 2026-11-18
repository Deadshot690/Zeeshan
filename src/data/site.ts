import { SiteConfig, CapabilityItem } from '@/types';

export const siteConfig: SiteConfig = {
  brandName: 'ZEESHAN RAFIK SHAIKH',
  displayName: 'ZEESHAN',
  role: 'VIDEO EDITOR | SHORT-FORM CONTENT SPECIALIST',
  title: 'Video Editor & Short-Form Content Specialist',
  location: 'Mumbai, Maharashtra, India',
  coordinates: '19.0760° N, 72.8777° E',
  contact: {
    phone: '+91 8237547886',
    phoneHref: 'tel:+918237547886',
    email: 'zeeshanedits14@gmail.com',
    emailHref: 'mailto:zeeshanedits14@gmail.com',
    whatsappHref: 'https://wa.me/918237547886',
  },
  summary:
    'Creative Video Editor with 4+ years of freelance experience specializing in short-form content, viral YouTube videos, ranking videos, and promotional advertisements. Experienced in transforming concepts into engaging visual content through effective storytelling, pacing, sound design, and editing techniques. Have contributed to millions of cumulative views across multiple client channels and social media pages.',
  experience: {
    role: 'Freelance Video Editor',
    period: '2022 – Present',
    responsibilities: [
      'Edited short-form videos for multiple YouTube channels and social media platforms.',
      'Specialized in viral content formats, including ranking videos and engaging audience-driven content.',
      'Worked on promotional advertisements and other client-specific video projects.',
      'Applied storytelling, visual transitions, sound design, and pacing techniques to improve viewer engagement.',
      'Collaborated with clients to understand creative requirements, implement feedback, and deliver projects within deadlines.',
      'Contributed to content generating millions of cumulative views across various client channels and pages.',
    ],
  },
  skills: [
    'Short-form Video Editing',
    'YouTube Content Editing',
    'Social Media Advertisements',
    'Storytelling & Visual Narration',
    'Motion Graphics & Animation',
    'Sound Design & Audio Synchronization',
    'Transitions & Visual Effects',
    'Content Pacing & Audience Retention',
    'Client Collaboration & Revision Management',
  ],
  software: [
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'CapCut',
  ],
  education: {
    degree: 'Bachelor of Technology – Computer Science and Engineering',
    institution: 'Fr. Conceicao Rodrigues College of Engineering (FRCRCE)',
    location: 'Bandra, Mumbai',
    status: 'Currently Pursuing',
  },
  showreel: {
    videoSrc: '/assets/showreel/showreel.mp4',
    posterSrc: '/assets/showreel/showreel-poster.webp',
    aspectRatio: '21/9',
    headline: 'SHOWREEL',
    supportingCopy: 'A curated selection of my work.',
    timecode: '01:24:67',
  },
};

export const capabilities: CapabilityItem[] = [
  {
    id: 'video-editing',
    number: '01',
    title: 'Video Editing',
    subtitle: 'Rhythm, Pacing & Narrative Assembly',
    description:
      'Precision pacing calibrated for audience retention. Seamless multi-cam assembly, scene transitions, and narrative framing that captures and holds viewer attention across short-form and extended formats.',
    deliverables: ['Short-Form Vertical Videos', 'Long-Form YouTube Edits', 'Ranking & List Formats', 'Commercial Spots'],
    software: ['Adobe Premiere Pro', 'CapCut'],
  },
  {
    id: 'motion-graphics',
    number: '02',
    title: 'Motion Graphics',
    subtitle: 'Kinetic Typography & Dynamic UI',
    description:
      'Dynamic typography, custom visual accents, animated lower thirds, kinetic graphical callouts, and bespoke motion assets that reinforce the visual identity and keep viewers engaged.',
    deliverables: ['Kinetic Titles', 'Branded Lower Thirds', 'Graphic Overlays', 'Explainer Visuals'],
    software: ['Adobe After Effects'],
  },
  {
    id: 'color-grading',
    number: '03',
    title: 'Color Grading',
    subtitle: 'Cinematic Looks & Tone Science',
    description:
      'Transforming flat raw Log sensor captures into rich, atmospheric color grades with controlled contrast, film emulation, skin-tone preservation, and mood-driven color palettes.',
    deliverables: ['Log-to-Rec.709 Correction', 'Film Emulation LUTs', 'Mood Palette Styling', 'Shot-to-Shot Matching'],
    software: ['Lumetri Color', 'Premiere Pro'],
  },
  {
    id: 'visual-effects',
    number: '04',
    title: 'Visual Effects',
    subtitle: 'Compositing & Seamless Illusions',
    description:
      'Speed ramps, rotoscoping, clean plate reconstruction, mask transitions, particle accents, and invisible visual effects that serve the story without distracting the viewer.',
    deliverables: ['Seamless Mask Transitions', 'Speed Ramps & Retiming', 'Object Isolation & Tracking', 'Atmospheric Particles'],
    software: ['Adobe After Effects', 'Premiere Pro'],
  },
];
