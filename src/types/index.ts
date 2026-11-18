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

export interface ProjectRecord {
  slug: string;
  identifier: string; // "PROJECT 01", "PROJECT 02", "PROJECT 03"
  title: string;
  category: 'Short-form content' | 'YouTube videos' | 'Ranking videos' | 'Promotional advertisements' | 'Motion graphics' | 'Social media content';
  year?: string;
  tagline: string;
  description: string;
  editingContribution: string;
  media: ProjectMedia;
  specs: ProjectTechnicalSpecs;
  featured: boolean;
  order: number;
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
