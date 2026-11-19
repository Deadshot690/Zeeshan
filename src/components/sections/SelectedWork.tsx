'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ui/ProjectCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const { refresh } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Video Editing',
    'Motion Graphics',
    'Color Grading',
    'Visual Effects',
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

    const section = sectionRef.current;
    const track = horizontalTrackRef.current;

    // Small delay to ensure all DOM elements and images have stabilized
    const timer = setTimeout(() => {
      const totalScroll = track.scrollWidth - window.innerWidth + 160;

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.2,
            start: 'top top',
            end: () => `+=${Math.max(totalScroll, 600)}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              const percent = Math.round(self.progress * 100);
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${percent}%`;
              }
              if (percentTextRef.current) {
                percentTextRef.current.textContent = `${percent}%`;
              }
            },
          },
        });
      }, section);

      ScrollTrigger.refresh();

      return () => {
        ctx.revert();
      };
    }, 60);

    return () => {
      clearTimeout(timer);
    };
  }, [filteredProjects]);

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="relative z-20 w-full py-20 lg:py-24 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      {/* Viewfinder Framing Marks */}
      <div className="corner-bracket corner-tl !top-8 !left-6 md:!left-12" />
      <div className="corner-bracket corner-tr !top-8 !right-6 md:!right-12" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span>SEC 04 // CURATED ARCHIVE</span>
              <span>INDEX: 01 – {filteredProjects.length.toString().padStart(2, '0')}</span>
            </div>
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              SELECTED WORKS
            </h2>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm md:text-right">
              A collection of projects that reflect my editing style and storytelling.
            </p>
            {/* Desktop Horizontal Scroll Progress Indicator */}
            <div className="hidden lg:flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest mt-1">
              <span>GALLERY SCRUB</span>
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#F0F0ED] transition-all duration-150"
                  style={{ width: '0%' }}
                />
              </div>
              <span ref={percentTextRef} className="text-[#F0F0ED]">0%</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono-tech text-[10px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#F0F0ED] text-[#080808] font-bold shadow-[0_0_20px_rgba(240,240,237,0.2)]'
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
          className="flex items-start gap-12 px-12 pb-12 w-max"
        >
          {filteredProjects.map((project, idx) => (
            <div key={project.slug} className="w-[580px] xl:w-[620px] flex-shrink-0">
              <ProjectCard project={project} priority={idx === 0} />
            </div>
          ))}

          {/* End of Gallery Callout Box */}
          <div className="w-[400px] h-[380px] flex-shrink-0 rounded-lg border border-dashed border-white/20 p-8 flex flex-col justify-between bg-white/[0.015] hover:border-white/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#777777] uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>OPEN FOR COMMISSIONS</span>
              </div>
              <h4 className="font-serif-editorial text-3xl text-[#F0F0ED] italic leading-tight">
                Need high-retention video edits for your channel or brand?
              </h4>
              <p className="font-sans-body text-xs text-[#777777] mt-3 leading-relaxed">
                Specialized in fast-paced short-form content, viral ranking videos, and cinematic promos.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-[#F0F0ED] hover:text-white group"
            >
              <span className="group-hover:underline">START A CONVERSATION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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