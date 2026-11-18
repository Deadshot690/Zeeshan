'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Compass } from 'lucide-react';
import Scene from '@/components/three/Scene';
import MagneticButton from '@/components/motion/MagneticButton';
import { siteConfig } from '@/data/site';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / window.innerHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between px-6 md:px-12 pt-28 pb-10 overflow-hidden bg-[#080808]"
    >
      {/* Interactive 3D WebGL Background Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Scene scrollProgress={scrollProgress} />
      </div>

      {/* Viewfinder Framing Brackets */}
      <div className="corner-bracket corner-tl !top-24 !left-6 md:!left-12" />
      <div className="corner-bracket corner-tr !top-24 !right-6 md:!right-12" />
      <div className="corner-bracket corner-bl !bottom-8 !left-6 md:!left-12" />
      <div className="corner-bracket corner-br !bottom-8 !right-6 md:!right-12" />

      {/* Top Section Metadata */}
      <div className="relative z-10 w-full flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span>REEL // 2026_MASTER</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>FPS: 24.00</span>
          <span>SHUTTER: 1/48</span>
          <span>ACES COLOR</span>
        </div>
        <div>
          <span>SEC 01/08</span>
        </div>
      </div>

      {/* Main Headline & Supporting Typography */}
      <div className="relative z-10 my-auto py-12 flex flex-col justify-center max-w-5xl pointer-events-none">
        {/* Editorial Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[1px] bg-white/30" />
          <p className="font-mono-tech text-xs sm:text-sm tracking-[0.25em] text-[#A1A1A1] uppercase">
            {siteConfig.role}
          </p>
        </motion.div>

        {/* Cinematic Headline: I TURN MOMENTS INTO MOTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col leading-[0.92] tracking-tighter"
        >
          <span className="font-serif-editorial text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#F0F0ED] italic font-light">
            I TURN
          </span>
          <span className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] text-[#F0F0ED] uppercase tracking-[-0.04em] pl-1 sm:pl-3">
            MOMENTS
          </span>
          <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <span className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] text-[#A1A1A1] italic font-light">
              INTO
            </span>
            <span className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] text-[#F0F0ED] uppercase tracking-[-0.04em]">
              MOTION.
            </span>
          </div>
        </motion.div>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 font-sans-body text-sm sm:text-base md:text-lg text-[#A1A1A1] max-w-xl leading-relaxed tracking-wide backdrop-blur-[2px] sm:backdrop-blur-none bg-[#080808]/40 sm:bg-transparent py-2 px-3 sm:p-0 rounded"
        >
          {siteConfig.summary}
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-4 pointer-events-auto"
        >
          <MagneticButton
            onClick={() => scrollTo('#selected-work')}
            strength={0.3}
            dataCursor="EXPLORE"
            className="px-8 py-4 rounded-full bg-[#F0F0ED] text-[#080808] font-mono-tech text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
          >
            <span className="flex items-center gap-3">
              EXPLORE SELECTED WORK
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollTo('#showreel')}
            strength={0.3}
            dataCursor="WATCH"
            className="px-6 py-4 rounded-full border border-white/15 bg-white/[0.03] text-[#F0F0ED] font-mono-tech text-xs tracking-[0.2em] uppercase hover:border-white/40 hover:bg-white/[0.08] transition-all"
          >
            WATCH SHOWREEL
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom Telemetry & Scroll Cue */}
      <div className="relative z-10 w-full flex items-end justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.2em] uppercase pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[#A1A1A1]">{siteConfig.displayName}</span>
          <span>SHORT-FORM SPECIALIST</span>
        </div>

        {/* Scroll Cue with pulsing indicator */}
        <button
          onClick={() => scrollTo('#philosophy')}
          className="flex items-center gap-3 text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors py-2 group"
          aria-label="Scroll to explore"
        >
          <span>SCROLL TO EXPLORE</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-[#F0F0ED]"
            />
          </div>
        </button>

        <div className="hidden sm:flex flex-col text-right gap-1">
          <span>CURATED ARCHIVE</span>
          <span className="text-[#A1A1A1]">4+ YEARS EXP</span>
        </div>
      </div>
    </section>
  );
}
