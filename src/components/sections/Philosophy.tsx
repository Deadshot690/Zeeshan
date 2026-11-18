'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Master Reveal Timeline triggered as section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      });

      // 1. Upper-left section indicator reveal
      tl.fromTo(
        '.philosophy-indicator',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // 2. Line 1: WE DON'T JUST (Vertical clipping mask reveal)
      tl.fromTo(
        '.philosophy-line-1',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
        '-=0.35'
      );

      // 3. Line 2: EDIT VIDEOS. (Thin typography reveal)
      tl.fromTo(
        '.philosophy-line-2',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
        '-=0.7'
      );

      // 4. Line 3: WE CREATE (Italic metallic typography reveal)
      tl.fromTo(
        '.philosophy-line-3',
        { yPercent: 105, x: -15, opacity: 0 },
        { yPercent: 0, x: 0, opacity: 1, duration: 1.0, ease: 'power4.out' },
        '-=0.7'
      );

      // 5. Line 4: EXPERIENCES. (Oversized italic bold metallic punch)
      tl.fromTo(
        '.philosophy-line-4',
        { yPercent: 110, scale: 0.96, opacity: 0 },
        { yPercent: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'power4.out' },
        '-=0.75'
      );

      // 6. Monochrome portrait reveal via rectangular clip-path
      tl.fromTo(
        '.philosophy-portrait-wrapper',
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut' },
        '-=0.9'
      );

      // 7. Architectural layered panels
      tl.fromTo(
        ['.philosophy-panel-back', '.philosophy-panel-front'],
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.9, stagger: 0.15 },
        '-=0.7'
      );

      // 8. Diagonal chrome / light streak reveal
      tl.fromTo(
        streakRef.current,
        { opacity: 0, scaleX: 0.9, transformOrigin: 'bottom left' },
        { opacity: 1, scaleX: 1, duration: 1.4, ease: 'power2.out' },
        '-=1.0'
      );

      // Continuous subtle parallax scroll connections
      gsap.to('.philosophy-portrait-container', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -40,
        ease: 'none',
      });

      gsap.to(streakRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
        },
        y: -25,
        x: 18,
        ease: 'none',
      });
    }, sectionRef);

    // Subtle pointer micro-interaction with damped inertia
    const handlePointerMove = (e: PointerEvent) => {
      if (!sectionRef.current || !portraitRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      gsap.to(portraitRef.current, {
        x: normX * 8,
        y: normY * 6,
        rotateY: normX * 1.5,
        rotateX: -normY * 1.5,
        duration: 1.2,
        ease: 'power2.out',
      });

      if (streakRef.current) {
        gsap.to(streakRef.current, {
          x: normX * 10,
          y: normY * 8,
          duration: 1.5,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative w-full min-h-screen py-28 sm:py-36 md:py-40 px-6 sm:px-12 md:px-16 lg:px-20 bg-[#050505] flex items-center overflow-hidden select-none"
    >
      {/* Background Subtle Radial Atmosphere */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_40%] from-white/[0.02] to-transparent pointer-events-none" />

      {/* Subtle Viewfinder Framing Brackets */}
      <div className="corner-bracket corner-tl !top-12 !left-6 md:!left-12 opacity-35" />
      <div className="corner-bracket corner-br !bottom-12 !right-6 md:!right-12 opacity-35" />

      {/* Main Content Layout Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center relative z-10">
        {/* Section Indicator: 02 /11 (Carefully positioned above the headline, perfectly visible) */}
        <div className="philosophy-indicator flex flex-col gap-1 mb-10 sm:mb-14 z-20 pointer-events-none">
          <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[#F0F0ED] tracking-widest">
            02
          </span>
          <span className="font-mono-tech text-[10px] sm:text-xs text-[#777777] tracking-widest">
            /11
          </span>
        </div>

        {/* 2-Column Responsive Layout: Typography Left, Architectural Portrait Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Kinetic Editorial Typography */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="flex flex-col leading-[0.92] tracking-tight">
              {/* Line 1: WE DON'T JUST */}
              <div className="overflow-hidden py-1">
                <div className="philosophy-line-1 flex items-baseline gap-2.5 sm:gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem]">
                  <span className="font-sans-body font-black uppercase tracking-tight text-[#F0F0ED]">
                    WE
                  </span>
                  <span className="font-sans-body font-light uppercase tracking-wider text-[#C8C8C5]">
                    DON'T JUST
                  </span>
                </div>
              </div>

              {/* Line 2: EDIT VIDEOS. (Thin / Light Sans-Serif) */}
              <div className="overflow-hidden py-1">
                <div className="philosophy-line-2 text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem]">
                  <span className="font-sans-body font-extralight uppercase tracking-[0.06em] text-[#A6A6A2]">
                    EDIT VIDEOS.
                  </span>
                </div>
              </div>

              {/* Line 3: WE CREATE (Italic Bold with Metallic Sheen) */}
              <div className="overflow-hidden py-1 mt-1 sm:mt-2">
                <div className="philosophy-line-3 text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem]">
                  <span className="font-sans-body font-black italic uppercase tracking-tight bg-gradient-to-r from-[#FFFFFF] via-[#ECECE8] to-[#999995] bg-clip-text text-transparent">
                    WE CREATE
                  </span>
                </div>
              </div>

              {/* Line 4: EXPERIENCES. (Oversized Italic Bold with Brilliant Silver Specular Finish) */}
              <div className="overflow-hidden py-2 pr-4 mt-1 sm:mt-2">
                <div className="philosophy-line-4 text-5xl sm:text-6xl md:text-7xl lg:text-[6.2rem] xl:text-[7.6rem]">
                  <span className="font-sans-body font-black italic uppercase tracking-tight bg-gradient-to-r from-[#FFFFFF] via-[#F4F4F0] via-40% to-[#777773] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(255,255,255,0.12)]">
                    EXPERIENCES.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Monochrome Portrait Composition */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            <div
              ref={portraitRef}
              className="philosophy-portrait-container relative w-[250px] sm:w-[300px] md:w-[330px] lg:w-[360px] xl:w-[400px] h-[360px] sm:h-[440px] md:h-[480px] lg:h-[530px] xl:h-[580px] transform-gpu"
            >
              {/* Layer 1: Dark Translucent Offset Architectural Panel Behind */}
              <div className="philosophy-panel-back absolute -top-3.5 -right-3.5 w-full h-full border border-white/10 bg-white/[0.02] backdrop-blur-[2px] pointer-events-none z-0" />

              {/* Layer 2: Main Grayscale Cinematic Portrait Crop (Tightly focused on eye & gaze) */}
              <div className="philosophy-portrait-wrapper relative w-full h-full overflow-hidden border border-white/20 bg-[#0a0a0a] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <Image
                  src="/assets/branding/portrait.jpg"
                  alt="Mohammad Zeeshan — Video Editor & Short-Form Content Specialist"
                  fill
                  priority
                  className="philosophy-portrait-img object-cover object-[center_35%] scale-125 filter grayscale contrast-135 brightness-90 hover:scale-130 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 80vw, 35vw"
                />

                {/* Controlled Cinematic Grayscale Shadows & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/35 via-transparent to-[#050505]/35 pointer-events-none" />
              </div>

              {/* Layer 3: Overlapping Architectural Dark Glass Panel (Bottom Left) */}
              <div className="philosophy-panel-front absolute -bottom-4 -left-6 w-32 sm:w-36 h-40 sm:h-48 border border-white/10 bg-black/45 backdrop-blur-md hidden sm:block pointer-events-none z-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Chrome / Metallic Light Ribbon Element (Flowing from lower-mid to upper-right) */}
      <svg
        ref={streakRef}
        className="philosophy-diagonal absolute inset-0 w-full h-full pointer-events-none z-30 transform-gpu"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chromeStreakGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="30%" stopColor="#999999" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#D5D5D0" stopOpacity="0.65" />
            <stop offset="90%" stopColor="#555555" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chromeGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Glow Diffusion Streak */}
        <path
          d="M 450 920 C 680 780, 920 620, 1420 440"
          stroke="url(#chromeGlowGrad)"
          strokeWidth="10"
          filter="url(#softGlow)"
          strokeLinecap="round"
        />

        {/* Primary Sharp Specular Metallic Ribbon */}
        <path
          d="M 450 920 C 680 780, 920 620, 1420 440"
          stroke="url(#chromeStreakGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Secondary Delicate Bottom-Right Accent Streak */}
        <path
          d="M 1080 880 C 1220 830, 1340 760, 1440 680"
          stroke="url(#chromeStreakGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
