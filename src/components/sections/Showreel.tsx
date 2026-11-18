'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/data/site';

gsap.registerPlugin(ScrollTrigger);

function formatVideoTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(168); // 2:48 as shown in reference
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / (video.duration || duration)) * 100 || 0);
    };

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
    };
  }, [duration]);

  // GSAP Choreographed Section Entrance & Scroll Interactions
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      });

      // 1. Section Indicator: 03 /11
      tl.fromTo(
        '.showreel-indicator',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // 2. Heading "SHOWREEL" with masked vertical clip reveal
      tl.fromTo(
        '.showreel-heading',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power4.out' },
        '-=0.4'
      );

      // 3. Supporting Copy: A CURATED SELECTION OF MY WORK.
      tl.fromTo(
        '.showreel-copy',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );

      // 4. Video Container smooth entrance with subtle scale
      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.94, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.8'
      );

      // Parallax scroll for natural connection into next section
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -30,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
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

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className="relative z-10 w-full min-h-[85vh] py-24 sm:py-32 lg:py-36 px-6 sm:px-10 md:px-14 lg:px-20 bg-[#080808] flex items-center overflow-hidden select-none border-t border-white/[0.06]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* LEFT COLUMN: Section Indicator, Heading & Description (~28% on desktop) */}
        <div className="w-full lg:w-[28%] flex flex-col justify-start flex-shrink-0">
          {/* Section Indicator: 03 /11 */}
          <div className="showreel-indicator flex flex-col gap-1 mb-8 sm:mb-12 pointer-events-none">
            <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[#F0F0ED] tracking-widest">
              03
            </span>
            <span className="font-mono-tech text-[10px] sm:text-xs text-[#777777] tracking-widest">
              /11
            </span>
          </div>

          {/* Heading: SHOWREEL */}
          <div className="py-1">
            <h2 className="showreel-heading font-sans-body font-black text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] uppercase tracking-[-0.02em] text-[#F0F0ED] leading-[0.95] m-0 whitespace-nowrap">
              SHOWREEL
            </h2>
          </div>

          {/* Supporting Copy */}
          <p className="showreel-copy mt-5 sm:mt-6 font-mono-tech text-xs sm:text-[13px] text-[#A1A1A1] tracking-[0.22em] uppercase leading-relaxed max-w-xs">
            A CURATED SELECTION
            <br />
            OF MY WORK.
          </p>
        </div>

        {/* RIGHT COLUMN: 16:9 Cinematic Video Player (~72% on desktop) */}
        <div className="w-full lg:w-[72%] flex-grow">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={togglePlay}
            className="group relative w-full aspect-video rounded-sm sm:rounded border border-white/10 bg-[#070707] overflow-hidden cursor-pointer shadow-[0_30px_70px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-white/25"
            data-cursor="PLAY"
          >
            {/* Native Video Tag with High-Res Poster */}
            <video
              ref={videoRef}
              src={siteConfig.showreel.videoSrc}
              poster={siteConfig.showreel.posterSrc}
              playsInline
              muted={isMuted}
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />

            {/* Subtle Vignette & Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

            {/* Faint Cinematic Camera Metadata Watermark */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between font-mono-tech text-[9px] text-[#A1A1A1]/70 tracking-widest uppercase pointer-events-none z-20">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/40'
                  }`}
                />
                <span className="text-[#F0F0ED]/90 font-bold">REC ● [24.00 FPS]</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[#777777]">
                <span>SHUTTER 180°</span>
                <span>4K MASTER</span>
              </div>
            </div>

            {/* Center Circular Play Button (Animated out when playing) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none z-20 ${
                isPlaying ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/80 bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#F0F0ED] fill-[#F0F0ED] translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Integrated Video Controls Bar (Matches Reference 04) */}
            <div
              className={`absolute bottom-0 inset-x-0 pt-8 pb-4 px-5 sm:px-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2.5 z-30 transition-opacity duration-300 ${
                isHovered || isPlaying ? 'opacity-100' : 'opacity-85'
              }`}
            >
              {/* Primary Controls Row: Play/Pause, Timecode, Scrubber, Volume & Fullscreen */}
              <div className="flex items-center justify-between gap-4 font-mono-tech text-xs text-[#E0E0DC]">
                {/* Left Controls: Play/Pause + Timecode (e.g. 0:00 / 2:48) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="p-1 text-[#F0F0ED] hover:text-white transition-transform hover:scale-110 cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-[#F0F0ED]" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-[#F0F0ED] translate-x-0.5" />
                    )}
                  </button>

                  <span className="font-mono-tech text-[11px] sm:text-xs text-[#E0E0DC] tracking-wider select-none font-medium">
                    {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                  </span>
                </div>

                {/* Right Controls: Mute & Fullscreen */}
                <div className="flex items-center gap-3 text-[#A1A1A1]">
                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-[#F0F0ED] transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-[#F0F0ED] transition-colors cursor-pointer"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full Width Thin Progress Scrubber Bar */}
              <div
                onClick={handleSeek}
                className="relative w-full h-[3px] hover:h-[5px] bg-white/20 transition-all cursor-pointer rounded-full overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-[#F0F0ED] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
