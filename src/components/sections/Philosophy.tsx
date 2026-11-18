'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import Image from 'next/image';
import { soundManager } from '@/lib/sound';
import { RotateCcw, Sparkles } from 'lucide-react';

interface AnimatedLineProps {
  text: string;
  className?: string;
  isTyped: boolean;
  visibleChars: number;
  showCursor: boolean;
}

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.25 });

  // Scroll animations for 3D perspective and parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const rotateXText = useTransform(scrollYProgress, [0.1, 0.45, 0.9], [12, 0, -8]);
  const scaleText = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.94, 1, 0.96]);
  const opacityBackground = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0.03, 0.12, 0.12, 0.02]);

  // Live Typewriter / Write-On State
  const lines = [
    { text: "WE DON'T JUST", serif: true },
    { text: "EDIT VIDEOS.", serif: false },
    { text: "WE CREATE", serif: true },
    { text: "EXPERIENCES.", serif: false },
  ];

  const totalChars = lines.reduce((acc, l) => acc + l.text.length, 0);
  const [typedCount, setTypedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startTyping = () => {
    setTypedCount(0);
    setIsTyping(true);
    setHasStarted(true);
  };

  useEffect(() => {
    if (isInView && !hasStarted) {
      startTyping();
    }
  }, [isInView, hasStarted]);

  useEffect(() => {
    if (!isTyping) return;

    if (typedCount < totalChars) {
      // Natural typing cadence: slight pause on spaces and punctuation
      const currentChar = getCharAtIndex(typedCount);
      const delay = currentChar === ' ' ? 70 : currentChar === '.' ? 140 : 38;

      const timer = setTimeout(() => {
        setTypedCount((prev) => {
          const next = prev + 1;
          if (next % 3 === 0) {
            soundManager.playHover();
          }
          if (next >= totalChars) {
            setIsTyping(false);
          }
          return next;
        });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isTyping, typedCount, totalChars]);

  function getCharAtIndex(index: number): string {
    let count = 0;
    for (const line of lines) {
      if (index < count + line.text.length) {
        return line.text[index - count] || '';
      }
      count += line.text.length;
    }
    return '';
  }

  // Calculate visible characters for each line
  const getLineProgress = (lineIndex: number) => {
    let charsBefore = 0;
    for (let i = 0; i < lineIndex; i++) {
      charsBefore += lines[i]!.text.length;
    }
    const charsForThisLine = lines[lineIndex]!.text.length;
    const lineCharsTyped = Math.max(0, Math.min(charsForThisLine, typedCount - charsBefore));
    const isCurrentLine = typedCount >= charsBefore && typedCount < charsBefore + charsForThisLine;
    return {
      visibleText: lines[lineIndex]!.text.slice(0, lineCharsTyped),
      isComplete: lineCharsTyped === charsForThisLine,
      showCursor: isCurrentLine && isTyping,
    };
  };

  const pillars = [
    {
      num: '01',
      title: 'AUDIENCE RETENTION ARCHITECTURE',
      desc: 'Short-form mastery is engineered in the first 3 seconds. Pacing is calibrated to prevent cognitive drop-off and maximize loop completion.',
    },
    {
      num: '02',
      title: 'SONIC PRECISION & RHYTHM',
      desc: 'Sound is 50% of the visual cut. Every hit, sweep, riser, and ambient texture is locked to the emotional cadence of the narrative.',
    },
    {
      num: '03',
      title: 'VISUAL DYNAMICS & PATTERN INTERRUPTS',
      desc: 'Strategic motion graphics, frame re-timing, and seamless transitions disrupt passive scrolling into deliberate viewing.',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative w-full py-32 md:py-48 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden select-none"
    >
      {/* Background Kinetic Grid Image from Reference 03 with scroll parallax */}
      <motion.div
        style={{ y: yBackground, opacity: opacityBackground }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/assets/textures/media_1794989648708_c64c8fec.jpg"
          alt="Kinetic Typography Flow Grid"
          fill
          className="object-cover filter contrast-150 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </motion.div>

      {/* Viewfinder Framing Marks */}
      <div className="corner-bracket corner-tl !top-12 !left-6 md:!left-12" />
      <div className="corner-bracket corner-tr !top-12 !right-6 md:!right-12" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Index Header with Replay Action */}
        <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-16 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SEC 02 // CREATIVE MANIFESTO</span>
            <span className="text-[#A1A1A1] hidden sm:inline">R517_FLOW</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={startTyping}
              className="flex items-center gap-1.5 text-[#777777] hover:text-[#F0F0ED] transition-colors py-1 px-2.5 rounded border border-white/10 hover:border-white/30 bg-white/[0.02]"
              title="Replay write-on typography animation"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-[9px]">RETYPE</span>
            </button>
            <span className="hidden sm:inline">[ INTENTIONAL MOTION ]</span>
          </div>
        </div>

        {/* Dramatic Oversized Editorial Statement with 3D Tilt & Write-On Animation */}
        <motion.div
          style={{
            rotateX: rotateXText,
            scale: scaleText,
            transformPerspective: 1200,
          }}
          className="max-w-5xl my-12"
        >
          <h2 className="flex flex-col tracking-tight uppercase leading-[0.94]">
            {/* Line 1: WE DON'T JUST (Serif italic) */}
            <div className="min-h-[1.1em] flex items-baseline">
              <span className="font-serif-editorial italic font-light text-[#777777] text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem]">
                {getLineProgress(0).visibleText}
              </span>
              {getLineProgress(0).showCursor && (
                <span className="inline-block w-2 sm:w-3 md:w-4 h-[0.8em] bg-[#F0F0ED] ml-1.5 animate-pulse" />
              )}
            </div>

            {/* Line 2: EDIT VIDEOS. (Sans Bold) */}
            <div className="min-h-[1.1em] flex items-baseline my-1">
              <span className="font-sans-body font-black text-[#F0F0ED] text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-[-0.035em]">
                {getLineProgress(1).visibleText}
              </span>
              {getLineProgress(1).showCursor && (
                <span className="inline-block w-2 sm:w-3 md:w-4 h-[0.8em] bg-[#F0F0ED] ml-1.5 animate-pulse" />
              )}
            </div>

            {/* Line 3: WE CREATE (Serif italic) */}
            <div className="min-h-[1.1em] flex items-baseline my-1">
              <span className="font-serif-editorial italic font-light text-[#A1A1A1] text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem]">
                {getLineProgress(2).visibleText}
              </span>
              {getLineProgress(2).showCursor && (
                <span className="inline-block w-2 sm:w-3 md:w-4 h-[0.8em] bg-[#F0F0ED] ml-1.5 animate-pulse" />
              )}
            </div>

            {/* Line 4: EXPERIENCES. (Sans Bold) */}
            <div className="min-h-[1.1em] flex items-baseline">
              <span className="font-sans-body font-black text-[#F0F0ED] text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-[-0.035em]">
                {getLineProgress(3).visibleText}
              </span>
              {getLineProgress(3).showCursor && (
                <span className="inline-block w-2 sm:w-3 md:w-4 h-[0.8em] bg-[#F0F0ED] ml-1.5 animate-pulse" />
              )}
              {!isTyping && typedCount >= totalChars && (
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ml-3 animate-ping" />
              )}
            </div>
          </h2>
        </motion.div>

        {/* Supporting Editorial Paragraph with Scroll Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-20">
          <div className="md:col-span-5">
            <div className="font-mono-tech text-xs tracking-[0.2em] uppercase text-[#A1A1A1] leading-relaxed flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
              <p>
                Every cut is a conscious decision. Every frame either advances retention or costs attention.
              </p>
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="font-sans-body text-base sm:text-lg md:text-xl text-[#A1A1A1] leading-relaxed font-light">
              Transforming raw footage into high-retention stories requires more than fast cuts—it demands psychological precision, narrative structure, and sonic depth that keeps audiences locked in from the opening frame to the final call to action.
            </p>
          </div>
        </div>

        {/* Three Editorial Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/[0.08]">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group p-6 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono-tech text-xs text-[#777777] group-hover:text-[#F0F0ED] transition-colors block mb-4">
                  // {pillar.num}
                </span>
                <h3 className="font-sans-body font-bold text-sm tracking-[0.15em] text-[#F0F0ED] uppercase mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans-body text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono-tech text-[9px] text-[#777777]">
                <span>FRAME® SYSTEM</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
