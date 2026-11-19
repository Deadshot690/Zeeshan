import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Play, Sliders, Cpu, Film, Layers, CheckCircle2 } from 'lucide-react';
import { projects, getProjectBySlug, getAdjacentProjects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import MagneticButton from '@/components/motion/MagneticButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryVideoShowcase from '@/components/ui/CategoryVideoShowcase';
import TransitionLink from '@/components/ui/TransitionLink';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F0F0ED] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex-grow">
        {/* Navigation Back Link */}
        <div className="mb-10">
          <TransitionLink
            href="/#selected-work"
            className="inline-flex items-center gap-2 font-mono-tech text-xs tracking-[0.2em] uppercase text-[#A1A1A1] hover:text-[#F0F0ED] transition-colors py-2 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO SELECTED WORK</span>
          </TransitionLink>
        </div>

        {/* Project Header Info */}
        <div className="border-b border-white/[0.1] pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-4 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-4">
            <span className="text-[#F0F0ED] font-bold">{project.identifier}</span>
            <span>//</span>
            <span>{project.category}</span>
            {project.year && (
              <>
                <span>//</span>
                <span>YEAR: {project.year}</span>
              </>
            )}
            <span>//</span>
            <span>EDITOR: {siteConfig.displayName}</span>
          </div>

          <h1 className="font-sans-body font-black text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight text-[#F0F0ED] max-w-5xl leading-[1.05]">
            {project.title}
          </h1>

          <p className="mt-6 font-serif-editorial text-2xl sm:text-3xl text-[#A1A1A1] italic font-light max-w-3xl">
            {project.tagline}
          </p>
        </div>

        {/* Category Video Showcase: Screening Theater & Catalog of All Videos */}
        <div className="mb-20">
          <CategoryVideoShowcase
            items={project.items || []}
            categoryTitle={project.category}
          />
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-white/[0.1] pb-16 mb-16">
          {/* Left Column: Project Overview & Contribution */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div>
              <h2 className="font-mono-tech text-xs tracking-[0.25em] text-[#777777] uppercase mb-4 flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>CATEGORY NARRATIVE & CONTEXT</span>
              </h2>
              <p className="font-sans-body text-base sm:text-lg text-[#A1A1A1] leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            <div>
              <h2 className="font-mono-tech text-xs tracking-[0.25em] text-[#777777] uppercase mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>EDITING DIRECTION & POST-PRODUCTION</span>
              </h2>
              <p className="font-sans-body text-base sm:text-lg text-[#A1A1A1] leading-relaxed font-light">
                {project.editingContribution}
              </p>
            </div>

            <div>
              <h2 className="font-mono-tech text-xs tracking-[0.25em] text-[#777777] uppercase mb-4 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>TECHNIQUES & EDITORIAL CRAFT</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.specs.techniques.map((tech) => (
                  <div
                    key={tech}
                    className="p-3.5 rounded border border-white/[0.08] bg-white/[0.02] flex items-center gap-3 font-mono-tech text-xs text-[#F0F0ED]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Technical Telemetry & Software */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:border-l lg:border-white/[0.08] lg:pl-10">
            <div>
              <h3 className="font-mono-tech text-xs tracking-[0.25em] text-[#777777] uppercase mb-4 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#F0F0ED]" />
                <span>SOFTWARE SUITE</span>
              </h3>
              <div className="flex flex-col gap-2">
                {project.specs.software.map((sw) => (
                  <div
                    key={sw}
                    className="p-3 rounded border border-white/10 bg-white/[0.03] font-mono-tech text-xs uppercase tracking-wider text-[#F0F0ED]"
                  >
                    {sw}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-4 font-mono-tech text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-[#777777]">RESOLUTION</span>
                <span className="text-[#F0F0ED]">{project.specs.resolution || '1080p / 4K UHD'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-[#777777]">COLOR SPACE</span>
                <span className="text-[#F0F0ED]">{project.specs.colorSpace || 'Rec.709'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-[#777777]">AUDIO MASTER</span>
                <span className="text-[#F0F0ED]">{project.specs.audioMix || 'Stereo -14 LUFS'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-[#777777]">TIMELINE TRACKS</span>
                <span className="text-[#F0F0ED]">{project.specs.timelineTracks || 24} Tracks</span>
              </div>
            </div>

            <div className="p-5 rounded border border-white/10 bg-white/[0.02]">
              <span className="font-mono-tech text-[10px] text-[#777777] uppercase tracking-wider block mb-2">
                AUTHENTIC EDITORIAL ARCHIVE
              </span>
              <p className="font-sans-body text-xs text-[#A1A1A1] leading-relaxed">
                All featured videos represent authentic completed projects edited and post-produced by {siteConfig.displayName}.
              </p>
            </div>
          </div>
        </div>

        {/* Adjacent Project Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/[0.1]">
          <TransitionLink
            href={`/work/${prev.slug}`}
            className="group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#777777] mb-3">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>PREVIOUS CATEGORY // {prev.identifier}</span>
            </div>
            <h4 className="font-sans-body font-bold text-lg uppercase text-[#F0F0ED] group-hover:text-white">
              {prev.title}
            </h4>
          </TransitionLink>

          <TransitionLink
            href={`/work/${next.slug}`}
            className="group p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30 transition-all flex flex-col justify-between text-right cursor-pointer"
          >
            <div className="flex items-center justify-end gap-2 font-mono-tech text-xs text-[#777777] mb-3">
              <span>NEXT CATEGORY // {next.identifier}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-sans-body font-bold text-lg uppercase text-[#F0F0ED] group-hover:text-white">
              {next.title}
            </h4>
          </TransitionLink>
        </div>
      </main>

      <Footer />
    </div>
  );
}
