'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles,
  Smartphone,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { ProjectMediaItem } from '@/types';
import { soundManager } from '@/lib/sound';

interface CategoryVideoShowcaseProps {
  items: ProjectMediaItem[];
  categoryTitle: string;
}

function formatVideoTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function CategoryVideoShowcase({ items, categoryTitle }: CategoryVideoShowcaseProps) {
  // Currently playing card ID (for inline in-card playback)
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Lightbox modal item (for full cinema screening overlay)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Navigate lightbox next/prev
  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % items.length));
    soundManager.playClick();
  }, [lightboxIndex, items.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! - 1 + items.length) % items.length));
    soundManager.playClick();
  }, [lightboxIndex, items.length]);

  // Global keyboard shortcuts for modal
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextLightbox]);

  const currentLightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="w-full flex flex-col gap-10">
      {/* 01. Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.1] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-[0.25em] mb-2">
            <Film className="w-3.5 h-3.5 text-[#F0F0ED]" />
            <span>CURATED WORKS ARCHIVE</span>
            <span>//</span>
            <span className="text-emerald-400 font-bold">{items.length} {items.length === 1 ? 'EDIT' : 'EDITS'} AVAILABLE</span>
          </div>
          <h2 className="font-sans-body font-black text-2xl sm:text-4xl text-[#F0F0ED] uppercase tracking-tight">
            ALL {categoryTitle.toUpperCase()} WORKS
          </h2>
        </div>
        <p className="font-mono-tech text-xs text-[#A1A1A1] uppercase tracking-wider max-w-sm sm:text-right">
          Click any card to play directly in place, or open in cinema screening mode.
        </p>
      </div>

      {/* 02. Video Cards Grid with Direct In-Card Playback */}
      <div
        className={`grid gap-8 ${
          items.some((i) => i.isVertical)
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {items.map((item, idx) => (
          <InlineVideoCard
            key={item.id}
            item={item}
            index={idx}
            isPlaying={activePlayingId === item.id}
            onTogglePlay={() => {
              if (activePlayingId === item.id) {
                setActivePlayingId(null);
              } else {
                setActivePlayingId(item.id);
                soundManager.playClick();
              }
            }}
            onOpenCinema={() => {
              setActivePlayingId(null); // Pause inline when expanding
              setLightboxIndex(idx);
              soundManager.playClick();
            }}
          />
        ))}
      </div>

      {/* 03. Immersive Cinema Lightbox Modal */}
      {currentLightboxItem && lightboxIndex !== null && (
        <CinemaLightboxModal
          item={currentLightboxItem}
          index={lightboxIndex}
          total={items.length}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// INLINE VIDEO CARD COMPONENT (Plays directly in place on click)
// -------------------------------------------------------------
interface InlineCardProps {
  item: ProjectMediaItem;
  index: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenCinema: () => void;
}

function InlineVideoCard({ item, index, isPlaying, onTogglePlay, onOpenCinema }: InlineCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sync play/pause with parent isPlaying state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Fallback to muted if browser blocks sound autoplay
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    const dur = video.duration || duration || 1;
    setProgress((video.currentTime / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * (video.duration || duration);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-xl border bg-[#0b0b0b] overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isPlaying
          ? 'border-white/60 shadow-[0_0_35px_rgba(255,255,255,0.18)] ring-1 ring-white/50'
          : 'border-white/10 hover:border-white/35 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:-translate-y-1'
      }`}
    >
      {/* Visual Frame Area */}
      <div
        onClick={onTogglePlay}
        className={`relative w-full bg-[#050505] overflow-hidden cursor-pointer ${
          item.isVertical ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        {/* Poster Image (shown when not playing) */}
        {!isPlaying && (
          <Image
            src={item.thumbnailSrc}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Live In-Card Video Element (mounted and playing in place) */}
        {isPlaying && (
          <video
            ref={videoRef}
            src={item.videoSrc}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover"
          />
        )}

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-black/35 pointer-events-none" />

        {/* Framing Reticles */}
        <div className="corner-bracket corner-tl !top-3 !left-3 !w-3 !h-3 pointer-events-none" />
        <div className="corner-bracket corner-tr !top-3 !right-3 !w-3 !h-3 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] uppercase tracking-wider text-[#F0F0ED]">
            {item.tag || `ITEM 0${index + 1}`}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 font-mono-tech text-[9px] text-[#A1A1A1]">
            TC {item.duration}
          </span>
        </div>

        {/* Center Play Button Overlay (when NOT playing) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-14 h-14 rounded-full border border-white/40 bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:border-white group-hover:bg-white group-hover:text-black shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </div>
          </div>
        )}

        {/* Interactive In-Card Controls Bar (when PLAYING) */}
        {isPlaying && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 inset-x-0 pt-8 pb-3 px-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 z-30 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-85'
            }`}
          >
            {/* Top row: Play/Pause, Time, Mute, Cinema Expand */}
            <div className="flex items-center justify-between text-white font-mono-tech text-[11px]">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onTogglePlay}
                  className="p-1 hover:text-white text-[#F0F0ED] transition-transform hover:scale-110 cursor-pointer"
                  title="Pause video"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
                <span className="text-[10px] text-[#A1A1A1] tracking-wider">
                  {formatVideoTime(currentTime)} / {item.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#F0F0ED]" />
                  )}
                </button>

                <button
                  onClick={onOpenCinema}
                  className="p-1 text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors cursor-pointer"
                  title="Expand to Cinema Mode"
                >
                  <Maximize className="w-3.5 h-3.5 text-[#F0F0ED]" />
                </button>
              </div>
            </div>

            {/* Scrubber line */}
            <div
              onClick={handleSeek}
              className="relative w-full h-[3px] hover:h-[5px] bg-white/20 rounded-full overflow-hidden cursor-pointer transition-all"
            >
              <div
                className="absolute top-0 left-0 h-full bg-[#F0F0ED] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Format Badge (when NOT playing) */}
        {!isPlaying && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono-tech text-[9px] text-[#777777] pointer-events-none z-20">
            <span className="flex items-center gap-1 text-[#A1A1A1]">
              {item.isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
              <span>{item.isVertical ? 'VERTICAL 9:16' : '16:9 WIDE'}</span>
            </span>
            <span className="text-[#F0F0ED]">{item.resolution.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* Card Editorial Footer */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-mono-tech">
          <span className="text-[#777777]">TRACK 0{index + 1}</span>
          {isPlaying ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> PLAYING IN PLACE
            </span>
          ) : (
            <span className="text-[#777777] text-[10px] uppercase tracking-wider">
              {item.resolution}
            </span>
          )}
        </div>

        <h4 className="font-sans-body font-bold text-sm sm:text-base text-[#F0F0ED] group-hover:text-white transition-colors leading-snug">
          {item.title}
        </h4>

        {item.description && (
          <p className="font-sans-body text-xs text-[#777777] group-hover:text-[#A1A1A1] transition-colors line-clamp-2 leading-relaxed font-light">
            {item.description}
          </p>
        )}

        {/* Bottom Action Triggers */}
        <div className="pt-2 flex items-center gap-2 border-t border-white/[0.06]">
          <button
            onClick={onTogglePlay}
            className={`flex-1 py-1.5 px-3 rounded text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isPlaying
                ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                : 'bg-white text-black hover:bg-[#F0F0ED]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCinema}
            className="py-1.5 px-2.5 rounded border border-white/15 bg-white/[0.04] text-[#A1A1A1] hover:text-white hover:border-white/35 transition-all text-[11px] font-mono-tech cursor-pointer flex items-center gap-1"
            title="Expand to Cinema Mode"
          >
            <Maximize className="w-3 h-3" />
            <span className="hidden sm:inline">CINEMA</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CINEMA LIGHTBOX SCREENING ROOM MODAL
// -------------------------------------------------------------
interface CinemaModalProps {
  item: ProjectMediaItem;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function CinemaLightboxModal({ item, index, total, onClose, onNext, onPrev }: CinemaModalProps) {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Play immediately when item changes
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
  }, [item.id]);

  const togglePlay = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    const dur = video.duration || duration || 1;
    setProgress((video.currentTime / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = modalVideoRef.current;
    if (video && video.duration) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = modalVideoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * (video.duration || duration);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-10 select-none animate-fadeIn"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 filter blur-3xl scale-125">
        <Image
          src={item.thumbnailSrc}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Modal Main Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-4 max-h-[95vh]"
      >
        {/* Top Header Row: Track Info + Close Button */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 font-mono-tech text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#F0F0ED] font-bold">
              TRACK 0{index + 1} / 0{total}
            </span>
            <span className="text-[#777777] hidden sm:inline">//</span>
            <span className="text-[#A1A1A1] hidden sm:inline font-sans-body truncate max-w-md">
              {item.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all cursor-pointer flex items-center gap-1.5 px-3 font-mono-tech text-xs"
          >
            <span>CLOSE</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Screening Area */}
        <div className="relative w-full flex items-center justify-center">
          {/* Previous Video Nav Arrow */}
          <button
            onClick={onPrev}
            className="absolute left-2 sm:-left-6 lg:-left-12 z-30 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-white text-[#F0F0ED] hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110"
            title="Previous edit (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Video Player Box */}
          <div
            onClick={togglePlay}
            className={`relative rounded-xl border border-white/20 bg-black overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] cursor-pointer flex items-center justify-center ${
              item.isVertical
                ? 'h-[65vh] sm:h-[72vh] md:h-[78vh] aspect-[9/16]'
                : 'w-full aspect-video max-h-[75vh]'
            }`}
          >
            <video
              ref={modalVideoRef}
              src={item.videoSrc}
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover"
            />

            {/* Play Overlay if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 pointer-events-none">
                <div className="w-16 h-16 rounded-full border border-white bg-white text-black flex items-center justify-center shadow-2xl scale-110">
                  <Play className="w-7 h-7 ml-0.5 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Next Video Nav Arrow */}
          <button
            onClick={onNext}
            className="absolute right-2 sm:-right-6 lg:-right-12 z-30 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-white text-[#F0F0ED] hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110"
            title="Next edit (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Integrated Bottom Cinema Bar */}
        <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-3 sm:p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#E0E0DC]">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1 hover:text-white transition-transform hover:scale-110 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <span>
                {formatVideoTime(currentTime)} / {formatVideoTime(duration || 1)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] text-amber-400 hidden sm:inline">MUTED</span>
                  </>
                ) : (
                  <Volume2 className="w-4 h-4 text-[#F0F0ED]" />
                )}
              </button>
            </div>
          </div>

          {/* Scrubber */}
          <div
            onClick={handleSeek}
            className="relative w-full h-[4px] hover:h-[6px] bg-white/20 rounded-full overflow-hidden cursor-pointer transition-all"
          >
            <div
              className="absolute top-0 left-0 h-full bg-[#F0F0ED] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#777777]">
            <span className="truncate max-w-xs">{item.title}</span>
            <span>PRESS SPACE TO PLAY/PAUSE • ESC TO CLOSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
