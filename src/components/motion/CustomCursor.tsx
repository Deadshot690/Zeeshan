'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        const clickable = (e.target as HTMLElement).closest('a, button, [role="button"], input, select');
        if (clickable) {
          setIsHovered(true);
          setCursorText('');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Follower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      >
        <motion.div
          animate={{
            width: cursorText ? 90 : isHovered ? 48 : 28,
            height: cursorText ? 90 : isHovered ? 48 : 28,
            backgroundColor: cursorText
              ? 'rgba(240, 240, 237, 0.95)'
              : isHovered
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(240, 240, 237, 0)',
            borderColor: cursorText
              ? 'rgba(240, 240, 237, 0)'
              : isHovered
              ? 'rgba(240, 240, 237, 0.6)'
              : 'rgba(240, 240, 237, 0.3)',
            backdropFilter: isHovered && !cursorText ? 'blur(2px)' : 'none',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="rounded-full border flex items-center justify-center p-2 text-center"
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[#080808] font-mono-tech text-[9px] font-bold tracking-widest uppercase leading-tight select-none"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Center Dot (hidden when label is visible) */}
      {!cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0F0ED]"
          style={{
            x: mouseX,
            y: mouseY,
          }}
          animate={{
            scale: isHovered ? 0 : 1,
            opacity: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      )}
    </>
  );
}
