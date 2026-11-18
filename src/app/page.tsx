'use client';

import React, { useState } from 'react';
import Preloader from '@/components/motion/Preloader';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Philosophy from '@/components/sections/Philosophy';
import Showreel from '@/components/sections/Showreel';
import SelectedWork from '@/components/sections/SelectedWork';
import BehindTheEdit from '@/components/sections/BehindTheEdit';
import Capabilities from '@/components/sections/Capabilities';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {/* 01. Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* 02. Navigation Header */}
      <Navbar />

      {/* Main Single-Take Cinematic Experience */}
      <main className="relative w-full overflow-hidden bg-[#080808]">
        {/* 03. Interactive 3D Hero */}
        <Hero />

        {/* 04. Creative Philosophy / Kinetic Typography */}
        <Philosophy />

        {/* 05. Master Showreel */}
        <Showreel />

        {/* 06. Selected Works Archive Gallery */}
        <SelectedWork />

        {/* 07. Behind the Edit (Raw vs. Refined & NLE Timeline) */}
        <BehindTheEdit />

        {/* 08. Capabilities (6 Core Disciplines) */}
        <Capabilities />

        {/* 09. About the Editor */}
        <About />

        {/* 10. Contact Inquiries & Direct Triggers */}
        <Contact />
      </main>

      {/* 11. Footer */}
      <Footer />
    </>
  );
}
