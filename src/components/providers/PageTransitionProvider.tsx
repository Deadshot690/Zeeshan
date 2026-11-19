'use client';

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { siteConfig } from '@/data/site';
import { soundManager } from '@/lib/sound';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

interface PageTransitionContextType {
  navigateTo: (url: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const curtainRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Automatically reset transition state whenever route pathname changes
  useEffect(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    if (curtainRef.current) {
      gsap.killTweensOf(curtainRef.current);
      gsap.set(curtainRef.current, { display: 'none', yPercent: -100, pointerEvents: 'none' });
    }
  }, [pathname]);

  const navigateTo = useCallback(
    (url: string) => {
      // 01. If on the home page and clicking a hash link (e.g. #selected-work or /#selected-work)
      if (pathname === '/' && (url.startsWith('#') || url.startsWith('/#'))) {
        const hash = url.startsWith('/#') ? url.replace('/', '') : url;
        soundManager.playClick();
        scrollTo(hash);
        return;
      }

      // Prevent concurrent transitions
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      soundManager.playClick();

      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(url);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // 02. Cinematic Shutter Entrance (Glide down over viewport)
      gsap.killTweensOf(curtain);
      gsap.set(curtain, { display: 'flex', pointerEvents: 'auto' });

      gsap.fromTo(
        curtain,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.32,
          ease: 'power3.inOut',
          onComplete: () => {
            const hasHash = url.includes('#');
            const [path, hash] = url.split('#');

            // Navigate using Next.js client-side router
            router.push(url);

            // Brief pacing pause for Next.js DOM swap
            setTimeout(() => {
              if (hasHash && hash) {
                // Scroll smoothly to target section
                setTimeout(() => {
                  scrollTo(`#${hash}`);
                }, 80);
              } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
              }

              // 03. Cinematic Shutter Reveal (Lift upward to reveal new page)
              gsap.to(curtain, {
                yPercent: 100,
                duration: 0.34,
                ease: 'power3.inOut',
                onComplete: () => {
                  gsap.set(curtain, { display: 'none', yPercent: -100, pointerEvents: 'none' });
                  isTransitioningRef.current = false;
                  setIsTransitioning(false);
                },
              });
            }, 100);
          },
        }
      );
    },
    [pathname, router, scrollTo]
  );

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {/* Cinematic Viewfinder Shutter Curtain */}
      <div
        ref={curtainRef}
        style={{ display: 'none' }}
        className="fixed inset-0 z-[9999] bg-[#070707] flex flex-col items-center justify-center select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle Ambient Film Lighting */}
        <div className="absolute inset-0 bg-radial-gradient from-white/[0.04] via-transparent to-transparent pointer-events-none" />

        {/* Cinematic Viewfinder Corner Framing Brackets */}
        <div className="corner-bracket corner-tl !top-8 !left-8 !w-5 !h-5 !border-white/40" />
        <div className="corner-bracket corner-tr !top-8 !right-8 !w-5 !h-5 !border-white/40" />
        <div className="corner-bracket corner-bl !bottom-8 !left-8 !w-5 !h-5 !border-white/40" />
        <div className="corner-bracket corner-br !bottom-8 !right-8 !w-5 !h-5 !border-white/40" />

        {/* Center Content Composition */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          {/* Top Label */}
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.35em] text-[#777777] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>FRAME® APERTURE // REEL TRANSITION</span>
          </div>

          {/* Brand Display */}
          <h2 className="font-sans-body font-black text-2xl sm:text-4xl text-[#F0F0ED] uppercase tracking-[0.22em] mb-4">
            {siteConfig.displayName}
          </h2>

          {/* Animated Scanning Hairline */}
          <div className="w-32 h-[1px] bg-white/20 relative overflow-hidden mb-4">
            <div className="w-12 h-full bg-white absolute top-0 left-0 animate-shimmer-sweep" />
          </div>

          {/* Bottom Telemetry */}
          <div className="font-mono-tech text-[9px] uppercase tracking-[0.25em] text-[#A1A1A1]">
            <span>REC [24.00 FPS] • 4K UHD SHORT-FORM ARCHIVE</span>
          </div>
        </div>
      </div>

      {children}
    </PageTransitionContext.Provider>
  );
}
