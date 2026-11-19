'use client';

import * as React from 'react';
import { Play, ChevronLeft, ChevronRight, Sparkles, Film, Maximize2 } from 'lucide-react';
import { ProjectMediaItem } from '@/types';
import { soundManager } from '@/lib/sound';

export type LandPalette = 'dawn' | 'alpine' | 'dusk' | 'mist';

export type Slide = {
  image?: string;
  title?: string;
  caption?: string;
  alt?: string;
  tag?: string;
  duration?: string;
  resolution?: string;
  palette?: LandPalette;
  seed?: number;
  item?: ProjectMediaItem;
};

export type PolaroidLineCarouselProps = {
  slides?: Slide[];
  /** Any CSS length. Default 640px. */
  height?: number | string;
  /** Width of a print in px (it shrinks on narrow screens). */
  cardWidth?: number;
  /** Card aspect ratio: 9/16 for vertical reels, 4/5 or 1/1 */
  aspectRatio?: '9/16' | '4/5' | '1/1';
  /** How far the string sags in the middle, px. */
  sag?: number;
  /** How much the prints swing; 0 holds them still. */
  swing?: number;
  /** ms per print; 0 turns autoplay off. It waits while someone is interacting. */
  autoplay?: number;
  /** Colour of the string wire. */
  string?: string;
  background?: string;
  ink?: string;
  onChange?: (index: number) => void;
  onSelectVideo?: (slide: Slide, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

// #region logic
export function wrap(i: number, n: number): number {
  return n ? ((i % n) + n) % n : 0;
}

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

/** Height of a string sagging by `sag` between (0, y0) and (w, y0), at x. */
export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

/** One step of a critically damped spring toward target. */
export function springStep(x: number, v: number, target: number, dt: number, k = 70): [number, number] {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

/** One step of a print's swing. lineVel is the prints' on-screen speed (px/s, + = moving right); a print lags behind the motion, is pulled back by gravity and damped. */
export function swingStep(a: number, w: number, lineVel: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [clamp(a + nw * dt, -0.6, 0.6), nw];
}

/** Index of the print nearest the centre for a line offset. */
export function nearestAt(off: number, spacing: number, n: number): number {
  return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1));
}

export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
// #endregion logic

/* ------------------------------------------------------- painted images */

const PALETTES = {
  dawn: { top: '#e7b7a5', bottom: '#f8e8d6', sun: '#fff4df', far: '#d2b2bb', near: '#3a2a3b', mist: '255,240,232' },
  alpine: { top: '#7ea5c8', bottom: '#e3ecf2', sun: '#ffffff', far: '#a9bfd0', near: '#1c3044', mist: '236,244,250' },
  dusk: { top: '#2a2450', bottom: '#ef8d60', sun: '#ffd9a6', far: '#93607c', near: '#18121f', mist: '255,196,160' },
  mist: { top: '#c4d0cb', bottom: '#eef1ec', sun: '#ffffff', far: '#aebcb5', near: '#2c3a33', mist: '246,248,245' },
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hexRgb(h: string): [number, number, number] {
  const v = parseInt(h.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function mixRgb(a: string, b: string, t: number): string {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
}

function paintLandscape(seed: number, palette: LandPalette, w = 1600, h = 1000): string {
  if (typeof document === 'undefined') return '';
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return '';
  const P = PALETTES[palette] ?? PALETTES.dawn;
  const r = mulberry32(seed * 104729 + 7);

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, P.top);
  sky.addColorStop(1, P.bottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  const sx = w * (0.22 + r() * 0.56);
  const sy = h * (0.26 + r() * 0.16);
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45);
  halo.addColorStop(0, 'rgba(' + hexRgb(P.sun).join(',') + ',.85)');
  halo.addColorStop(0.08, 'rgba(' + hexRgb(P.sun).join(',') + ',.55)');
  halo.addColorStop(1, 'rgba(' + hexRgb(P.sun).join(',') + ',0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  g.fillStyle = P.sun;
  g.beginPath();
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2);
  g.fill();

  const layers = 5;
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1);
    const base = h * (0.42 + k * 0.4);
    const amp = h * (0.07 + k * 0.1);
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2);
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8];
    const ridge = (x: number) => {
      const u = x / w;
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      );
    };
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4);
    mist.addColorStop(0, 'rgba(' + P.mist + ',0)');
    mist.addColorStop(1, 'rgba(' + P.mist + ',' + (0.55 - k * 0.35).toFixed(2) + ')');
    g.fillStyle = mist;
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8);
    const body = g.createLinearGradient(0, base - amp, 0, h);
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)));
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)));
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x));
    g.lineTo(w, h);
    g.closePath();
    g.fill();
    if (L >= layers - 2) {
      g.fillStyle = mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.08));
      for (let x = 0; x < w; x += 7 + r() * 9) {
        if (r() < 0.35) continue;
        const y = ridge(x) + 2;
        const th = h * (0.025 + r() * 0.035) * (0.6 + k);
        const tw = th * 0.32;
        g.beginPath();
        g.moveTo(x, y - th);
        g.lineTo(x + tw, y);
        g.lineTo(x - tw, y);
        g.closePath();
        g.fill();
      }
    }
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,.32)');
  g.fillStyle = vig;
  g.fillRect(0, 0, w, h);
  const grain = g.getImageData(0, 0, w, h);
  const d = grain.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 14;
    d[i] += v;
    d[i + 1] += v;
    d[i + 2] += v;
  }
  g.putImageData(grain, 0, 0);
  return c.toDataURL('image/jpeg', 0.88);
}

const DEFAULT_SLIDES: Slide[] = [
  { title: 'Global Travel Reel', caption: 'Dynamic whip pans & speed ramping.', palette: 'dawn', seed: 3 },
  { title: 'Alpine Mountain Reel', caption: 'High-altitude 3-second hook cut.', palette: 'alpine', seed: 8 },
  { title: 'Extreme Skiing Cut', caption: 'High retention motion tracking.', palette: 'dusk', seed: 14 },
  { title: 'Keya Tortilla Commercial', caption: 'ASMR culinary cuts & sound design.', palette: 'mist', seed: 21 },
  { title: 'Viral Ranking Format', caption: 'Continuous audio drive & countdown.', palette: 'dawn', seed: 34 },
  { title: 'Countdown Edition 63', caption: 'YouTube Shorts retention structure.', palette: 'alpine', seed: 55 },
];

function useSlideImages(slides: Slide[]): string[] {
  const key = slides.map((s) => s.image || (s.palette || 'dawn') + ':' + (s.seed ?? 1)).join('|');
  const [painted, setPainted] = React.useState(() => slides.map(() => ''));
  React.useEffect(() => {
    setPainted(slides.map((s, i) => (s.image ? '' : paintLandscape(s.seed ?? i + 1, s.palette || 'dawn'))));
  }, [key]);
  return slides.map((s, i) => s.image || painted[i] || '');
}

const PL_CSS = `
.pl-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--pl-bg);
  color: var(--pl-ink);
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
  cursor: grab;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}
.pl-root[data-drag='1'] {
  cursor: grabbing;
}
.pl-root:focus-visible {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}
.pl-string {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8));
}
.pl-card {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--pl-cw);
  transform-origin: 50% 0;
  will-change: transform;
  cursor: inherit;
}
.pl-print {
  margin-top: 14px;
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 10px 10px 8px;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.9), 0 25px 40px -20px rgba(0, 0, 0, 0.85);
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.45s ease, box-shadow 0.45s ease, filter 0.45s ease, opacity 0.45s ease;
  backdrop-filter: blur(8px);
}
.pl-card[data-on='1'] .pl-print {
  transform: scale(1.04);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.09), 0 30px 60px -20px rgba(0, 0, 0, 0.95);
  filter: brightness(1.05);
  opacity: 1;
}
.pl-card[data-on='0'] .pl-print {
  transform: scale(0.88);
  filter: saturate(0.6) brightness(0.68);
  opacity: 0.75;
}
.pl-card:hover .pl-print {
  border-color: rgba(255, 255, 255, 0.5);
  opacity: 1;
  filter: saturate(0.9) brightness(0.95);
}
.pl-shot {
  position: relative;
  aspect-ratio: var(--pl-aspect, 9/16);
  overflow: hidden;
  background: #090909;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.pl-shot img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  display: block;
  pointer-events: none;
  transition: transform 0.5s ease;
}
.pl-card:hover .pl-shot img {
  transform: scale(1.04);
}
.pl-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}
.pl-card[data-on='1'] .pl-play-btn,
.pl-card:hover .pl-play-btn {
  opacity: 1;
}
.pl-note {
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6px 4px 0;
  font-family: var(--font-dm-sans, sans-serif);
  color: #F0F0ED;
  overflow: hidden;
}
.pl-note-tag {
  font-family: var(--font-dm-mono, monospace);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #34D399;
}
.pl-note-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #F0F0ED;
}
.pl-peg {
  position: absolute;
  left: 50%;
  top: 0;
  width: 12px;
  height: 28px;
  margin-left: -6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #181818, #3a3a3a 45%, #1b1b1b);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  z-index: 20;
}
.pl-peg::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 9px;
  width: 2px;
  height: 8px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 1px;
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}
.pl-bar {
  position: absolute;
  left: clamp(16px, 4vw, 56px);
  right: clamp(16px, 4vw, 56px);
  bottom: clamp(16px, 3vh, 32px);
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
  cursor: default;
  z-index: 30;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(10, 10, 10, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
.pl-cap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding-bottom: 0.1em;
}
.pl-cap > * {
  display: block;
  animation: pl-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.pl-title {
  font-family: var(--font-dm-sans, sans-serif);
  font-weight: 700;
  font-size: clamp(14px, 1.8vw, 20px);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #F0F0ED;
  letter-spacing: 0.02em;
}
.pl-sub {
  margin-top: 3px;
  font-family: var(--font-dm-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #A1A1A1;
  text-transform: uppercase;
}
.pl-count {
  font-family: var(--font-dm-mono, monospace);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #777777;
}
.pl-count b {
  color: #F0F0ED;
  font-weight: 700;
}
.pl-btn {
  appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.03);
  color: #F0F0ED;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pl-btn:hover {
  background: #F0F0ED;
  color: #080808;
  border-color: #F0F0ED;
}
.pl-btn:focus-visible {
  outline: 2px solid #F0F0ED;
  outline-offset: 2px;
}
.pl-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 6px;
  background: #F0F0ED;
  color: #080808;
  font-family: var(--font-dm-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}
.pl-action-btn:hover {
  background: #FFFFFF;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
.pl-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes pl-in {
  from {
    transform: translateY(80%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pl-cap > * {
    animation: none;
  }
  .pl-print {
    transition: none;
  }
}
`;

export default function PolaroidLineCarousel({
  slides = DEFAULT_SLIDES,
  height = '620px',
  cardWidth = 240,
  aspectRatio = '9/16',
  sag = 42,
  swing = 1,
  autoplay = 4500,
  string = 'rgba(255, 255, 255, 0.22)',
  background = '#070707',
  ink = '#F0F0ED',
  onChange,
  onSelectVideo,
  className,
  style,
  ariaLabel = 'Cinematic Video Reel Carousel',
}: PolaroidLineCarouselProps) {
  const n = slides.length;
  const srcs = useSlideImages(slides);
  const [active, setActive] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState({ w: 1200, h: 620, cw: cardWidth });
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const sim = React.useRef({ off: 0, vel: 0, target: 0, a: [] as number[], w: [] as number[] });
  const drag = React.useRef<null | { x: number; off: number; lx: number; lt: number; v: number; moved: boolean }>(null);
  const lastTouch = React.useRef(0);
  const activeRef = React.useRef(0);
  const opts = React.useRef({ sag, swing });
  opts.current = { sag, swing };

  const spacing = size.cw * 1.15;
  const goTo = React.useCallback(
    (i: number) => {
      sim.current.target = clamp(i, 0, n - 1) * spacing;
    },
    [n, spacing]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect();
      const cw = Math.round(Math.max(150, Math.min(cardWidth, r.width * 0.45, r.height * 0.44)));
      setSize({ w: r.width, h: r.height, cw });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [cardWidth]);

  // Keep target aligned on spacing changes
  React.useEffect(() => {
    sim.current.target = activeRef.current * spacing;
    sim.current.off = activeRef.current * spacing;
  }, [spacing]);

  React.useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  // Simulation loop written straight to the DOM each frame for maximum 120fps performance
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;
      const y0 = Math.max(35, h * 0.16);
      const d = drag.current;
      let lineVel: number;

      if (d && d.moved) {
        lineVel = d.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }

      const o = opts.current;
      const g = reduce ? 0 : o.swing;
      const near = nearestAt(S.off, spacing, n);

      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const x = w / 2 + i * spacing - S.off;
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        let a = S.a[i] || 0;
        let av = S.w[i] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, g);
        if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g;
        S.a[i] = a;
        S.w[i] = av;
        const y = stringY(x, w, y0, o.sag) - 6;
        el.style.transform = `translate(${(x - cw / 2).toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`;
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near));
      }

      pathRef.current?.setAttribute(
        'd',
        `M0 ${y0} Q${w / 2} ${y0 + 2 * o.sag} ${w} ${y0}`
      );

      if (near !== activeRef.current) {
        activeRef.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });

    io.observe(root);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, n]);

  // Autoplay
  React.useEffect(() => {
    if (!autoplay || n < 2) return;
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return;
      goTo(activeRef.current >= n - 1 ? 0 : activeRef.current + 1);
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, n, goTo]);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.pl-bar')) return;
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      rootRef.current?.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const max = (n - 1) * spacing;
    let off = d.off - dx;
    if (off < 0) off *= 0.35;
    if (off > max) off = max + (off - max) * 0.35;
    sim.current.off = off;
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    if (d.moved) {
      setDragging(false);
      sim.current.vel = -d.v * 1000;
      goTo(nearestAt(sim.current.off - d.v * 180, spacing, n));
      return;
    }
    const card = (e.target as HTMLElement).closest('[data-i]');
    if (card) {
      const idx = Number(card.getAttribute('data-i'));
      if (idx === activeRef.current) {
        // If clicking the active print, trigger video selection
        const sl = slides[idx];
        if (sl && onSelectVideo) {
          onSelectVideo(sl, idx);
        }
      } else {
        goTo(idx);
        soundManager.playClick();
      }
    }
  };

  const step = (dir: number) => {
    lastTouch.current = performance.now();
    goTo(clamp(activeRef.current + dir, 0, n - 1));
    soundManager.playClick();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  const s = slides[active] || {};

  return (
    <div
      ref={rootRef}
      className={['pl-root', className].filter(Boolean).join(' ')}
      style={{
        height,
        ['--pl-bg' as string]: background,
        ['--pl-ink' as string]: ink,
        ['--pl-cw' as string]: size.cw + 'px',
        ['--pl-aspect' as string]: aspectRatio,
        ...style,
      }}
      data-drag={dragging ? '1' : '0'}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{PL_CSS}</style>

      {/* Viewfinder Framing Marks */}
      <div className="corner-bracket corner-tl !top-3 !left-3 !w-3 !h-3 !border-white/20 pointer-events-none" />
      <div className="corner-bracket corner-tr !top-3 !right-3 !w-3 !h-3 !border-white/20 pointer-events-none" />
      <div className="corner-bracket corner-bl !bottom-3 !left-3 !w-3 !h-3 !border-white/20 pointer-events-none" />
      <div className="corner-bracket corner-br !bottom-3 !right-3 !w-3 !h-3 !border-white/20 pointer-events-none" />

      {/* Top Left Telemetry HUD */}
      <div className="absolute top-4 left-5 z-20 flex flex-col gap-0.5 pointer-events-none">
        <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#A1A1A1] uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>POLAROID LINE ARCHIVE // REEL CONTACT PRINTS</span>
        </div>
        <div className="font-mono-tech text-[9px] text-[#777777] tracking-wider uppercase">
          SWINGING LINE CAROUSEL • DRAG TO SLIDE • CLICK TO SCREEN
        </div>
      </div>

      {/* Sagging Steel Cable SVG */}
      <svg className="pl-string" aria-hidden="true">
        <path
          ref={pathRef}
          fill="none"
          stroke={string}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      {/* Slides Pegged to String */}
      {slides.map((sl, i) => (
        <div
          key={i}
          className="pl-card"
          data-i={i}
          data-on={i === active ? '1' : '0'}
          ref={(el) => void (cards.current[i] = el)}
          aria-hidden={i === active ? undefined : true}
        >
          <div className="pl-print">
            <div className="pl-shot">
              {srcs[i] ? (
                <img
                  src={srcs[i]}
                  alt={sl.alt || sl.title || ''}
                  draggable={false}
                />
              ) : null}

              {/* Play Button Indicator */}
              <div className="pl-play-btn">
                <div className="w-10 h-10 rounded-full bg-[#080808]/80 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                  <Play className="w-4 h-4 ml-0.5 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Note & Telemetry on Print */}
            <div className="pl-note">
              <span className="pl-note-tag">
                {sl.tag || `TRACK ${pad2(i + 1)}`} {sl.duration ? `• ${sl.duration}` : ''}
              </span>
              <span className="pl-note-title">{sl.title || ''}</span>
            </div>
          </div>

          {/* Slate Titanium Peg Clip */}
          <div className="pl-peg" />
        </div>
      ))}

      {/* Bottom Telemetry & Navigation Bar */}
      <div className="pl-bar">
        <div className="pl-cap" key={active} aria-hidden="true">
          {s.title ? <span className="pl-title">{s.title}</span> : null}
          {s.caption ? <span className="pl-sub">{s.caption}</span> : null}
        </div>

        {/* Direct Cinema Launch Action */}
        {onSelectVideo && (
          <button
            type="button"
            onClick={() => onSelectVideo(s, active)}
            className="pl-action-btn"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">SCREEN REEL</span>
          </button>
        )}

        {/* Counter */}
        <span className="pl-count" aria-hidden="true">
          <b>{pad2(active + 1)}</b> / {pad2(n)}
        </span>

        {/* Prev & Next Controls */}
        <button
          type="button"
          className="pl-btn"
          aria-label="Previous reel"
          onClick={() => step(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="pl-btn"
          aria-label="Next reel"
          onClick={() => step(1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="pl-sr" aria-live="polite">
        {'Reel ' + (active + 1) + ' of ' + n + (s.title ? ': ' + s.title : '')}
      </div>
    </div>
  );
}

// Standalone DemoPhotos compatibility export as specified in prompt
const U = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=1800&auto=format&fit=crop`;

export function DemoPhotos() {
  return (
    <PolaroidLineCarousel
      slides={[
        { image: U('1506905925346-21bda4d32df4'), title: 'Above the Clouds', caption: 'Valais, Switzerland — sunrise at 3,100 m.' },
        { image: U('1501785888041-af3ef285b470'), title: 'Glass Lake', caption: 'Lago di Braies, a rowboat at noon.' },
        { image: U('1469474968028-56623f02e42e'), title: 'Gold Valley', caption: 'Late light pouring over the ridge.' },
        { image: U('1464822759023-fed622ff2c3b'), title: 'Snow Line', caption: 'Pines, river flats and the high range.' },
        { image: U('1500534314209-a25ddb2bd429'), title: 'Blue Ridges', caption: 'Seven layers of haze before dusk.' },
        { image: U('1433086966358-54859d0ed716'), title: 'Falls Bridge', caption: 'Multnomah Falls after the rain.' },
      ]}
    />
  );
}
