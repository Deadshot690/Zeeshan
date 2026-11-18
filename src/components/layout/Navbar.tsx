'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/data/site';
import SoundToggle from '@/components/ui/SoundToggle';
import MagneticButton from '@/components/motion/MagneticButton';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (target.startsWith('#')) {
      e.preventDefault();
      scrollTo(target);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'SHOWREEL', href: '#showreel' },
    { label: 'PROCESS', href: '#behind-the-edit' },
    { label: 'CAPABILITIES', href: '#capabilities' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#080808]/85 backdrop-blur-md border-b border-white/[0.08]'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Monogram */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-8 h-8 rounded border border-white/20 flex items-center justify-center bg-white/[0.03] group-hover:border-white/60 transition-colors">
              <span className="font-mono-tech text-xs font-bold text-[#F0F0ED]">Z</span>
              <div className="corner-bracket corner-tl !w-1.5 !h-1.5" />
              <div className="corner-bracket corner-br !w-1.5 !h-1.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans-body font-bold text-xs tracking-[0.2em] uppercase text-[#F0F0ED]">
                {siteConfig.displayName}
              </span>
              <span className="font-mono-tech text-[9px] text-[#777777] tracking-widest uppercase">
                FRAME® // SHORT-FORM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <MagneticButton key={link.label} strength={0.25} dataCursor="NAV">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-mono-tech text-xs tracking-[0.2em] uppercase text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors py-1 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#F0F0ED] group-hover:w-full transition-all duration-300" />
                </a>
              </MagneticButton>
            ))}
          </nav>

          {/* Right Controls: Location Telemetry, Sound Toggle, CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right font-mono-tech text-[9px] text-[#777777] tracking-wider">
              <span>MUMBAI, IN</span>
              <span className="text-[#A1A1A1]">19.0760° N, 72.8777° E</span>
            </div>

            <SoundToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F0F0ED] hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808] flex flex-col justify-between p-8 pt-28 md:hidden">
          <div className="flex flex-col gap-6">
            <span className="font-mono-tech text-[10px] tracking-widest text-[#777777] uppercase border-b border-white/10 pb-2">
              NAVIGATION // DIRECTORY
            </span>
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-serif-editorial text-4xl text-[#F0F0ED] hover:text-[#A1A1A1] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="font-mono-tech text-xs text-[#777777]">0{idx + 1}</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-2 font-mono-tech text-xs text-[#777777]">
            <span className="text-[#A1A1A1]">{siteConfig.brandName}</span>
            <span>{siteConfig.location}</span>
            <a href={siteConfig.contact.emailHref} className="text-[#F0F0ED] underline pt-2">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
