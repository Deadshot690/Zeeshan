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
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitColRef = useRef<HTMLDivElement>(null);

  // Parallax layer refs
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);

  // Modal State for Expanded Dossier
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Creative skill tags from reference
  const skillTags = ['EDITING', 'MOTION', 'COLOR', 'VFX'];

  // Master GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.to(containerRef.current, { opacity: 1, duration: 0.6 });
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

      // 1. Reveal dedicated section header above container
      tl.fromTo(
        '.about-section-header',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' }
      );

      // 2. Reveal main container frame
      tl.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, clearProps: 'transform' },
        '-=0.3'
      );

      // 3. Reveal section counter (07 /11 + vertical accent line)
      tl.fromTo(
        '.about-counter',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' },
        '-=0.5'
      );

      // 4. Reveal top-right bare arrow
      tl.fromTo(
        '.about-arrow-icon',
        { opacity: 0, x: -6, y: 6 },
        { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' },
        '-=0.5'
      );

      // 5. Reveal layered background rectangles
      tl.fromTo(
        ['.about-layer-1', '.about-layer-2'],
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out', clearProps: 'transform' },
        '-=0.5'
      );

      // 6. Reveal main portrait with smooth vertical clip-path
      tl.fromTo(
        '.about-portrait-frame',
        { clipPath: 'inset(100% 0 0 0)', scale: 1.04, opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.inOut',
          clearProps: 'clipPath,transform',
        },
        '-=0.6'
      );

      // 7. Reveal Heading lines
      tl.fromTo(
        '.about-heading-line',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power4.out', clearProps: 'transform' },
        '-=0.7'
      );

      // 8. Reveal Role
      tl.fromTo(
        '.about-role',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
        '-=0.5'
      );

      // 9. Reveal Biography
      tl.fromTo(
        '.about-bio',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
        '-=0.45'
      );

      // 10. Reveal Skill Tags sequentially
      tl.fromTo(
        '.about-skill-tag',
        { y: 12, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'back.out(1.5)',
          clearProps: 'transform',
        },
        '-=0.35'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Subtle Parallax Interaction on Layered Composition (Desktop Only)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (!portraitColRef.current) return;

    const rect = portraitColRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (portraitFrameRef.current) {
      gsap.to(portraitFrameRef.current, {
        x: x * 6,
        y: y * 6,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (layer1Ref.current) {
      gsap.to(layer1Ref.current, {
        x: x * -10,
        y: y * -8,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (layer2Ref.current) {
      gsap.to(layer2Ref.current, {
        x: x * -5,
        y: y * -4,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth < 1024) return;

    const elements = [portraitFrameRef.current, layer1Ref.current, layer2Ref.current];
    gsap.to(elements, {
      x: 0,
      y: 0,
      duration: 0.7,
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
      className="relative z-10 w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#080808] overflow-hidden"
    >
      <div className="w-full max-w-[1360px] mx-auto">
        {/* ==================================================== */}
        {/* 2. DEDICATED SECTION HEADER (ABOVE MAIN CANVAS)      */}
        {/* ==================================================== */}
        <div className="about-section-header flex items-center gap-3 mb-4 sm:mb-5 select-none">
          <div className="px-2.5 py-0.5 rounded border border-white/20 bg-white/[0.04] font-mono-tech text-xs font-bold text-white tracking-wider">
            09
          </div>
          <h3 className="font-sans-body font-medium text-sm sm:text-base text-white tracking-wider uppercase">
            About the Editor
          </h3>
        </div>

        {/* ==================================================== */}
        {/* 3. MAIN WIDE CONTAINER CANVAS                        */}
        {/* ==================================================== */}
        <div
          ref={containerRef}
          className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-[#070709] p-6 sm:p-8 lg:p-10 xl:p-12 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          {/* Top-Left Section Counter: 07 /11 with subtle vertical line */}
          <div className="about-counter absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex flex-col items-start font-mono-tech select-none">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">07</span>
              <span className="text-[11px] sm:text-xs text-[#777777]">/11</span>
            </div>
            <div className="w-[1px] h-5 sm:h-6 bg-white/20 mt-1.5 ml-1" />
          </div>

          {/* Top-Right Bare Diagonal Arrow (Minimal & White, No Circular Background) */}
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Expand detailed profile and credentials"
            className="about-arrow-icon absolute top-6 right-6 sm:top-8 sm:right-8 z-20 text-white/70 hover:text-white transition-all duration-300 group cursor-pointer p-1"
          >
            <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
          </button>

          {/* ==================================================== */}
          {/* 4. EXACT TWO-COLUMN COMPOSITION: Left 55% / Right 45% */}
          {/* ==================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center pt-8 sm:pt-10 lg:pt-2">
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN (~55%): SUBSTANTIALLY LARGER PORTRAIT    */}
            {/* ---------------------------------------------------- */}
            <div
              ref={portraitColRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-7 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] xl:min-h-[580px] select-none"
            >
              {/* LAYER 1 — Background Muted Rectangle Offset Towards Left */}
              <div
                ref={layer1Ref}
                className="about-layer-1 absolute w-[68%] sm:w-[72%] h-[78%] sm:h-[82%] border border-white/10 bg-white/[0.02] backdrop-blur-[2px] rounded-sm pointer-events-none z-0 transform -translate-x-16 sm:-translate-x-24 lg:-translate-x-28 translate-y-4 sm:translate-y-6"
              />

              {/* LAYER 2 — Second Overlay Panel Offset Horizontally */}
              <div
                ref={layer2Ref}
                className="about-layer-2 absolute w-[64%] sm:w-[68%] h-[74%] sm:h-[78%] border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-[2px] rounded-sm pointer-events-none z-0 transform translate-x-12 sm:translate-x-16 lg:translate-x-20 -translate-y-8 sm:-translate-y-10"
              />

              {/* LAYER 3 — Main Sharp Dominant Portrait (Occupies 75-82% container height) */}
              <div
                ref={portraitFrameRef}
                className="about-portrait-frame relative w-[82%] sm:w-[85%] lg:w-[88%] max-w-[480px] h-[400px] sm:h-[480px] lg:h-[530px] xl:h-[560px] rounded-sm overflow-hidden border border-white/20 bg-[#0a0a0c] z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group"
              >
                {/* Authentic Actual Portrait Asset */}
                <Image
                  src="/assets/branding/portrait.jpg"
                  alt="Mohammad Zeeshan — Video Editor & Visual Storyteller"
                  fill
                  priority
                  className="object-cover object-[center_25%] filter grayscale contrast-[1.35] brightness-[0.92] transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 95vw, 50vw"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-85 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />

                {/* Subtle Viewfinder Framing Marks */}
                <div className="corner-bracket corner-tl !top-3 !left-3 !w-2 !h-2 opacity-50" />
                <div className="corner-bracket corner-br !bottom-3 !right-3 !w-2 !h-2 opacity-50" />
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN (~45%): EDITORIAL CONTENT & SKILL TAGS  */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              {/* Main Heading: ABOUT \n MOHAMMAD ZEESHAN (Condensed Display Font) */}
              <div className="overflow-hidden mb-1">
                <span className="about-heading-line block font-condensed-heading font-black text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] leading-[0.92] text-white tracking-normal uppercase">
                  ABOUT
                </span>
                <span className="about-heading-line block font-condensed-heading font-black text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] leading-[0.92] text-white tracking-normal uppercase mt-1">
                  MOHAMMAD ZEESHAN
                </span>
              </div>

              {/* Professional Role / Identity */}
              <div className="about-role mt-4 sm:mt-5">
                <p className="font-sans-body text-base sm:text-lg text-[#D4D4D0] font-normal leading-snug tracking-wide">
                  Video Editor / Motion Designer /<br className="hidden sm:inline" /> Visual Storyteller
                </p>
              </div>

              {/* Concise Biography (2-3 Lines on Desktop) */}
              <div className="about-bio mt-4 sm:mt-5 max-w-md">
                <p className="font-sans-body text-sm sm:text-base text-[#999999] leading-relaxed font-light">
                  A creative video editor focused on crafting emotionally driven, visually compelling stories through editing, motion and sound.
                </p>
              </div>

              {/* Creative Skill Tags (4 Outlined Pill Badges) */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 sm:mt-10">
                {skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="about-skill-tag px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 bg-white/[0.02] text-[#F0F0ED] font-mono-tech text-xs tracking-widest uppercase transition-all duration-300 hover:border-white/60 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 cursor-default select-none shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
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
