'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { siteConfig } from '@/data/site';

interface PreloaderProps {
  onComplete?: () => void;
}

function checkIsReload(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = performance.getEntriesByType && (performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]);
    if (nav && nav.length > 0 && nav[0] && nav[0].type) {
      return nav[0].type === 'reload';
    }
    if ((window.performance as any)?.navigation) {
      return (window.performance as any).navigation.type === 1;
    }
  } catch {}
  return false;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        if ((window as any).__FRAME_PRELOADER_COMPLETED__) {
          return false;
        }

        const isReload = checkIsReload();
        if (isReload) {
          return true; // Always show preloader on page refresh
        }

        return sessionStorage.getItem('frame_has_loaded') !== 'true';
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    // If this document lifecycle has already completed the preloader, never run again
    if (typeof window !== 'undefined' && (window as any).__FRAME_PRELOADER_COMPLETED__) {
      setIsVisible(false);
      return;
    }

    const isReload = checkIsReload();
    let hasSeen = false;
    try {
      hasSeen = !isReload && sessionStorage.getItem('frame_has_loaded') === 'true';
    } catch {
      hasSeen = false;
    }

    if (hasSeen) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('has-loaded');
      }
      hasCompletedRef.current = true;
      if (typeof window !== 'undefined') {
        (window as any).__FRAME_PRELOADER_COMPLETED__ = true;
      }
      setIsVisible(false);
      onCompleteRef.current?.();
      return;
    }

    // Otherwise (First entrance OR page refresh): Show preloader
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('has-loaded');
    }
    setIsVisible(true);

    // Lock scroll during preloader presentation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dismissPreloader = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      if (typeof window !== 'undefined') {
        (window as any).__FRAME_PRELOADER_COMPLETED__ = true;
      }
      try {
        sessionStorage.setItem('frame_has_loaded', 'true');
        document.documentElement.classList.add('has-loaded');
      } catch {}
      document.body.style.overflow = originalOverflow;
      setIsVisible(false);
      onCompleteRef.current?.();
    };

    // Quick exit for reduced motion
    if (prefersReducedMotion) {
      const exitTimer = setTimeout(dismissPreloader, 200);
      return () => {
        clearTimeout(exitTimer);
        document.body.style.overflow = originalOverflow;
      };
    }

    if (!overlayRef.current) return;

    // Failsafe timer: guaranteed dismiss within 2.1s so preloader NEVER stays frozen
    const failsafeTimer = setTimeout(dismissPreloader, 2100);

    const progressDuration = 1.05;

    // Single Coordinated Master GSAP Timeline with Scoped Selectors
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { opacity: 1, yPercent: 0 });
      gsap.set('.preloader-chrome', { opacity: 0, scale: 1.04, x: 20 });
      gsap.set('.preloader-bracket', { opacity: 0, scale: 0.92 });
      gsap.set('.preloader-label', { opacity: 0, y: 8 });
      gsap.set('.preloader-brand', { opacity: 0, y: 14 });
      gsap.set('.preloader-progress-row', { opacity: 0, y: 6 });

      const progressBarFill = overlayRef.current?.querySelector('.preloader-progress-fill') as HTMLDivElement | null;
      const progressNum = overlayRef.current?.querySelector('.preloader-progress-num') as HTMLSpanElement | null;

      const masterTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // Phase 01: Ambient Chrome Sculpture & Corner Framing Reveal (0.0s - 0.4s)
      masterTl.to(
        '.preloader-chrome',
        {
          opacity: 0.95,
          scale: 1,
          x: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        0
      );

      masterTl.to(
        '.preloader-bracket',
        {
          opacity: 0.65,
          scale: 1,
          duration: 0.35,
          stagger: 0.03,
        },
        0.05
      );

      // Phase 02: Label & Brand Reveal (0.05s - 0.4s)
      masterTl.to(
        '.preloader-label',
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.08
      );

      masterTl.to(
        '.preloader-brand',
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        },
        0.12
      );

      masterTl.to(
        '.preloader-progress-row',
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.15
      );

      // Phase 03: Synchronized Progress Animation (Starts immediately at 0.1s and counts to 100%)
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
        0.1
      );

      // Phase 04: Brief breath at 100% completion
      masterTl.to({}, { duration: 0.1 });

      // Phase 05: Cinematic Exit Sequence
      masterTl.to(
        ['.preloader-label', '.preloader-progress-row'],
        {
          opacity: 0,
          y: -6,
          duration: 0.22,
          stagger: 0.02,
          ease: 'power2.in',
        }
      );

      masterTl.to(
        '.preloader-brand',
        {
          opacity: 0,
          y: -12,
          duration: 0.28,
          ease: 'power3.in',
        },
        '-=0.14'
      );

      masterTl.to(
        ['.preloader-bracket', '.preloader-chrome'],
        {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.in',
        },
        '-=0.18'
      );

      // Vertical shutter reveal lifting upward
      masterTl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            clearTimeout(failsafeTimer);
            dismissPreloader();
          },
        },
        '-=0.08'
      );
    }, overlayRef);

    return () => {
      clearTimeout(failsafeTimer);
      if (!hasCompletedRef.current && !(window as any)?.__FRAME_PRELOADER_COMPLETED__) {
        ctx.revert();
      }
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isVisible) return null;

  return (
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
  );
}
