'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpRight, X, Briefcase, GraduationCap, Cpu, MapPin, CheckCircle2, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/data/site';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { scrollTo } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);
  
  // Parallax layer refs
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);

  // Modal State for Expanded Dossier
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Creative skill tags from reference
  const skillTags = ['EDITING', 'MOTION', 'COLOR', 'VFX'];

  // Master GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.to(cardRef.current, { opacity: 1, duration: 0.6 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      // 1. Reveal outer container card
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, clearProps: 'transform' }
      );

      // 2. Reveal section counter (07 /11 + vertical accent line)
      tl.fromTo(
        '.about-counter',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      );

      // 3. Reveal top-right interactive arrow
      tl.fromTo(
        '.about-arrow-btn',
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' },
        '-=0.5'
      );

      // 4. Reveal layered background panels (staggered depth)
      tl.fromTo(
        ['.about-layer-1', '.about-layer-2', '.about-layer-3'],
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' },
        '-=0.6'
      );

      // 5. Reveal main portrait with smooth vertical clip-path reveal
      tl.fromTo(
        '.about-portrait-frame',
        { clipPath: 'inset(100% 0 0 0)', scale: 1.06, opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          clearProps: 'clipPath,transform',
        },
        '-=0.7'
      );

      // 6. Reveal Heading lines with mask
      tl.fromTo(
        '.about-heading-line',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power4.out', clearProps: 'transform' },
        '-=0.8'
      );

      // 7. Reveal Professional Role
      tl.fromTo(
        '.about-role',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
        '-=0.6'
      );

      // 8. Reveal Biography
      tl.fromTo(
        '.about-bio',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
        '-=0.5'
      );

      // 9. Reveal Skill Tags sequentially
      tl.fromTo(
        '.about-skill-tag',
        { y: 14, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'back.out(1.5)',
          clearProps: 'transform',
        },
        '-=0.4'
      );

      // Scroll-based subtle ambient parallax on the portrait column
      gsap.to(portraitColRef.current, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-driven Parallax Interaction on the Layered Portrait Composition (Desktop Only)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (!portraitColRef.current) return;

    const rect = portraitColRef.current.getBoundingClientRect();
    // Normalize coordinates: -1 to 1 relative to center
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Shift main portrait subtly
    if (portraitFrameRef.current) {
      gsap.to(portraitFrameRef.current, {
        x: x * 8,
        y: y * 8,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Shift Layer 1 (Leftmost offset pane) with greater inverse parallax
    if (layer1Ref.current) {
      gsap.to(layer1Ref.current, {
        x: x * -14,
        y: y * -12,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Shift Layer 2 (Center-back pane) with intermediate parallax
    if (layer2Ref.current) {
      gsap.to(layer2Ref.current, {
        x: x * -6,
        y: y * -6,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Shift Layer 3 (Top-right accent tile) with forward parallax
    if (layer3Ref.current) {
      gsap.to(layer3Ref.current, {
        x: x * 10,
        y: y * 10,
        duration: 0.75,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth < 1024) return;

    const elements = [
      portraitFrameRef.current,
      layer1Ref.current,
      layer2Ref.current,
      layer3Ref.current,
    ];

    gsap.to(elements, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleModalContactClick = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      scrollTo('#contact');
    }, 200);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 w-full py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 bg-[#080808] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Section Container: Exact Reference Proportions & Editorial Aesthetic */}
        <div
          ref={cardRef}
          className="about-card-container relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-white/[0.08] bg-[#0c0c0e] p-6 sm:p-10 lg:p-14 xl:p-16 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        >
          {/* Subtle Ambient Grain & Dark Gradient Depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black pointer-events-none" />

          {/* Section Counter: 07 /11 with vertical line (Matching Reference) */}
          <div className="about-counter absolute top-6 sm:top-10 left-6 sm:left-10 lg:top-12 lg:left-12 z-20 flex flex-col items-start font-mono-tech select-none">
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm sm:text-base font-bold text-white tracking-wider">07</span>
              <span className="text-xs text-[#777777]">/11</span>
            </div>
            <div className="w-[1px] h-6 sm:h-8 bg-white/20 mt-1.5 ml-1" />
          </div>

          {/* Top-Right Interactive Diagonal Arrow (Opens Detailed Editorial Dossier) */}
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Expand detailed profile and credentials"
            className="about-arrow-btn absolute top-6 sm:top-10 right-6 sm:right-10 lg:top-12 lg:right-12 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-white/[0.03] hover:border-white/40 hover:bg-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 group cursor-pointer"
          >
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
          </button>

          {/* Main Two-Column Composition: Left Image ~55%, Right Content ~45% */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center pt-10 sm:pt-12 lg:pt-4">
            {/* ==================================================== */}
            {/* LEFT COLUMN: Layered Editorial Monochrome Portrait   */}
            {/* ==================================================== */}
            <div
              ref={portraitColRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-7 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] xl:min-h-[520px] select-none"
            >
              {/* Layer 1: Leftmost Offset Vertical Rectangular Glass Pane */}
              <div
                ref={layer1Ref}
                className="about-layer-1 absolute w-28 sm:w-36 lg:w-40 h-52 sm:h-64 lg:h-72 border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent backdrop-blur-[2px] rounded-sm pointer-events-none z-0 transform -translate-x-20 sm:-translate-x-28 lg:-translate-x-32"
              />

              {/* Layer 2: Center-Rear Architectural Translucent Panel Behind Head */}
              <div
                ref={layer2Ref}
                className="about-layer-2 absolute w-60 sm:w-72 lg:w-80 h-60 sm:h-72 lg:h-80 border border-white/[0.12] bg-white/[0.02] backdrop-blur-[3px] rounded-sm pointer-events-none z-0 transform -translate-y-6 sm:-translate-y-8"
              />

              {/* Layer 3: Top-Right Subtle Accent Glass Tile */}
              <div
                ref={layer3Ref}
                className="about-layer-3 absolute w-28 sm:w-36 lg:w-40 h-28 sm:h-36 lg:h-40 border border-white/[0.08] bg-white/[0.03] backdrop-blur-[2px] rounded-sm pointer-events-none z-0 transform translate-x-20 sm:translate-x-28 lg:translate-x-32 -translate-y-16 sm:-translate-y-20 hidden sm:block"
              />

              {/* Layer 4: Dominant Monochrome Portrait of Mohammad Zeeshan */}
              <div
                ref={portraitFrameRef}
                className="about-portrait-frame relative w-[260px] sm:w-[320px] lg:w-[350px] xl:w-[380px] h-[340px] sm:h-[420px] lg:h-[460px] xl:h-[490px] rounded-sm overflow-hidden border border-white/20 bg-[#0a0a0c] z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group"
              >
                {/* Authentic High-Contrast Monochrome Portrait Asset */}
                <Image
                  src="/assets/branding/portrait.jpg"
                  alt="Mohammad Zeeshan — Video Editor & Visual Storyteller"
                  fill
                  priority
                  className="object-cover object-[center_28%] filter grayscale contrast-[1.35] brightness-[0.92] transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />

                {/* Cinematic Vignette & Bottom Edge Blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-90 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                {/* Subtle Viewfinder Framing Marks */}
                <div className="corner-bracket corner-tl !top-3 !left-3 !w-2 !h-2 opacity-60" />
                <div className="corner-bracket corner-br !bottom-3 !right-3 !w-2 !h-2 opacity-60" />
              </div>
            </div>

            {/* ==================================================== */}
            {/* RIGHT COLUMN: Editorial Typography & Skill Tags     */}
            {/* ==================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              {/* Main Heading: ABOUT \n MOHAMMAD ZEESHAN (Condensed Bold Display) */}
              <div className="overflow-hidden mb-2">
                <span className="about-heading-line block font-sans-body font-black text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[0.95] text-white tracking-tight uppercase">
                  ABOUT
                </span>
                <span className="about-heading-line block font-sans-body font-black text-3xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[0.95] text-white tracking-tight uppercase mt-1">
                  MOHAMMAD ZEESHAN
                </span>
              </div>

              {/* Professional Role / Identity */}
              <div className="about-role mt-4 sm:mt-5">
                <p className="font-sans-body text-base sm:text-lg text-[#E0E0E0] font-normal leading-snug tracking-wide">
                  Video Editor / Motion Designer /<br className="hidden sm:inline" /> Visual Storyteller
                </p>
              </div>

              {/* Biography: Exact Professional Introduction (2-3 Lines on Desktop) */}
              <div className="about-bio mt-4 sm:mt-5 max-w-md">
                <p className="font-sans-body text-sm sm:text-base text-[#A1A1A1] leading-relaxed font-light">
                  A creative video editor focused on crafting emotionally driven, visually compelling stories through editing, motion and sound.
                </p>
              </div>

              {/* Creative Skill Tags: 4 Outlined Pill Badges (EDITING, MOTION, COLOR, VFX) */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 sm:mt-10">
                {skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="about-skill-tag px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-[#F0F0ED] font-mono-tech text-xs tracking-widest uppercase transition-all duration-300 hover:border-white/60 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 cursor-default select-none shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* EXPANDED PROFILE DOSSIER MODAL                       */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e0e12] p-6 sm:p-8 lg:p-10 text-white shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest mb-1.5">
                  <MapPin className="w-3 h-3 text-white" />
                  <span>{siteConfig.location}</span>
                </div>
                <h3 className="font-sans-body font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                  {siteConfig.displayName}
                </h3>
                <p className="font-mono-tech text-xs tracking-wider text-[#A1A1A1] uppercase mt-0.5">
                  {siteConfig.role}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                aria-label="Close Profile Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="py-6 space-y-6 text-sm text-[#CCCCCC]">
              {/* Creative Philosophy */}
              <div>
                <h4 className="font-mono-tech text-[11px] text-[#888888] tracking-widest uppercase mb-2">
                  // CREATIVE PHILOSOPHY
                </h4>
                <p className="font-sans-body text-sm sm:text-base text-[#D4D4D0] leading-relaxed font-light">
                  {siteConfig.summary}
                </p>
              </div>

              {/* Experience & Education Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Experience */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                    <span>EXPERIENCE</span>
                  </div>
                  <h5 className="font-sans-body font-bold text-sm text-white uppercase">
                    {siteConfig.experience.role}
                  </h5>
                  <p className="font-mono-tech text-xs text-[#A1A1A1] mt-1">
                    {siteConfig.experience.period}
                  </p>
                  <p className="font-sans-body text-xs text-[#888888] mt-2 leading-relaxed">
                    Specialized in viral short-form retention, ranking formats, and client brand storytelling.
                  </p>
                </div>

                {/* Education */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-white" />
                    <span>EDUCATION</span>
                  </div>
                  <h5 className="font-sans-body font-bold text-sm text-white uppercase leading-snug">
                    {siteConfig.education.degree}
                  </h5>
                  <p className="font-sans-body text-xs text-[#A1A1A1] mt-1">
                    {siteConfig.education.institution}
                  </p>
                  <p className="font-mono-tech text-[10px] text-[#777777] mt-1">
                    {siteConfig.education.location} • {siteConfig.education.status}
                  </p>
                </div>
              </div>

              {/* Software Suite */}
              <div className="pt-2">
                <h4 className="font-mono-tech text-[11px] text-[#888888] tracking-widest uppercase mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-white" />
                  <span>CORE SOFTWARE SUITE</span>
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {siteConfig.software.map((sw) => (
                    <div
                      key={sw}
                      className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] font-mono-tech text-xs tracking-wider uppercase text-white flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{sw}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer / Direct Call to Action */}
            <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono-tech text-[10px] text-[#666666] tracking-wider uppercase">
                MOHAMMAD ZEESHAN // PORTFOLIO 2026
              </span>
              <button
                onClick={handleModalContactClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-sans-body font-bold text-xs uppercase tracking-wider hover:bg-[#E0E0E0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>INITIATE COLLABORATION</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
