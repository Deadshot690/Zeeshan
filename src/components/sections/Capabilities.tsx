'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { capabilities } from '@/data/site';
import { soundManager } from '@/lib/sound';

export default function Capabilities() {
  const [activeCapability, setActiveCapability] = useState<string>(capabilities[0]!.id);

  const activeItem = capabilities.find((c) => c.id === activeCapability) || capabilities[0]!;

  return (
    <section
      id="capabilities"
      className="relative w-full py-28 md:py-40 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span>SEC 06 // TECHNICAL EXPERTISE</span>
              <span>INDEX: 01 – {capabilities.length.toString().padStart(2, '0')}</span>
            </div>
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              CAPABILITIES.
            </h2>
          </div>
          <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm md:text-right">
            Editorial craftsmanship engineered for modern audience retention.
          </p>
        </div>

        {/* Editorial Index Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: 6 Disciplines Interactive List */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {capabilities.map((item) => {
              const isActive = item.id === activeCapability;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setActiveCapability(item.id);
                    soundManager.playHover();
                  }}
                  onClick={() => {
                    setActiveCapability(item.id);
                    soundManager.playClick();
                  }}
                  className={`group py-8 px-4 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    isActive ? 'bg-white/[0.03] pl-6' : 'hover:bg-white/[0.01]'
                  }`}
                  data-cursor="EXPAND"
                >
                  <div className="flex items-baseline gap-6">
                    <span
                      className={`font-mono-tech text-xs tracking-widest transition-colors ${
                        isActive ? 'text-[#F0F0ED] font-bold' : 'text-[#777777] group-hover:text-[#A1A1A1]'
                      }`}
                    >
                      {item.number}
                    </span>
                    <div>
                      <h3
                        className={`font-sans-body font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-tight transition-colors ${
                          isActive ? 'text-[#F0F0ED]' : 'text-[#777777] group-hover:text-[#F0F0ED]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="font-mono-tech text-xs text-[#777777] mt-1 tracking-wider uppercase hidden sm:block">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? 'border-white text-white bg-white/10 rotate-45'
                        : 'border-white/10 text-[#777777] group-hover:border-white/30 group-hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Panel for Selected Capability */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-lg border border-white/[0.1] bg-[#111111]/80 backdrop-blur-md flex flex-col justify-between self-start sticky top-28 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest mb-6 pb-4 border-b border-white/[0.08]">
                <span>DISCIPLINE SPECIFICATION</span>
                <span className="text-[#F0F0ED] font-bold">// {activeItem.number}</span>
              </div>

              <h4 className="font-serif-editorial text-3xl sm:text-4xl text-[#F0F0ED] italic mb-3 font-light">
                {activeItem.title}
              </h4>

              <p className="font-mono-tech text-xs text-[#A1A1A1] uppercase tracking-wider mb-6">
                {activeItem.subtitle}
              </p>

              <p className="font-sans-body text-sm sm:text-base text-[#A1A1A1] leading-relaxed mb-8 font-light">
                {activeItem.description}
              </p>

              {/* Deliverables List */}
              <div className="mb-8">
                <span className="font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest block mb-3">
                  DELIVERABLES & FORMATS
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeItem.deliverables.map((del) => (
                    <div
                      key={del}
                      className="flex items-center gap-2.5 font-mono-tech text-xs text-[#F0F0ED]"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400/80" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Software Stack for Discipline */}
            <div className="pt-6 border-t border-white/[0.08]">
              <span className="font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest block mb-2">
                CORE SOFTWARE
              </span>
              <div className="flex flex-wrap gap-2">
                {activeItem.software.map((sw) => (
                  <span
                    key={sw}
                    className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 font-mono-tech text-[10px] text-[#F0F0ED] uppercase tracking-wider"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
