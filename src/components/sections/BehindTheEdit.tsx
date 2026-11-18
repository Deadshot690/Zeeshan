'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Layers, Volume2, Mic, Sparkles, Scissors, Clock } from 'lucide-react';
import BeforeAfter from '@/components/ui/BeforeAfter';

export default function BehindTheEdit() {
  const [playheadPos, setPlayheadPos] = useState(38);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  return (
    <section
      id="behind-the-edit"
      className="relative w-full py-28 md:py-40 px-6 md:px-12 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#777777] tracking-[0.25em] uppercase mb-2">
              <span>SEC 05 // POST-PRODUCTION PIPELINE</span>
              <span>NLE SUITE</span>
            </div>
            <h2 className="font-sans-body font-black text-4xl sm:text-6xl md:text-7xl uppercase text-[#F0F0ED] tracking-tight">
              FROM RAW TO REFINED.
            </h2>
          </div>
          <p className="font-mono-tech text-xs sm:text-sm text-[#A1A1A1] tracking-wider uppercase max-w-sm md:text-right">
            A look inside the editing process and how the story comes to life.
          </p>
        </div>

        {/* Feature 1: Draggable Before / After Grading Comparison Slider */}
        <div className="mb-20">
          <div className="flex items-center justify-between font-mono-tech text-xs text-[#777777] uppercase tracking-wider mb-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>01 // DYNAMIC COLOR SCIENCE & SENSOR RECOVERY</span>
            </span>
            <span className="text-[#A1A1A1]">[ ARRI LOG-C3 → 35MM EMULATION ]</span>
          </div>

          <BeforeAfter />

          <p className="mt-4 font-mono-tech text-[11px] text-[#777777] tracking-wider uppercase text-right">
            * Demonstration comparison illustrating flat sensor grading curve and highlight recovery.
          </p>
        </div>

        {/* Feature 2: NLE Editing Timeline & Waveform Visualization (Inspired by Ref 11) */}
        <div className="p-6 md:p-8 rounded-lg border border-white/[0.1] bg-[#0c0c0c] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          {/* NLE Toolbar Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] font-mono-tech text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[#F0F0ED] font-bold tracking-wider">
                <Scissors className="w-3.5 h-3.5" />
                <span>TIMELINE // SHORT_FORM_ENGAGE_V04.prproj</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#A1A1A1] text-[10px]">
                24.00 FPS
              </span>
            </div>

            <div className="flex items-center gap-6 text-[#A1A1A1] text-[11px]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#777777]" />
                <span className="text-[#F0F0ED]">00:00:14:08</span>
              </span>
              <span className="hidden sm:inline text-[#777777]">DURATION: 00:00:45:00</span>
            </div>
          </div>

          {/* Timeline Tracks Grid */}
          <div className="relative mt-6 flex flex-col gap-2 overflow-x-auto no-scrollbar pb-2">
            {/* Playhead Needle (Draggable / Positioned) */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white z-30 pointer-events-none"
              style={{ left: `${playheadPos}%` }}
            >
              <div className="w-3 h-3 bg-white rotate-45 -translate-x-[5px] -translate-y-1 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>

            {/* Track 1: V3 Kinetic Captions & Motion Graphics */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>V3 [FX]</span>
              </div>
              <div className="flex-grow h-9 rounded bg-white/[0.03] border border-white/[0.04] relative flex items-center px-2 overflow-hidden">
                <div
                  className="absolute left-[8%] w-[25%] h-7 rounded bg-indigo-500/30 border border-indigo-400/40 flex items-center px-2 font-mono-tech text-[9px] text-indigo-200"
                >
                  HOOK_TITLE_KINETIC.aep
                </div>
                <div
                  className="absolute left-[38%] w-[32%] h-7 rounded bg-indigo-500/30 border border-indigo-400/40 flex items-center px-2 font-mono-tech text-[9px] text-indigo-200"
                >
                  CALLOUT_LOWER_THIRD.mov
                </div>
                <div
                  className="absolute left-[75%] w-[20%] h-7 rounded bg-indigo-500/30 border border-indigo-400/40 flex items-center px-2 font-mono-tech text-[9px] text-indigo-200"
                >
                  OUTRO_CARD.aep
                </div>
              </div>
            </div>

            {/* Track 2: V2 Overlays & B-Roll */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>V2 [B]</span>
              </div>
              <div className="flex-grow h-9 rounded bg-white/[0.03] border border-white/[0.04] relative flex items-center px-2 overflow-hidden">
                <div
                  className="absolute left-[15%] w-[18%] h-7 rounded bg-teal-500/30 border border-teal-400/40 flex items-center px-2 font-mono-tech text-[9px] text-teal-200"
                >
                  B_ROLL_CUTAWAY_01
                </div>
                <div
                  className="absolute left-[45%] w-[22%] h-7 rounded bg-teal-500/30 border border-teal-400/40 flex items-center px-2 font-mono-tech text-[9px] text-teal-200"
                >
                  PRODUCT_MACRO_SHOT
                </div>
              </div>
            </div>

            {/* Track 3: V1 Primary Cut (A-Roll) */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                <span>V1 [A]</span>
              </div>
              <div className="flex-grow h-11 rounded bg-white/[0.04] border border-white/[0.06] relative flex items-center overflow-hidden">
                <div className="w-[18%] h-full border-r border-black/40 bg-zinc-800/80 flex items-center px-2 font-mono-tech text-[9px] text-zinc-300">
                  A_ROLL_TAKE01
                </div>
                <div className="w-[28%] h-full border-r border-black/40 bg-zinc-700/80 flex items-center px-2 font-mono-tech text-[9px] text-zinc-200">
                  MAIN_SPEAKER_CAM_A
                </div>
                <div className="w-[24%] h-full border-r border-black/40 bg-zinc-800/80 flex items-center px-2 font-mono-tech text-[9px] text-zinc-300">
                  REACTION_RAMP_120FPS
                </div>
                <div className="w-[30%] h-full bg-zinc-700/80 flex items-center px-2 font-mono-tech text-[9px] text-zinc-200">
                  SUMMARY_CONCLUSION
                </div>
              </div>
            </div>

            {/* Timeline Audio Separator Bar */}
            <div className="w-full h-[1px] bg-white/10 my-1" />

            {/* Track 4: A1 Dialogue Waveform (Cyan - Inspired by Reference 11) */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Mic className="w-3 h-3 text-cyan-400" />
                <span>A1 [VO]</span>
              </div>
              <div className="flex-grow h-12 rounded bg-cyan-950/20 border border-cyan-800/30 relative flex items-center px-2 overflow-hidden">
                <div className="w-full h-full flex items-center justify-between opacity-80">
                  {/* Procedural SVG Waveform */}
                  <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 500 40">
                    <path
                      d="M0 20 Q 25 5, 50 20 T 100 20 T 150 8 T 200 20 T 250 2 T 300 20 T 350 12 T 400 20 T 450 5 T 500 20"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 20 Q 25 35, 50 20 T 100 20 T 150 32 T 200 20 T 250 38 T 300 20 T 350 28 T 400 20 T 450 35 T 500 20"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  </svg>
                </div>
                <span className="absolute top-1 left-2 font-mono-tech text-[8px] text-cyan-300">
                  SPEECH_DENOISED_COMPRESSED.wav
                </span>
              </div>
            </div>

            {/* Track 5: A2 Sound FX & Risers (Yellow - Inspired by Reference 11) */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" />
                <span>A2 [SFX]</span>
              </div>
              <div className="flex-grow h-10 rounded bg-amber-950/20 border border-amber-800/30 relative flex items-center px-2 overflow-hidden">
                <div className="absolute left-[12%] w-[12%] h-full flex items-center">
                  <div className="w-full h-4 bg-amber-400/40 rounded border border-amber-300/60" />
                </div>
                <div className="absolute left-[42%] w-[16%] h-full flex items-center">
                  <div className="w-full h-6 bg-amber-400/50 rounded border border-amber-300/60" />
                </div>
                <div className="absolute left-[78%] w-[14%] h-full flex items-center">
                  <div className="w-full h-5 bg-amber-400/40 rounded border border-amber-300/60" />
                </div>
                <span className="absolute top-1 left-2 font-mono-tech text-[8px] text-amber-300">
                  SWEEPS_RISERS_IMPACTS.wav
                </span>
              </div>
            </div>

            {/* Track 6: A3 Score & Sub-Bass (Magenta - Inspired by Reference 11) */}
            <div className="flex items-center gap-3">
              <div className="w-16 flex-shrink-0 font-mono-tech text-[10px] text-[#777777] uppercase flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-fuchsia-400" />
                <span>A3 [MX]</span>
              </div>
              <div className="flex-grow h-10 rounded bg-fuchsia-950/20 border border-fuchsia-800/30 relative flex items-center px-2 overflow-hidden">
                <svg className="w-full h-6 opacity-70" preserveAspectRatio="none" viewBox="0 0 500 30">
                  <path
                    d="M0 15 Q 40 2, 80 15 T 160 15 T 240 4 T 320 15 T 400 3 T 480 15 L 500 15"
                    fill="none"
                    stroke="#e879f9"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="absolute top-1 left-2 font-mono-tech text-[8px] text-fuchsia-300">
                  CINEMATIC_SYNTH_SCORE.wav [-14 LUFS]
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Scrub Control */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono-tech text-[10px] text-[#777777]">
            <div className="flex items-center gap-4">
              <span>SCRUB TIMELINE:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={playheadPos}
                onChange={(e) => setPlayheadPos(Number(e.target.value))}
                className="w-48 sm:w-72 accent-white cursor-pointer"
                aria-label="Timeline playhead scrub slider"
              />
              <span className="text-[#F0F0ED]">{playheadPos}%</span>
            </div>
            <span className="hidden sm:inline uppercase tracking-widest text-[#A1A1A1]">
              6 ACTIVE TRACKS // MULTI-STEM MASTER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
