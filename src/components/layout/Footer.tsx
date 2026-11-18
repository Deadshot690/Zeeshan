'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Compass } from 'lucide-react';
import { siteConfig } from '@/data/site';
import MagneticButton from '@/components/motion/MagneticButton';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // IST time string
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(istString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (target.startsWith('#')) {
      e.preventDefault();
      scrollTo(target);
    }
  };

  return (
    <footer className="w-full bg-[#080808] border-t border-white/[0.08] text-[#A1A1A1] relative z-20 py-16 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Footer Section: Large Brand Display & Back To Top */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-12 border-b border-white/[0.08]">
          <div>
            <span className="font-mono-tech text-[10px] text-[#777777] uppercase tracking-[0.25em] block mb-2">
              FRAME® // VIDEO EDITOR PORTFOLIO
            </span>
            <h3 className="font-sans-body font-black text-3xl sm:text-5xl md:text-6xl uppercase text-[#F0F0ED] tracking-tighter">
              {siteConfig.displayName}
            </h3>
            <p className="font-mono-tech text-xs text-[#777777] tracking-wider uppercase mt-1">
              {siteConfig.brandName} • {siteConfig.role}
            </p>
          </div>

          {/* Back-To-Top Interaction */}
          <MagneticButton
            onClick={() => scrollTo(0)}
            strength={0.3}
            dataCursor="TOP"
            className="p-4 rounded-full border border-white/10 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.08] transition-all flex items-center gap-3 text-xs font-mono-tech text-[#F0F0ED] uppercase tracking-wider group"
          >
            <span>BACK TO TOP</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <ArrowUp className="w-4 h-4 text-[#F0F0ED]" />
            </div>
          </MagneticButton>
        </div>

        {/* Middle Navigation & Information Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 font-mono-tech text-xs">
          {/* Col 1: Directory */}
          <div className="flex flex-col gap-3">
            <span className="text-[#777777] uppercase tracking-widest text-[10px]">DIRECTORY</span>
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, '#hero')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              HOME
            </a>
            <a
              href="#selected-work"
              onClick={(e) => handleLinkClick(e, '#selected-work')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              SELECTED WORK
            </a>
            <a
              href="#behind-the-edit"
              onClick={(e) => handleLinkClick(e, '#behind-the-edit')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              POST-PRODUCTION PROCESS
            </a>
            <a
              href="#capabilities"
              onClick={(e) => handleLinkClick(e, '#capabilities')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              CAPABILITIES
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, '#about')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              ABOUT THE EDITOR
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="hover:text-[#F0F0ED] transition-colors"
            >
              CONTACT
            </a>
          </div>

          {/* Col 2: Studio Location & Clock */}
          <div className="flex flex-col gap-3">
            <span className="text-[#777777] uppercase tracking-widest text-[10px]">STUDIO LOCATION</span>
            <span className="text-[#F0F0ED]">{siteConfig.location}</span>
            <span className="text-[#777777]">{siteConfig.coordinates}</span>
            <div className="mt-3 p-3 rounded border border-white/[0.06] bg-white/[0.01]">
              <span className="text-[10px] text-[#777777] block">LOCAL TIME (IST):</span>
              <span className="text-[#F0F0ED] font-bold text-sm tracking-widest">
                {currentTime || '14:28:14'} IST
              </span>
            </div>
          </div>

          {/* Col 3: Direct Inquiry */}
          <div className="flex flex-col gap-3">
            <span className="text-[#777777] uppercase tracking-widest text-[10px]">DIRECT INQUIRY</span>
            <a href={siteConfig.contact.emailHref} className="text-[#F0F0ED] hover:underline break-all">
              {siteConfig.contact.email}
            </a>
            <a href={siteConfig.contact.phoneHref} className="hover:text-[#F0F0ED] transition-colors">
              {siteConfig.contact.phone}
            </a>
            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline mt-1"
            >
              WhatsApp Messaging →
            </a>
          </div>

          {/* Col 4: Technical Specs */}
          <div className="flex flex-col gap-3">
            <span className="text-[#777777] uppercase tracking-widest text-[10px]">SYSTEM ARCHITECTURE</span>
            <span>NEXT.JS 16 • REACT 19</span>
            <span>THREE.JS • GSAP • LENIS</span>
            <span>ACES COLOR METRIC</span>
            <span className="text-[#777777] text-[10px] pt-2">
              DESIGN SOURCE: REFERENCE 01-12
            </span>
          </div>
        </div>

        {/* Bottom Legal & Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06] font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider">
          <div>
            <span>© 2026 {siteConfig.brandName}. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>PROJECT CODE: FRAME®</span>
            <span>MINIMAL LUXURY CINEMA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
