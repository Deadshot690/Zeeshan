'use client';

import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from '@/components/motion/Preloader';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Philosophy from '@/components/sections/Philosophy';
import Showreel from '@/components/sections/Showreel';
import BehindTheEdit from '@/components/sections/BehindTheEdit';
import Capabilities from '@/components/sections/Capabilities';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  };

  return (
    <>
      {/* 01. Preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* 02. Navigation Header */}
      <Navbar />

      {/* Main Single-Take Cinematic Experience */}
      <main className="relative w-full overflow-hidden bg-[#080808]">
        {/* Section 01: Interactive 3D Hero */}
        <Hero />

        {/* Section 02: Creative Philosophy / Kinetic Typography */}
        <Philosophy />

        {/* Section 03: Master Showreel */}
        <Showreel />

        {/* Section 04: Behind the Edit (Raw vs. Refined & NLE Timeline) */}
        <BehindTheEdit />

        {/* Section 05: Capabilities (Core Disciplines) */}
        <Capabilities />

        {/* Section 06: About the Editor */}
        <About />

        {/* Section 07: Contact Inquiries & Direct Triggers */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
