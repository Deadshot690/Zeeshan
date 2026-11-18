'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sliders } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface BeforeAfterProps {
  imageSrc?: string;
  className?: string;
}

export default function BeforeAfter({
  imageSrc = '/assets/textures/media_1794989658544_b17167fa.jpg',
  className = '',
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
      setSliderPosition(percent);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
      soundManager.playClick();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
      soundManager.playClick();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => {
        setIsDragging(true);
        soundManager.playClick();
      }}
      onMouseUp={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      tabIndex={0}
      role="slider"
      aria-label="Comparison slider between Raw Log footage and Refined Grade"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      onKeyDown={handleKeyDown}
      className={`relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg border border-white/[0.12] bg-[#111111] overflow-hidden select-none cursor-ew-resize group focus:outline-none focus:ring-1 focus:ring-white/40 ${className}`}
      data-cursor="DRAG"
    >
      {/* Corner Viewfinder Reticles */}
      <div className="corner-bracket corner-tl !top-3 !left-3" />
      <div className="corner-bracket corner-tr !top-3 !right-3" />
      <div className="corner-bracket corner-bl !bottom-3 !left-3" />
      <div className="corner-bracket corner-br !bottom-3 !right-3" />

      {/* REFINED (Right Side / Full Base Image with rich grading) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt="Refined Graded Footage Master"
          fill
          className="object-cover filter contrast-125 saturate-125 brightness-105"
        />
        <div className="absolute top-4 right-6 z-10 px-3 py-1 rounded bg-[#080808]/80 backdrop-blur-md border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-[#F0F0ED]">
          REFINED // 35MM MASTER GRADE
        </div>
      </div>

      {/* RAW (Left Side / Clipped Image with flat Log-C emulation) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
          <Image
            src={imageSrc}
            alt="Raw Log-C Flat Sensor Capture"
            fill
            className="object-cover filter saturate-[0.25] contrast-[0.75] brightness-90"
          />
          <div className="absolute top-4 left-6 z-10 px-3 py-1 rounded bg-[#080808]/80 backdrop-blur-md border border-white/10 font-mono-tech text-[10px] uppercase tracking-widest text-[#A1A1A1]">
            RAW // LOG-C SENSOR FLAT
          </div>
        </div>
      </div>

      {/* Draggable Divider Line & Knob */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#080808] border border-white/60 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <Sliders className="w-4 h-4 text-[#F0F0ED]" />
        </div>
      </div>

      {/* Bottom Telemetry Cue */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between font-mono-tech text-[9px] text-[#A1A1A1] uppercase tracking-wider pointer-events-none">
        <span>← DRAG TO REVEAL SENSOR CONTRAST →</span>
        <span>ACES COLOR PIPELINE</span>
      </div>
    </div>
  );
}
