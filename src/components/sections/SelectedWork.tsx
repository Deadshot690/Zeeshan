'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import { ArrowRight, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Short-form content',
    'Ranking videos',
    'Promotional advertisements',
    'Motion graphics',
  ];

  const filteredProjects =
    selectedCategory === 'ALL'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    // Only enable horizontal pin scrolling on desktop screens >= 1024px
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion || !sectionRef.current || !horizontalTrackRef.current) {
      return;
    }

    const track = horizontalTrackRef.current;
    const totalScroll = track.scrollWidth - window.innerWidth + 200;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="relative w-full py-28 md:py-36 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Viewfinder Framing Marks */}
      <div className="corner-bracket corner-tl !top-8 !left-6 md:!left-12" />
      <div className="corner-bracket corner-tr !top-8 !right-6 md:!right-12" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span>SEC 04 // CURATED ARCHIVE</span>
              <span>INDEX: 01 – 03</span>
            </div>
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              SELECTED WORKS
            </h2>
          </div>
          <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm md:text-right">
            A collection of projects that reflect my editing style and storytelling.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono-tech text-[10px] uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#F0F0ED] text-[#080808] font-bold'
                  : 'border border-white/10 text-[#A1A1A1] hover:text-[#F0F0ED] hover:border-white/30 bg-white/[0.02]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Horizontal Track (>= 1024px) */}
      <div className="hidden lg:block w-full overflow-hidden">
        <div
          ref={horizontalTrackRef}
          className="flex items-center gap-12 px-12 pb-16 w-max"
        >
          {filteredProjects.map((project, idx) => (
            <div key={project.slug} className="w-[580px] flex-shrink-0">
              <ProjectCard project={project} priority={idx === 0} />
            </div>
          ))}

          {/* End of Gallery Callout Box */}
          <div className="w-[380px] h-[360px] flex-shrink-0 rounded-lg border border-dashed border-white/20 p-8 flex flex-col justify-between bg-white/[0.01]">
            <div>
              <span className="font-mono-tech text-xs text-[#777777] block mb-2">// COMMISSIONS</span>
              <h4 className="font-serif-editorial text-3xl text-[#F0F0ED] italic">
                Need high-retention video edits for your channel or brand?
              </h4>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#F0F0ED] hover:underline"
            >
              <span>START A CONVERSATION</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Grid (< 1024px) */}
      <div className="lg:hidden px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredProjects.map((project, idx) => (
          <div key={project.slug} className="w-full">
            <ProjectCard project={project} priority={idx === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
