export interface ProjectMedia {
  thumbnail: string;
  previewVideo?: string;
  finalVideo?: string;
  aspectRatio?: number;
  duration?: string;
}

export interface ProjectTechnicalSpecs {
  software: string[];
  techniques: string[];
  timelineTracks?: number;
  colorSpace?: string;
  audioMix?: string;
  resolution?: string;
}

export interface ProjectMediaItem {
  id: string;
  title: string;
  videoSrc: string;
  thumbnailSrc: string;
  duration: string;
  isVertical: boolean;
  resolution: string;
  description?: string;
  tag?: string;
}

export interface ProjectRecord {
  slug: string;
  identifier: string; // "WORK 01", "WORK 02", etc.
  title: string;
  category: 'Video Editing' | 'Motion Graphics' | 'Color Grading' | 'Visual Effects' | string;
  year?: string;
  tagline: string;
  description: string;
  editingContribution: string;
  media: ProjectMedia;
  specs: ProjectTechnicalSpecs;
  featured: boolean;
  order: number;
  items?: ProjectMediaItem[];
}

export interface CapabilityItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  software: string[];
}

export interface SiteConfig {
  brandName: string;
  displayName: string;
  role: string;
  title: string;
  location: string;
  coordinates: string;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    whatsappHref: string;
  };
  summary: string;
  experience: {
    role: string;
    period: string;
    responsibilities: string[];
  };
  skills: string[];
  software: string[];
  education: {
    degree: string;
    institution: string;
    location: string;
    status: string;
  };
  showreel: {
    videoSrc: string;
    posterSrc: string;
    aspectRatio: string;
    headline: string;
    supportingCopy: string;
    timecode: string;
  };
}
