'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MessageSquare, ArrowUpRight, Copy, Check } from 'lucide-react';
import { siteConfig } from '@/data/site';
import MagneticButton from '@/components/motion/MagneticButton';
import { soundManager } from '@/lib/sound';

export default function Contact() {
  const [copied, setCopied] = React.useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.contact.email);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-32 md:py-48 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Fleava-inspired Atmospheric Organic Dark Fluid Backdrop (Reference 01) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/textures/media_1794989629083_8c5fd7c9.jpg"
          alt="Atmospheric Dark Fluid Environment"
          fill
          className="object-cover filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Index Header */}
        <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-16 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <span>SEC 08 // COLLABORATION & INQUIRIES</span>
            <span className="text-[#A1A1A1]">LET&apos;S TALK</span>
          </div>
          <div>
            <span>[ OPEN FOR SELECT COMMISSIONS ]</span>
          </div>
        </div>

        {/* Dramatic Closing Headlines */}
        <div className="max-w-5xl mb-20">
          <h2 className="font-sans-body font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight uppercase text-[#F0F0ED] leading-[0.95]">
            <span className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] italic font-light text-[#A1A1A1] block mb-2">
              HAVE A STORY
            </span>
            <span>TO TELL?</span>
          </h2>

          <p className="mt-6 font-serif-editorial text-2xl sm:text-4xl text-[#F0F0ED] italic font-light">
            LET&apos;S MAKE SOMETHING UNFORGETTABLE.
          </p>
        </div>

        {/* Functional Contact Triggers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Email Trigger */}
          <div className="group p-8 rounded-lg border border-white/[0.1] bg-[#111111]/70 backdrop-blur-md hover:border-white/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-xs text-[#777777] mb-6">
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#F0F0ED]" />
                  <span>DIRECT EMAIL</span>
                </span>
                <button
                  onClick={copyEmail}
                  className="p-1 hover:text-[#F0F0ED] transition-colors"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <a
                href={siteConfig.contact.emailHref}
                className="font-sans-body font-bold text-lg sm:text-xl text-[#F0F0ED] group-hover:text-white transition-colors block break-all"
              >
                {siteConfig.contact.email}
              </a>
            </div>

            <a
              href={siteConfig.contact.emailHref}
              className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono-tech text-xs uppercase tracking-wider text-[#A1A1A1] group-hover:text-[#F0F0ED] transition-colors"
            >
              <span>SEND AN EMAIL</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* WhatsApp Trigger */}
          <div className="group p-8 rounded-lg border border-white/[0.1] bg-[#111111]/70 backdrop-blur-md hover:border-white/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-xs text-[#777777] mb-6">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FAST TRACK CHAT</span>
                </span>
                <span className="text-[10px] text-emerald-400/80">ONLINE</span>
              </div>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans-body font-bold text-lg sm:text-xl text-[#F0F0ED] group-hover:text-white transition-colors block"
              >
                WhatsApp Message
              </a>
              <span className="font-mono-tech text-xs text-[#777777] block mt-1">
                {siteConfig.contact.phone}
              </span>
            </div>

            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono-tech text-xs uppercase tracking-wider text-[#A1A1A1] group-hover:text-emerald-300 transition-colors"
            >
              <span>OPEN WHATSAPP CHAT</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Direct Phone Trigger */}
          <div className="group p-8 rounded-lg border border-white/[0.1] bg-[#111111]/70 backdrop-blur-md hover:border-white/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-xs text-[#777777] mb-6">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F0F0ED]" />
                  <span>VOICE CALL</span>
                </span>
                <span className="text-[10px] text-[#A1A1A1]">IST (UTC+5:30)</span>
              </div>
              <a
                href={siteConfig.contact.phoneHref}
                className="font-sans-body font-bold text-lg sm:text-xl text-[#F0F0ED] group-hover:text-white transition-colors block"
              >
                {siteConfig.contact.phone}
              </a>
              <span className="font-mono-tech text-xs text-[#777777] block mt-1">
                Mumbai, Maharashtra, India
              </span>
            </div>

            <a
              href={siteConfig.contact.phoneHref}
              className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono-tech text-xs uppercase tracking-wider text-[#A1A1A1] group-hover:text-[#F0F0ED] transition-colors"
            >
              <span>CALL NOW</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Closing Telemetry Notice */}
        <div className="p-6 rounded border border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-[#777777]">
          <span>LOCATION: MUMBAI, MAHARASHTRA, INDIA [19.0760° N, 72.8777° E]</span>
          <span className="text-[#A1A1A1]">NO UNAUTHORIZED SOCIAL PROFILES INVENTED</span>
        </div>
      </div>
    </section>
  );
}
