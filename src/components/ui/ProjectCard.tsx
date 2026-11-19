'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { ProjectRecord } from '@/types';
import { soundManager } from '@/lib/sound';
import { usePageTransition } from '@/components/providers/PageTransitionProvider';

interface ProjectCardProps {
  project: ProjectRecord;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { navigateTo } = usePageTransition();

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundManager.playHover();
    if (videoRef.current && project.media.previewVideo) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo(`/work/${project.slug}`);
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group block relative w-full select-none"
      data-cursor="VIEW PROJECT"
    >
      {/* Thumbnail and Video Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-lg border border-white/[0.1] bg-[#111111] overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Corner Reticle Brackets */}
        <div className="corner-bracket corner-tl !top-3 !left-3 !w-4 !h-4 group-hover:scale-110 transition-transform" />
        <div className="corner-bracket corner-tr !top-3 !right-3 !w-4 !h-4 group-hover:scale-110 transition-transform" />
        <div className="corner-bracket corner-bl !bottom-3 !left-3 !w-4 !h-4 group-hover:scale-110 transition-transform" />
        <div className="corner-bracket corner-br !bottom-3 !right-3 !w-4 !h-4 group-hover:scale-110 transition-transform" />

        {/* Thumbnail Image */}
        <Image
          src={project.media.thumbnail}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 620px"
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-90'
          }`}
        />

        {/* Hover Video Preview */}
        {project.media.previewVideo && (
          <video
            ref={videoRef}
            src={project.media.previewVideo}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Category Pill & Video Count Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded bg-[#080808]/85 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] uppercase tracking-wider text-[#F0F0ED]">
            {project.category}
          </div>
          {project.items && project.items.length > 0 && (
            <div className="px-2 py-1 rounded bg-[#080808]/85 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] uppercase tracking-wider text-emerald-400 font-medium">
              {project.items.length} {project.items.length === 1 ? 'EDIT' : 'EDITS'}
            </div>
          )}
        </div>

        {/* Duration / Telemetry Overlay */}
        {project.media.duration && (
          <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded bg-[#080808]/80 backdrop-blur-md border border-white/10 font-mono-tech text-[9px] uppercase tracking-wider text-[#A1A1A1]">
            TC {project.media.duration}
          </div>
        )}
      </div>

      {/* Editorial Project Metadata Footer */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-mono-tech text-xs text-[#777777] font-bold">
              {project.identifier}
            </span>
            <span className="text-[#333333]">/</span>
            <span className="font-mono-tech text-[10px] text-[#A1A1A1] uppercase tracking-wider">
              {project.specs.software.join(' • ')}
            </span>
          </div>
          <h3 className="font-sans-body font-bold text-base sm:text-lg uppercase text-[#F0F0ED] group-hover:text-white transition-colors tracking-tight">
            {project.title}
          </h3>
          <p className="font-sans-body text-xs sm:text-sm text-[#777777] group-hover:text-[#A1A1A1] transition-colors mt-1 line-clamp-1">
            {project.tagline}
          </p>
        </div>

        {/* Arrow Trigger */}
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#777777] group-hover:border-white/50 group-hover:text-[#F0F0ED] group-hover:bg-white/[0.05] transition-all flex-shrink-0 mt-1">
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
