'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { siteConfig } from '@/data/site';
import MagneticButton from '@/components/motion/MagneticButton';
import { formatTimecode } from '@/lib/utils';

export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(84.67); // Reference timecode ~ 01:24:67
  const [videoError, setVideoError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const onError = () => {
      setVideoError(true);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
    };
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
        .catch(() => {
          // If video fails to autoplay or source isn't ready
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * (video.duration || duration);
  };

  return (
    <section
      id="showreel"
      className="relative z-10 w-full py-28 md:py-36 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span>SEC 03 // MASTER SHOWREEL</span>
              <span>2.39:1 ANAMORPHIC</span>
            </div>
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              {siteConfig.showreel.headline}
            </h2>
          </div>
          <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm text-left sm:text-right">
            {siteConfig.showreel.supportingCopy}
          </p>
        </div>

        {/* Viewfinder Cinematic Video Player Box (Inspired by Reference 10) */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg border border-white/[0.12] bg-[#111111] overflow-hidden group select-none shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Viewfinder Reticles */}
          <div className="corner-bracket corner-tl !top-4 !left-4 !w-6 !h-6" />
          <div className="corner-bracket corner-tr !top-4 !right-4 !w-6 !h-6" />
          <div className="corner-bracket corner-bl !bottom-16 !left-4 !w-6 !h-6" />
          <div className="corner-bracket corner-br !bottom-16 !right-4 !w-6 !h-6" />

          {/* Center Crosshair HUD */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-8 h-[1px] bg-white" />
            <div className="h-8 w-[1px] bg-white absolute" />
          </div>

          {/* Actual Video Tag or Polished Fallback */}
          <video
            ref={videoRef}
            src={siteConfig.showreel.videoSrc}
            poster={siteConfig.showreel.posterSrc}
            playsInline
            muted={isMuted}
            preload="metadata"
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />

          {/* Video Poster / Fallback overlay when not playing */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
              data-cursor="PLAY"
            >
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:border-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <Play className="w-8 h-8 text-[#F0F0ED] translate-x-0.5 fill-[#F0F0ED]" />
                </div>
                <span className="font-mono-tech text-xs tracking-[0.25em] text-[#F0F0ED] uppercase">
                  PLAY MASTER REEL
                </span>
              </div>
            </div>
          )}

          {/* Telemetry HUD Top Bar */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between font-mono-tech text-[10px] text-[#A1A1A1] tracking-widest uppercase pointer-events-none z-20">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-white/40'}`} />
              <span className="text-[#F0F0ED] font-bold">REC ● [24.00 FPS]</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>SHUTTER 180°</span>
              <span>ISO 800</span>
              <span>4K DCI</span>
            </div>
            <div>
              <span className="text-[#F0F0ED]">{formatTimecode(currentTime)}</span>
              <span className="text-[#777777]"> / {formatTimecode(duration)}</span>
            </div>
          </div>

          {/* Bottom Custom Playback Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#080808]/95 via-[#080808]/70 to-transparent flex flex-col gap-3 z-20">
            {/* Scrubber Timeline Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/15 rounded-full cursor-pointer relative group/scrub overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 h-full bg-[#F0F0ED] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Left Play / Pause / Rewind */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 text-[#F0F0ED] hover:text-white transition-colors"
                  aria-label={isPlaying ? 'Pause Showreel' : 'Play Showreel'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="p-1.5 text-[#A1A1A1] hover:text-white transition-colors"
                  aria-label="Restart Showreel"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono-tech text-[10px] text-[#A1A1A1] tracking-wider ml-2">
                  {formatTimecode(currentTime)}
                </span>
              </div>

              {/* Right Controls: Audio Mute & Fullscreen */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-[#A1A1A1] hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-[#A1A1A1] hover:text-white transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Showreel Technical Attribution */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 pt-6 border-t border-white/[0.06] font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider">
          <div>
            <span className="block text-[#A1A1A1] mb-1">EDITOR</span>
            <span>{siteConfig.displayName}</span>
          </div>
          <div>
            <span className="block text-[#A1A1A1] mb-1">TIMELINE TRACKS</span>
            <span>36 Multi-Track Assembly</span>
          </div>
          <div>
            <span className="block text-[#A1A1A1] mb-1">COLOR WORKFLOW</span>
            <span>ACEScg / Rec.709 Master</span>
          </div>
          <div className="text-right">
            <span className="block text-[#A1A1A1] mb-1">AUDIO MIX</span>
            <span>Integrated Stereo -14 LUFS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
