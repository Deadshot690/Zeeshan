'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  LayoutGrid,
  Settings,
  Share2,
  Check,
} from 'lucide-react';
import { ProjectMediaItem } from '@/types';
import { soundManager } from '@/lib/sound';
import PolaroidLineCarousel, { Slide } from '@/components/ui/polaroid-line-carousel';

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

function pad2(num: number): string {
  return String(num).padStart(2, '0');
}

export default function CategoryVideoShowcase({ items, categoryTitle }: CategoryVideoShowcaseProps) {
  // View mode: Polaroid Line Carousel vs Classic Card Grid
  const [viewMode, setViewMode] = useState<'polaroid' | 'grid'>('polaroid');

  // Currently playing card ID (for inline in-card playback)
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Lightbox modal item (for full cinema screening overlay)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Check if category videos are primarily widescreen horizontal (16:9) or vertical short-form (9:16)
  const isHorizontalCategory = useMemo(() => {
    const horizontalCount = items.filter((i) => !i.isVertical).length;
    const verticalCount = items.filter((i) => i.isVertical).length;
    return horizontalCount >= verticalCount;
  }, [items]);

  // Transform video items into luxury device slides
  const slides: Slide[] = useMemo(() => {
    return items.map((item) => ({
      image: item.thumbnailSrc,
      title: item.title,
      caption: `${item.tag || 'VIDEO EDIT'} • ${item.duration} • ${item.resolution || '4K UHD'}`,
      tag: item.tag,
      duration: item.duration,
      resolution: item.resolution,
      item,
    }));
  }, [items]);

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
      {/* 01. Catalog Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/[0.1] pb-6">
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

        {/* View Mode Toggle: Polaroid Line Carousel vs Classic Grid */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.04] border border-white/10 self-start sm:self-end">
          <button
            type="button"
            onClick={() => {
              setViewMode('polaroid');
              soundManager.playClick();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono-tech text-[11px] tracking-wider uppercase transition-all cursor-pointer ${
              viewMode === 'polaroid'
                ? 'bg-[#F0F0ED] text-[#080808] font-bold shadow-md'
                : 'text-[#A1A1A1] hover:text-[#F0F0ED]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>TABLET SHOWCASE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('grid');
              soundManager.playClick();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono-tech text-[11px] tracking-wider uppercase transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#F0F0ED] text-[#080808] font-bold shadow-md'
                : 'text-[#A1A1A1] hover:text-[#F0F0ED]'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>GRID ARCHIVE</span>
          </button>
        </div>
      </div>

      {/* 02. Showcase Presentation */}
      {viewMode === 'polaroid' ? (
        <div className="flex flex-col gap-6">
          <PolaroidLineCarousel
            slides={slides}
            height={isHorizontalCategory ? '640px' : '680px'}
            cardWidth={isHorizontalCategory ? 460 : 230}
            aspectRatio={isHorizontalCategory ? '16/9' : '9/16'}
            sag={isHorizontalCategory ? 26 : 34}
            swing={1}
            autoplay={5000}
            deviceType={isHorizontalCategory ? 'tablet' : 'phone'}
            onSelectVideo={(slide, idx) => {
              setActivePlayingId(null);
              setLightboxIndex(idx);
              soundManager.playClick();
            }}
          />
          {/* Quick Guidance Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-tech text-[#777777] px-2">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>DRAG THE CABLE OR USE ARROWS • CLICK ANY SUSPENDED DEVICE TO SCREEN FULL VIDEO</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setViewMode('grid');
                soundManager.playClick();
              }}
              className="text-[#A1A1A1] hover:text-white underline tracking-wider cursor-pointer transition-colors"
            >
              SWITCH TO CLASSIC MULTI-COLUMN GRID →
            </button>
          </div>
        </div>
      ) : (
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
      )}

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
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Play immediately when item changes
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = isMuted;
    video.volume = volume;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Fallback to muted autoplay if browser blocks audio gesture
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
  }, [item.id]);

  // Auto-hide YouTube controls during playback on inactivity
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 2800);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    } else {
      showControlsTemporarily();
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isPlaying, showControlsTemporarily]);

  const togglePlay = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setControlsVisible(true);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
      showControlsTemporarily();
    }
  };

  const toggleMute = () => {
    const video = modalVideoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const video = modalVideoRef.current;
    if (!video) return;
    setVolume(newVol);
    video.volume = newVol;
    if (newVol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
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
    setProgress(pos * 100);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-6 md:p-10 select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="YouTube Screening Room"
    >
      {/* Background Dynamic Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 filter blur-3xl scale-125">
        <Image
          src={item.thumbnailSrc}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Close Button Top-Right of Modal */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-white text-[#F0F0ED] hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl flex items-center gap-1.5 px-3 font-mono-tech text-xs tracking-wider"
        title="Close screening (Esc)"
      >
        <span>CLOSE</span>
        <X className="w-4 h-4" />
      </button>

      {/* Track Pill Top-Left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-40 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/15 text-xs font-mono-tech text-[#A1A1A1] pointer-events-none backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[#F0F0ED] font-bold">
          TRACK {pad2(index + 1)} / {pad2(total)}
        </span>
        <span>•</span>
        <span className="text-white/80">{item.tag || 'VIDEO EDIT'}</span>
      </div>

      {/* Main Screening Frame Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full flex items-center justify-center max-h-[92vh]"
      >
        {/* Previous Video Nav Arrow */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:-left-6 lg:-left-12 z-40 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-white text-[#F0F0ED] hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
          title="Previous edit (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Realistic YouTube Player Box */}
        <div
          ref={playerContainerRef}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => {
            if (isPlaying) setControlsVisible(false);
          }}
          onClick={togglePlay}
          className={`group/yt relative bg-black overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.98)] cursor-pointer flex items-center justify-center transition-all ${
            item.isVertical
              ? 'w-full max-w-[410px] aspect-[9/16] h-[75vh] sm:h-[82vh] max-h-[820px] rounded-2xl border border-white/15'
              : 'w-full max-w-5xl aspect-video max-h-[78vh] rounded-xl border border-white/15'
          }`}
        >
          {/* Native Video Element */}
          <video
            ref={modalVideoRef}
            src={item.videoSrc}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-contain bg-black"
          />

          {/* Center Play Button Overlay (when paused) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none z-20 ${
              isPlaying ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/65 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_35px_rgba(0,0,0,0.8)] scale-105">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white text-white" />
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* YOUTUBE TOP HEADER OVERLAY (Channel info, title, top controls) */}
          {/* ------------------------------------------------------------- */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-0 inset-x-0 pt-3 sm:pt-4 pb-12 px-3 sm:px-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Channel Avatar & Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0 bg-neutral-900 shadow-md">
                <Image
                  src="/assets/branding/zeeshan.jpg"
                  alt="Zeeshan"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white truncate drop-shadow-md leading-tight">
                  {item.title}
                </span>
                <span className="text-[10px] sm:text-xs text-[#DDDDDD] font-normal truncate mt-0.5">
                  Zeeshan • Video Editor & VFX Artist
                </span>
              </div>
            </div>

            {/* Top Right Controls: Volume, CC, Settings */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-white/90">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 sm:p-1.5 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <div
                className="px-1.5 py-0.5 rounded border border-white/70 text-[9px] sm:text-[10px] font-bold text-white tracking-wider select-none"
                title="Subtitles / Closed Captions"
              >
                CC
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-1 sm:p-1.5 hover:text-white transition-transform hover:rotate-45 cursor-pointer"
                  title="Quality Settings"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Quality Popover */}
                {isSettingsOpen && (
                  <div className="absolute right-0 top-8 w-44 rounded-lg bg-black/90 border border-white/20 p-2.5 text-xs text-[#E0E0DC] backdrop-blur-xl shadow-2xl flex flex-col gap-1.5 z-40 font-mono-tech">
                    <div className="text-[10px] uppercase text-[#777777] border-b border-white/10 pb-1">
                      Play Quality
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-bold py-0.5">
                      <span>{item.resolution || '4K 2160p (60fps)'}</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-white/60 text-[10px]">HDR / Rec.709 Master</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* YOUTUBE BOTTOM PLAYER CONTROLS (Red bar, time, icons, logo)   */}
          {/* ------------------------------------------------------------- */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 inset-x-0 pt-12 pb-2.5 sm:pb-3 px-3 sm:px-5 bg-gradient-to-t from-black/95 via-black/55 to-transparent flex flex-col gap-1.5 z-30 transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Signature YouTube Red Scrubber Bar with Expanding Red Thumb */}
            <div
              onClick={handleSeek}
              className="group/scrub relative w-full h-[3px] hover:h-[5px] bg-white/25 cursor-pointer transition-all flex items-center py-1"
            >
              {/* Buffered Track */}
              <div
                className="absolute left-0 top-1 bottom-1 bg-white/40 rounded-full"
                style={{ width: `${Math.min(100, progress + 25)}%` }}
              />

              {/* Played Track (Vibrant YouTube Red #FF0000) */}
              <div
                className="absolute left-0 top-1 bottom-1 bg-[#FF0000] rounded-full"
                style={{ width: `${progress}%` }}
              />

              {/* Red YouTube Scrub Thumb */}
              <div
                className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#FF0000] rounded-full -translate-x-1/2 shadow transition-transform scale-0 group-hover/scrub:scale-100"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Bottom Controls Row: Play/Pause, Vol, Time, Share, Fullscreen, Logo */}
            <div className="flex items-center justify-between text-white font-sans text-xs">
              {/* Left Controls: Play/Pause, Next Track, Volume, Timecode */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 sm:p-1.5 hover:text-white/80 transition-transform active:scale-95 cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" />
                  )}
                </button>

                {/* Next Track Button */}
                <button
                  type="button"
                  onClick={onNext}
                  className="p-1 sm:p-1.5 hover:text-white/80 transition-transform active:scale-95 cursor-pointer"
                  title="Next edit"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* Volume Button with Hover Slider */}
                <div
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="flex items-center gap-1.5"
                >
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 sm:p-1.5 hover:text-white/80 transition-transform active:scale-95 cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>

                  {/* Desktop Smooth Volume Slider on Hover */}
                  <div
                    className={`hidden sm:flex items-center transition-all duration-200 overflow-hidden ${
                      showVolumeSlider ? 'w-16 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/40 accent-[#FF0000] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Timecode */}
                <span className="font-sans text-[11px] sm:text-xs text-white/90 select-none ml-1 tabular-nums font-medium">
                  {formatVideoTime(currentTime)} / {formatVideoTime(duration || 1)}
                </span>
              </div>

              {/* Right Controls: Share, Fullscreen & Official YouTube Badge */}
              <div className="flex items-center gap-1.5 sm:gap-3 text-white/90">
                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1 sm:p-1.5 hover:text-white transition-transform active:scale-95 cursor-pointer hidden sm:flex items-center gap-1.5"
                  title="Share link"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {copied ? (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">COPIED!</span>
                  ) : (
                    <span className="text-[11px] hidden md:inline">Share</span>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1 sm:p-1.5 hover:text-white transition-transform active:scale-95 cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Official YouTube Logo Badge */}
                <div
                  className="flex items-center gap-1 pl-1 select-none cursor-pointer hover:opacity-90 transition-opacity"
                  title="YouTube Player Experience"
                >
                  <div className="w-5 h-3.5 sm:w-6 sm:h-4 bg-[#FF0000] rounded-[3px] flex items-center justify-center shadow">
                    <Play className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-white text-white ml-0.5" />
                  </div>
                  <span className="font-sans font-bold text-xs sm:text-sm tracking-tight text-white hidden xs:inline">
                    YouTube
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Video Nav Arrow */}
        <button
          onClick={onNext}
          className="absolute right-2 sm:-right-6 lg:-right-12 z-40 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-white text-[#F0F0ED] hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
          title="Next edit (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
