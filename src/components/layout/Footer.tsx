'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowUpRight, Copy, Check, Radio, Volume2, Film, Sliders, Sparkles, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/site';
import MagneticButton from '@/components/motion/MagneticButton';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { soundManager } from '@/lib/sound';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const [copied, setCopied] = useState(false);
  const [smpteTimecode, setSmpteTimecode] = useState('00:00:00:00');
  const [localTime, setLocalTime] = useState('');

  // SMPTE 24fps live timecode & IST clock ticker
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      const now = new Date();
      // IST time string
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLocalTime(istString);

      // Frame counter 00-23 for 24fps SMPTE display
      frame = (frame + 1) % 24;
      const frameStr = frame.toString().padStart(2, '0');
      setSmpteTimecode(`${istString}:${frameStr}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.contact.email);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (target.startsWith('#')) {
      e.preventDefault();
      soundManager.playClick();
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        scrollTo(target);
      } else {
        window.location.href = `/${target}`;
      }
    }
  };

  const marqueeItems = useMemo(
    () => [
      'FRAME® EDITORIAL SUITE',
      '24FPS CINEMATIC MASTERING',
      'HIGH-RETENTION VIRAL HOOKS',
      'MILLISECOND SOUND DESIGN',
      '4K UHD 2160×3840 DELIVERY',
      'REC.709 & DCI-P3 COLOR SCIENCE',
      'ADOBE PREMIERE PRO • AFTER EFFECTS • CAPCUT',
      'AVAILABLE FOR COMMISSIONS & SPRINT EDITS',
    ],
    []
  );

  return (
    <footer className="w-full bg-[#060606] border-t border-white/[0.1] text-[#A1A1A1] relative z-20 overflow-hidden select-none">
      {/* 01. GOD-TIER KINETIC MARQUEE RIBBON */}
      <div className="w-full border-b border-white/[0.08] bg-black/60 py-3.5 overflow-hidden flex items-center relative">
        <div className="animate-marquee-infinite flex items-center gap-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 font-mono-tech text-xs tracking-[0.25em] text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="uppercase font-medium">{text}</span>
              <span className="text-white/20 font-light">//</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 flex flex-col gap-20">
        {/* 02. MONUMENTAL BRAND HEADER & BACK-TO-TOP */}
        <div className="relative flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 pb-16 border-b border-white/[0.08]">
          {/* Subtle Ambient Radial Lighting Glow behind the brand title */}
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] uppercase tracking-[0.3em] mb-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
                OPEN FOR COMMISSIONS
              </span>
              <span>•</span>
              <span>FRAME® POST-PRODUCTION</span>
            </div>

            <h2 className="font-sans-body font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-tighter text-[#F0F0ED] leading-none mb-4">
              <span className="bg-gradient-to-r from-white via-[#F0F0ED] to-white/40 bg-clip-text text-transparent">
                {siteConfig.displayName}
              </span>
            </h2>

            <p className="font-serif-editorial text-xl sm:text-2xl text-[#A1A1A1] italic font-light max-w-lg">
              Engineering high-retention short-form edits, cinematic montages, and viral pacing that stop the scroll.
            </p>
          </div>

          {/* Right Action: Studio Telemetry & Back-To-Top Button */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Live SMPTE Timecode & Equalizer HUD */}
            <div className="p-4 rounded-xl border border-white/[0.1] bg-[#0c0c0c]/80 backdrop-blur-md flex flex-col gap-2 font-mono-tech">
              <div className="flex items-center justify-between gap-4 text-[10px] text-[#777777] uppercase tracking-widest border-b border-white/[0.08] pb-2">
                <span className="flex items-center gap-1.5 text-white">
                  <Film className="w-3 h-3 text-emerald-400" />
                  <span>MASTER TIMECODE</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white">24.00 FPS</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm sm:text-base font-bold text-white tracking-[0.18em] font-mono-tech">
                  {smpteTimecode}
                </span>

                {/* Animated Audio Equalizer Bars */}
                <div className="flex items-end gap-1 h-4 w-7 pb-0.5" title="Stereo Master Audio Meter (-14 LUFS)">
                  <span className="w-1 bg-emerald-400 rounded-sm animate-eq-1" />
                  <span className="w-1 bg-emerald-400 rounded-sm animate-eq-2" />
                  <span className="w-1 bg-white/70 rounded-sm animate-eq-3" />
                  <span className="w-1 bg-emerald-400 rounded-sm animate-eq-4" />
                </div>
              </div>
            </div>

            {/* Magnetic Back-To-Top Interaction */}
            <MagneticButton
              onClick={() => {
                soundManager.playClick();
                scrollTo(0);
              }}
              strength={0.35}
              dataCursor="TOP"
              className="p-5 rounded-full border border-white/15 hover:border-white/60 bg-[#111111] hover:bg-white text-[#F0F0ED] hover:text-black transition-all duration-300 flex items-center gap-3 text-xs font-mono-tech uppercase tracking-wider group shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <span className="font-bold">RETURN TO TOP</span>
              <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <ArrowUp className="w-4 h-4" />
              </div>
            </MagneticButton>
          </div>
        </div>

        {/* 03. EDITORIAL INFORMATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 font-mono-tech text-xs">
          {/* Col 1: Directory */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[#777777] uppercase tracking-[0.25em] text-[10px] pb-1 border-b border-white/[0.06]">
              DIRECTORY // NAVIGATION
            </span>
            {[
              { label: 'HOME', href: '#hero' },
              { label: 'SELECTED WORKS', href: '#selected-work' },
              { label: 'SHOWREEL', href: '#showreel' },
              { label: 'CAPABILITIES', href: '#capabilities' },
              { label: 'ABOUT THE EDITOR', href: '#about' },
              { label: 'CONTACT & INQUIRIES', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="group flex items-center justify-between text-[#A1A1A1] hover:text-[#F0F0ED] hover:translate-x-1.5 transition-all duration-200"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Col 2: Studio Location & Real-Time Presence */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[#777777] uppercase tracking-[0.25em] text-[10px] pb-1 border-b border-white/[0.06]">
              STUDIO LOCATION & PRESENCE
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[#F0F0ED] font-bold text-sm tracking-wide">{siteConfig.location}</span>
              <span className="text-[#777777] text-[11px]">{siteConfig.coordinates}</span>
            </div>

            <div className="mt-2 p-3.5 rounded-lg border border-white/[0.08] bg-[#0f0f0f]">
              <div className="flex items-center justify-between text-[10px] text-[#777777] mb-1">
                <span>LOCAL TIME (IST):</span>
                <span className="text-emerald-400 font-semibold">UTC+5:30</span>
              </div>
              <span className="text-[#F0F0ED] font-bold text-base tracking-widest block font-mono-tech">
                {localTime || '00:00:00'} IST
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#777777]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>ACTIVE // 24-48H TURNAROUND</span>
            </div>
          </div>

          {/* Col 3: Direct Inquiry & Commissions */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[#777777] uppercase tracking-[0.25em] text-[10px] pb-1 border-b border-white/[0.06]">
              DIRECT INQUIRIES & COMMISSIONS
            </span>

            {/* Interactive Copy Email Box */}
            <div className="p-3.5 rounded-lg border border-white/[0.08] bg-[#0f0f0f] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] text-[#777777]">
                <span>OFFICIAL EMAIL</span>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1 hover:text-white transition-colors text-[10px] uppercase font-bold"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> COPIED!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> COPY
                    </span>
                  )}
                </button>
              </div>
              <a
                href={siteConfig.contact.emailHref}
                className="text-[#F0F0ED] hover:underline font-bold text-sm break-all"
              >
                {siteConfig.contact.email}
              </a>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500/50 hover:bg-emerald-950/40 transition-all font-bold"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>CHAT ON WHATSAPP</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={siteConfig.contact.phoneHref}
                className="text-[#777777] hover:text-[#F0F0ED] transition-colors text-[11px] pt-1"
              >
                Direct Phone: {siteConfig.contact.phone}
              </a>
            </div>
          </div>

          {/* Col 4: POST-PRODUCTION & MASTERING SPECS (Replaces System Architecture) */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[#777777] uppercase tracking-[0.25em] text-[10px] pb-1 border-b border-white/[0.06]">
              POST-PRODUCTION & MASTERING SPECS
            </span>

            <div className="flex flex-col gap-2 text-[11px] text-[#A1A1A1]">
              <div className="flex items-start gap-2">
                <span className="text-white/40 font-mono-tech">01</span>
                <div>
                  <span className="text-[#F0F0ED] font-bold block">NLE SUITE</span>
                  <span>Premiere Pro • After Effects • CapCut</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-white/40 font-mono-tech">02</span>
                <div>
                  <span className="text-[#F0F0ED] font-bold block">COLOR PIPELINE</span>
                  <span>Rec.709 D65 • ACEScc • DCI-P3 Commercial Looks</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-white/40 font-mono-tech">03</span>
                <div>
                  <span className="text-[#F0F0ED] font-bold block">AUDIO MASTERING</span>
                  <span>EBU R128 (-14 LUFS True Peak -1dBTP)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-white/40 font-mono-tech">04</span>
                <div>
                  <span className="text-[#F0F0ED] font-bold block">MASTER DELIVERY</span>
                  <span>4K 2160×3840 ProRes 422 HQ / FastStart H.264</span>
                </div>
              </div>
            </div>

            <div className="mt-1 pt-2 border-t border-white/[0.06] text-[10px] text-[#777777] uppercase flex items-center justify-between">
              <span>REVISIONS: FRAME-ACCURATE</span>
              <span className="text-emerald-400 font-bold">100% SPEC COMPLIANT</span>
            </div>
          </div>
        </div>

        {/* 04. BOTTOM LEGAL & COLOPHON STRIP */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.08] font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="text-[#F0F0ED] font-bold">© 2026 {siteConfig.displayName}</span>
            <span>//</span>
            <span>ALL EDITS & ASSETS RESERVED</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#777777]">
            <span className="hover:text-white transition-colors">ASPECT: 9:16 VERTICAL & 16:9 THEATRICAL</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">HIGH-RETENTION HOOK DELIVERY</span>
            <span>•</span>
            <span className="text-[#F0F0ED] font-semibold">MUMBAI // GLOBAL COMMISSIONS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
