'use client';

import React from 'react';
import Image from 'next/image';
import { Briefcase, GraduationCap, Cpu, MapPin, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/data/site';

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full py-28 md:py-44 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span>SEC 06 // BIOGRAPHY & PROFILE</span>
              <span>INDEX: PERS // ZEESHAN</span>
            </div>
            {/* Main Header: ABOUT */}
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              ABOUT
            </h2>
          </div>
          <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm md:text-right">
            {siteConfig.location}
          </p>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Bio, Experience & Education */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              {/* Telemetry Location & Coordinates Header */}
              <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-[#777777] uppercase tracking-widest mb-3">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <MapPin className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>MUMBAI, MAHARASHTRA, INDIA</span>
                <span className="text-[#444444]">//</span>
                <span className="text-[#888888]">{siteConfig.coordinates}</span>
              </div>

              {/* Elevated Modern Editorial Brand Name with Metallic Shimmer Sheen */}
              <div className="group relative inline-block mb-3">
                <h3 className="font-sans-body font-black text-2xl sm:text-3xl md:text-[2.35rem] lg:text-[2.65rem] tracking-tight uppercase leading-[1.08] select-none">
                  <span className="animate-shimmer-sweep inline-block font-black tracking-tight">
                    {siteConfig.brandName}
                  </span>
                </h3>
                {/* Dynamic Specular Hover Underline Accent */}
                <div className="h-[2px] w-14 bg-gradient-to-r from-white via-white/60 to-transparent rounded-full group-hover:w-full transition-all duration-500 ease-out mt-1.5" />
              </div>

              {/* Role Indicator with Pulsing Accent */}
              <div className="flex items-center gap-2 font-mono-tech text-xs tracking-[0.2em] uppercase text-[#A1A1A1]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span>{siteConfig.role}</span>
              </div>
            </div>

            {/* Verbatim About Copy */}
            <div className="flex flex-col gap-5 text-[#A1A1A1] font-sans-body text-base sm:text-lg leading-relaxed font-light">
              <p>
                I&apos;m a creative video editor with over four years of freelance experience, specializing in short-form content, YouTube videos, ranking videos and promotional advertisements.
              </p>
              <p>
                I enjoy transforming concepts into engaging visual stories through precise editing, effective pacing, sound design and creative transitions.
              </p>
              <p>
                My focus is on creating content that captures attention, communicates clearly and keeps audiences engaged.
              </p>
            </div>

            {/* Experience & Education Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/[0.08]">
              {/* Experience */}
              <div className="p-6 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2 font-mono-tech text-xs text-[#777777] uppercase tracking-wider mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#F0F0ED]" />
                  <span>EXPERIENCE</span>
                </div>
                <h4 className="font-sans-body font-bold text-base text-[#F0F0ED] uppercase">
                  {siteConfig.experience.role}
                </h4>
                <p className="font-mono-tech text-xs text-[#A1A1A1] mt-1">
                  {siteConfig.experience.period}
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.06] font-mono-tech text-[10px] text-[#777777] leading-relaxed">
                  Specialized in viral content formats, ranking videos, and client promotional edits.
                </div>
              </div>

              {/* Education */}
              <div className="p-6 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2 font-mono-tech text-xs text-[#777777] uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#F0F0ED]" />
                  <span>EDUCATION</span>
                </div>
                <h4 className="font-sans-body font-bold text-sm text-[#F0F0ED] uppercase leading-snug">
                  {siteConfig.education.degree}
                </h4>
                <p className="font-sans-body text-xs text-[#A1A1A1] mt-1">
                  {siteConfig.education.institution}
                </p>
                <p className="font-mono-tech text-[10px] text-[#777777] mt-0.5">
                  {siteConfig.education.location} • {siteConfig.education.status}
                </p>
              </div>
            </div>

            {/* Software Proficiency */}
            <div>
              <span className="font-mono-tech text-xs tracking-widest text-[#777777] uppercase block mb-3 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>SOFTWARE PROFICIENCY</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {siteConfig.software.map((sw) => (
                  <div
                    key={sw}
                    className="px-4 py-2 rounded border border-white/10 bg-white/[0.03] font-mono-tech text-xs tracking-wider uppercase text-[#F0F0ED] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
                    <span>{sw}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Monochrome Portrait Box */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative w-full aspect-[4/5] rounded-lg border border-white/[0.12] bg-[#111111] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              {/* Corner Viewfinder Reticles */}
              <div className="corner-bracket corner-tl !top-3 !left-3" />
              <div className="corner-bracket corner-tr !top-3 !right-3" />
              <div className="corner-bracket corner-bl !bottom-3 !left-3" />
              <div className="corner-bracket corner-br !bottom-3 !right-3" />

              {/* Authentic Editorial Portrait of Zeeshan (Balanced framing: hair preserved, face centered) */}
              <Image
                src="/assets/branding/zeeshan.jpg"
                alt="Zeeshan Rafik Shaikh Portrait"
                fill
                priority
                className="object-cover object-[center_40%] filter grayscale contrast-[1.25] brightness-[0.95] group-hover:scale-105 group-hover:contrast-[1.3] transition-all duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 40vw"
              />

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Telemetry HUD on Portrait */}
              <div className="absolute bottom-6 left-6 right-6 font-mono-tech text-[10px] text-[#A1A1A1] uppercase tracking-wider flex justify-between items-end pointer-events-none">
                <div>
                  <span className="block text-[#F0F0ED] font-bold text-xs">
                    {siteConfig.displayName}
                  </span>
                  <span className="text-[#777777]">MUMBAI, IN</span>
                </div>
                <div className="text-right">
                  <span className="block text-[#F0F0ED]">4+ YEARS</span>
                  <span className="text-[#777777]">POST-PRODUCTION</span>
                </div>
              </div>
            </div>

            <p className="font-mono-tech text-[10px] text-[#777777] tracking-wider uppercase text-center">
              * Monochromatic editorial visual representation. Actual identity and facts strictly adhered to.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
