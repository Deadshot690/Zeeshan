'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Sparkles, CheckCircle2, Monitor, Smartphone } from 'lucide-react';
import { ProjectMediaItem } from '@/types';
import { soundManager } from '@/lib/sound';

interface CategoryVideoShowcaseProps {
  items: ProjectMediaItem[];
  categoryTitle: string;
}

export default function CategoryVideoShowcase({ items, categoryTitle }: CategoryVideoShowcaseProps) {
  const [activeItem, setActiveItem] = useState<ProjectMediaItem>(items[0] || {
    id: 'default',
    title: categoryTitle,
    videoSrc: '',
    thumbnailSrc: '',
    duration: '00:00',
    isVertical: false,
    resolution: '4K UHD',
  });

  const [isPlayingTheater, setIsPlayingTheater] = useState(false);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);
  const theaterContainerRef = useRef<HTMLDivElement>(null);

  // When active item changes, reload theater video
  useEffect(() => {
    if (theaterVideoRef.current) {
      theaterVideoRef.current.load();
      setIsPlayingTheater(false);
    }
  }, [activeItem.id]);

  const handleSelectVideo = (item: ProjectMediaItem) => {
    setActiveItem(item);
    soundManager.playClick();
    // Scroll theater player into view smoothly if not visible
    if (theaterContainerRef.current) {
      theaterContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Attempt auto-play
    setTimeout(() => {
      if (theaterVideoRef.current) {
        theaterVideoRef.current.play()
          .then(() => setIsPlayingTheater(true))
          .catch(() => setIsPlayingTheater(false));
      }
    }, 200);
  };

  const toggleTheaterPlay = () => {
    if (!theaterVideoRef.current) return;
    if (isPlayingTheater) {
      theaterVideoRef.current.pause();
      setIsPlayingTheater(false);
    } else {
      theaterVideoRef.current.play()
        .then(() => setIsPlayingTheater(true))
        .catch(() => setIsPlayingTheater(false));
    }
    soundManager.playClick();
  };

  return (
    <div className="w-full flex flex-col gap-16">
      {/* 01. Primary Cinematic Theater Player */}
      <div ref={theaterContainerRef} className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#F0F0ED] font-bold">NOW SCREENING:</span>
            <span className="text-[#A1A1A1] max-w-[200px] sm:max-w-md truncate">{activeItem.title}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#777777]">
            <span>{activeItem.resolution}</span>
            <span>TC {activeItem.duration}</span>
            <span>{activeItem.isVertical ? '9:16 VERTICAL REEL' : '16:9 WIDESCREEN'}</span>
          </div>
        </div>

        {/* Theater Screen Container */}
        <div className={`relative w-full rounded-xl border border-white/[0.12] bg-[#070707] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.9)] flex items-center justify-center ${
          activeItem.isVertical ? 'min-h-[500px] sm:min-h-[640px] md:min-h-[720px] max-h-[82vh] py-6 bg-black/60 backdrop-blur-md' : 'aspect-video'
        }`}>
          {/* Subtle Ambient Glow in Background from Poster Image (Zero Video Decoding Overhead) */}
          {activeItem.isVertical && activeItem.thumbnailSrc && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 filter blur-3xl scale-125">
              <Image
                src={activeItem.thumbnailSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Framing Brackets */}
          <div className="corner-bracket corner-tl !top-4 !left-4" />
          <div className="corner-bracket corner-tr !top-4 !right-4" />
          <div className="corner-bracket corner-bl !bottom-4 !left-4" />
          <div className="corner-bracket corner-br !bottom-4 !right-4" />

          {/* Video Element */}
          <video
            ref={theaterVideoRef}
            src={activeItem.videoSrc}
            poster={activeItem.thumbnailSrc}
            controls
            playsInline
            preload="metadata"
            onPlay={() => setIsPlayingTheater(true)}
            onPause={() => setIsPlayingTheater(false)}
            className={`relative z-10 transition-all ${
              activeItem.isVertical
                ? 'h-full max-h-[75vh] aspect-[9/16] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/10'
                : 'w-full h-full object-cover'
            }`}
          />
        </div>

        {/* Caption below theater */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono-tech text-[10px] text-[#F0F0ED] uppercase tracking-wider">
              {activeItem.tag || 'FEATURED'}
            </span>
            <span className="font-sans-body text-xs sm:text-sm text-[#A1A1A1] font-light">
              {activeItem.description || activeItem.title}
            </span>
          </div>
          <span className="font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest sm:text-right">
            PRESS PLAY OR SELECT ANY EDIT BELOW
          </span>
        </div>
      </div>

      {/* 02. Curated Category Video Archive Grid */}
      <div className="w-full flex flex-col gap-6 pt-10 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-[0.25em] mb-1">
              <Film className="w-3.5 h-3.5 text-[#F0F0ED]" />
              <span>CATEGORY CATALOG</span>
              <span>//</span>
              <span className="text-[#F0F0ED]">{items.length} {items.length === 1 ? 'PROJECT' : 'PROJECTS'}</span>
            </div>
            <h3 className="font-sans-body font-black text-2xl sm:text-4xl text-[#F0F0ED] uppercase tracking-tight">
              ALL {categoryTitle.toUpperCase()} WORKS
            </h3>
          </div>
          <p className="font-mono-tech text-xs text-[#A1A1A1] uppercase tracking-wider max-w-sm sm:text-right">
            Select any title to load into the master screening player.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className={`grid gap-6 ${
          // If predominantly vertical reels, use 3 or 4 columns
          items.some(i => i.isVertical)
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {items.map((item, idx) => {
            const isCurrent = item.id === activeItem.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectVideo(item)}
                onMouseEnter={() => soundManager.playHover()}
                className={`group relative rounded-xl border bg-[#0b0b0b] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/40'
                    : 'border-white/10 hover:border-white/35 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:-translate-y-1'
                }`}
              >
                {/* Visual Thumbnail / Preview Area */}
                <div className={`relative w-full bg-[#050505] overflow-hidden ${
                  item.isVertical ? 'aspect-[9/16]' : 'aspect-video'
                }`}>
                  {/* Thumbnail Image */}
                  <Image
                    src={item.thumbnailSrc}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-black/30 pointer-events-none" />

                  {/* Corner Reticle */}
                  <div className="corner-bracket corner-tl !top-3 !left-3 !w-3 !h-3" />
                  <div className="corner-bracket corner-tr !top-3 !right-3 !w-3 !h-3" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] uppercase tracking-wider text-[#F0F0ED]">
                      {item.tag || `ITEM 0${idx + 1}`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] text-[#A1A1A1]">
                      TC {item.duration}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'border-white bg-white text-black scale-110 shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                        : 'border-white/30 bg-black/60 text-white group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-black'
                    }`}>
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Format Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono-tech text-[9px] text-[#777777] pointer-events-none">
                    <span className="flex items-center gap-1 text-[#A1A1A1]">
                      {item.isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                      <span>{item.isVertical ? 'VERTICAL 9:16' : '16:9 WIDE'}</span>
                    </span>
                    <span className="text-[#F0F0ED]">{item.resolution.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Card Editorial Footer */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-[#777777]">TRACK 0{idx + 1}</span>
                    {isCurrent && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> SCREENING
                      </span>
                    )}
                  </div>
                  <h4 className="font-sans-body font-bold text-sm sm:text-base text-[#F0F0ED] group-hover:text-white transition-colors leading-snug">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="font-sans-body text-xs text-[#777777] group-hover:text-[#A1A1A1] transition-colors line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
