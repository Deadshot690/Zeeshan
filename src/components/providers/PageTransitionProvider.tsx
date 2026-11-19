'use client';

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
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
  const pendingTargetRef = useRef<string | null>(null);

  // When pathname changes (new route has mounted), fade out the black curtain
  useEffect(() => {
    if (!isTransitioningRef.current || !curtainRef.current) return;

    const curtain = curtainRef.current;
    const target = pendingTargetRef.current;
    const hasHash = target?.includes('#');
    const hash = target?.split('#')[1];

    if (hasHash && hash) {
      setTimeout(() => scrollTo(`#${hash}`), 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Luxurious smooth fade from black to reveal newly mounted page (200ms)
    gsap.killTweensOf(curtain);
    gsap.to(curtain, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(curtain, { display: 'none', pointerEvents: 'none' });
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        pendingTargetRef.current = null;
      },
    });
  }, [pathname, scrollTo]);

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
      pendingTargetRef.current = url;
      soundManager.playClick();

      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(url);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Fast, luxury cinema black screen fade (dip to black)
      gsap.killTweensOf(curtain);
      gsap.set(curtain, { display: 'block', opacity: 0, pointerEvents: 'auto' });

      // Phase 01: Fast, cinematic fade to pure black (160ms)
      gsap.to(curtain, {
        opacity: 1,
        duration: 0.16,
        ease: 'power2.in',
        onComplete: () => {
          // Push route while completely black
          router.push(url);

          // Safety fallback: if pathname does not change (e.g. navigating to same route or stalled)
          setTimeout(() => {
            if (isTransitioningRef.current && curtainRef.current) {
              const target = pendingTargetRef.current;
              const hasHash = target?.includes('#');
              const hash = target?.split('#')[1];
              if (hasHash && hash) {
                scrollTo(`#${hash}`);
              }
              gsap.to(curtainRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                  if (curtainRef.current) {
                    gsap.set(curtainRef.current, { display: 'none', pointerEvents: 'none' });
                  }
                  isTransitioningRef.current = false;
                  setIsTransitioning(false);
                  pendingTargetRef.current = null;
                },
              });
            }
          }, 350);
        },
      });
    },
    [pathname, router, scrollTo]
  );

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {/* Luxury Minimalist Black Screen Fade Overlay */}
      <div
        ref={curtainRef}
        style={{ display: 'none', opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-[#080808] pointer-events-none select-none"
        aria-hidden="true"
      />

      {children}
    </PageTransitionContext.Provider>
  );
}
