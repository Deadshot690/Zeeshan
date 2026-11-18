'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Settings, Scissors, Film, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundManager } from '@/lib/sound';

gsap.registerPlugin(ScrollTrigger);

// Authentic audio waveform amplitude data for Track 01
const WAVEFORM_AMPLITUDES = [
  20, 35, 48, 30, 65, 88, 76, 96, 62, 45, 32, 55, 80, 94, 100, 90, 68, 50, 36, 60,
  84, 98, 72, 58, 40, 50, 68, 82, 60, 44, 32, 22, 38, 58, 75, 90, 66, 48, 34, 52,
  78, 92, 85, 70, 52, 40, 62, 88, 100, 78, 60, 42, 30, 48, 70, 86, 96, 80, 62, 45,
  36, 58, 80, 94, 88, 70, 54, 40, 26, 42, 65, 82, 96, 78, 60, 46, 32, 24, 18, 12,
];

export default function BehindTheEdit() {
  const sectionRef = useRef<HTMLElement>(null);
  const comparisonContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Comparison slider position (percentage 0 to 100)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Timeline interactive playhead position (percentage 0 to 100)
  const [playheadPos, setPlayheadPos] = useState(42);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);

  // Comparison Slider Drag Logic with Subpixel Accuracy & Magnetic Center Snap
  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!comparisonContainerRef.current) return;
    const rect = comparisonContainerRef.current.getBoundingClientRect();
    const rawPos = ((clientX - rect.left) / rect.width) * 100;
    let clamped = Math.max(0, Math.min(100, rawPos));

    // Subtle magnetic snap when within 2% of the center (50%)
    if (Math.abs(clamped - 50) < 2) {
      clamped = 50;
    }
    setSliderPosition(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderFromClientX(e.clientX);
    soundManager.playClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingSlider) {
      setIsDraggingSlider(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe no-op if pointer was already released
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 4));
      soundManager.playClick();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 4));
      soundManager.playClick();
    }
  };

  // Timeline interactive seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setPlayheadPos(pos);
    soundManager.playClick();
  };

  // Automated gentle playhead motion when idle
  useEffect(() => {
    if (isTimelineHovered) return;
    const interval = setInterval(() => {
      setPlayheadPos((prev) => (prev >= 98 ? 2 : prev + 0.12));
    }, 50);
    return () => clearInterval(interval);
  }, [isTimelineHovered]);

  // GSAP Choreographed Entrance Animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      // 1. Indicator fade in
      tl.from(
        '.bte-indicator',
        { opacity: 0, y: -12, duration: 0.5, clearProps: 'all' }
      );

      // 2. Heading lines reveal via masked vertical clip
      tl.from(
        '.bte-heading-line',
        { yPercent: 105, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out', clearProps: 'all' },
        '-=0.3'
      );

      // 3. Supporting copy reveal
      tl.from(
        '.bte-copy',
        { opacity: 0, y: 12, duration: 0.6, clearProps: 'all' },
        '-=0.5'
      );

      // 4. Comparison panel smooth scale and fade entrance
      tl.from(
        comparisonContainerRef.current,
        { opacity: 0, scale: 0.97, y: 18, duration: 0.9, ease: 'power3.out', clearProps: 'all' },
        '-=0.5'
      );

      // 5. Timeline entrance from bottom
      tl.from(
        timelineRef.current,
        { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', clearProps: 'all' },
        '-=0.6'
      );

      // 6. Timeline clips smooth appearance
      tl.from(
        '.bte-timeline-clip',
        { opacity: 0, scaleX: 0.88, duration: 0.7, stagger: 0.08, ease: 'power2.out', clearProps: 'all' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="behind-the-edit"
      className="relative z-10 w-full py-16 sm:py-20 lg:py-24 px-6 sm:px-10 md:px-14 lg:px-16 bg-[#080808] flex items-center overflow-hidden select-none border-t border-white/[0.06]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 lg:gap-10">
        {/* AREA A — MAIN CONTENT: TWO-COLUMN COMPOSITION (Matches Reference 07) */}
        <div className="w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* LEFT COLUMN: Section Indicator, Heading & Description (~28% on desktop) */}
          <div className="w-full lg:w-[28%] flex flex-col justify-start flex-shrink-0">
            {/* Section Indicator: 04 /07 */}
            <div className="bte-indicator flex flex-col gap-1 mb-8 sm:mb-10 pointer-events-none">
              <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[#F0F0ED] tracking-widest">
                04
              </span>
              <span className="font-mono-tech text-[10px] sm:text-xs text-[#777777] tracking-widest">
                /07
              </span>
            </div>

            {/* Main Headline: FROM RAW TO REFINED. (Condensed bold editorial display) */}
            <div className="py-1">
              <div className="overflow-hidden">
                <h2 className="bte-heading-line font-sans-body font-black text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] uppercase tracking-[-0.02em] text-[#F0F0ED] leading-[0.95] m-0">
                  FROM RAW
                </h2>
              </div>
              <div className="overflow-hidden">
                <h2 className="bte-heading-line font-sans-body font-black text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[3.8rem] uppercase tracking-[-0.02em] text-[#F0F0ED] leading-[0.95] m-0">
                  TO REFINED.
                </h2>
              </div>
            </div>

            {/* Supporting Copy */}
            <p className="bte-copy mt-5 sm:mt-6 font-mono-tech text-xs sm:text-[13px] text-[#A1A1A1] tracking-[0.2em] uppercase leading-relaxed max-w-xs">
              A LOOK INSIDE THE EDITING PROCESS
              <br />
              AND HOW THE STORY COMES TO LIFE.
            </p>
          </div>

          {/* RIGHT COLUMN: Interactive RAW vs FINAL Comparison Image (~72% on desktop) */}
          <div className="w-full lg:w-[72%] flex-grow">
            <div
              ref={comparisonContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-label="Interactive RAW vs FINAL grading comparison slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sliderPosition)}
              className="group relative w-full aspect-video rounded-sm sm:rounded border border-white/10 bg-[#070707] overflow-hidden cursor-ew-resize shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-white/25 focus:outline-none focus:ring-1 focus:ring-white/40"
              data-cursor="DRAG"
            >
              {/* Layer 1 (Bottom / Base): FINAL Edited Footage */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                  src="/assets/behind-the-edit/final.webp"
                  alt="FINAL Graded Footage — Alpine Mountain Landscape with Hiker"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 72vw"
                  className="object-cover object-center"
                />

                {/* Top-Right Pill Label: FINAL */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 px-3.5 py-1.5 rounded bg-black/90 text-white border border-white/25 font-sans-body text-[11px] sm:text-xs font-black tracking-widest uppercase select-none shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  FINAL
                </div>
              </div>

              {/* Layer 2 (Top / Clipped): RAW Flat Log Footage */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <Image
                  src="/assets/behind-the-edit/raw.webp"
                  alt="RAW Sensor Footage — Flat Log Emulation with Lifted Shadows"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 72vw"
                  className="object-cover object-center"
                />

                {/* Top-Left Pill Label: RAW */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 px-3.5 py-1.5 rounded bg-[#F0F0ED] text-[#080808] font-sans-body text-[11px] sm:text-xs font-black tracking-widest uppercase select-none shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  RAW
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none transition-opacity duration-200"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Subtle vertical glow along divider line */}
                <div className="absolute inset-y-0 -left-1 -right-1 bg-white/30 blur-[2px] pointer-events-none" />
              </div>

              {/* Circular Draggable Interaction Handle with < > Arrows */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-black/80 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,0,0,0.9)] group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
                  <div className="flex items-center gap-0.5 -mx-0.5">
                    <ChevronLeft className="w-4 h-4 text-white stroke-[2.8]" />
                    <ChevronRight className="w-4 h-4 text-white stroke-[2.8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AREA B — PROFESSIONAL VIDEO EDITING TIMELINE (Matches Reference 07) */}
        <div
          ref={timelineRef}
          onMouseEnter={() => setIsTimelineHovered(true)}
          onMouseLeave={() => setIsTimelineHovered(false)}
          className="w-full rounded-sm sm:rounded border border-white/[0.08] bg-[#0c0c0e] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="w-full flex items-stretch gap-3 sm:gap-4">
            {/* Left Toolbar Strip with 4 Track Control Icons */}
            <div className="w-8 sm:w-10 flex-shrink-0 flex flex-col justify-between py-1.5 border-r border-white/[0.06] pr-2 text-[#777777]">
              {/* Settings Icon */}
              <div className="flex items-center justify-center hover:text-[#F0F0ED] transition-colors cursor-pointer" title="Timeline Settings">
                <Settings className="w-3.5 h-3.5" />
              </div>

              {/* Razor / Cut Tool */}
              <div className="flex items-center justify-center hover:text-[#F0F0ED] transition-colors cursor-pointer" title="Razor Tool [C]">
                <Scissors className="w-3.5 h-3.5" />
              </div>

              {/* Film Track Icon */}
              <div className="flex items-center justify-center hover:text-[#F0F0ED] transition-colors cursor-pointer" title="Video Track V1">
                <Film className="w-3.5 h-3.5" />
              </div>

              {/* Lock Track Icon */}
              <div className="flex items-center justify-center hover:text-[#F0F0ED] transition-colors cursor-pointer" title="Lock All Tracks">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Main Multi-Track NLE Workspace */}
            <div
              onClick={handleTimelineClick}
              className="relative flex-grow flex flex-col gap-2.5 sm:gap-3 overflow-hidden cursor-pointer"
            >
              {/* Draggable Playhead Needle */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none transition-all duration-75 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{ left: `${playheadPos}%` }}
              >
                {/* Playhead Top Triangle Needle */}
                <div className="w-3 h-3 bg-white -translate-x-[5px] -translate-y-1 rotate-45 shadow-[0_0_12px_rgba(255,255,255,0.95)]" />
              </div>

              {/* TRACK 01: Video Thumbnails (5 sequential frames) + Horizontal Audio Waveform */}
              <div className="w-full h-11 sm:h-12 flex items-center gap-2 sm:gap-3 bg-black/50 rounded-[3px] border border-white/[0.06] px-1.5 sm:px-2 overflow-hidden">
                {/* 5 Video Thumbnails */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="relative w-12 sm:w-16 md:w-20 h-8 sm:h-9 rounded-[2px] overflow-hidden border border-white/20 bg-[#161616] flex-shrink-0 hover:border-white/50 hover:brightness-110 transition-all"
                    >
                      <Image
                        src={`/assets/behind-the-edit/thumb_${i}.webp`}
                        alt={`Video clip frame ${i}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Horizontal Audio Waveform */}
                <div className="flex-grow h-full flex items-center justify-between px-2 sm:px-4 overflow-hidden">
                  <div className="w-full flex items-center justify-between gap-[2px] h-6 sm:h-7 opacity-90">
                    {WAVEFORM_AMPLITUDES.map((amp, idx) => (
                      <div
                        key={idx}
                        className="w-[1.5px] sm:w-[2px] bg-[#E8E8E5] rounded-full transition-all"
                        style={{
                          height: `${Math.max(16, (amp / 100) * 100)}%`,
                          opacity: idx < WAVEFORM_AMPLITUDES.length * (playheadPos / 100) ? 1 : 0.45,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TRACK 02: Main Lavender / Purple Video Editing Track */}
              <div className="w-full h-7 sm:h-8 bg-black/50 rounded-[3px] border border-white/[0.06] p-0.5 relative overflow-hidden flex items-center">
                <div
                  className="bte-timeline-clip h-full w-[98%] bg-[#7D6DB8] border border-[#9686D4]/60 rounded-[2px] shadow-[0_2px_12px_rgba(125,109,184,0.35)] flex items-center px-2.5 sm:px-3 text-[10px] font-mono-tech text-white font-medium tracking-wider truncate hover:brightness-110 transition-all"
                  title="A01_C004_1028_RAW_4K.mov"
                >
                  <span className="hidden sm:inline">A01_C004_1028_RAW_4K.mov</span>
                  <span className="sm:hidden">CLIP_01</span>
                </div>
              </div>

              {/* TRACK 03: Secondary Effects Tracks (Purple-to-Cyan + Purple Clips) */}
              <div className="w-full h-7 sm:h-8 bg-black/50 rounded-[3px] border border-white/[0.06] p-0.5 relative overflow-hidden flex items-center justify-between">
                {/* Clip A: Purple-to-Cyan / Blue Gradient */}
                <div
                  className="bte-timeline-clip h-full w-[38%] bg-gradient-to-r from-[#7D6DB8] via-[#5C8EBC] to-[#45A8CA] border border-cyan-400/50 rounded-[2px] shadow-[0_2px_12px_rgba(69,168,202,0.3)] flex items-center px-2.5 sm:px-3 text-[10px] font-mono-tech text-white font-medium tracking-wider truncate hover:brightness-110 transition-all"
                  title="COLOR_GRADE_EMULATION_V03"
                >
                  <span className="hidden sm:inline">COLOR_GRADE_V03</span>
                  <span className="sm:hidden">FX_01</span>
                </div>

                {/* Clip B: Purple Track Clip positioned at the right side */}
                <div
                  className="bte-timeline-clip h-full w-[24%] bg-[#7D6DB8] border border-[#9686D4]/60 rounded-[2px] shadow-[0_2px_12px_rgba(125,109,184,0.35)] flex items-center px-2.5 sm:px-3 text-[10px] font-mono-tech text-white font-medium tracking-wider truncate hover:brightness-110 transition-all ml-auto"
                  title="MASTER_GRADE_ACEScg"
                >
                  <span className="hidden sm:inline">MASTER_ACEScg</span>
                  <span className="sm:hidden">FX_02</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
