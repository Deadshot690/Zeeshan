'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, RotateCcw } from 'lucide-react';
import Scene from '@/components/three/Scene';
import MagneticButton from '@/components/motion/MagneticButton';
import { siteConfig } from '@/data/site';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { soundManager } from '@/lib/sound';

export default function Hero() {
  const { scrollTo, refresh } = useSmoothScroll();
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll animations for 3D depth and parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const headlineRotateX = useTransform(scrollYProgress, [0, 0.8], [0, -12]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  // Live Typewriter / Write-On State for Hero Headline
  const heroLines = [
    { text: 'I TURN', serif: true },
    { text: 'MOMENTS', serif: false },
    { text: 'INTO', serif: true },
    { text: 'MOTION.', serif: false },
  ];

  const totalHeroChars = heroLines.reduce((acc, l) => acc + l.text.length, 0);
  const [typedHeroCount, setTypedHeroCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const startHeroTyping = () => {
    setTypedHeroCount(0);
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    if (typedHeroCount < totalHeroChars) {
      const delay = typedHeroCount === 5 || typedHeroCount === 12 || typedHeroCount === 16 ? 90 : 42;
      const timer = setTimeout(() => {
        setTypedHeroCount((prev) => {
          const next = prev + 1;
          if (next % 3 === 0) {
            soundManager.playHover();
          }
          if (next >= totalHeroChars) {
            setIsTyping(false);
            if (refresh) refresh();
          }
          return next;
        });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isTyping, typedHeroCount, totalHeroChars, refresh]);

  const getLineProgress = (lineIndex: number) => {
    let charsBefore = 0;
    for (let i = 0; i < lineIndex; i++) {
      charsBefore += heroLines[i]!.text.length;
    }
    const charsForThisLine = heroLines[lineIndex]!.text.length;
    const lineCharsTyped = Math.max(0, Math.min(charsForThisLine, typedHeroCount - charsBefore));
    const isCurrentLine = typedHeroCount >= charsBefore && typedHeroCount < charsBefore + charsForThisLine;
    return {
      visibleText: heroLines[lineIndex]!.text.slice(0, lineCharsTyped),
      isComplete: lineCharsTyped === charsForThisLine,
      showCursor: isCurrentLine && isTyping,
    };
  };

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

      {/* Top Section Metadata with Retype Action */}
      <div className="relative z-10 w-full flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span>REEL // 2026_MASTER</span>
          <button
            onClick={startHeroTyping}
            className="hidden sm:flex items-center gap-1.5 text-[#777777] hover:text-[#F0F0ED] transition-colors py-0.5 px-2 rounded border border-white/10 hover:border-white/30 bg-white/[0.02]"
            title="Replay write-on animation"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="text-[8px]">RETYPE</span>
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-4 pointer-events-none">
          <span>FPS: 24.00</span>
          <span>SHUTTER: 1/48</span>
          <span>ACES COLOR</span>
        </div>
        <div>
          <span>SEC 01/07</span>
        </div>
      </div>

      {/* Main Headline & Supporting Typography with Live Write-On */}
      <motion.div
        style={{
          rotateX: headlineRotateX,
          y: headlineY,
          opacity: headlineOpacity,
          transformPerspective: 1000,
        }}
        className="relative z-10 my-auto py-12 flex flex-col justify-center max-w-5xl pointer-events-none"
      >
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

        {/* Cinematic Headline with Live Typewriter: I TURN MOMENTS INTO MOTION */}
        <div className="flex flex-col leading-[0.92] tracking-tighter">
          {/* Line 1: I TURN (Serif Italic) */}
          <div className="relative flex items-baseline">
            <span
              aria-hidden="true"
              className="font-serif-editorial text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] italic font-light opacity-0 select-none pointer-events-none"
            >
              {heroLines[0]!.text}
            </span>
            <div className="absolute inset-0 flex items-baseline">
              <span className="font-serif-editorial text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#F0F0ED] italic font-light">
                {getLineProgress(0).visibleText}
              </span>
              {getLineProgress(0).showCursor && (
                <span className="inline-block w-2.5 sm:w-3.5 h-[0.8em] bg-[#F0F0ED] ml-2 animate-pulse" />
              )}
            </div>
          </div>

          {/* Line 2: MOMENTS (Sans Bold) */}
          <div className="relative flex items-baseline">
            <span
              aria-hidden="true"
              className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] uppercase tracking-[-0.04em] pl-1 sm:pl-3 opacity-0 select-none pointer-events-none"
            >
              {heroLines[1]!.text}
            </span>
            <div className="absolute inset-0 flex items-baseline">
              <span className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] text-[#F0F0ED] uppercase tracking-[-0.04em] pl-1 sm:pl-3">
                {getLineProgress(1).visibleText}
              </span>
              {getLineProgress(1).showCursor && (
                <span className="inline-block w-2.5 sm:w-3.5 h-[0.8em] bg-[#F0F0ED] ml-2 animate-pulse" />
              )}
            </div>
          </div>

          {/* Line 3 & 4: INTO MOTION. */}
          <div className="relative flex items-baseline">
            <div
              aria-hidden="true"
              className="flex flex-wrap items-baseline gap-4 sm:gap-6 opacity-0 select-none pointer-events-none"
            >
              <span className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] italic font-light">
                {heroLines[2]!.text}
              </span>
              <span className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] uppercase tracking-[-0.04em]">
                {heroLines[3]!.text}
              </span>
            </div>
            <div className="absolute inset-0 flex flex-wrap items-baseline gap-4 sm:gap-6">
              <span className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] text-[#A1A1A1] italic font-light">
                {getLineProgress(2).visibleText}
              </span>
              {getLineProgress(2).showCursor && (
                <span className="inline-block w-2.5 sm:w-3.5 h-[0.8em] bg-[#F0F0ED] ml-2 animate-pulse" />
              )}
              <span className="font-sans-body font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] text-[#F0F0ED] uppercase tracking-[-0.04em]">
                {getLineProgress(3).visibleText}
              </span>
              {getLineProgress(3).showCursor && (
                <span className="inline-block w-2.5 sm:w-3.5 h-[0.8em] bg-[#F0F0ED] ml-2 animate-pulse" />
              )}
            </div>
          </div>
        </div>

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
            onClick={() => scrollTo('#showreel')}
            strength={0.3}
            dataCursor="EXPLORE"
            className="px-8 py-4 rounded-full bg-[#F0F0ED] text-[#080808] font-mono-tech text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
          >
            <span className="flex items-center gap-3">
              EXPLORE SHOWREEL
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollTo('#behind-the-edit')}
            strength={0.3}
            dataCursor="PROCESS"
            className="px-6 py-4 rounded-full border border-white/15 bg-white/[0.03] text-[#F0F0ED] font-mono-tech text-xs tracking-[0.2em] uppercase hover:border-white/40 hover:bg-white/[0.08] transition-all"
          >
            BEHIND THE EDIT
          </MagneticButton>
        </motion.div>
      </motion.div>

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
