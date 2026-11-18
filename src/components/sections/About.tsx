'use client';

import React from 'react';
import Image from 'next/image';
import { Briefcase, GraduationCap, Cpu, MapPin, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { soundManager } from '@/lib/sound';

const SOFTWARE_TOOLS = [
  {
    name: 'Adobe Premiere Pro',
    abbreviation: 'Pr',
    role: 'Multi-Track Assembly & Pacing',
    badge: 'PRIMARY NLE',
    experience: '4+ Years',
    color: '#9999FF',
    bgGradient: 'from-[#9999FF]/12 via-[#9999FF]/[0.02] to-transparent',
    borderColor: 'group-hover:border-[#9999FF]/60',
    shadowColor: 'group-hover:shadow-[0_12px_36px_rgba(153,153,255,0.2)]',
    accentText: 'text-[#9999FF]',
    accentBg: 'bg-[#9999FF]/10',
    logoType: 'pr' as const,
  },
  {
    name: 'Adobe After Effects',
    abbreviation: 'Ae',
    role: 'Motion Graphics & Visual Effects',
    badge: 'VFX & MOTION',
    experience: '4+ Years',
    color: '#D1A2F7',
    bgGradient: 'from-[#D1A2F7]/12 via-[#D1A2F7]/[0.02] to-transparent',
    borderColor: 'group-hover:border-[#D1A2F7]/60',
    shadowColor: 'group-hover:shadow-[0_12px_36px_rgba(209,162,247,0.2)]',
    accentText: 'text-[#D1A2F7]',
    accentBg: 'bg-[#D1A2F7]/10',
    logoType: 'ae' as const,
  },
  {
    name: 'CapCut',
    abbreviation: 'CC',
    role: 'High-Retention Short-Form & Viral Pacing',
    badge: 'VIRAL FORMATS',
    experience: '3+ Years',
    color: '#00F2EA',
    bgGradient: 'from-[#00F2EA]/12 via-[#00F2EA]/[0.02] to-transparent',
    borderColor: 'group-hover:border-[#00F2EA]/60',
    shadowColor: 'group-hover:shadow-[0_12px_36px_rgba(0,242,234,0.2)]',
    accentText: 'text-[#00F2EA]',
    accentBg: 'bg-[#00F2EA]/10',
    logoType: 'capcut' as const,
  },
];

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

            {/* Software Proficiency — Expanded High-Impact Interactive Showcase */}
            <div className="pt-8 border-t border-white/[0.08]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <span className="font-mono-tech text-xs tracking-widest text-[#A1A1A1] uppercase flex items-center gap-2 font-medium">
                  <Cpu className="w-4 h-4 text-[#F0F0ED] animate-pulse" />
                  <span>SOFTWARE PROFICIENCY</span>
                  <span className="text-[#444444]">//</span>
                  <span className="text-[#777777] text-[10px]">PRODUCTION TOOLKIT</span>
                </span>
                <span className="font-mono-tech text-[10px] text-emerald-400/90 tracking-widest uppercase flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  HARDWARE ACCELERATED
                </span>
              </div>

              {/* 3 Prominent Interactive Software Cards with Authentic Logos & Dynamic Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {SOFTWARE_TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={() => soundManager.playClick()}
                    className={`group relative p-4.5 sm:p-5 rounded-xl border border-white/[0.1] bg-[#0c0c0c] hover:bg-[#121212] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${tool.borderColor} ${tool.shadowColor} hover:-translate-y-1.5`}
                  >
                    {/* Ambient Radial Accent Glow on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${tool.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    />

                    {/* Corner Reticle */}
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-white/60 transition-colors pointer-events-none" />

                    {/* Top Row: Logo & Category Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                      {/* Authentic Tool Logo Badge */}
                      {tool.logoType === 'pr' && (
                        <div className="relative w-12 h-12 rounded-xl bg-[#00005B] border border-[#9999FF]/60 flex items-center justify-center shadow-[0_0_18px_rgba(153,153,255,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_26px_rgba(153,153,255,0.55)] transition-all duration-300 flex-shrink-0">
                          <span className="font-sans-body font-black text-2xl text-[#9999FF] tracking-tighter leading-none select-none">
                            Pr
                          </span>
                        </div>
                      )}
                      {tool.logoType === 'ae' && (
                        <div className="relative w-12 h-12 rounded-xl bg-[#00005B] border border-[#D1A2F7]/60 flex items-center justify-center shadow-[0_0_18px_rgba(209,162,247,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_26px_rgba(209,162,247,0.55)] transition-all duration-300 flex-shrink-0">
                          <span className="font-sans-body font-black text-2xl text-[#D1A2F7] tracking-tighter leading-none select-none">
                            Ae
                          </span>
                        </div>
                      )}
                      {tool.logoType === 'capcut' && (
                        <div className="relative w-12 h-12 rounded-xl bg-[#070707] border border-[#00F2EA]/60 flex items-center justify-center shadow-[0_0_18px_rgba(0,242,234,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_26px_rgba(0,242,234,0.55)] transition-all duration-300 flex-shrink-0">
                          <svg
                            className="w-7 h-7 text-[#00F2EA] group-hover:scale-105 transition-transform duration-300"
                            viewBox="0 0 25 24"
                            fill="currentColor"
                          >
                            <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" />
                          </svg>
                        </div>
                      )}

                      <span
                        className={`font-mono-tech text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 ${tool.accentBg} ${tool.accentText}`}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    {/* Tool Name & Specialty Role */}
                    <div className="relative z-10 flex flex-col gap-1">
                      <h4 className="font-sans-body font-bold text-sm sm:text-base text-[#F0F0ED] uppercase tracking-tight group-hover:text-white transition-colors">
                        {tool.name}
                      </h4>
                      <p className="font-mono-tech text-[11px] text-[#A1A1A1] leading-snug tracking-normal">
                        {tool.role}
                      </p>
                    </div>

                    {/* Bottom Status / Experience Footer */}
                    <div className="relative z-10 mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between font-mono-tech text-[10px] text-[#777777]">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                      <span className="text-[#A1A1A1] font-medium">{tool.experience}</span>
                    </div>

                    {/* Moving Sheen Line Animation on Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                      <div className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>
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
