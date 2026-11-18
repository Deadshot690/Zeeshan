'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const scaleText = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.92, 1, 0.96]);

  const pillars = [
    {
      num: '01',
      title: 'AUDIENCE RETENTION ARCHITECTURE',
      desc: 'Short-form mastery is engineered in the first 3 seconds. Pacing is calibrated to prevent cognitive drop-off and maximize loop completion.',
    },
    {
      num: '02',
      title: 'SONIC PRECISION & RHYTHM',
      desc: 'Sound is 50% of the visual cut. Every hit, sweep, riser, and ambient texture is locked to the emotional cadence of the narrative.',
    },
    {
      num: '03',
      title: 'VISUAL DYNAMICS & PATTERN INTERRUPTS',
      desc: 'Strategic motion graphics, frame re-timing, and seamless transitions disrupt passive scrolling into deliberate viewing.',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative w-full py-32 md:py-48 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Background Kinetic Grid Image from Reference 03 (Wireframe FLOW typography) */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute inset-0 pointer-events-none opacity-[0.07] flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/assets/textures/media_1794989648708_c64c8fec.jpg"
          alt="Kinetic Typography Flow Grid"
          fill
          className="object-cover filter contrast-150"
        />
      </motion.div>

      {/* Viewfinder Framing Marks */}
      <div className="corner-bracket corner-tl !top-12 !left-6 md:!left-12" />
      <div className="corner-bracket corner-tr !top-12 !right-6 md:!right-12" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Index Header */}
        <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-16 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <span>SEC 02 // CREATIVE MANIFESTO</span>
            <span className="text-[#A1A1A1]">R517_FLOW</span>
          </div>
          <div>
            <span>[ INTENTIONAL MOTION ]</span>
          </div>
        </div>

        {/* Dramatic Oversized Editorial Statement */}
        <motion.div style={{ scale: scaleText }} className="max-w-5xl my-12">
          <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-[-0.035em] uppercase text-[#F0F0ED] leading-[0.94]">
            <span className="block text-[#777777] font-serif-editorial italic font-light tracking-normal text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem] mb-2">
              WE DON&apos;T JUST
            </span>
            <span className="block text-[#F0F0ED]">
              EDIT VIDEOS.
            </span>
            <span className="block text-[#A1A1A1] font-serif-editorial italic font-light tracking-normal text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem] my-2">
              WE CREATE
            </span>
            <span className="block text-[#F0F0ED]">
              EXPERIENCES.
            </span>
          </h2>
        </motion.div>

        {/* Supporting Editorial Paragraph */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-20">
          <div className="md:col-span-5">
            <p className="font-mono-tech text-xs tracking-[0.2em] uppercase text-[#A1A1A1] leading-relaxed">
              Every cut is a conscious decision. Every frame either advances retention or costs attention.
            </p>
          </div>
          <div className="md:col-span-7">
            <p className="font-sans-body text-base sm:text-lg md:text-xl text-[#A1A1A1] leading-relaxed font-light">
              Transforming raw footage into high-retention stories requires more than fast cuts—it demands psychological precision, narrative structure, and sonic depth that keeps audiences locked in from the opening frame to the final call to action.
            </p>
          </div>
        </div>

        {/* Three Editorial Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/[0.08]">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="group p-6 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono-tech text-xs text-[#777777] group-hover:text-[#F0F0ED] transition-colors block mb-4">
                  // {pillar.num}
                </span>
                <h3 className="font-sans-body font-bold text-sm tracking-[0.15em] text-[#F0F0ED] uppercase mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans-body text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono-tech text-[9px] text-[#777777]">
                <span>FRAME® SYSTEM</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
