'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { siteConfig } from '@/data/site';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('frame_has_loaded') !== 'true';
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    // Check if user has already seen preloader in this active session
    let hasSeen = false;
    try {
      hasSeen = sessionStorage.getItem('frame_has_loaded') === 'true';
    } catch {
      hasSeen = false;
    }

    if (hasSeen) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('has-loaded');
      }
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Lock scroll during first-time preloader presentation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Quick exit for reduced motion
    if (prefersReducedMotion) {
      const exitTimer = setTimeout(() => {
        try {
          sessionStorage.setItem('frame_has_loaded', 'true');
        } catch {}
        setIsVisible(false);
        document.body.style.overflow = originalOverflow;
        onComplete?.();
      }, 250);
      return () => {
        clearTimeout(exitTimer);
        document.body.style.overflow = originalOverflow;
      };
    }

    if (!overlayRef.current) return;

    const progressDuration = 1.5;

    // Single Coordinated Master GSAP Timeline with Scoped Selectors
    const ctx = gsap.context((self) => {
      // 00. Initial Setup via Scoped Class Selectors (guaranteed no null refs)
      gsap.set(overlayRef.current, { opacity: 1, yPercent: 0 });
      gsap.set('.preloader-chrome', { opacity: 0, scale: 1.04, x: 20 });
      gsap.set('.preloader-bracket', { opacity: 0, scale: 0.9 });
      gsap.set('.preloader-label', { opacity: 0, y: 10 });
      gsap.set('.preloader-brand', { opacity: 0, y: 18 });
      gsap.set('.preloader-progress-row', { opacity: 0, y: 8 });

      const progressBarFill = overlayRef.current?.querySelector('.preloader-progress-fill') as HTMLDivElement | null;
      const progressNum = overlayRef.current?.querySelector('.preloader-progress-num') as HTMLSpanElement | null;

      const masterTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // Phase 01: Ambient Chrome Sculpture & Corner Framing Reveal (0.0s - 0.6s)
      masterTl.to('.preloader-chrome', {
        opacity: 0.95,
        scale: 1,
        x: 0,
        duration: 0.75,
        ease: 'power2.out',
      });

      masterTl.to(
        '.preloader-bracket',
        {
          opacity: 0.65,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
        },
        '-=0.55'
      );

      // Phase 02: "LOADING EXPERIENCE" Label Reveal (0.2s - 0.6s)
      masterTl.to(
        '.preloader-label',
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.35'
      );

      // Phase 03: Primary Brand Typography Reveal "ZEESHAN" (0.35s - 1.0s)
      masterTl.to(
        '.preloader-brand',
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        '-=0.25'
      );

      // Reveal Progress Bar Row (0.5s - 0.85s)
      masterTl.to(
        '.preloader-progress-row',
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.45'
      );

      // Phase 04: Synchronized Progress Animation (Starts at 0.5s and glides to 100%)
      const progressState = { value: 0 };
      masterTl.to(
        progressState,
        {
          value: 100,
          duration: progressDuration,
          ease: 'power1.inOut',
          onUpdate: () => {
            const currentVal = Math.min(100, Math.round(progressState.value));
            if (progressBarFill) {
              progressBarFill.style.width = `${currentVal}%`;
            }
            if (progressNum) {
              progressNum.textContent = `${currentVal}%`;
            }
          },
        },
        '-=0.3'
      );

      // Phase 05: Cinematic Exit Sequence (follows 100% completion in the same timeline)
      // Brief aesthetic pause
      masterTl.to({}, { duration: 0.2 });

      // Fade out loading text & progress row (safely using selector array)
      masterTl.to(
        ['.preloader-label', '.preloader-progress-row'],
        {
          opacity: 0,
          y: -6,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.in',
        }
      );

      // Subtle upward glide of brand name
      masterTl.to(
        '.preloader-brand',
        {
          opacity: 0,
          y: -14,
          duration: 0.4,
          ease: 'power3.in',
        },
        '-=0.15'
      );

      // Fade corner brackets
      masterTl.to(
        '.preloader-bracket',
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.3,
          ease: 'power2.in',
        },
        '-=0.25'
      );

      // Fade chrome reflection as curtain lifts
      masterTl.to(
        '.preloader-chrome',
        {
          opacity: 0,
          x: 15,
          duration: 0.4,
          ease: 'power2.in',
        },
        '-=0.3'
      );

      // Vertical shutter reveal lifting upward like a camera shutter
      masterTl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power3.inOut',
          onComplete: () => {
            try {
              sessionStorage.setItem('frame_has_loaded', 'true');
              document.documentElement.classList.add('has-loaded');
            } catch {}
            document.body.style.overflow = originalOverflow;
            setIsVisible(false);
            onComplete?.();
          },
        },
        '-=0.1'
      );
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('frame_has_loaded')==='true'){document.documentElement.classList.add('has-loaded');}}catch(e){}",
        }}
      />
      <div
        ref={overlayRef}
        suppressHydrationWarning
        className="preloader-overlay fixed inset-0 z-[10000] bg-[#070707] flex flex-col items-center justify-center select-none overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience"
    >
      {/* Abstract Metallic Chrome Background Element entering diagonally from top-right */}
      <div className="preloader-chrome absolute top-0 right-0 w-[90vw] sm:w-[70vw] md:w-[55vw] lg:w-[46vw] h-full pointer-events-none overflow-hidden select-none z-0">
        <Image
          src="/assets/branding/preloader-chrome-element.webp"
          alt="Reflective Chrome Sculpture"
          fill
          priority
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 46vw"
          className="object-cover object-right-top filter brightness-110 contrast-125 opacity-75 sm:opacity-100 pointer-events-none"
        />
        {/* Soft Left Feather to blend seamlessly into the #070707 dark void */}
        <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-[#070707] via-[#070707]/60 to-transparent pointer-events-none" />
        {/* Top Vignette to blend the top entrance cleanly in portrait viewports */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070707] via-[#070707]/80 to-transparent pointer-events-none" />
        {/* Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none" />
      </div>

      {/* Cinematic Viewfinder Corner Framing Brackets */}
      {/* Top-Left Bracket */}
      <div className="preloader-bracket absolute top-6 left-6 sm:top-10 sm:left-10 md:top-12 md:left-12 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-t border-l border-white/40 pointer-events-none z-10" />
      {/* Top-Right Bracket */}
      <div className="preloader-bracket absolute top-6 right-6 sm:top-10 right-10 md:top-12 md:right-12 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-t border-r border-white/40 pointer-events-none z-10" />
      {/* Bottom-Left Bracket */}
      <div className="preloader-bracket absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-b border-l border-white/40 pointer-events-none z-10" />
      {/* Bottom-Right Bracket */}
      <div className="preloader-bracket absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-b border-r border-white/40 pointer-events-none z-10" />

      {/* Center Cinematic Content Composition */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-5xl">
        {/* Top Centered Secondary Label: LOADING EXPERIENCE */}
        <div className="preloader-label font-sans-body text-[9px] sm:text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#A1A1A1] mb-5 sm:mb-8 font-medium">
          LOADING EXPERIENCE
        </div>

        {/* Primary Brand Typography: ZEESHAN */}
        <div className="w-full flex justify-center mb-6 sm:mb-8 overflow-visible">
          <h1 className="preloader-brand font-sans-body font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F0F0ED] uppercase tracking-[0.2em] sm:tracking-[0.24em] md:tracking-[0.26em] whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] px-2">
            {siteConfig.displayName}
          </h1>
        </div>

        {/* Minimal Progress Bar & Percentage Counter in One Unified Row */}
        <div className="preloader-progress-row flex items-center gap-3 sm:gap-4 w-[200px] sm:w-[260px] md:w-[300px]">
          {/* Subtle Progress Track with White Fill Line */}
          <div className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden relative">
            <div
              className="preloader-progress-fill h-full bg-[#F0F0ED] rounded-full"
              style={{ width: '0%' }}
            />
          </div>

          {/* Synchronized Percentage Counter */}
          <span className="preloader-progress-num font-sans-body tabular-nums text-[10px] sm:text-xs text-[#A1A1A1] font-medium tracking-wider w-8 text-right select-none">
            0%
          </span>
        </div>
      </div>
    </div>
  </>
  );
}