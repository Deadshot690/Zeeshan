'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '@/data/site';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasSeen = sessionStorage.getItem('frame_has_loaded');
    const targetDuration = hasSeen ? 1000 : 2000;
    const intervalTime = 25;
    const increment = 100 / (targetDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem('frame_has_loaded', 'true');
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] bg-[#080808] flex flex-col items-center justify-between p-8 sm:p-14 select-none"
        >
          {/* Subtle Ambient Chrome Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="w-[600px] h-[300px] bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-transparent rounded-full blur-[120px] -rotate-12" />
          </div>

          {/* Corner Framing Brackets */}
          <div className="corner-bracket corner-tl !top-8 !left-8 !w-5 !h-5" />
          <div className="corner-bracket corner-tr !top-8 !right-8 !w-5 !h-5" />
          <div className="corner-bracket corner-bl !bottom-8 !left-8 !w-5 !h-5" />
          <div className="corner-bracket corner-br !bottom-8 !right-8 !w-5 !h-5" />

          {/* Top Metadata Header */}
          <div className="w-full flex justify-between items-center font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase z-10">
            <span>SYS // BOOT_SEQUENCE</span>
            <span>TC 00:00:00:00</span>
          </div>

          {/* Center Brand & Progress Line */}
          <div className="flex flex-col items-center max-w-lg w-full z-10 text-center">
            {/* Monospace Percentage Counter (Inspired by Ref 09: counter '77') */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono-tech text-6xl sm:text-7xl font-light text-[#F0F0ED] tracking-tight mb-6"
            >
              {Math.round(progress).toString().padStart(2, '0')}
            </motion.div>

            {/* Fine Horizontal Progress Line */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-8">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#F0F0ED]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Brand Typography Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center gap-1.5"
            >
              <h1 className="font-sans-body font-bold text-sm sm:text-base tracking-[0.35em] text-[#F0F0ED] uppercase">
                {siteConfig.displayName}
              </h1>
              <p className="font-mono-tech text-[10px] tracking-[0.25em] text-[#777777] uppercase">
                {siteConfig.role}
              </p>
            </motion.div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="w-full flex justify-between items-center font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase z-10">
            <span>MUMBAI // 19.0760° N, 72.8777° E</span>
            <span>FRAME® CINEMATIC SUITE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
